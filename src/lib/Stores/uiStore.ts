import { writable } from "svelte/store";

export const showBoat = writable(false); 
/* 
  Falls showBoat jedoch nur in wenigen spezifischen Komponenten relevant ist 
  oder wenn es sich um eine UI-spezifische Zustandsinformation handelt, 
  die nicht eng mit der Spiellogik verknüpft ist, könntest du erwägen, 
  sie in einen lokaleren Kontext zu verschieben, um die Trennung zwischen UI-Status 
  und Geschäftslogik deutlicher zu machen.
*/