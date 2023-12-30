export interface Player {
    name: string;
    startingLocation: string
    supplies: number;
    actionsMade: number;
    actionsHistory: Action[];
    color: string;
  }

export interface Action {
  type: 'moveTo' | 'startAt';
  location: string;
}

export function createPlayer(name: string, startingLocation: string, color: string): Player {
    return {
      name,
      startingLocation,
      supplies: 0, // Startwert für Supplies
      actionsMade: 0,
      actionsHistory: [{ type: 'startAt', location: startingLocation }],
      color
    }
}
  