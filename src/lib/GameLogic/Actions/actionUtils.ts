import type { PlayerCard, PlayerHandCard } from "../../Models/types";

export function discardCard<T extends PlayerHandCard>(
    card: T,
    playerCards: T[],
    discardPile: PlayerCard[]
){
    const cardIndex = playerCards.findIndex(c => c.name === card.name);

    let newDiscardPile = [...discardPile]
    let newPlayerCards = [...playerCards];

    if (cardIndex !== -1) {
        newDiscardPile.push(card);
        newPlayerCards.splice(cardIndex, 1);
    }

    return { newDiscardPile, newPlayerCards };
}
