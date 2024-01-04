import { writable, get } from 'svelte/store';
import { players } from './Stores/playerStore'; 
import type { Action } from './Models/types';

export const drawnInfectionCards = writable<string[]>([]);

export const currentTurnActions = writable<Action[]>([]);

export function addActionToCurrentTurn(action: Action) {
  currentTurnActions.update(actions => [...actions, action]);
}

export const resetCurrentTurnActions = () => {
  currentTurnActions.set([]);
}

export const charterBoatMode = writable(false);

