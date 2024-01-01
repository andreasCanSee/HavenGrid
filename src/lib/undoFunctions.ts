import { get } from 'svelte/store';
import { players, activePlayerIndex, boardConfig, currentTurnActions } from './store';
import type { Action } from './player';  


export function undoMoveToAction(action: Action) {
    players.update(currentPlayers => {
        const currentPlayer = currentPlayers[get(activePlayerIndex)];
        
        let newLocation = '';
        for (let i = get(currentTurnActions).length - 1; i >= 0; i--) {
            if (get(currentTurnActions)[i].type === 'moveTo') {
                newLocation = get(currentTurnActions)[i].location || '';
                break;
            }
        }

        // Wenn keine moveTo-Aktion in currentTurnActions gefunden wurde, durchsuche die actionsHistory
        if (!newLocation) {
            for (let i = currentPlayer.actionsHistory.length - 1; i >= 0; i--) {
                for (let j = currentPlayer.actionsHistory[i].length - 1; j >= 0; j--) {
                    if (currentPlayer.actionsHistory[i][j].type === 'moveTo') {
                        newLocation = currentPlayer.actionsHistory[i][j].location || '';
                        break;
                    }
                }
                if (newLocation) break;
            }
        }
        newLocation = newLocation || currentPlayer.actionsHistory[0][0]?.location || '';
        currentPlayer.currentLocation = newLocation;

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