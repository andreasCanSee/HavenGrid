import { gameState } from "../Stores/gameStateStore";
import { resetGameState } from "../Stores/gameStateStore";
import { resetDiscardMode } from "../Stores/uiStore";
import { initializeNextTurn } from "../Stores/turnStateStore";
import { get } from "svelte/store";

export function setupNewGame(){
    resetDiscardMode() 
    resetGameState()
    const currentState = get(gameState)
    const currentPlayerLocation = currentState.players[currentState.activePlayerIndex].currentLocation;
    initializeNextTurn(currentPlayerLocation); 
}