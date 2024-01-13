import { gameState } from "../Stores/gameStateStore";
import { initializeNextTurn } from "../Stores/turnStateStore";
import { performInfections } from "./Decks/infectionDeck";
import { performPlayerCardsPhase } from "./Decks/playerDeck";
import { get } from "svelte/store";
import type { GameState, PlayerHand } from "../Models/types";
import { setDiscardMode } from "../Stores/uiStore";
import { getCurrentInfectionRate } from "../Models/infectionRate";

let cardsDrawn = false;

export function endTurn() {

    if(!cardsDrawn){

        gameState.update(state => {

            const newState = { ...state };

            // Spielkarten nachziehen
            const { updatedPlayerDeck, updatedPlayer, drawnEpidemicCards } = performPlayerCardsPhase(
                newState.playerDeck, newState.players[newState.activePlayerIndex]);

            // Aktualisiere den neuen Zustand basierend auf den Ergebnissen von performPlayerCardsPhase
            newState.playerDeck = updatedPlayerDeck;
            newState.players[newState.activePlayerIndex] = updatedPlayer;

            for (const epidemicCard of drawnEpidemicCards) {
                // Verarbeite jede Epidemie-Karte und aktualisiere den neuen Zustand
                const epidemicChanges = epidemicCard.action(newState.boardState, newState.infectionDeck, newState.infectionRateIndex);
                Object.assign(newState, epidemicChanges);
            }

            return newState;
        });
        const currentState = get(gameState);

        if (checkHandCardLimit(currentState.players[currentState.activePlayerIndex].handCards)) {
            setDiscardMode(currentState.activePlayerIndex)
            cardsDrawn = true; // Markiere, dass Karten gezogen wurden
        } else {
            performInfectionPhaseAndMoveToNextPlayer(currentState);
        }
    } else {
        const currentState = get(gameState);
        performInfectionPhaseAndMoveToNextPlayer(currentState);
        cardsDrawn = false; // Setze zurück für den nächsten Spieler
    }
}

function performInfectionPhaseAndMoveToNextPlayer(state: GameState){
    // Infektionsphase durchführen
    const { updatedInfectionDeck, updatedBoardState } = performInfections(state.infectionDeck, getCurrentInfectionRate(state.infectionRateIndex), state.boardState);

    // Zum nächsten Spieler übergehen
    const nextPlayerIndex = (state.activePlayerIndex + 1) % state.players.length;

    gameState.set({
        ...state,
        boardState: updatedBoardState,
        infectionDeck: updatedInfectionDeck,
        activePlayerIndex: nextPlayerIndex
    });

    // den aktuellen Zug vorbereiten (Startstandort speichern)
    const currentPlayerLocation = state.players[nextPlayerIndex].currentLocation;
    initializeNextTurn(currentPlayerLocation);
}

export function checkHandCardLimit(handCards: PlayerHand){
    const handCardLimit = 7;
    const totalCards = handCards.cityCards.length + handCards.actionCards.length;

    return totalCards > handCardLimit;
}