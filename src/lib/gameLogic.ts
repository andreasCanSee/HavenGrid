import { currentTurnActions } from "./store";
import { players, activePlayerIndex } from "./Stores/playerStore";
import { get } from "svelte/store";

export function startPlayerTurn() {
    // Logik, die zu Beginn eines Spielerzuges ausgeführt wird
}

export function endPlayerTurn() {
    // Beende den Spielerzug und leite die nächste Phase ein
    // Setze currentTurnActions für den nächsten Spieler zurück
    currentTurnActions.set([]);

    drawPlayerCards();
    performInfectionPhase();
    moveToNextPlayer();
}

export function drawPlayerCards() {
    // Spieler zieht Karten
}

export function performInfectionPhase() {
    // Führe die Infektionsphase durch
}

export function moveToNextPlayer() {
    // Wechsle zum nächsten Spieler
    activePlayerIndex.update(index => (index + 1) % get(players).length);
}