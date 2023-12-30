export interface Player {
    name: string;
    currentLocation: string;
    supplies: number;
    actionsMade: number;
    actionsHistory: string[];
    color: string;
  }

export function createPlayer(name: string, startingLocation: string, color: string): Player {
    return {
      name: name,
      currentLocation: startingLocation,
      supplies: 0, // Startwert für Supplies
      actionsMade: 0,
      actionsHistory: [startingLocation],
      color: color // Setzen der Farbeigenschaft
    }
}
  