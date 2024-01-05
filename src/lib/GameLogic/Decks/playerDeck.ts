import type { DeckState, CityCard } from "../../Models/types";
import { initialBoardState } from "../../Models/initialBoardData";
import { shuffleArray } from "../../Utilities/utils";

export function initializePlayerDeck(): DeckState<CityCard> {
    // Erstelle das PlayerDeck ohne Atlantis, Avalon und Asgard
    const playerDeck = initialBoardState
        .filter(field => !['Atlantis', 'Avalon', 'Asgard'].includes(field.name))
        .flatMap(field => Array(4).fill({ // Jeder Standort viermal im Deck
            cardType: 'City',
            data: {
                name: field.name,
                color: field.color,
            },
            inBuildArea: false
        }));
  
    const shuffledDeck = shuffleArray(playerDeck);
  
    return {
      deck: shuffledDeck,
      discardPile: []
    };
  }
  
export function distributeStartCards(playerDeck: CityCard[], numCardsPerPlayer: number, numPlayers: number): [CityCard[], CityCard[][]] {
    let remainingDeck = [...playerDeck];
    const allPlayersCards = [];
  
    for (let i = 0; i < numPlayers; i++) {
      const drawnCards = remainingDeck.slice(0, numCardsPerPlayer);
      remainingDeck = remainingDeck.slice(numCardsPerPlayer);
      allPlayersCards.push(drawnCards);
    }
  
    return [remainingDeck, allPlayersCards];
  }