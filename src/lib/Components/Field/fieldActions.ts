import { findPath } from "../../Utilities/utils";
import { get } from "svelte/store";
import { animateFerry } from "../Board/boardUtils";
import type { Action } from "../../Models/types";
import { addActionToCurrentTurn } from "../../store";
import { players, activePlayerIndex } from "../../Stores/playerStore";
import { charterBoatMode } from "../../store";
import { cardsStore } from "../../Stores/cardsStore";
import { addToDiscardPile } from "../../Stores/cardsStore";
import { currentTurnActions } from "../../store";
import { showBoat } from "../../Stores/uiStore";
import { gameState } from "../../Stores/gameStateStore";
import { initialBoardState } from "../../Models/initialBoardData";

export function moveToLocation(targetLocation: string) {
    const activeLocation = get(players)[get(activePlayerIndex)].currentLocation;
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
        // Spielerposition im Store aktualisieren
        players.update(currentPlayers => {
            let updatedPlayers = [...currentPlayers];
            updatedPlayers[get(activePlayerIndex)].currentLocation = targetLocation;
            return updatedPlayers;
        });
    }
}

async function charterToLocation(currentLocation: string, targetLocation: string) {
    if(get(charterBoatMode) && targetLocation !== currentLocation){
        await animateFerry(currentLocation, targetLocation, 'charterBoatTo');
  
        players.update(allPlayers => {
          const updatedPlayers = [...allPlayers];
          const player = updatedPlayers[get(activePlayerIndex)];
          const cardIndex = player.handCards.findIndex(card => card.data.name === currentLocation);
  
          if (cardIndex !== -1) {
              // Entferne die gefundene Karte aus den Handkarten
              player.handCards.splice(cardIndex, 1);
          }
  
          player.currentLocation = targetLocation;
          return updatedPlayers;
        });
  
        let locationColor = '';
        initialBoardState.forEach(place => {
          if (place.name === currentLocation) {
            locationColor = place.color;
          }
        });
  
        const cardToDiscard = {
          cardType: 'city', // oder ein anderer passender Wert für cardType
          data: { name: currentLocation, color: locationColor },
          inBuildArea: false
        };
        addToDiscardPile(cardToDiscard);
        console.log(get(cardsStore));
  
        const charterBoatToLocation: Action = {
          type: 'charterBoatTo',
          startLocation: currentLocation,
          location: targetLocation,
          freeAction: false
        };
        addActionToCurrentTurn(charterBoatToLocation);
    }
}

export function deliverSupplies(index: number, supplies: number, capacity: number, name: string){
  
 
  let deliveryQuantity = index - supplies + 1;

  let currentPlayer = get(players)[get(activePlayerIndex)];
  if ( deliveryQuantity <= currentPlayer.supplies && currentPlayer.currentLocation === name && !get(showBoat)){

      players.update(currentPlayers => {
          let currentPlayer = currentPlayers[get(activePlayerIndex)];
          if (currentPlayer.supplies >= deliveryQuantity) {
              currentPlayer.supplies -= deliveryQuantity;
          } 
          return currentPlayers;
      });

      // Aktualisiere boardState im gameState
      gameState.update(state => {
        let updatedBoardState = state.boardState.map(field => {
            if (field.name === name) {
                return { ...field, supplies: Math.min(field.supplies + deliveryQuantity, capacity) };
            }
            return field;
        });

        return { ...state, boardState: updatedBoardState };
    });

      const action: Action = {
          type: 'deliverSupplies',
          location: name,
          supplies: deliveryQuantity,
          freeAction: false // nur zum testen
      }
      addActionToCurrentTurn(action);
  }
}

export function pickUpSupplies(name: string) {
  if (get(players)[get(activePlayerIndex)].currentLocation === name) {
  // Aktion hinzufügen
  const action: Action = {
      type: 'pickUpSupplies',
      location: name,
      freeAction: true
  };
  addActionToCurrentTurn(action);

  players.update(currentPlayers => {
      let updatedPlayers = [...currentPlayers];
      updatedPlayers[get(activePlayerIndex)].supplies += 1;
      return updatedPlayers;
  });

  // Aktualisiere den boardState im gameState
  gameState.update(state => {
    let updatedBoardState = state.boardState.map(field => {
        if (field.name === name) {
            return { ...field, supplies: field.supplies - 1 };
        }
        return field;
    });

    return { ...state, boardState: updatedBoardState };
    });
  }
}