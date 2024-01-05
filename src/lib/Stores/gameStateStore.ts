import { writable } from 'svelte/store';
import type { GameState } from '../Models/types';
import { initializeGameState } from '../GameLogic/gameInitialization';

// Initialisiere den Spielzustand für den Store
const initialGameState = initializeGameState();

// Erstelle den Svelte Store mit dem initialen Spielzustand
export const gameState = writable<GameState>(initialGameState);

// Funktion zum Zurücksetzen des Spielzustands
export function resetGameState() {
  gameState.set(initializeGameState());
}