import { get } from 'svelte/store';
import { currentTurnActions } from '../store';
import { boardConfig } from '../Stores/boardStore';
import { cardsStore } from '../Stores/cardsStore';
import { players, activePlayerIndex } from '../Stores/playerStore';
import type { Action } from '../Models/types';
import type { Card } from '../Models/types';

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
    players.update(currentPlayers => {
        const currentPlayer = currentPlayers[get(activePlayerIndex)];
        currentPlayer.currentLocation = findLastLocation();
        return currentPlayers;
    });         
}

export function undoPickUpSuppliesAction(action: Action) {

    players.update(currentPlayers => {
        if (currentPlayers[get(activePlayerIndex)].supplies > 0) {
            currentPlayers[get(activePlayerIndex)].supplies--;
        }
        return currentPlayers;
    });

    boardConfig.update(fields => {
        let fieldToUpdate = fields.find(f => f.name === action.location);
        if (fieldToUpdate) {
            fieldToUpdate.supplies += 1;
        }
        return fields;
    });
}

export function undoMakeSupplyAction(){
    players.update(currentPlayers => {
        if (currentPlayers[get(activePlayerIndex)].supplies > 0) {
            currentPlayers[get(activePlayerIndex)].supplies--;
        }
        return currentPlayers;
    });

}

export function undoDeliverSuppliesAction(action: Action) {

        players.update(currentPlayers => {
            let currentPlayer = currentPlayers[get(activePlayerIndex)];
            currentPlayer.supplies += action.supplies ?? 0; // Vorräte des Spielers erhöhen
            return currentPlayers;
        });

        boardConfig.update(fields => {
            let fieldToUpdate = fields.find(f => f.name === action.location);
            if (fieldToUpdate && typeof action.supplies === 'number') {
                fieldToUpdate.supplies -= action.supplies; // Vorräte des Feldes reduzieren
                fieldToUpdate.supplies = Math.max(0, fieldToUpdate.supplies); // Verhindere negative Vorräte
            }
            return fields;
        });
}

export function undoTransferSuppliesAction(action: Action){
    players.update(allPlayers => {
        const activePlayer = allPlayers[get(activePlayerIndex)];
        const otherPlayer = allPlayers.find(p => p.name === action.transactionPartner && p.currentLocation === activePlayer.currentLocation);

        if (otherPlayer) {
            if (action.supplies === -1) {
                // Der aktive Spieler hatte Vorräte abgegeben und erhält sie zurück
                activePlayer.supplies++;
                otherPlayer.supplies--;
            } else if (action.supplies === 1) {
                // Der aktive Spieler hatte Vorräte erhalten und gibt sie zurück
                activePlayer.supplies--;
                otherPlayer.supplies++;
            }
        }

        return allPlayers;
    });
}

export function undoSailToAction(action: Action){

    const locationName = action.location;

    let cardToReturn: Card | null = null;

    cardsStore.update(store => {
        const cardIndex = store.discardPile.findIndex(card => card.data.name === locationName && card.cardType === 'city');
        if (cardIndex !== -1) {
            [cardToReturn] = store.discardPile.splice(cardIndex, 1);
        }
        return store;
    });

    players.update(allPlayers => {
        if(cardToReturn){
            const currentPlayer = allPlayers[get(activePlayerIndex)];
            currentPlayer.handCards.push(cardToReturn);
            currentPlayer.currentLocation = findLastLocation();
        }
        
        return allPlayers;
    });
}

export function undoCharterBoatToAction(action: Action) {
    let cardToReturn: Card | null = null;

    // Karte vom discardPile zurückholen
    cardsStore.update(store => {
        const cardIndex = store.discardPile.findIndex(card => card.data.name === action.startLocation && card.cardType === 'city');
        if (cardIndex !== -1) {
            [cardToReturn] = store.discardPile.splice(cardIndex, 1);
        }
        return store;
    });

    // Spielerposition und Handkarten in einem Schritt aktualisieren
    players.update(allPlayers => {
        const currentPlayer = allPlayers[get(activePlayerIndex)];

        // Füge die Karte zurück zu den Handkarten hinzu, wenn sie gefunden wurde
        if (cardToReturn) {
            currentPlayer.handCards.push(cardToReturn);
        }

        // Aktualisiere die aktuelle Position des Spielers
        currentPlayer.currentLocation = findLastLocation();

        return allPlayers;
    });
}