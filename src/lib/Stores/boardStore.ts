import { writable } from "svelte/store";

  export const initialBoardConfig =[
      { name: 'Sao Paulo', x: 2, y: 5, connections: ['Lagos', 'Asgard'], color: 'yellow', capacity: 3, supplies: 3, hasSupplyCenter: false },
      { name: 'Lagos', x: 5, y: 4, connections: ['Sao Paulo', 'Asgard'], color: 'yellow', capacity: 3, supplies: 3, hasSupplyCenter: false},
      { name: 'Jacksonville', x: 2, y: 3, connections: ['Asgard', 'Washington', 'New York'], color: 'yellow', capacity: 3, supplies: 3, hasSupplyCenter: false },
      { name: 'Atlantis', x: 4, y: 1, connections: ['New York', 'Asgard', 'Avalon', 'London'], color: 'white', capacity: 3, supplies: 3, hasSupplyCenter: true },
      { name: 'Avalon', x: 6, y: 2, connections: ['Atlantis', 'Asgard', 'Istanbul', 'Tripolis'], color: 'white', capacity: 3, supplies: 3, hasSupplyCenter: true },
      { name: 'Asgard', x: 4, y: 3, connections: ['Sao Paulo', 'Lagos', 'Atlantis', 'Jacksonville', 'Avalon'], color: 'white', capacity: 3, supplies: 3, hasSupplyCenter: true },
      { name: 'London', x: 6, y: 1, connections: ['Atlantis'], color: 'blue', capacity: 3, supplies: 3, hasSupplyCenter: false },
      { name: 'New York', x: 2, y: 1, connections: ['Washington', 'Jacksonville', 'Atlantis'], color: 'blue', capacity: 3, supplies: 3, hasSupplyCenter: false },
      { name: 'Washington', x: 1, y: 2, connections: ['New York', 'Jacksonville'], color: 'blue', capacity: 3, supplies: 3, hasSupplyCenter: false },
      { name: 'Tripolis', x: 7, y: 3, connections: ['Cairo', 'Avalon'], color: 'black', capacity: 3, supplies: 3, hasSupplyCenter: false },
      { name: 'Cairo', x: 8, y: 3, connections: ['Istanbul', 'Tripolis'], color: 'black', capacity: 3, supplies: 3, hasSupplyCenter: false },
      { name: 'Istanbul', x: 8, y: 2, connections: ['Cairo', 'Avalon'], color: 'black', capacity: 3, supplies: 3, hasSupplyCenter: false }
  ];
  
export const boardConfig = writable([...initialBoardConfig]);

export const showBoat = writable(false); 
/* 
  Falls showBoat jedoch nur in wenigen spezifischen Komponenten relevant ist 
  oder wenn es sich um eine UI-spezifische Zustandsinformation handelt, 
  die nicht eng mit der Spiellogik verknüpft ist, könntest du erwägen, 
  sie in einen lokaleren Kontext zu verschieben, um die Trennung zwischen UI-Status 
  und Geschäftslogik deutlicher zu machen.
*/