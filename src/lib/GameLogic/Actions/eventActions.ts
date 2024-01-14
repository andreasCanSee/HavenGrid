import type { Action, ActionCard } from "../../Models/types";
import { gameState } from "../../Stores/gameStateStore";
import { addActionToCurrentTurn, countNonFreeActions, isTurnFinished } from "../../Stores/turnStateStore";
import { isDiscardModeActive } from "../../Stores/uiStore";
import { discardCard } from "./actionUtils";

export function produceSuppliesAction(currentLocation: string, playerIndex: number){

    if(countNonFreeActions() >= 4 || isDiscardModeActive() || isTurnFinished()) return
    let oldSupplies = 0;
    let cardToDiscard: ActionCard | undefined;
    
    gameState.update(currentState => {

        let newState = { ...currentState };

        newState.boardState = newState.boardState.map(city => {
            if (city.name === currentLocation && city.hasSupplyCenter) {
                oldSupplies = city.supplies
                // Fülle die Vorräte auf
                return { ...city, supplies: 3 };
            }
            return city;
        });

        const activePlayer = newState.players[playerIndex];

        // Finde die "ProduceSupplies"-Karte
        cardToDiscard = activePlayer.handCards.actionCards.find(card => card.eventType === 'produceSupplies');

        if (cardToDiscard) {
            const result = discardCard(cardToDiscard, activePlayer.handCards.actionCards, newState.playerDeck.discardPile);
            activePlayer.handCards.actionCards = result.newPlayerCards as ActionCard[];
            newState.playerDeck.discardPile = result.newDiscardPile;
        }

        // Gebe den aktualisierten Zustand zurück
        return newState;
    });

    // Protokolliere die Aktion vor der Aktualisierung des Zustands
    const action: Action = {
        type: 'produceSupplies',
        card: cardToDiscard,
        location: currentLocation,
        supplies: oldSupplies,
        freeAction: false,
      };
      addActionToCurrentTurn(action);
}