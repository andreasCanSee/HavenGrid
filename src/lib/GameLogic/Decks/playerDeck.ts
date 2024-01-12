import type { DeckState, PlayerCard, PlayerState, CityCard, EventCard, ProduceSuppliesCard } from "../../Models/types";
import { drawCards } from "./deckUtils";

export function performPlayerCardsPhase(
    playerDeck: DeckState<PlayerCard>, 
    player: PlayerState, 
    numCards: number = 2
): { updatedPlayerDeck: DeckState<PlayerCard>, updatedPlayer: PlayerState } {
  const [remainingPlayerDeck, drawnPlayerCards] = drawCards(playerDeck.deck, numCards);
  const updatedPlayerDeck = {
        deck: remainingPlayerDeck,
        discardPile: playerDeck.discardPile
    };

    const newCityCards = drawnPlayerCards.filter(card => card.cardType === 'city') as CityCard[];
    const newActionCards = drawnPlayerCards.filter(card => card.cardType !== 'city') as (EventCard | ProduceSuppliesCard)[];
            
    const updatedPlayer: PlayerState = {
        ...player,
        handCards: {
          cityCards: [...player.handCards.cityCards, ...newCityCards],
          actionCards: [...player.handCards.actionCards, ...newActionCards]
        }
      };
    
      return { updatedPlayerDeck, updatedPlayer };
}