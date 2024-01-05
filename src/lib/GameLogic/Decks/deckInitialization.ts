import type { DeckState, CityCard, InfectionCard } from "../../Models/types";
import { initialBoardState } from "../../Models/initialBoardData";
import { shuffleArray } from "./deckUtils";

export function initializeDecks(): { playerDeck: DeckState<CityCard>, infectionDeck: DeckState<InfectionCard>}{
    const playerDeckCards: CityCard[] = [];
    const infectionDeckCards: InfectionCard[] = [];

    initialBoardState
        .filter(field => !['Atlantis', 'Avalon', 'Asgard'].includes(field.name))
        .forEach(field => {
        
            // Füge Karten zum Spielerdeck hinzu
            playerDeckCards.push(...Array.from({ length: 4 }, () => ({
                cardType: 'City',
                data: {
                    name: field.name,
                    color: field.color,
                },
                inBuildArea: false
            })));

            // Füge Karten zum Infektionsdeck hinzu
            infectionDeckCards.push(...Array.from({ length: 3 }, () => ({
                cardType: 'Infection',
                data: {
                    name: field.name,
                    color: field.color,
                },
            })));
        });

        const shuffledPlayerDeck = shuffleArray(playerDeckCards);
        const shuffledInfectionDeck = shuffleArray(infectionDeckCards);

        return {
            playerDeck: {
                deck: shuffledPlayerDeck,
                discardPile: []
            },
            infectionDeck: {
                deck: shuffledInfectionDeck,
                discardPile: []
            }
        };
}