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

export function transferCityCard(fromPlayerName: string, toPlayerName: string, cityName: string){
    if(countNonFreeActions() < 4){

        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const fromPlayerIndex = updatedPlayers.findIndex(p => p.name === fromPlayerName);
            const toPlayerIndex = updatedPlayers.findIndex(p => p.name === toPlayerName);

            if (fromPlayerIndex !== -1 && toPlayerIndex !== -1) {
                const fromPlayer = updatedPlayers[fromPlayerIndex];
                const toPlayer = updatedPlayers[toPlayerIndex];

                // Finde die Karte im Handkartendeck des abgebenden Spielers
                const cardIndex = fromPlayer.handCards.findIndex(card => card.data.name === cityName);

                if (cardIndex !== -1) {
                    // Entferne die Karte aus dem Handkartendeck des abgebenden Spielers und füge sie dem empfangenden Spieler hinzu
                    const [card] = fromPlayer.handCards.splice(cardIndex, 1);
                    toPlayer.handCards.push(card);
                }
            }
            return { ...state, players: updatedPlayers}
        })

        const action: Action = {
            type: 'transferCard',
            transferringPlayer: fromPlayerName,
            receivingPlayer: toPlayerName,
            location: cityName,
            freeAction: false,
        };
        addActionToCurrentTurn(action); 

    }
}