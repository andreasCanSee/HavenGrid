import { writable, get } from 'svelte/store';
import { createPlayer } from './player';
import type { Action, Player } from './player'; 

export interface FieldConfig {
  name: string;
  x: number;
  y: number;
  connections: string[];
  color: string;
  capacity: number;
  supplies: number;
}

export const initialBoardConfig =[
    { name: 'Sao Paulo', x: 2, y: 5, connections: ['Lagos', 'Asgard'], color: 'yellow', capacity: 3, supplies: 3 },
    { name: 'Lagos', x: 5, y: 4, connections: ['Sao Paulo', 'Asgard'], color: 'yellow', capacity: 3, supplies: 3 },
    { name: 'Jacksonville', x: 2, y: 3, connections: ['Asgard', 'Washington', 'New York'], color: 'yellow', capacity: 3, supplies: 3 },
    { name: 'Atlantis', x: 4, y: 1, connections: ['New York', 'Asgard', 'Avalon', 'London'], color: 'white', capacity: 3, supplies: 3 },
    { name: 'Avalon', x: 6, y: 2, connections: ['Atlantis', 'Asgard', 'Istanbul', 'Tripolis'], color: 'white', capacity: 3, supplies: 3 },
    { name: 'Asgard', x: 4, y: 3, connections: ['Sao Paulo', 'Lagos', 'Atlantis', 'Jacksonville', 'Avalon'], color: 'white', capacity: 3, supplies: 3 },
    { name: 'London', x: 6, y: 1, connections: ['Atlantis'], color: 'blue', capacity: 3, supplies: 3 },
    { name: 'New York', x: 2, y: 1, connections: ['Washington', 'Jacksonville', 'Atlantis'], color: 'blue', capacity: 3, supplies: 3 },
    { name: 'Washington', x: 1, y: 2, connections: ['New York', 'Jacksonville'], color: 'blue', capacity: 3, supplies: 3 },
    { name: 'Tripolis', x: 7, y: 3, connections: ['Cairo', 'Avalon'], color: 'black', capacity: 3, supplies: 3 },
    { name: 'Cairo', x: 8, y: 3, connections: ['Istanbul', 'Tripolis'], color: 'black', capacity: 3, supplies: 3 },
    { name: 'Istanbul', x: 8, y: 2, connections: ['Cairo', 'Avalon'], color: 'black', capacity: 3, supplies: 3 }
];

export const boardConfig = writable([...initialBoardConfig]);

export function getInitialPlayers() {
  return [
    createPlayer("Spieler 1", "Atlantis", "purple", '/survivor-male.png'),
    createPlayer("Spieler 2", "Avalon", "	orange", '/survivor-female.png')
  ];
}

export const players = writable<Player[]>(getInitialPlayers());

export const activePlayerIndex = writable(0);

export const drawnInfectionCards = writable<string[]>([]);

export const currentTurnActions = writable<Action[]>([]);

export function addActionToCurrentTurn(action: Action) {
  currentTurnActions.update(actions => [...actions, action]);
}

export function finalizeTurn(activePlayerIndex: number) {
  const currentPlayerActions = get(currentTurnActions);

  players.update(currentPlayers => {
    let updatedPlayers = [...currentPlayers];
    let currentPlayer = updatedPlayers[activePlayerIndex];
    // Füge die aktuellen Aktionen zur Aktionshistorie hinzu
    currentPlayer.actionsHistory.push([...currentPlayerActions]);

    // Aktualisiere den Spieler im Array
    updatedPlayers[activePlayerIndex] = currentPlayer;

    return updatedPlayers;
  });

  // Setze currentTurnActions für den nächsten Spieler zurück
  currentTurnActions.set([]);
}

export const increaseSupplies = (playerName: string) => {
  const makeSupplyAction: Action = { type: 'makeSupply' };  

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

export const showBoat = writable(false);