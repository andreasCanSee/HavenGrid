import { updateCurrentTurnActions } from '../Stores/turnStateStore';
import type { Action, ActionCard, CityCard, PlayerHandCard } from '../Models/types';
import { gameState } from '../Stores/gameStateStore';
import { resetDiscardMode, setDiscardMode } from '../Stores/uiStore';
import { checkHandCardLimit } from '../GameLogic/turnCycleLogic';
import { get } from 'svelte/store';

export function undoLastMove(currentActions: Action[]) {

    // 1. Zwischenspeichern des Anfangszustands
    const originalActions = [...currentActions];

    try {
         // 2. Durchführen der Operationen
        let [updatedActions, lastActionRemoved] = removeLastAction(currentActions);
        
        if (lastActionRemoved) {
            switch (lastActionRemoved.type) {
                case 'moveTo':
                    undoMoveToAction(updatedActions);
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
                    undoSailToAction(updatedActions, lastActionRemoved);
                    break;
                case 'charterBoatTo':
                    undoCharterBoatToAction(lastActionRemoved);
                    break;
                case 'exchangeCard':
                    undoExchangeCardAction(lastActionRemoved);
                    break;
                case 'buildSupplyCenter':
                    undoBuildSupplyCenterAction(lastActionRemoved);
                    break;
                case 'discardCard':
                    undoDiscardExcessCardAction(lastActionRemoved);
                    break;
                case 'produceSupplies':
                    undoProduceSuppliesAction(lastActionRemoved);
                    break;
            }
            // 3. Aktualisieren des Zustands, wenn alles erfolgreich war
            updateCurrentTurnActions(updatedActions);
        
        }
    } catch (error) {
        // Im Fehlerfall den ursprünglichen Zustand wiederherstellen
        console.error("Fehler beim Rückgängigmachen der Aktion: ", error);
        updateCurrentTurnActions(originalActions);
    }
}

function removeLastAction(currentActions: Action[]): [Action[], Action | undefined] {
    let lastAction: Action | undefined;

    // Prüfe, ob die letzte Aktion 'turnFinished' ist
    if (currentActions.length > 0 && currentActions[currentActions.length - 1].type === 'turnFinished') {
        return [currentActions, undefined];
    }

    // Die neue Liste der Aktionen, nachdem die letzte Aktion entfernt wurde
    let updatedActions = [...currentActions];
  
    if(updatedActions.length > 1){
      lastAction = updatedActions.pop();
    }
  
    // Rückgabe des aktualisierten Aktionsarrays und der entfernten letzten Aktion
    return [updatedActions, lastAction];
}

const movementActionTypes = ['moveTo', 'sailTo', 'charterBoatTo', 'startAt'];

function isMovementAction(actionType: string) {
    return movementActionTypes.includes(actionType);
}

function findLastLocation(actions: Action[]): string {
    let lastLocation = '';
    
    for (let i = actions.length - 1; i >= 0; i--) {
        const action = actions[i];
        if (isMovementAction(action.type)) {
            lastLocation = action.location || '';
            break;
        }
    }

    // Überprüfe, ob ein gültiger Standort gefunden wurde
    if (!lastLocation) {
        throw new Error('Kein gültiger letzter Standort gefunden');
    }

    return lastLocation;
}

function undoMoveToAction(actions: Action[]) {
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        const activePlayer = updatedPlayers[state.activePlayerIndex];
        activePlayer.currentLocation = findLastLocation(actions);
        return { ...state, players: updatedPlayers };
    });         
}

function undoPickUpSuppliesAction(action: Action) {
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

function undoMakeSupplyAction() {
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

function undoDeliverSuppliesAction(action: Action) {
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

function undoTransferSuppliesAction(action: Action) {
    
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

function undoExchangeCardAction(action: Action){
    if (action.type === 'exchangeCard' && typeof action.transferringPlayerIndex === 'number' && typeof action.receivingPlayerIndex === 'number') {
        const cardToReturn = action.card as CityCard;

        gameState.update(state => {
            const updatedPlayers = [...state.players];

            if (typeof action.transferringPlayerIndex === 'number' && typeof action.receivingPlayerIndex === 'number') {
                const fromPlayer = updatedPlayers[action.transferringPlayerIndex];
                const toPlayer = updatedPlayers[action.receivingPlayerIndex];

                // Finde die Karte im Handkartendeck des aufnehmenden Spielers
                const cardIndex = toPlayer.handCards.cityCards.findIndex(card => card.name === cardToReturn.name);

                if (cardIndex !== -1) {
                    // Entferne die Karte aus dem Handkartendeck des aufnehmenden Spielers und füge sie dem abgebenden Spieler hinzu
                    toPlayer.handCards.cityCards.splice(cardIndex, 1);
                    fromPlayer.handCards.cityCards.push(cardToReturn);
                }
            }

            return { ...state, players: updatedPlayers };
        });
        
        // Prüfe und aktualisiere den isDiscardMode Zustand
        const updatedState = get(gameState);
        if (checkHandCardLimit(updatedState.players[action.receivingPlayerIndex].handCards)) {
            setDiscardMode(action.receivingPlayerIndex);
        } else {
            resetDiscardMode();
        }
    }
}

function undoSailToAction(currentActions: Action[], action: Action) {
    if (action.type === 'sailTo' && action.card) {

        const cardToReturn = action.card as CityCard;

        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const updatedDiscardPile = [...state.playerDeck.discardPile];

            const currentPlayer = updatedPlayers[state.activePlayerIndex];

            // Entferne die Karte aus dem discardPile
            const cardIndex = updatedDiscardPile.findIndex(card => card === cardToReturn);
            if (cardIndex !== -1) {
                updatedDiscardPile.splice(cardIndex, 1);
            }

            // Füge die Karte zurück zu den Handkarten des aktuellen Spielers
            currentPlayer.handCards.cityCards.push(cardToReturn);

            // Aktualisiere die aktuelle Position des Spielers
            currentPlayer.currentLocation = findLastLocation(currentActions);

            return { ...state, players: updatedPlayers, playerDeck: {...state.playerDeck, discardPile: updatedDiscardPile} };
        });
    } else {
        console.error('Invalid action data for undoSailToAction');
    }
}

export function undoCharterBoatToAction(action: Action) {
    
    if (action.type === 'charterBoatTo' && action.card) {
        const cardToReturn = action.card as CityCard;

        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const updatedDiscardPile = [...state.playerDeck.discardPile];

            const currentPlayer = updatedPlayers[state.activePlayerIndex];

            // Entferne die Karte aus dem discardPile
            const cardIndex = updatedDiscardPile.findIndex(card => card === cardToReturn);
            if (cardIndex !== -1) {
                updatedDiscardPile.splice(cardIndex, 1);
            }

            // Füge die Karte zurück zu den Handkarten des aktuellen Spielers
            currentPlayer.handCards.cityCards.push(cardToReturn);

            // Aktualisiere die aktuelle Position des Spielers
            currentPlayer.currentLocation = cardToReturn.name;

            return { ...state, players: updatedPlayers, playerDeck: {...state.playerDeck, discardPile: updatedDiscardPile} };
        });
    } else {
        console.error('Invalid action data for undoCharterBoatToAction');
    }
}

export function undoBuildSupplyCenterAction(action: Action) {
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        const activePlayer = updatedPlayers[state.activePlayerIndex];

        // Füge die Karten zurück zu den Handkarten des Spielers
        action.cards?.forEach(card => {
            if (card.cardType === 'city') {
                activePlayer.handCards.cityCards.push(card as CityCard);
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

    if (action.type === 'discardCard' && action.card && action.transferringPlayerIndex !== undefined) {

        const cardToReturn = action.card as PlayerHandCard;
        const playerIndex = action.transferringPlayerIndex;
       
        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const affectedPlayer = updatedPlayers[playerIndex];
            
            // Füge die abgeworfene Karte zurück zu den Handkarten des Spielers
            if (cardToReturn.cardType === 'city') {
                affectedPlayer.handCards.cityCards.push(cardToReturn as CityCard);
            } else if (cardToReturn.cardType === 'action') {
                affectedPlayer.handCards.actionCards.push(cardToReturn as ActionCard);
            }

            // Entferne die Karte aus dem Ablagestapel
            const cardIndex = state.playerDeck.discardPile.findIndex(discardCard => discardCard === cardToReturn);
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

function undoProduceSuppliesAction(action: Action) {
    if (action.type === 'produceSupplies' && action.card) {
        const cardToReturn = action.card as ActionCard;

        gameState.update(state => {
            // Flache Kopien der benötigten Arrays erstellen
            const updatedPlayers = [...state.players];
            const updatedBoardState = [...state.boardState];
            const updatedDiscardPile = [...state.playerDeck.discardPile];


            const activePlayer = updatedPlayers[state.activePlayerIndex];

            // Entferne die Karte aus dem discardPile
            const cardIndex = updatedDiscardPile.findIndex(card => card === cardToReturn);
            if (cardIndex !== -1) {
                updatedDiscardPile.splice(cardIndex, 1);
            }

            // Füge die Karte zurück zu den Handkarten des Spielers
            activePlayer.handCards.actionCards.push(cardToReturn);

            // Setze die Vorräte am Standort zurück
            for (let i = 0; i < updatedBoardState.length; i++) {
                if (updatedBoardState[i].name === action.location) {
                    updatedBoardState[i] = {
                        ...updatedBoardState[i],
                        supplies: action.supplies !== undefined ? action.supplies : updatedBoardState[i].supplies
                    };
                    break; // Abbruch der Schleife nach dem Update
                }
            }

            return { 
                ...state, 
                players: updatedPlayers, 
                boardState: updatedBoardState, 
                playerDeck: {...state.playerDeck, discardPile: updatedDiscardPile} 
            };
        });
    } else {
        console.error('Invalid action data for undoProduceSuppliesAction');
    }
}