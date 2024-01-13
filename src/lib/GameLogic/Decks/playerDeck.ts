import type { DeckState, PlayerCard, EpidemicCard, PlayerState, CityCard, EventCard, ProduceSuppliesCard } from "../../Models/types";
import { drawCards } from "./deckUtils";

export function performPlayerCardsPhase(
    playerDeck: DeckState<PlayerCard>, 
    player: PlayerState, 
    numCards: number = 2
): { updatedPlayerDeck: DeckState<PlayerCard>, updatedPlayer: PlayerState, drawnEpidemicCards: EpidemicCard[] } {

  const [remainingPlayerDeck, drawnPlayerCards] = drawCards(playerDeck.deck, numCards);
  let updatedDiscardPile = [...playerDeck.discardPile];

  let newCityCards: CityCard[] = [];
  let newActionCards: (EventCard | ProduceSuppliesCard)[] = [];
  let drawnEpidemicCards: EpidemicCard[] = [];

  for(const card of drawnPlayerCards){
    if(card.cardType === 'epidemic'){
      updatedDiscardPile.push(card);
      drawnEpidemicCards.push(card as EpidemicCard);
    } else if (card.cardType === 'city'){
      newCityCards.push(card)
    }
    else {
      newActionCards.push(card as (EventCard | ProduceSuppliesCard));
  }
}

  const updatedPlayerDeck: DeckState<PlayerCard> = {
        deck: remainingPlayerDeck,
        discardPile: playerDeck.discardPile
    };
            
    const updatedPlayer: PlayerState = {
        ...player,
        handCards: {
          cityCards: [...player.handCards.cityCards, ...newCityCards],
          actionCards: [...player.handCards.actionCards, ...newActionCards]
        }
      };
    
      return { updatedPlayerDeck, updatedPlayer, drawnEpidemicCards };
}