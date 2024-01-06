import { gameState } from "../../Stores/gameStateStore";
import type { Action } from "../../Models/types";
import { countNonFreeActions, addActionToCurrentTurn } from "../../Stores/turnStateStore";

export function increasePlayerSupplies(playerIndex: number) {
    if(countNonFreeActions() < 4){
        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const activePlayer = updatedPlayers[playerIndex];
            if (activePlayer) {
                activePlayer.supplies++;
            }
            return { ...state, players: updatedPlayers };
        });
    }

    const action: Action = { type: 'makeSupply', freeAction: false };
    addActionToCurrentTurn(action);
}

export function transferSupplies(fromPlayerIndex: number, toPlayerIndex: number){
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        updatedPlayers[fromPlayerIndex].supplies--;
        updatedPlayers[toPlayerIndex].supplies++;
               
        return { ...state, players: updatedPlayers};
    });

    const action: Action = {
        type: 'transferSupplies',
        transferringPlayerIndex: fromPlayerIndex,
        receivingPlayerIndex: toPlayerIndex,
        freeAction: true,
    };
    addActionToCurrentTurn(action); 
}

export function transferCityCard(fromPlayerIndex: number, toPlayerIndex: number, cityName: string){
    console.log(fromPlayerIndex, toPlayerIndex, cityName)
    if(countNonFreeActions() < 4){

        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const fromPlayer = updatedPlayers[fromPlayerIndex];
            const toPlayer = updatedPlayers[toPlayerIndex];

            // Finde die Karte im Handkartendeck des abgebenden Spielers
            const cardIndex = fromPlayer.handCards.findIndex(card => card.data.name === cityName);

            if (cardIndex !== -1) {
                // Entferne die Karte aus dem Handkartendeck des abgebenden Spielers und füge sie dem empfangenden Spieler hinzu
                const [card] = fromPlayer.handCards.splice(cardIndex, 1);
                toPlayer.handCards.push(card);
            }
        return { ...state, players: updatedPlayers}
    })

        const action: Action = {
            type: 'exchangeCard',
            transferringPlayerIndex: fromPlayerIndex,
            receivingPlayerIndex: toPlayerIndex,
            location: cityName,
            freeAction: false,
        };
        addActionToCurrentTurn(action); 
    }
}