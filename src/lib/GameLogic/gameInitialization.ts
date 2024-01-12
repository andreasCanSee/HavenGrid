import type { GameState } from '../Models/types';
import { initialBoardState } from '../Models/initialBoardData';
import { initialPlayerData } from '../Models/initialPlayerData';
import { initializeDecks } from './Decks/deckInitialization';
import { performPlayerCardsPhase } from '../GameLogic/Decks/playerDeck';
import { performInfections } from '../GameLogic/Decks/infectionDeck';
import { initializeNextTurn } from '../Stores/turnStateStore';
import { isDiscardMode } from '../Stores/uiStore';

export function initializeGameState(): GameState {
  // Initialisiere die Decks
  const { playerDeck: newPlayerDeck, infectionDeck: newInfectionDeck } = initializeDecks();

  // Initialisiere die Spielerdaten
  let updatedPlayers = initialPlayerData.map((player, index) =>({ 
    playerIndex: index,
    currentLocation:  player.currentLocation,
    supplies: player.supplies,
    handCards: player.handCards // Handkarten initial leer setzen
  }));

  // Verteile Startkarten an die Spieler
  let currentPlayerDeck = { ...newPlayerDeck, deck: [...newPlayerDeck.deck] };
  for (let i = 0; i < initialPlayerData.length; i++) {
    const result = performPlayerCardsPhase(currentPlayerDeck, updatedPlayers, i, 4);
    currentPlayerDeck = result.updatedPlayerDeck;
    updatedPlayers = result.updatedPlayers;
  }

  // Führe die Infektionsphase aus
  const initialInfectionRate = 9; // Anpassen, falls erforderlich
  let boardState = initialBoardState.map(({ name, supplies, hasSupplyCenter }) => ({
    name,
    supplies,
    hasSupplyCenter
  }));
  const { updatedInfectionDeck, updatedBoardState } = performInfections(newInfectionDeck, initialInfectionRate, boardState);

  // Setze den gesamten Spielzustand zurück
  const gameState = {
    boardState: updatedBoardState,
    infectionDeck: updatedInfectionDeck,
    players: updatedPlayers,
    playerDeck: currentPlayerDeck,
    activePlayerIndex: 0,
    infectionRate: 2, // oder entsprechend des initialen Zustands
    outbreaks: 0
  };

  const currentPlayerLocation = gameState.players[gameState.activePlayerIndex].currentLocation;
  initializeNextTurn(currentPlayerLocation); // bezieht sich eigentlich auf anderen Store
  // Setze isDiscardMode zurück
  isDiscardMode.set({ active: false, playerIndex: null }); // bezieht sich eigentlich auf anderen Store

  return gameState;
}