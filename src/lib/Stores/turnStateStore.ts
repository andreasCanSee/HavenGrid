import { writable, get } from 'svelte/store';
import type { Action } from '../Models/types';

export const currentTurnActions = writable<Action[]>([]);

export function addActionToCurrentTurn(action: Action) {
  currentTurnActions.update(actions => [...actions, action]);
}

export function initializeNextTurn(location: string){
  // Setze currentTurnActions für den nächsten Spieler zurück
  currentTurnActions.set([{ type: 'startAt', location, freeAction: true }]);
}

export function countNonFreeActions(): number{
  const actions = get(currentTurnActions);
  return actions.filter(action => !action.freeAction).length;
}