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
    let newOutbreaks = 0;
    const updatedBoardState = boardState.map(city => {
        if(drawnInfectionCards.some(card => card.data.name === city.name)){
            if (city.supplies === 0) {
                city.plagueLevel = Math.min(city.plagueLevel + 1, 3);
                newOutbreaks += 1;
            } else {
                city.supplies -= 1;
            }
        }
        return city;
    });

    return {updatedInfectionDeck, updatedBoardState, newOutbreaks}
}