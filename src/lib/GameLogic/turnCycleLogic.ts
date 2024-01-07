import { gameState } from "../Stores/gameStateStore";
import { initializeNextTurn } from "../Stores/turnStateStore";
import { performInfectionPhase } from "./Decks/infectionDeck";
import { performPlayerCardsPhase } from "./Decks/playerDeck";
import { get } from "svelte/store";

export function endTurnAndInitializeNext() {
   
    gameState.update(state => {
        // Spielkarten nachziehen
        const { updatedPlayerDeck, updatedPlayers } = performPlayerCardsPhase(state.playerDeck, state.players, state.activePlayerIndex);
        // Infektionsphase durchführen
        const { updatedInfectionDeck, updatedBoardState } = performInfectionPhase(state.infectionDeck, state.infectionRate, state.boardState);
        // Zum nächsten Spieler übergehen
        const nextPlayerIndex = (state.activePlayerIndex + 1) % state.players.length;

        return {
            ...state, 
            boardState: updatedBoardState,
            infectionDeck: updatedInfectionDeck,
            activePlayerIndex: nextPlayerIndex,
            playerDeck: updatedPlayerDeck,
            players: updatedPlayers
        }
    });
    // den aktuellen Zug vorbereiten (Startstandort speichern)
    const currentPlayerIndex = get(gameState).activePlayerIndex;
    const currentPlayerLocation = get(gameState).players[currentPlayerIndex].currentLocation;
    initializeNextTurn(currentPlayerLocation);
}