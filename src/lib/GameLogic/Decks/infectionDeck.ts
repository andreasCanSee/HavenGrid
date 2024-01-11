import type { DeckState, InfectionCard, FieldState } from "../../Models/types";
import { drawCards } from "./deckUtils";

export function performInfections(infectionDeck: DeckState<InfectionCard>, infectionRate: number, boardState: FieldState[]){

    // Infection Phase I: Draw & Discard Infection Cards
    const [remainingInfectionDeck, drawnInfectionCards] = drawCards(infectionDeck.deck, infectionRate);
        const updatedDiscardPile = [...infectionDeck.discardPile, ...drawnInfectionCards];
        const updatedInfectionDeck = {
            deck: remainingInfectionDeck,
            discardPile: updatedDiscardPile
        };

        // Infection Phases II; Infect Cities
        const affectedCities = drawnInfectionCards.map(card => card.data.name);
        const updatedBoardState = boardState.map(city => {
            if (affectedCities.includes(city.name)) {
                const infectionCount = affectedCities.filter(affectedCity => affectedCity === city.name).length;
                return { ...city, supplies: Math.max(city.supplies - infectionCount, 0) };
            }
            return city;
        });

        return {updatedInfectionDeck, updatedBoardState}
}