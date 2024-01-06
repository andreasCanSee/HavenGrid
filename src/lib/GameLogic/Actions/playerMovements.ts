import { get } from "svelte/store";
import { gameState } from "../../Stores/gameStateStore";
import { findPath } from "../../Utilities/utils";
import { animateFerry } from "../../Components/Board/boardUtils";
import type { Action } from "../../Models/types";
import { charterBoatMode } from "../../Stores/uiStore";
import { currentTurnActions, addActionToCurrentTurn } from "../../Stores/turnStateStore";
import { showBoat } from "../../Stores/uiStore";
import { initialBoardState } from "../../Models/initialBoardData";

export function moveToLocation(targetLocation: string) {
    const currentGameState = get(gameState);
    const activeLocation = currentGameState.players[currentGameState.activePlayerIndex].currentLocation;
    let actionsTaken = get(currentTurnActions).filter(action => !action.freeAction).length;

    if(get(charterBoatMode) && targetLocation !== activeLocation && actionsTaken < 4){
      charterToLocation(activeLocation, targetLocation)
    }else{
      ferryToLocation(activeLocation, targetLocation, actionsTaken );
    }
}

// checken, dass nicht vorliegt:
// if($charterBoatMode && targetLocation !== currentLocation){
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

async function charterToLocation(currentLocation: string, targetLocation: string) {
    if(get(charterBoatMode) && targetLocation !== currentLocation){
        await animateFerry(currentLocation, targetLocation, 'charterBoatTo');
  
        gameState.update(state => {
          const updatedPlayers = [...state.players];
          const activePlayer = updatedPlayers[state.activePlayerIndex];
          const cardIndex = activePlayer.handCards.findIndex(card => card.data.name === currentLocation);
  
          if (cardIndex !== -1) {
            // Finde die Farbe des aktuellen Standorts
            let locationColor = '';
            initialBoardState.forEach(place => {
              if (place.name === currentLocation) {
                locationColor = place.color;
              }
          });
         
          // Erstelle die zu entsorgende Karte
          const cardToDiscard = {
            cardType: 'city', // oder ein anderer passender Wert für cardType
            data: { name: currentLocation, color: locationColor },
            inBuildArea: false
          };
          
          state.playerDeck.discardPile.push(cardToDiscard)
          activePlayer.handCards.splice(cardIndex, 1);
        }
        
        
        activePlayer.currentLocation = targetLocation;
        return {...state, players: updatedPlayers};
        });
  
        const charterBoatToLocation: Action = {
          type: 'charterBoatTo',
          startLocation: currentLocation,
          location: targetLocation,
          freeAction: false
        };
        addActionToCurrentTurn(charterBoatToLocation);
    }
}