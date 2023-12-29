import { writable } from 'svelte/store';

export const boardConfig = writable([
    { name: 'Sao Paulo', x: 2, y: 5, connections: ['Lagos', 'Asgard'], color: 'yellow' },
    { name: 'Lagos', x: 5, y: 4, connections: ['Sao Paulo', 'Asgard'], color: 'yellow' },
    { name: 'Jacksonville', x: 2, y: 3, connections: ['Asgard', 'Washington', 'New York'], color: 'yellow' },
    { name: 'Atlantis', x: 4, y: 1, connections: ['New York', 'Asgard', 'Avalon', 'London'], color: 'white' },
    { name: 'Avalon', x: 6, y: 2, connections: ['Atlantis', 'Asgard', 'Istanbul', 'Tripolis'], color: 'white' },
    { name: 'Asgard', x: 4, y: 3, connections: ['Sao Paulo', 'Lagos', 'Atlantis', 'Jacksonville', 'Avalon'], color: 'white' },
    { name: 'London', x: 6, y: 1, connections: ['Atlantis'], color: 'blue' },
    { name: 'New York', x: 2, y: 1, connections: ['Washington', 'Jacksonville', 'Atlantis'], color: 'blue' },
    { name: 'Washington', x: 1, y: 2, connections: ['New York', 'Jacksonville'], color: 'blue' },
    { name: 'Tripolis', x: 7, y: 3, connections: ['Cairo', 'Avalon'], color: 'black' },
    { name: 'Cairo', x: 8, y: 3, connections: ['Istanbul', 'Tripolis'], color: 'black' },
    { name: 'Istanbul', x: 8, y: 2, connections: ['Cairo', 'Avalon'], color: 'black' }
]);

export const currentLocation = writable("");
export const moveHistory = writable(["Atlantis"]);