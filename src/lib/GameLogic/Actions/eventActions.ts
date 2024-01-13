import type { Action } from "../../Models/types";
import { get } from "svelte/store";
import { gameState } from "../../Stores/gameStateStore";
import { addActionToCurrentTurn } from "../../Stores/turnStateStore";
import { discardActionCard } from "./actionUtils";

export function produceSuppliesAction(currentLocation: string, playerIndex: number){
    let oldSupplies = 0
    
    gameState.update(currentState => {

        let newState = { ...currentState };

        let updatedBoardState = newState.boardState.map(city => {
            if (city.name === currentLocation && city.hasSupplyCenter) {
                oldSupplies = city.supplies
                
                // Fülle die Vorräte auf
                return { ...city, supplies: 3 };
            }
            return city;
        });

        // Aktualisiere den boardState im newState
        newState.boardState = updatedBoardState;

        const { newDiscardPile, newActionCards } = discardActionCard(
            'produceSupplies', 
            currentState.players[playerIndex].handCards.actionCards, 
            currentState.playerDeck.discardPile
        );

        // Aktualisiere die Karten des Spielers und den Ablagestapel
        newState.players[playerIndex].handCards.actionCards = newActionCards;
        newState.playerDeck.discardPile = newDiscardPile;

        // Gebe den aktualisierten Zustand zurück
        return newState;
    });

    // Protokolliere die Aktion vor der Aktualisierung des Zustands
    const action: Action = {
        type: 'produceSupplies',
        location: currentLocation,
        supplies: oldSupplies,
        freeAction: false,
      };
      addActionToCurrentTurn(action);
}