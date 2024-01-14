import { writable } from "svelte/store";
import { get } from "svelte/store";

export const showBoat = writable(false); 

export function isShowBoatActive() {
  return get(showBoat);
}

export const charterBoatMode = writable(false);

export function isCharterBoatModeActive() {
  return get(charterBoatMode);
}

export const isDiscardMode = writable<{ active: boolean; playerIndex: number | null }>({ active: false, playerIndex: null });

export function resetDiscardMode() {
  isDiscardMode.set({ active: false, playerIndex: null });
}

export function setDiscardMode(playerIndex: number){
  isDiscardMode.set({ active: true, playerIndex });
}

export function isDiscardModeActive(){
  const discardMode = get(isDiscardMode);
  return discardMode.active;
}

/* 
  Falls showBoat jedoch nur in wenigen spezifischen Komponenten relevant ist 
  oder wenn es sich um eine UI-spezifische Zustandsinformation handelt, 
  die nicht eng mit der Spiellogik verknüpft ist, könntest du erwägen, 
  sie in einen lokaleren Kontext zu verschieben, um die Trennung zwischen UI-Status 
  und Geschäftslogik deutlicher zu machen.
*/