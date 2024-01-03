import { findPath } from "../../Utilities/utils";
import { boardConfig } from "../../Stores/boardStore";
import { get } from "svelte/store";
import { animateFerry } from "../Board/boardUtils";
import type { Action, Player } from "../../Models/types";
import { addActionToCurrentTurn } from "../../store";
import { players, activePlayerIndex } from "../../playerStore";
import { charterBoatMode } from "../../store";
import { cardsStore } from "../../cardsStore";
import { addToDiscardPile } from "../../cardsStore";
import { currentTurnActions } from "../../store";
import { showBoat } from "../../Stores/boardStore";

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
    let path = findPath(currentLocation, targetLocation, get(boardConfig));

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
          get(boardConfig).forEach(place => {
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

      boardConfig.update(fields => {
          let currentField = fields.find(f => f.name === name);
          if(currentField){
              currentField.supplies = Math.min(currentField.supplies +deliveryQuantity ,capacity)
          }
          return fields;
      })

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

  boardConfig.update(fields => {
      let updatedFields = [...fields];
      let fieldToUpdate = updatedFields.find(f => f.name === name);

      if (fieldToUpdate) {
          fieldToUpdate.supplies -= 1; 
      }

      return updatedFields;
      });
  }
}