import type { DeckState, CityCard, PlayerState } from "../../Models/types";
import { drawCards } from "./deckUtils";

export function distributeStartCards(playerDeck: CityCard[], numCardsPerPlayer: number, numPlayers: number): [CityCard[], CityCard[][]] {
  let remainingDeck = [...playerDeck];
  const allPlayersCards: CityCard[][] = [];

  for (let i = 0; i < numPlayers; i++) {
      let drawnCards: CityCard[];
      [remainingDeck, drawnCards] = drawCards(remainingDeck, numCardsPerPlayer);
      allPlayersCards.push(drawnCards);
  }

  return [remainingDeck, allPlayersCards];
}

export function performPlayerCardsPhase(playerDeck: DeckState<CityCard>, players: PlayerState[], activePlayerIndex: number, numCards: number = 2): { updatedPlayerDeck: DeckState<CityCard>, updatedPlayers: PlayerState[] } {
  const [remainingPlayerDeck, drawnPlayerCards] = drawCards(playerDeck.deck, numCards);
  const updatedPlayerDeck = {
        deck: remainingPlayerDeck,
        discardPile: playerDeck.discardPile
    };

    const updatedPlayers = players.map((player, index) => {
        if (index === activePlayerIndex) {
            return {
                ...player,
                handCards: [...player.handCards, ...drawnPlayerCards]
            };
        }
        return player;
    });

    return { updatedPlayerDeck, updatedPlayers };
}