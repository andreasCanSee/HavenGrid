import { writable } from "svelte/store";
import { initialBoardConfig } from '../lib/boardStore';

interface Card {
    cardType: string;
    data: string;
  }

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Tausche Elemente
    }
    return array;
}

const createInitialPlayerDeck = (): Card[] => {
    return initialBoardConfig
      .filter(place => place.color !== 'white')
      .flatMap(place => 
        Array(3).fill(null).map(() => ({ cardType: 'city', data: place.name }))
      ); 
  };
  
  export const cardsStore = writable({
    playerDeck: shuffleArray(createInitialPlayerDeck()),
    discardPile: []
  });

  export const resetCardsStore = () => {
    cardsStore.set({
      playerDeck: shuffleArray(createInitialPlayerDeck()),
      discardPile: []
    });
  };