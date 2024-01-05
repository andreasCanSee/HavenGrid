import { writable } from 'svelte/store';
import { initialBoardState } from '../Models/initialBoardData';
import { initialPlayerData } from '../Models/initialPlayerData';
import { initializePlayerDeck, distributeStartCards } from '../GameLogic/Decks/playerDeck';
import { initializeInfectionDeck } from '../GameLogic/Decks/infectionDeck';

const initialGameState = {
  // Initialisiere den Zustand des Spielbretts
  boardState: initialBoardState.map(({ name, supplies, hasSupplyCenter }) => ({
    name,
    supplies,
    hasSupplyCenter
  })),
  
  // Initialisiere das Infektionsdeck
  infectionDeck: initializeInfectionDeck(),

  // Initialisiere die Spieler mit ihren variablen Eigenschaften
  players: initialPlayerData.map(({ name, currentLocation, supplies, handCards }) => ({
    name,
    currentLocation,
    supplies,
    handCards
  })),

  // Initialisiere das Spielerdeck
  playerDeck: initializePlayerDeck(),

  // Weitere Spielzustandsvariablen
  activePlayerIndex: 0,
  infectionRate: 2,
  outbreaks: 0
};

// Initialisiere die Handkarten für jeden Spieler
const [remainingDeck, playersCards] = distributeStartCards(initialGameState.playerDeck.deck, 4, initialPlayerData.length);
initialGameState.playerDeck.deck = remainingDeck;

initialGameState.players = initialGameState.players.map((player, index) => {
  return { ...player, handCards: playersCards[index] };
});

export const gameState = writable(initialGameState);

export function resetGameState() {
  // Initialisiere das Spielerdeck neu
  const playerDeck = initializePlayerDeck();

  // Verteile Startkarten an die Spieler
  const [remainingDeck, playersCards] = distributeStartCards(playerDeck.deck, 4, initialPlayerData.length);
  playerDeck.deck = remainingDeck;

  // Initialisiere die Spieler mit neuen Handkarten
  const updatedPlayers = initialPlayerData.map((player, index) => {
    return { ...player, handCards: playersCards[index] };
  });

  // Setze den gesamten Spielzustand zurück
  gameState.set({
    ...initialGameState,
    playerDeck: playerDeck,
    players: updatedPlayers,
    infectionDeck: initializeInfectionDeck(), // Stellen Sie sicher, dass das Deck neu gemischt wird
    // Andere Zustände, die bei jedem Reset neu initialisiert werden müssen
  });
}
