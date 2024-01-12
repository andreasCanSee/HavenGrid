import type { PlayerCard, CityCard } from "../../Models/types";

export function discardCityCard(
    cardName: string, 
    cityCards: CityCard[], 
    discardPile: PlayerCard[]
) {
    const cardIndex = cityCards.findIndex(card => card.cardType === 'city' && card.name === cardName);
    
    let newDiscardPile = [...discardPile];
    let newCityCards = [...cityCards];

    if (cardIndex !== -1) {
        const cardToDiscard: CityCard = {
            cardType: 'city', 
            name: cardName,
            inBuildArea: false
        };
        newDiscardPile.push(cardToDiscard);
        newCityCards.splice(cardIndex, 1);
    }

    return { newDiscardPile, newCityCards };
}
