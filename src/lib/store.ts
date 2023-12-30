import { writable } from 'svelte/store';
import { createPlayer } from './player';

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

export const initialPlayers = [
    createPlayer("Spieler 1", "Atlantis", "purple"),
    createPlayer("Spieler 2", "Avalon", "orange")
  ];
  
export const players = writable(JSON.parse(JSON.stringify(initialPlayers)));

export const activePlayerIndex = writable(0);

export const drawnInfectionCards = writable<string[]>([]);