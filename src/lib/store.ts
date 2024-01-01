import { writable, get } from 'svelte/store';
import { players } from './playerStore'; 
import type { Action } from './player';

export const drawnInfectionCards = writable<string[]>([]);

export const currentTurnActions = writable<Action[]>([]);

export function addActionToCurrentTurn(action: Action) {
  currentTurnActions.update(actions => [...actions, action]);
}

export function finalizeTurn(activePlayerIndex: number) {
  const currentPlayerActions = get(currentTurnActions);

  players.update(currentPlayers => {
    let updatedPlayers = [...currentPlayers];
    let currentPlayer = updatedPlayers[activePlayerIndex];
    // Füge die aktuellen Aktionen zur Aktionshistorie hinzu
    currentPlayer.actionsHistory.push([...currentPlayerActions]);

    // Aktualisiere den Spieler im Array
    updatedPlayers[activePlayerIndex] = currentPlayer;

    return updatedPlayers;
  });

  // Setze currentTurnActions für den nächsten Spieler zurück
  currentTurnActions.set([]);
}

export const charterBoatMode = writable(false);