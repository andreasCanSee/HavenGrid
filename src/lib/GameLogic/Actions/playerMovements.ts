import { get } from "svelte/store";
import { gameState } from "../../Stores/gameStateStore";
import { findPath } from "../../Utilities/utils";
import { animateFerry } from "../../Components/Board/boardUtils";
import type { Action } from "../../Models/types";
import { charterBoatMode } from "../../Stores/uiStore";
import { addActionToCurrentTurn, countNonFreeActions } from "../../Stores/turnStateStore";
import { showBoat } from "../../Stores/uiStore";
import { getColorOfCity } from "../../Models/initialBoardData";
import { discardCard } from "./actionUtils";

export function moveToLocation(targetLocation: string) {
    const currentGameState = get(gameState);
    const activeLocation = currentGameState.players[currentGameState.activePlayerIndex].currentLocation;
    const countActions = countNonFreeActions()
    if(countActions < 4 && !get(showBoat)){
      if(get(charterBoatMode) && targetLocation !== activeLocation){
        charterToLocation(activeLocation, targetLocation)
      }
      else{
        ferryToLocation(activeLocation, targetLocation, countActions);
      }
    }
}

async function ferryToLocation(currentLocation: string, targetLocation: string, actionsTaken: number) {
    let path = findPath(currentLocation, targetLocation);

    // Überprüfen, ob der Zielort direkt mit dem aktuellen Ort verbunden ist
    if (path.length > 0 && actionsTaken + path.length <= 4) {
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
      
        gameState.update(state => {
          const updatedPlayers = [...state.players];
          const activePlayer = updatedPlayers[state.activePlayerIndex];
          activePlayer.currentLocation = targetLocation;

          // Finde die Farbe des aktuellen Standorts
          const locationColor = getColorOfCity(currentLocation)

          const { newDiscardPile, newHandCards } = discardCard(currentLocation, locationColor, activePlayer.handCards, state.playerDeck.deck);
          state.playerDeck.discardPile = newDiscardPile;
          activePlayer.handCards = newHandCards;

          return {...state, players: updatedPlayers };
        });
  
        const charterBoatToLocation: Action = {
          type: 'charterBoatTo',
          startLocation: currentLocation,
          location: targetLocation,
          freeAction: false
        }
      
        addActionToCurrentTurn(charterBoatToLocation);
}

export async function sailToLocation(currentLocation: string, targetLocation: string, cardColor: string, playerIndex: number) {
  const countActions = countNonFreeActions()

  if(countActions < 4 && !get(showBoat) && currentLocation !== targetLocation){

    await animateFerry(currentLocation, targetLocation, 'sailTo');
    gameState.update(state => {
      const updatedPlayers = [...state.players];
      const activePlayer = updatedPlayers[playerIndex]
      activePlayer.currentLocation = targetLocation;

      const { newDiscardPile, newHandCards } = discardCard(targetLocation, cardColor, activePlayer.handCards, state.playerDeck.discardPile);
      state.playerDeck.discardPile = newDiscardPile;
      activePlayer.handCards = newHandCards;
      
      return { ...state, players: updatedPlayers };
    });
    
    const sailToLocation: Action = {
      type: 'sailTo',
      location: targetLocation,
      freeAction: false
    };
    addActionToCurrentTurn(sailToLocation);
   }
}



