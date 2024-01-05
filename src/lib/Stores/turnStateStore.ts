import { writable } from 'svelte/store';
import type { Action } from '../Models/types';
import { get } from 'svelte/store';

export const currentTurnActions = writable<Action[]>([]);

export function addActionToCurrentTurn(action: Action) {
  currentTurnActions.update(actions => [...actions, action]);
  console.log(get(currentTurnActions))
}

export function initializeNextTurn(location: string){
  // Setze currentTurnActions für den nächsten Spieler zurück
  currentTurnActions.set([{ type: 'startAt', location, freeAction: true }]);
}