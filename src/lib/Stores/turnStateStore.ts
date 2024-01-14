import { writable, get } from 'svelte/store';
import { initialPlayerData } from '../Models/initialPlayerData';
import type { Action } from '../Models/types';


// Hole die Anfangsposition des ersten Spielers
const startLocation = initialPlayerData[0].currentLocation; // Startspieler hat Index 0

// Initialisiere currentTurnActions mit der Startaktion
export const currentTurnActions = writable<Action[]>([{ type: 'startAt', location: startLocation, freeAction: true }]);

export function addActionToCurrentTurn(action: Action) {
  currentTurnActions.update(actions => [...actions, action]);
}

export function updateCurrentTurnActions(actions: Action[]){
  currentTurnActions.set(actions);
}

export function initializeNextTurn(location: string){
  currentTurnActions.set([{ type: 'startAt', location, freeAction: true }]);
}

export function countNonFreeActions(): number{
  const actions = get(currentTurnActions);
  return actions.filter(action => !action.freeAction).length;
}

export function isTurnFinished(): boolean {
  const actions = get(currentTurnActions);
  if (actions.length === 0) {
      return false;
  }
  return actions[actions.length - 1].type === 'turnFinished';
}