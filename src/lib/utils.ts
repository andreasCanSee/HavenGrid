import type { Action } from './player'; 

export function getCurrentLocationFromHistory(actionsHistory: Action[]) {
    for (let i = actionsHistory.length - 1; i >= 0; i--) {
      if (actionsHistory[i].type === 'moveTo') {
        return actionsHistory[i].location || '';
      }
    }
    return actionsHistory[0].location || ''; // Wenn kein moveTo-Objekt gefunden wird
}