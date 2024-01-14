import { get } from "svelte/store";
import { gameState } from "../../Stores/gameStateStore";
import { findPath } from "../../Utilities/utils";
import { animateFerry } from "../../Components/Board/boardUtils";
import type { Action, CityCard } from "../../Models/types";
import { charterBoatMode, isDiscardModeActive } from "../../Stores/uiStore";
import { addActionToCurrentTurn, countNonFreeActions, currentTurnActions, isTurnFinished, canPerformAction } from "../../Stores/turnStateStore";
import { discardCard } from "./actionUtils";


export function moveToLocation(targetLocation: string) {
  if(!canPerformAction()) return

  const currentGameState = get(gameState);
  const activeLocation = currentGameState.players[currentGameState.activePlayerIndex].currentLocation;

  if(get(charterBoatMode) && targetLocation !== activeLocation){
    charterToLocation(activeLocation, targetLocation)
  }
  else{
    ferryToLocation(activeLocation, targetLocation, countNonFreeActions());
  }
}

async function ferryToLocation(currentLocation: string, targetLocation: string, actionsTaken: number) {
    let path = findPath(currentLocation, targetLocation);

    // Überprüfen, ob der Zielort direkt mit dem aktuellen Ort verbunden ist
    if (path.length > 0 && actionsTaken + path.length <= 4 && !isDiscardModeActive() && !isTurnFinished()) {
        for (const location of path) {
            await animateFerry(currentLocation, location, 'moveTo');
            // Aktion zur Bewegung hinzufügen
            const action: Action = { type: 'moveTo', location, freeAction: false };
            addActionToCurrentTurn(action);

            // Aktualisierung der Spielerposition für den nächsten Schritt
            currentLocation = location;
      }
        // Spielerposition im gameState Store aktualisieren
        gameState.update(state => {
            let updatedPlayers = [...state.players];
            updatedPlayers[state.activePlayerIndex].currentLocation = targetLocation;
            return { ...state, players: updatedPlayers };
        });
    }
}

export async function charterToLocation(currentLocation: string, targetLocation: string) {
    
        await animateFerry(currentLocation, targetLocation, 'charterBoatTo');

        let cardToDiscard: CityCard | undefined;
      
        gameState.update(state => {
          const updatedPlayers = [...state.players];
          const activePlayer = updatedPlayers[state.activePlayerIndex];

          // Finde die zu entsorgende CityCard basierend auf dem Namen der aktuellen Location
          cardToDiscard = activePlayer.handCards.cityCards.find(card => card.name === currentLocation);

          if (cardToDiscard) {
            const result = discardCard<CityCard>(cardToDiscard, activePlayer.handCards.cityCards, state.playerDeck.discardPile);
            activePlayer.handCards.cityCards = result.newPlayerCards as CityCard[];
            state.playerDeck.discardPile = result.newDiscardPile;
          }

          activePlayer.currentLocation = targetLocation;

          return {...state, players: updatedPlayers };
        });
  
        const charterBoatToLocationAction: Action = {
          type: 'charterBoatTo',
          location: targetLocation,
          card: cardToDiscard,
          freeAction: false
        }
      
        addActionToCurrentTurn(charterBoatToLocationAction);
        console.log(get(currentTurnActions))
}

export async function sailToLocation(currentLocation: string, targetLocation: string, playerIndex: number) {

  if(!canPerformAction() || currentLocation === targetLocation) return

  await animateFerry(currentLocation, targetLocation, 'sailTo');

  let cardToDiscard: CityCard | undefined;

  gameState.update(state => {
    const updatedPlayers = [...state.players];
    const activePlayer = updatedPlayers[playerIndex]
    activePlayer.currentLocation = targetLocation;

    // Finde die zu entsorgende CityCard basierend auf dem Namen der Ziellocation
    cardToDiscard = activePlayer.handCards.cityCards.find(card => card.name === targetLocation);

    if (cardToDiscard) {
      const result = discardCard<CityCard>(cardToDiscard, activePlayer.handCards.cityCards, state.playerDeck.discardPile);
      activePlayer.handCards.cityCards = result.newPlayerCards as CityCard[];
      state.playerDeck.discardPile = result.newDiscardPile;
    }
      
    return { ...state, players: updatedPlayers };
  });
    
    const sailToLocationAction: Action = {
      type: 'sailTo',
      card: cardToDiscard,
      location: cardToDiscard?.name,
      freeAction: false
    };
    addActionToCurrentTurn(sailToLocationAction);
}