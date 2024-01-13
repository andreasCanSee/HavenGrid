import type { PlayerCard, EpidemicCard, GameState, FieldState, InfectionCard, DeckState } from "../../Models/types";
import { increaseInfectionIndex } from "../../Models/infectionRate";
import { shuffleArray } from "./deckUtils";

export function executeEpidemic(
    boardState: FieldState[], 
    infectionDeck: DeckState<InfectionCard>, 
    infectionRateIndex: number
): Partial<GameState> {
    
    const newInfectionIndex = increaseInfectionIndex(infectionRateIndex);
    const drawnInfectionCard = infectionDeck.deck.shift();

    const updatedBoardState = boardState.map(city => {
        if (drawnInfectionCard && city.name === drawnInfectionCard.data.name) {
            return { ...city, supplies: 0 };
        }
        return city;
    });

    let updatedDiscardPile = drawnInfectionCard 
        ? [...infectionDeck.discardPile, drawnInfectionCard]
        : [...infectionDeck.discardPile];
    updatedDiscardPile = shuffleArray(updatedDiscardPile);

    return {
        boardState: updatedBoardState,
        infectionDeck: {
            deck: [...infectionDeck.deck],
            discardPile: updatedDiscardPile
        },
        infectionRateIndex: newInfectionIndex
    };
}


export function insertEpidemicCards(deck: PlayerCard[]): PlayerCard[]{
    const epidemicCards: EpidemicCard[] = Array(5).fill({
        cardType: 'epidemic',
        action: executeEpidemic
    });

    // Erstelle zuerst eine flache Kopie des Originaldecks
    let deckCopy = [...deck];
    
    const deckSize = deck.length;
    const subDeckSize = Math.floor(deckSize / 5);
    let subDecks = [];
      
    for (let i = 0; i < 5; i++) {
        subDecks.push(deckCopy.slice(i * subDeckSize, (i+1) * subDeckSize))
    }

    if (deckSize % 5 !== 0) {
        subDecks[4] = subDecks[4].concat(deckCopy.slice(5 * subDeckSize));
    }

    subDecks = subDecks.map((subDeck, index) => {
        subDeck.push(epidemicCards[index]); // Füge Epidemie-Karte hinzu
        return shuffleArray(subDeck); // Mische das Sub-Array
    });

    let shuffledDeck = subDecks.flat();

    return shuffledDeck  
}