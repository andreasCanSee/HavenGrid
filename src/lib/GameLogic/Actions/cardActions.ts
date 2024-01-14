import { gameState } from "../../Stores/gameStateStore";
import type { Action, GameState, PlayerState, CityCard, PlayerHandCard, ActionCard } from "../../Models/types";
import { countNonFreeActions, addActionToCurrentTurn, isTurnFinished } from "../../Stores/turnStateStore";
import { discardCard } from "./actionUtils";
import { checkHandCardLimit } from "../turnCycleLogic";
import { get } from "svelte/store";
import { setDiscardMode, resetDiscardMode, isDiscardModeActive } from "../../Stores/uiStore";


export function exchangeCityCard(fromPlayerIndex: number, toPlayerIndex: number, cityCard: CityCard){
    if(countNonFreeActions() >= 4 || isDiscardModeActive() || isTurnFinished()) return
    
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        const fromPlayer = updatedPlayers[fromPlayerIndex];
        const toPlayer = updatedPlayers[toPlayerIndex];

        // Finde die StadtKarte im Handkartendeck des abgebenden Spielers
        const cardIndex = fromPlayer.handCards.cityCards.findIndex(card => card.name === cityCard.name);

        if (cardIndex !== -1) {
            fromPlayer.handCards.cityCards.splice(cardIndex, 1);
            toPlayer.handCards.cityCards.push(cityCard);
        }
        return { ...state, players: updatedPlayers}
    })

    const currentState = get(gameState);
    if (checkHandCardLimit(currentState.players[toPlayerIndex].handCards)) {
        setDiscardMode(toPlayerIndex);
    }
        const action: Action = {
            type: 'exchangeCard',
            transferringPlayerIndex: fromPlayerIndex,
            receivingPlayerIndex: toPlayerIndex,
            card: cityCard,
            freeAction: false,
        };
        addActionToCurrentTurn(action); 
}

export function buildSupplyCenter(playerLocation: string) {
    if(countNonFreeActions() >= 4 || isDiscardModeActive() || isTurnFinished()) return
        
    let discardedCards: CityCard[] = [];
    gameState.update((state: GameState) => {

        // Flache Kopie des aktuellen Spielzustands
        let newState = { ...state };

        // Referenz auf den aktiven Spieler im neuen Zustand
        const activePlayer: PlayerState = newState.players[newState.activePlayerIndex];
        
        // Filtern und Verarbeiten der Karten
        discardedCards = activePlayer.handCards.cityCards.filter(card => card.inBuildArea);

        discardedCards.forEach(card => {
            const result = discardCard<CityCard>(card, activePlayer.handCards.cityCards, newState.playerDeck.discardPile);
            activePlayer.handCards.cityCards = result.newPlayerCards;
            newState.playerDeck.discardPile = result.newDiscardPile;
        });

        // Update des Supply Center Status
        const locationIndex = newState.boardState.findIndex(field => field.name === playerLocation);
        if (locationIndex !== -1) {
            newState.boardState[locationIndex].hasSupplyCenter = true;
        }
        
        return newState;
    });

    const action: Action = {
        type: 'buildSupplyCenter',
        cards: discardedCards,
        location: playerLocation,
        freeAction: false,
    };
    addActionToCurrentTurn(action); 
}

export function discardExcessCard(playerIndex: number, card: PlayerHandCard ){
    gameState.update(currentState => {

        let newState = {...currentState};
        let affectedPlayer = { ...newState.players[playerIndex]}

        // Generische Behandlung für das Aussortieren von Karten
        if(card.cardType === 'city' || card.cardType === 'action'){
            const playerCards = card.cardType === 'city' ? affectedPlayer.handCards.cityCards : affectedPlayer.handCards.actionCards;

            const result = discardCard(card, playerCards, newState.playerDeck.discardPile);
            
            if (card.cardType === 'city') {
                affectedPlayer.handCards.cityCards = result.newPlayerCards as CityCard[];
            } else {
                affectedPlayer.handCards.actionCards = result.newPlayerCards as ActionCard[];
            }
            newState.playerDeck.discardPile = result.newDiscardPile;
        } else {
            // Handle unexpected card type
            throw new Error('Unexpected card type');
        }

        newState.players[playerIndex] = affectedPlayer;
        
        return newState;
    });

    // Prüfe und aktualisiere den isDiscardMode Zustand
    const updatedState = get(gameState);
    if (!checkHandCardLimit(updatedState.players[playerIndex].handCards)) {
        resetDiscardMode();
    }

    const action: Action = {
        type: 'discardCard',
        transferringPlayerIndex: playerIndex,
        card: card,
        freeAction: true,
    };
    addActionToCurrentTurn(action); 
}