import { writable } from 'svelte/store';
import { initialBoardState } from '../Models/initialBoardData';
import type { InfectionCard, DeckState } from '../Models/types';
import { shuffleArray } from '../Utilities/utils';

const initialGameState = {
  boardState: initialBoardState.map(({ name, supplies, hasSupplyCenter }) => ({
    name,
    supplies,
    hasSupplyCenter
})),
  infectionDeck: initializeInfectionDeck(),
  activePlayerIndex: 0,
  infectionRate: 2,
  outbreaks: 0
}

/* Zu ergänzen:
playerDeck
 players: [] as Player[],
*/

export const gameState = writable(initialGameState);

export function resetGameState() {
  gameState.set({
    ...initialGameState,
    infectionDeck: initializeInfectionDeck() // Stellen Sie sicher, dass das Deck neu gemischt wird
    // Andere Zustände, die bei jedem Reset neu initialisiert werden müssen
  });
}

function initializeInfectionDeck(): DeckState<InfectionCard>{
  const infectionDeck = initialBoardState
      .filter(field => field.color !== 'white')
      .flatMap(field => Array(3).fill({
          cardType: 'Infection',
          data: {
              name: field.name,
              color: field.color,
          },
      }));

  const shuffledDeck = shuffleArray(infectionDeck);

  return {
    deck: shuffledDeck,
    discardPile: []
  }

}

/*
function initializePlayerDeck(){
  
}*/


/*
function createPlayer(name: string, startingLocation: string, color: string, image: string): Player {
  return {
    name,
    currentLocation: startingLocation,
    supplies: 0,
    color,
    image,
    handCards: distributeStartCards(4)
  }
}

function initializePlayers(): Player[]  {
    return [
      createPlayer("Spieler 1", "Atlantis", "purple", '/survivor-male.png'),
      createPlayer("Spieler 2", "Avalon", "orange", '/survivor-female.png')
    ];
}
*/