import { gameState } from "../../Stores/gameStateStore";

export function drawAndDiscard(count: number) {
    gameState.update(state => {
        let newDeck = [...state.infectionDeck.deck];
        let newDiscardPile = [...state.infectionDeck.discardPile];
        let affectedCities = [] as string[];

        for (let i = 0; i < count; i++) {
            const card = newDeck.pop();
            if (card) {
                newDiscardPile.push(card);
                affectedCities.push(card.data.name);
            }
        }

        // Direkte Aktualisierung der Versorgungsgüter
        const newBoardState = state.boardState.map(city => {
            if (affectedCities.includes(city.name)) {
                const reductionCount = affectedCities.filter(name => name === city.name).length;
                return { ...city, supplies: Math.max(city.supplies - reductionCount, 0) };
            }
            return city;
        });

        return {
            ...state,
            boardState: newBoardState,
            infectionDeck: {
                deck: newDeck,
                discardPile: newDiscardPile
            }
        };
    });
}

    

