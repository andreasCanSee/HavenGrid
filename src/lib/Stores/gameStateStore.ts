import { writable } from 'svelte/store';
import type { GameState, PlayerHand } from '../Models/types';
import { initialBoardState } from '../Models/initialBoardData';
import { initialPlayerData } from '../Models/initialPlayerData';
import { initializeDecks } from '../GameLogic/Decks/deckInitialization';
import { performPlayerCardsPhase } from '../GameLogic/Decks/playerDeck';
import { performInfections } from '../GameLogic/Decks/infectionDeck';
import { insertEpidemicCards } from '../GameLogic/Decks/epidemicActions';
import { startingPlayerIndex } from '../GameLogic/config';

// Initialisiere den Spielzustand für den Store
const initialGameState = initializeGameState();

// Erstelle den Svelte Store mit dem initialen Spielzustand
export const gameState = writable<GameState>(initialGameState);

// Funktion zum Zurücksetzen des Spielzustands
export function resetGameState() {
  gameState.set(initializeGameState());
}

function initializeGameState(): GameState {
  // Initialisiere die Decks
  const { playerDeck: newPlayerDeck, infectionDeck: newInfectionDeck } = initializeDecks();

  // Initialisiere die Spielerdaten
  let updatedPlayers = initialPlayerData.map((player, index) =>({ 
    playerIndex: index,
    currentLocation:  player.currentLocation,
    supplies: player.supplies,
    handCards: {
      cityCards: [],
      actionCards: []
    } as PlayerHand // Handkarten initial leer setzen
  }));

  // Verteile Startkarten an die Spieler
  let currentPlayerDeck = { ...newPlayerDeck };

  for (let i = 0; i < initialPlayerData.length; i++) {
    const result = performPlayerCardsPhase(currentPlayerDeck, updatedPlayers[i], 4);
    currentPlayerDeck = result.updatedPlayerDeck;
    updatedPlayers[i] = result.updatedPlayer;
  }

  // Die Epidemie-Karten in das Spielerdeck mischen
  currentPlayerDeck.deck = insertEpidemicCards(currentPlayerDeck.deck);

  // Führe die Infektionsphase aus
  const initialInfectionRate = 9; // Anpassen, falls erforderlich
  let boardState = initialBoardState.map(({ name, supplies, hasSupplyCenter, plagueLevel }) => ({
    name,
    supplies,
    hasSupplyCenter,
    plagueLevel
  }));
  const { updatedInfectionDeck, updatedBoardState } = performInfections(newInfectionDeck, initialInfectionRate, boardState);

  // Setze den gesamten Spielzustand zurück
  const gameState = {
    boardState: updatedBoardState,
    infectionDeck: updatedInfectionDeck,
    players: updatedPlayers,
    playerDeck: currentPlayerDeck,
    activePlayerIndex: startingPlayerIndex,
    infectionRateIndex: 0,
    outbreaks: 0
  };

  return gameState;
}