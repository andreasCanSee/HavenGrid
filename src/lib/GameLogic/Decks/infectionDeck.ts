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
    const updatedBoardState = [...boardState]; // Erstelle eine Kopie von boardState

    // Gehe jede gezogene Infektionskarte durch und infiziere die entsprechende Stadt
    drawnInfectionCards.forEach(infectionCard => {
        const cityIndex = updatedBoardState.findIndex(city => city.name === infectionCard.data.name);
        if (cityIndex !== -1) {
            const city = updatedBoardState[cityIndex];
            if (city.supplies === 0) {
                city.plagueLevel = Math.min(city.plagueLevel + 1, 3);
                newOutbreaks += 1;
            } else {
                city.supplies -= 1;
            }
            updatedBoardState[cityIndex] = city; // Aktualisiere die Stadt im Array
        }
    });

    return {updatedInfectionDeck, updatedBoardState, newOutbreaks}
}