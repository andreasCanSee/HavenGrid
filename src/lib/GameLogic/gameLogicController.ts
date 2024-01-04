import { currentTurnActions } from "../store";
import { players, activePlayerIndex } from "../Stores/playerStore";
import { get } from "svelte/store";
import { resetCardsStore } from "../Stores/cardsStore";
import { getInitialPlayers } from "../Stores/playerStore";
import { drawAndDiscard } from "./Decks/infectionDeck";
import { resetGameState } from "../Stores/gameStateStore";

export function drawPlayerCards() {
    // Spieler zieht Karten
}

function moveToNextPlayer() {
    // Wechsle zum nächsten Spieler
    activePlayerIndex.update(index => (index + 1) % get(players).length);
}

export function endActionPhase() {
    const currentPlayerActions = get(currentTurnActions);
    const currentPlayerIndex = get(activePlayerIndex);
  
    players.update(currentPlayers => {
      let updatedPlayers = [...currentPlayers];
      let currentPlayer = updatedPlayers[currentPlayerIndex];
      // Füge die aktuellen Aktionen zur Aktionshistorie hinzu
      currentPlayer.actionsHistory.push([...currentPlayerActions]);
  
      // Aktualisiere den Spieler im Array
      updatedPlayers[currentPlayerIndex] = currentPlayer;
  
      return updatedPlayers;
    });

    // Perform Infection Phase
    drawAndDiscard(2);

    moveToNextPlayer();

    // Setze currentTurnActions für den nächsten Spieler zurück
    currentTurnActions.set([{ type: 'startAt', location: get(players)[currentPlayerIndex].currentLocation, freeAction: true }]);
}

export function startGame(){
    resetGameState();
    resetCardsStore();

    players.set(getInitialPlayers());
    activePlayerIndex.set(0);

    currentTurnActions.set([{ type: 'startAt', location: get(players)[get(activePlayerIndex)].currentLocation, freeAction: true }]);

    drawAndDiscard(9);
}