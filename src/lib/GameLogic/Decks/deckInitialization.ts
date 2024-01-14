import type { DeckState, PlayerCard, InfectionCard, CityCard, ActionCard } from "../../Models/types";
import { initialBoardState } from "../../Models/initialBoardData";
import { shuffleArray } from "./deckUtils";

export function initializeDecks(): { playerDeck: DeckState<PlayerCard>, infectionDeck: DeckState<InfectionCard>}{
    const playerDeckCards: PlayerCard[] = [];
    const infectionDeckCards: InfectionCard[] = [];

    initialBoardState
        .filter(field => !['Atlantis', 'Avalon', 'Asgard'].includes(field.name))
        .forEach(field => {
        
            // Füge Karten zum Spielerdeck hinzu
            playerDeckCards.push(...Array.from({ length: 4 }, (): CityCard => ({
                cardType: 'city',
                name: field.name,
                inBuildArea: false
            })));

            // Füge Karten zum Infektionsdeck hinzu
            infectionDeckCards.push(...Array.from({ length: 3 }, (): InfectionCard => ({
                cardType: 'infection',
                data: {
                    name: field.name,
                    color: field.color,
                },
            })));
        });

    // Erstelle ProduceSupplies-Karten
    const produceSuppliesCards: ActionCard[] = Array.from({ length: 8 }, (): ActionCard => ({
        cardType: 'action',
        eventType: 'produceSupplies',
        name: 'Vorräte produzieren' 
    }));

    // Füge die ProduceSupplies-Karten zum Spielerdeck hinzu
    playerDeckCards.push(...produceSuppliesCards);

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