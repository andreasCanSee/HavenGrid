import { get } from 'svelte/store';
import { currentTurnActions } from '../Stores/turnStateStore';
import type { Action } from '../Models/types';
import { gameState } from '../Stores/gameStateStore';

export function undoLastMove() {

    let lastActionRemoved: Action | undefined;

    currentTurnActions.update(actions => {
        if (actions.length > 0) {
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
        const fromPlayerIndex = updatedPlayers.findIndex(p => p.name === action.transferringPlayer);
        const toPlayerIndex = updatedPlayers.findIndex(p => p.name === action.receivingPlayer);

        if (fromPlayerIndex !== -1 && toPlayerIndex !== -1) {
            // Rückgängig machen des Supply-Transfers
            updatedPlayers[fromPlayerIndex].supplies++; // Erhöhe Supplies beim abgebenden Spieler
            updatedPlayers[toPlayerIndex].supplies--;   // Reduziere Supplies beim aufnehmenden Spieler
        }

        return { ...state, players: updatedPlayers }; 
    });
}

export function undoSailToAction(action: Action) {
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        const currentPlayer = updatedPlayers[state.activePlayerIndex];

        // Karte vom discardPile zurückholen
        const cardIndex = state.playerDeck.discardPile.findIndex(card => card.data.name === action.location && card.cardType === 'city');
        let cardToReturn = null;
        if (cardIndex !== -1) {
            cardToReturn = state.playerDeck.discardPile.splice(cardIndex, 1)[0];
        }

        // Wenn eine Karte zurückgeholt wird, füge sie den Handkarten des aktuellen Spielers hinzu
        if (cardToReturn) {
            currentPlayer.handCards.push(cardToReturn);
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
        const cardIndex = state.playerDeck.discardPile.findIndex(card => card.data.name === action.startLocation && card.cardType === 'city');
        let cardToReturn = null;
        if (cardIndex !== -1) {
            cardToReturn = state.playerDeck.discardPile.splice(cardIndex, 1)[0];
        }

        // Wenn eine Karte zurückgeholt wird, füge sie den Handkarten des aktuellen Spielers hinzu
        if (cardToReturn) {
            currentPlayer.handCards.push(cardToReturn);
        }

        // Aktualisiere die aktuelle Position des Spielers
        currentPlayer.currentLocation = findLastLocation();

        return { ...state, players: updatedPlayers };
    });
}