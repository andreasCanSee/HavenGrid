import { writable } from "svelte/store";
import { initialBoardConfig } from './boardStore';
import type { Card } from "../Models/types";

  interface CardsStoreState {
    playerDeck: Card[];
    discardPile: Card[];
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
        Array(3).fill(null).map(() => ({ 
          cardType: 'city', 
          data: { 
            name: place.name, 
            color: place.color
          },
          inBuildArea: false
        }))
      ); 
  };
  
  export const cardsStore = writable<CardsStoreState>({
    playerDeck: shuffleArray(createInitialPlayerDeck()),
    discardPile: []
  });

  export const distributeStartCards = (numberOfCards: number): Card[] => {
    let startCards: Card[] = [];
  
    cardsStore.update(cards => {
      for (let i = 0; i < numberOfCards; i++) {
        if (cards.playerDeck.length > 0) {
          // Ziehe die oberste Karte vom Deck
          const card = cards.playerDeck.pop();
          if (card !== undefined) {
            startCards.push(card);
          }
        }
      }
      return cards;
    });
  
    return startCards;
  };

  export const resetCardsStore = () => {
    cardsStore.set({
      playerDeck: shuffleArray(createInitialPlayerDeck()),
      discardPile: []
    });
  };

  export function addToDiscardPile(card: Card) {
    cardsStore.update(store => {
        const updatedStore = { ...store };
        updatedStore.discardPile.push(card);
        return updatedStore;
    });
}