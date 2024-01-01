import type { Card } from './cardsStore' 
import { distributeStartCards } from './cardsStore';

export interface Player {
    name: string;
    currentLocation: string
    supplies: number;
    actionsHistory: Action[][];
    color: string;
    image: string;
    handCards: Card[]
  }

export interface Action {
  type: 'moveTo' | 'startAt' | 'makeSupply' | 'pickUpSupplies' | 'deliverSupplies' | 'transferSupplies' | 'sailTo';
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
      image,
      handCards: distributeStartCards(4)
    }
}