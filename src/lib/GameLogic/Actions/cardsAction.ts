import { gameState } from "../../Stores/gameStateStore";
import type { Action, GameState, PlayerState, CityCard } from "../../Models/types";
import { countNonFreeActions, addActionToCurrentTurn } from "../../Stores/turnStateStore";
import { discardCityCard } from "./actionUtils";
import { checkHandCardLimit } from "../turnCycleLogic";
import { get } from "svelte/store";
import { setDiscardMode, resetDiscardMode, isDiscardMode } from "../../Stores/uiStore";

export function transferCityCard(fromPlayerIndex: number, toPlayerIndex: number, cityName: string){
    if(countNonFreeActions() < 4 && !get(isDiscardMode).active){
        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const fromPlayer = updatedPlayers[fromPlayerIndex];
            const toPlayer = updatedPlayers[toPlayerIndex];

            // Finde die StadtKarte im Handkartendeck des abgebenden Spielers
            const cardIndex = fromPlayer.handCards.cityCards.findIndex(card => card.name === cityName);

            if (cardIndex !== -1) {
                // Entferne die Karte aus dem Handkartendeck des abgebenden Spielers und füge sie dem empfangenden Spieler hinzu
                const [card] = fromPlayer.handCards.cityCards.splice(cardIndex, 1);
                toPlayer.handCards.cityCards.push(card);
            }
        return { ...state, players: updatedPlayers}
    })

    const currentState = get(gameState);
    if (checkHandCardLimit(currentState.players[toPlayerIndex].handCards)) {
        setDiscardMode(toPlayerIndex);
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
    if(countNonFreeActions() < 4 && !get(isDiscardMode).active){
        let discardedCards: CityCard[] = [];
        gameState.update((state: GameState) => {
            const activePlayer: PlayerState = state.players[state.activePlayerIndex];
            discardedCards = activePlayer.handCards.cityCards.filter(card => card.inBuildArea);
    
            // Entferne alle Karten mit inBuildArea = true aus den Handkarten des Spielers
            // Entferne alle Karten mit inBuildArea = true und füge sie dem Ablagestapel hinzu
            activePlayer.handCards.cityCards.forEach((card: CityCard) => {
                if (card.inBuildArea) {
                    const { newDiscardPile, newCityCards } = discardCityCard(
                        card.name, 
                        activePlayer.handCards.cityCards, 
                        state.playerDeck.discardPile
                    );
                    activePlayer.handCards.cityCards = newCityCards;
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

export function discardExcessCityCard(playerIndex: number, card: CityCard ){
    gameState.update(currentState => {

        let newState = {...currentState};
        let affectedPlayer = { ...newState.players[playerIndex]}
        const { newDiscardPile, newCityCards } = discardCityCard(
                card.name, 
                affectedPlayer.handCards.cityCards, 
                newState.playerDeck.discardPile
            );

        affectedPlayer.handCards.cityCards = newCityCards;
        newState.playerDeck.discardPile = newDiscardPile;
        newState.players[playerIndex] = affectedPlayer;
        
        return newState;
    })

    // Prüfe und aktualisiere den isDiscardMode Zustand
    const updatedState = get(gameState);
    if (!checkHandCardLimit(updatedState.players[playerIndex].handCards)) {
        resetDiscardMode();
    }

    const action: Action = {
        type: 'discardCard',
        transferringPlayerIndex: playerIndex,
        cards: [card],
        freeAction: true,
    };
    addActionToCurrentTurn(action); 
}
