import { gameState } from "../Stores/gameStateStore";
import { initializeNextTurn } from "../Stores/turnStateStore";
import { performInfections } from "./Decks/infectionDeck";
import { performPlayerCardsPhase } from "./Decks/playerDeck";
import { get } from "svelte/store";
import type { CityCard, GameState } from "../Models/types";
import { setDiscardMode } from "../Stores/uiStore";

let cardsDrawn = false;

export function endTurn() {

    if(!cardsDrawn){

        gameState.update(state => {
            // Spielkarten nachziehen
            const { updatedPlayerDeck, updatedPlayers } = performPlayerCardsPhase(state.playerDeck, state.players, state.activePlayerIndex);
            return {
                ...state, playerDeck: updatedPlayerDeck, players: updatedPlayers
            }
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
    const { updatedInfectionDeck, updatedBoardState } = performInfections(state.infectionDeck, state.infectionRate, state.boardState);

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

export function checkHandCardLimit(handCards: CityCard[]){
    const handCardLimit = 7;

    return handCards.length > handCardLimit
}