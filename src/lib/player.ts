import { distributeStartCards } from './cardsStore';

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