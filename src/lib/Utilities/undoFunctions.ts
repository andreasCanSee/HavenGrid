import { get } from 'svelte/store';
import { currentTurnActions } from '../Stores/turnStateStore';
import type { Action, CityCard, PlayerCard } from '../Models/types';
import { gameState } from '../Stores/gameStateStore';
import { isDiscardMode, resetDiscardMode, setDiscardMode } from '../Stores/uiStore';
import { checkHandCardLimit } from '../GameLogic/turnCycleLogic';

export function undoLastMove() {

    let lastActionRemoved: Action | undefined;

    currentTurnActions.update(actions => {
        // Nie den Startort einer Runde entfernen
        if (actions.length > 1) {
            lastActionRemoved = actions.pop();
        }
        return actions;
    });
    
    if (lastActionRemoved) {
        switch (lastActionRemoved.type) {
            case 'moveTo':
                undoMoveToAction();
                break;
            case 'pickUpSupplies':
                undoPickUpSuppliesAction(lastActionRemoved);
                break;
            case 'makeSupply':
                undoMakeSupplyAction();
                break;
            case 'deliverSupplies':
                undoDeliverSuppliesAction(lastActionRemoved);
                break;
            case 'transferSupplies':
                undoTransferSuppliesAction(lastActionRemoved);
                break;
            case 'sailTo':
                undoSailToAction(lastActionRemoved);
                break;
            case 'charterBoatTo':
                undoCharterBoatToAction(lastActionRemoved);
                break;
            case 'exchangeCard':
                undoexchangeCardAction(lastActionRemoved);
                break;
            case 'buildSupplyCenter':
                undoBuildSupplyCenterAction(lastActionRemoved);
                break;
            case 'discardCard':
                undoDiscardExcessCardAction(lastActionRemoved);
                break;
    
        }
    }
   
}

const movementActionTypes = ['moveTo', 'sailTo', 'charterBoatTo', 'startAt'];

function isMovementAction(actionType: string) {
    return movementActionTypes.includes(actionType);
}

function findLastLocation(): string {
    let lastLocation = '';
    
    for (let i = get(currentTurnActions).length - 1; i >= 0; i--) {
        const action = get(currentTurnActions)[i];
        if (isMovementAction(action.type )) {
            lastLocation = action.location || '';
            break;
        }
    }

    return lastLocation;
}

export function undoMoveToAction() {
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        const activePlayer = updatedPlayers[state.activePlayerIndex];
        activePlayer.currentLocation = findLastLocation();
        return { ...state, players: updatedPlayers };
    });         
}

export function undoPickUpSuppliesAction(action: Action) {
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        const activePlayer = updatedPlayers[state.activePlayerIndex];

        // Reduziere die Vorräte des aktiven Spielers um 1, wenn er vorher aufgenommen wurde
        if (activePlayer.supplies > 0) {
            activePlayer.supplies--;
        }

        // Aktualisiere die Vorräte am Standort im BoardState
        let updatedBoardState = state.boardState.map(field => {
            if (field.name === action.location) {
                return { ...field, supplies: field.supplies + 1 };
            }
            return field;
        });

        return { ...state, players: updatedPlayers, boardState: updatedBoardState };
    });
}

export function undoMakeSupplyAction() {
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        const activePlayer = updatedPlayers[state.activePlayerIndex];

        // Reduziere die Vorräte des aktiven Spielers um 1, wenn er vorher eine Vorratsaktion durchgeführt hatte
        if (activePlayer.supplies > 0) {
            activePlayer.supplies--;
        }

        return { ...state, players: updatedPlayers };
    });
}

export function undoDeliverSuppliesAction(action: Action) {
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        const activePlayer = updatedPlayers[state.activePlayerIndex];

        // Füge die gelieferten Vorräte zurück zum aktiven Spieler hinzu
        if (action.supplies && typeof action.supplies === 'number') {
            activePlayer.supplies += action.supplies;
        }

        // Reduziere die Vorräte am Standort im BoardState
        let updatedBoardState = state.boardState.map(field => {
            if (field.name === action.location && typeof action.supplies === 'number') {
                let updatedSupplies = field.supplies - action.supplies;
                updatedSupplies = Math.max(0, updatedSupplies); // Verhindere negative Vorräte
                return { ...field, supplies: updatedSupplies };
            }
            return field;
        });

        return { ...state, players: updatedPlayers, boardState: updatedBoardState };
    });
}


export function undoTransferSuppliesAction(action: Action) {
    
        gameState.update(state => {
            const updatedPlayers = [...state.players];

            // Prüfe, ob die Indizes definiert sind
            if (typeof action.transferringPlayerIndex === 'number' && typeof action.receivingPlayerIndex === 'number') {
                // Rückgängig machen des Supply-Transfers
                if (updatedPlayers[action.receivingPlayerIndex].supplies > 0) {
                    updatedPlayers[action.transferringPlayerIndex].supplies++; // Erhöhe Supplies beim abgebenden Spieler
                    updatedPlayers[action.receivingPlayerIndex].supplies--; // Reduziere Supplies beim aufnehmenden Spieler
                }
            }

            return { ...state, players: updatedPlayers }; 
        });
    
}

export function undoexchangeCardAction(action: Action){
    if (action.type === 'exchangeCard' && typeof action.transferringPlayerIndex === 'number' && typeof action.receivingPlayerIndex === 'number') {
        gameState.update(state => {
            const updatedPlayers = [...state.players];

            if (typeof action.transferringPlayerIndex === 'number' && typeof action.receivingPlayerIndex === 'number') {
                const fromPlayer = updatedPlayers[action.transferringPlayerIndex];
                const toPlayer = updatedPlayers[action.receivingPlayerIndex];

                // Finde die Karte im Handkartendeck des aufnehmenden Spielers
                const cardIndex = toPlayer.handCards.cityCards.findIndex(card => card.name === action.location);

                if (cardIndex !== -1) {
                    // Entferne die Karte aus dem Handkartendeck des aufnehmenden Spielers und füge sie dem abgebenden Spieler hinzu
                    const [card] = toPlayer.handCards.cityCards.splice(cardIndex, 1);
                    fromPlayer.handCards.cityCards.push(card);
                }
            }

            return { ...state, players: updatedPlayers };
        });
        
        // Prüfe und aktualisiere den isDiscardMode Zustand
        const updatedState = get(gameState);
        if (typeof action.receivingPlayerIndex === 'number' && !checkHandCardLimit(updatedState.players[action.receivingPlayerIndex].handCards)) {
            resetDiscardMode();
        }
    }
}

export function undoSailToAction(action: Action) {
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        const currentPlayer = updatedPlayers[state.activePlayerIndex];
        
        // Karte vom discardPile zurückholen
        const cardIndex = state.playerDeck.discardPile.findIndex(card => card.cardType === 'city' && card.name === action.location);
        let cardToReturn = null;
        if (cardIndex !== -1) {
            cardToReturn = state.playerDeck.discardPile.splice(cardIndex, 1)[0] as CityCard;
        }

        // Wenn eine Karte zurückgeholt wird, füge sie den Handkarten des aktuellen Spielers hinzu
        if (cardToReturn) {
            currentPlayer.handCards.cityCards.push(cardToReturn);
        }

        // Aktualisiere die aktuelle Position des Spielers
        currentPlayer.currentLocation = findLastLocation();

        return { ...state, players: updatedPlayers };
    });
}

export function undoCharterBoatToAction(action: Action) {
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        const currentPlayer = updatedPlayers[state.activePlayerIndex];

        // Karte vom discardPile zurückholen
        const cardIndex = state.playerDeck.discardPile.findIndex(card => card.cardType === 'city' && card.name === action.startLocation);
        if (cardIndex !== -1) {
            const cardToReturn = state.playerDeck.discardPile.splice(cardIndex, 1)[0] as CityCard;
            // Wenn eine Karte zurückgeholt wird, füge sie den Handkarten des aktuellen Spielers hinzu
            currentPlayer.handCards.cityCards.push(cardToReturn);
        }

        // Aktualisiere die aktuelle Position des Spielers
        if (action.startLocation) {
            currentPlayer.currentLocation = action.startLocation;
        }
        else{
            currentPlayer.currentLocation = findLastLocation();
        }

        return { ...state, players: updatedPlayers };
    });
}

export function undoBuildSupplyCenterAction(action: Action) {
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        const activePlayer = updatedPlayers[state.activePlayerIndex];

        // Karten vom Ablagestapel zurück in die Hand des Spielers legen
        action.cards?.forEach(card => {
            const cardIndex = state.playerDeck.discardPile.findIndex(discardCard => 
               discardCard.cardType === 'city' && discardCard.name === card.name 
            );

            if (cardIndex !== -1) {
                const [cardToReturn] = state.playerDeck.discardPile.splice(cardIndex, 1);
                if (cardToReturn.cardType === 'city') {
                    activePlayer.handCards.cityCards.push(cardToReturn);
                }
            }
        });

        // Entferne das Versorgungszentrum vom Standort
        if (action.location) {
            const locationIndex = state.boardState.findIndex(field => field.name === action.location);
            if (locationIndex !== -1) {
                state.boardState[locationIndex].hasSupplyCenter = false;
            }
        }

        return { ...state, players: updatedPlayers };
    });
}

function undoDiscardExcessCardAction(action: Action) {

    if (action.type === 'discardCard' && action.cards && action.cards.length > 0 && action.transferringPlayerIndex !== undefined) {

        const cardToReturn = action.cards[0] as CityCard;
        const playerIndex = action.transferringPlayerIndex;
       
        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const affectedPlayer = updatedPlayers[playerIndex];
            
            // Füge die abgeworfene Karte zurück zu den Handkarten des Spielers
            affectedPlayer.handCards.cityCards.push(cardToReturn);

            // Entferne die Karte aus dem Ablagestapel
            const cardIndex = state.playerDeck.discardPile.findIndex(discardCard => 
                discardCard.cardType === 'city' && discardCard.name === cardToReturn.name 
            );
            if (cardIndex !== -1) {
                state.playerDeck.discardPile.splice(cardIndex, 1);
            }

            return { ...state, players: updatedPlayers };
        });

         // Überprüfe, ob der isDiscardMode aktualisiert werden muss
         const updatedState = get(gameState);
         if (checkHandCardLimit(updatedState.players[playerIndex].handCards)) {
             setDiscardMode(playerIndex);
         } else {
             resetDiscardMode();
         }
    }
}

