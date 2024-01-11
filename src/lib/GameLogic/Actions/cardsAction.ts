import { gameState } from "../../Stores/gameStateStore";
import type { Action, GameState, PlayerState, CityCard } from "../../Models/types";
import { countNonFreeActions, addActionToCurrentTurn } from "../../Stores/turnStateStore";
import { discardCard } from "./actionUtils";
import { checkHandCardLimit } from "../turnCycleLogic";
import { get } from "svelte/store";
import { isDiscardMode } from "../../Stores/uiStore";

export function transferCityCard(fromPlayerIndex: number, toPlayerIndex: number, cityName: string){
    if(countNonFreeActions() < 4){
        gameState.update(state => {
            const updatedPlayers = [...state.players]; //hier ist ein problem
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

    const currentState = get(gameState);
    if (checkHandCardLimit(currentState.players[toPlayerIndex].handCards)) {
        isDiscardMode.set({active: true, playerIndex: toPlayerIndex});
        console.log(get(isDiscardMode))
    }


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


export function buildSupplyCenter(playerLocation: string) {
    if(countNonFreeActions() < 4){
        let discardedCards: CityCard[] = [];
        gameState.update((state: GameState) => {
            const activePlayer: PlayerState = state.players[state.activePlayerIndex];
            discardedCards = activePlayer.handCards.filter(card => card.inBuildArea);
    
            // Entferne alle Karten mit inBuildArea = true aus den Handkarten des Spielers
            // Entferne alle Karten mit inBuildArea = true und füge sie dem Ablagestapel hinzu
            activePlayer.handCards.forEach((card: CityCard) => {
                if (card.inBuildArea) {
                    const { newDiscardPile, newHandCards } = discardCard(card.data.name, card.data.color, activePlayer.handCards, state.playerDeck.discardPile);
                    activePlayer.handCards = newHandCards;
                    state.playerDeck.discardPile = newDiscardPile;
                }
            });
    
            // Setze hasSupplyCenter auf true am aktuellen Standort des Spielers
            const locationIndex = state.boardState.findIndex(field => field.name === playerLocation);
            if (locationIndex !== -1) {
                state.boardState[locationIndex].hasSupplyCenter = true;
            }
    
            return state;
        });
        const action: Action = {
            type: 'buildSupplyCenter',
            cards: discardedCards,
            location: playerLocation,
            freeAction: false,
        };
        addActionToCurrentTurn(action); 

    }
    
}
