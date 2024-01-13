import type { ExtendedFieldData } from "../Models/types";

  export const initialBoardState: ExtendedFieldData[] =[
      { name: 'Sao Paulo', coordinates: {x: 2, y: 6}, connections: ['Lagos', 'Asgard'], color: 'yellow', capacity: 3, supplies: 3, hasSupplyCenter: false, plagueLevel: 0 },
      { name: 'Lagos', coordinates: {x: 5, y: 5}, connections: ['Sao Paulo', 'Asgard'], color: 'yellow', capacity: 3, supplies: 3, hasSupplyCenter: false, plagueLevel: 0},
      { name: 'Jacksonville',coordinates: {x: 2, y: 3}, connections: ['Asgard', 'Washington', 'New York'], color: 'yellow', capacity: 3, supplies: 3, hasSupplyCenter: false, plagueLevel: 0 },
      { name: 'Atlantis',coordinates: {x: 4, y: 1}, connections: ['New York', 'Asgard', 'Avalon', 'London'], color: 'white', capacity: 3, supplies: 3, hasSupplyCenter: true, plagueLevel: 0 },
      { name: 'Avalon',coordinates: {x: 6, y: 2}, connections: ['Atlantis', 'Asgard', 'Istanbul', 'Tripolis'], color: 'white', capacity: 3, supplies: 3, hasSupplyCenter: true, plagueLevel: 0 },
      { name: 'Asgard', coordinates: {x: 4, y: 4}, connections: ['Sao Paulo', 'Lagos', 'Atlantis', 'Jacksonville', 'Avalon'], color: 'white', capacity: 3, supplies: 3, hasSupplyCenter: true, plagueLevel: 0 },
      { name: 'London', coordinates: {x: 7, y: 1}, connections: ['Atlantis'], color: 'blue', capacity: 3, supplies: 3, hasSupplyCenter: false, plagueLevel: 0 },
      { name: 'New York', coordinates: {x: 2, y: 1}, connections: ['Washington', 'Jacksonville', 'Atlantis'], color: 'blue', capacity: 3, supplies: 3, hasSupplyCenter: false, plagueLevel: 0 },
      { name: 'Washington', coordinates: {x: 1, y: 2}, connections: ['New York', 'Jacksonville'], color: 'blue', capacity: 3, supplies: 3, hasSupplyCenter: false, plagueLevel: 0 },
      { name: 'Tripolis',coordinates: {x: 7, y: 3}, connections: ['Cairo', 'Avalon'], color: 'black', capacity: 3, supplies: 3, hasSupplyCenter: false, plagueLevel: 0 },
      { name: 'Cairo', coordinates: {x: 9, y: 3}, connections: ['Istanbul', 'Tripolis'], color: 'black', capacity: 3, supplies: 3, hasSupplyCenter: false, plagueLevel: 0 },
      { name: 'Istanbul', coordinates: {x: 8, y: 2}, connections: ['Cairo', 'Avalon'], color: 'black', capacity: 3, supplies: 3, hasSupplyCenter: false, plagueLevel: 0 }
  ];

  // Erstellen der Zuordnungstabelle: Stadt -> Farbe
  const cityColorMap: Map<string, string> = new Map();
  initialBoardState.forEach(place => {
      cityColorMap.set(place.name, place.color);
  });

  // Verwenden der Map zur Farbsuche
  export function getColorOfCity(cityName: string): string {
      return cityColorMap.get(cityName) || 'green';
  }