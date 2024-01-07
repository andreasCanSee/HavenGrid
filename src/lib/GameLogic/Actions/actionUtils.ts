import type { CityCard } from "../../Models/types";

export function discardCard(cardName: string, cardColor: string, handCards: CityCard[], discardPile: CityCard[]) {
    const cardIndex = handCards.findIndex(card => card.data.name === cardName)
    
    let newDiscardPile = [...discardPile];
    let newHandCards = [...handCards];

    if (cardIndex !== -1) {
        const cardToDiscard = {
            cardType: 'city', 
            data: { name: cardName, color: cardColor },
            inBuildArea: false
        };
        newDiscardPile.push(cardToDiscard);
        newHandCards.splice(cardIndex, 1);
    }

    return { newDiscardPile, newHandCards };
}
