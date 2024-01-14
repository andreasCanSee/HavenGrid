import { writable, get } from 'svelte/store';
import { initialPlayerData } from '../Models/initialPlayerData';
import { isDiscardModeActive } from './uiStore';
import type { Action } from '../Models/types';
import { isShowBoatActive } from './uiStore';


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

export function markTurnAsFinished() {
  addActionToCurrentTurn({ type: 'turnFinished', freeAction: true });
}

export function isTurnFinished(): boolean {
  const actions = get(currentTurnActions);
  // Rückwärts durch das Array gehen
  for (let i = actions.length - 1; i >= 0; i--) {
    if (actions[i].type === 'turnFinished') {
        return true;
    }
  }
  return false;
  // Alternativ: `return actions.some(action => action.type === 'turnFinished');`
}

export function canPerformFreeAction(): boolean {
  return !isDiscardModeActive() && !isTurnFinished();
}

export function canPerformAction(): boolean {
  return canPerformFreeAction() && (countNonFreeActions() < 4) && !isShowBoatActive();
}
