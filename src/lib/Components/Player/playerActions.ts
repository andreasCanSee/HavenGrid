import { showBoat } from "../../Stores/uiStore";
import { currentTurnActions, countNonFreeActions } from "../../Stores/turnStateStore";
import { gameState } from "../../Stores/gameStateStore";
import type { Action } from "../../Models/types";
import { addActionToCurrentTurn } from "../../Stores/turnStateStore";

export function increasePlayerSupplies(name: string) {
    if(countNonFreeActions() < 4){
        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const activePlayer = updatedPlayers.find(p => p.name === name);
            if (activePlayer) {
                activePlayer.supplies++;
            }
            return { ...state, players: updatedPlayers };
        });
    }

    const action: Action = { type: 'makeSupply', freeAction: false };
    addActionToCurrentTurn(action);
}

export function transferSupplies(fromPlayerName: string, toPlayerName: string){
  
    if(countNonFreeActions() < 4){
        console.log('in transfer supplies 2')
        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const fromPlayerIndex = updatedPlayers.findIndex(p => p.name === fromPlayerName);
            const toPlayerIndex = updatedPlayers.findIndex(p => p.name === toPlayerName);
            
            if (fromPlayerIndex !== -1 && toPlayerIndex !== -1) {
                updatedPlayers[fromPlayerIndex].supplies--;
                updatedPlayers[toPlayerIndex].supplies++;
            }       
            return { ...state, players: updatedPlayers};
        });

        const action: Action = {
            type: 'transferSupplies',
            transferringPlayer: fromPlayerName,
            receivingPlayer: toPlayerName,
            freeAction: true,
        };
        addActionToCurrentTurn(action); 
    }
}