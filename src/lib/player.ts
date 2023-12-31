export interface Player {
    name: string;
    currentLocation: string
    supplies: number;
    actionsHistory: Action[][];
    color: string;
  }

export interface Action {
  type: 'moveTo' | 'startAt' | 'makeSupply';
  location?: string;
}

export function createPlayer(name: string, startingLocation: string, color: string): Player {
    return {
      name,
      currentLocation: startingLocation,
      supplies: 0,
      actionsHistory: [[{ type: 'startAt', location: startingLocation }]],
      color
    }
}
  