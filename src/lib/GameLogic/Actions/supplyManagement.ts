import { get } from "svelte/store";
import { addActionToCurrentTurn, countNonFreeActions } from "../../Stores/turnStateStore";
import { showBoat } from "../../Stores/uiStore";
import { gameState } from "../../Stores/gameStateStore";
import type { Action } from "../../Models/types";

export function increasePlayerSupplies(playerIndex: number) {
  
    if(countNonFreeActions() < 4){
        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const activePlayer = updatedPlayers[playerIndex];
            if (activePlayer) {
                activePlayer.supplies++;
            }
            return { ...state, players: updatedPlayers };
        });

        const action: Action = { type: 'makeSupply', freeAction: false };
        addActionToCurrentTurn(action);
    } 
}

export function transferSupplies(fromPlayerIndex: number, toPlayerIndex: number){
    gameState.update(state => {
        const updatedPlayers = [...state.players];
        updatedPlayers[fromPlayerIndex].supplies--;
        updatedPlayers[toPlayerIndex].supplies++;
               
        return { ...state, players: updatedPlayers};
    });

    const action: Action = {
        type: 'transferSupplies',
        transferringPlayerIndex: fromPlayerIndex,
        receivingPlayerIndex: toPlayerIndex,
        freeAction: true,
    };
    addActionToCurrentTurn(action); 
}

export function deliverSupplies(index: number, supplies: number, capacity: number, name: string){
    const currentGameState = get(gameState);
    let currentPlayer = currentGameState.players[currentGameState.activePlayerIndex];
    let deliveryQuantity = index - supplies + 1;
  
    if ( deliveryQuantity <= currentPlayer.supplies && currentPlayer.currentLocation === name && !get(showBoat) && countNonFreeActions() < 4){
        gameState.update(state => {
          let updatedPlayers = [...state.players];
          let updatedPlayer = updatedPlayers[state.activePlayerIndex];
    
          if (updatedPlayer.supplies >= deliveryQuantity) {
            updatedPlayer.supplies -= deliveryQuantity;
                  
            let updatedBoardState = state.boardState.map(field => {
              if (field.name === name) {
                return { ...field, supplies: Math.min(field.supplies + deliveryQuantity, capacity) };
              }
              return field;
            });
            return { ...state, players: updatedPlayers, boardState: updatedBoardState };
          }
        return state;
      });
    
      const action: Action = {
          type: 'deliverSupplies',
          location: name,
          supplies: deliveryQuantity,
          freeAction: false 
      }
      addActionToCurrentTurn(action);
    }
  }
  
  export function pickUpSupplies(name: string) {
    const currentGameState = get(gameState);
    if (currentGameState.players[currentGameState.activePlayerIndex].currentLocation === name) {
      // Aktion hinzufügen
      const action: Action = {
          type: 'pickUpSupplies',
          location: name,
          freeAction: true
      };
      addActionToCurrentTurn(action);
  
      gameState.update(state => {
        let updatedPlayers = [...state.players];
        let updatedPlayer = updatedPlayers[state.activePlayerIndex];
  
        updatedPlayer.supplies += 1;
  
        let updatedBoardState = state.boardState.map(field => {
            if (field.name === name) {
                return { ...field, supplies: field.supplies - 1 };
            }
            return field;
        });
  
        return { ...state, players: updatedPlayers, boardState: updatedBoardState };
      });
    }
  }