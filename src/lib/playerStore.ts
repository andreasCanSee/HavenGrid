import { writable } from "svelte/store";
import { currentTurnActions } from "./store";

export interface Player {
    name: string;
    currentLocation: string
    supplies: number;
    actionsHistory: Action[][];
    color: string;
    image: string;
  }

export interface Action {
  type: 'moveTo' | 'startAt' | 'makeSupply' | 'pickUpSupplies' | 'deliverSupplies' | 'transferSupplies';
  location?: string;
  supplies?: number;
  freeAction: boolean;
  transactionPartner?: string;
}

export function createPlayer(name: string, startingLocation: string, color: string, image: string): Player {
    return {
      name,
      currentLocation: startingLocation,
      supplies: 0,
      actionsHistory: [[{ type: 'startAt', location: startingLocation, freeAction: true }]],
      color,
      image
    }
}

export function getInitialPlayers() {
    return [
      createPlayer("Spieler 1", "Atlantis", "purple", '/survivor-male.png'),
      createPlayer("Spieler 2", "Avalon", "	orange", '/survivor-female.png')
    ];
  }
  
  export const players = writable<Player[]>(getInitialPlayers());

  export const activePlayerIndex = writable(0);

  export const increaseSupplies = (playerName: string) => {
    const makeSupplyAction: Action = { type: 'makeSupply', freeAction: false };  
  
    // Aktualisiere currentTurnActions
    currentTurnActions.update(actions => [...actions, makeSupplyAction]);
  
    // Erhöhe die supplies des angegebenen Spielers
    players.update(allPlayers => {
        return allPlayers.map(p => {
            if (p.name === playerName) {
                return { ...p, supplies: p.supplies + 1 };
            }
            return p;
        });
    });
  };
  