import { currentTurnActions } from "../store";
import { get } from "svelte/store";
import { drawAndDiscard } from "./Decks/infectionDeck";
import { gameState, resetGameState } from "../Stores/gameStateStore";

export function drawPlayerCards() {
    // Spieler zieht Karten
}

function moveToNextPlayer() {
    gameState.update(state => {
        const nextPlayerIndex = (state.activePlayerIndex + 1) % state.players.length;
        return { ...state, activePlayerIndex: nextPlayerIndex };
    })
}

export function endActionPhase() {
   
    // Perform Infection Phase
    drawAndDiscard(2);

    moveToNextPlayer();

    // Bestimme die Position des nächsten Spielers aus dem gameState
    const currentPlayerIndex = get(gameState).activePlayerIndex;
    const currentPlayerLocation = get(gameState).players[currentPlayerIndex].currentLocation;

    // Setze currentTurnActions für den nächsten Spieler zurück
    currentTurnActions.set([{ type: 'startAt', location: currentPlayerLocation, freeAction: true }]);
}

export function startGame(){
    resetGameState();

    const currentPlayerIndex = get(gameState).activePlayerIndex;
    const currentPlayerLocation = get(gameState).players[currentPlayerIndex].currentLocation;
 
    currentTurnActions.set([{ type: 'startAt', location: currentPlayerLocation, freeAction: true }]);

    drawAndDiscard(9);
}