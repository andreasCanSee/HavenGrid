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