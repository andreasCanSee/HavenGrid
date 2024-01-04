import { currentTurnActions } from "./store";
import { players, activePlayerIndex } from "./Stores/playerStore";
import { get } from "svelte/store";
import { resetCardsStore } from "./Stores/cardsStore";
import { getInitialPlayers } from "./Stores/playerStore";
import { boardConfig } from "./Stores/boardStore";
import { initialBoardConfig } from "./Stores/boardStore";
import { drawnInfectionCards } from "./store";


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

export function endActionPhase() {
    const currentPlayerActions = get(currentTurnActions);
    const currentPlayerIndex = get(activePlayerIndex);
  
    players.update(currentPlayers => {
      let updatedPlayers = [...currentPlayers];
      let currentPlayer = updatedPlayers[currentPlayerIndex];
      // Füge die aktuellen Aktionen zur Aktionshistorie hinzu
      currentPlayer.actionsHistory.push([...currentPlayerActions]);
  
      // Aktualisiere den Spieler im Array
      updatedPlayers[currentPlayerIndex] = currentPlayer;
  
      return updatedPlayers;
    });

    moveToNextPlayer();

    // Setze currentTurnActions für den nächsten Spieler zurück
    currentTurnActions.set([{ type: 'startAt', location: get(players)[currentPlayerIndex].currentLocation, freeAction: true }]);
}

export function restartGame(){
    resetCardsStore();

    players.set(getInitialPlayers());
    activePlayerIndex.set(0);

    currentTurnActions.set([{ type: 'startAt', location: get(players)[get(activePlayerIndex)].currentLocation, freeAction: true }]);

    // Setze das Spielbrett zurück
    let newDrawnInfectionCards: string[] = [];

    // Setze boardConfig auf die ursprüngliche Konfiguration zurück
    boardConfig.set(initialBoardConfig.map(place => ({ ...place })));

    boardConfig.update(config => {
        // Erstelle eine Liste von Orten für die Reduktionen
        let placesForReduction = config
                                    .filter(place => place.color !== 'white')
                                    .flatMap(place => Array(3).fill(place.name)); // Jeder Ort erscheint dreimal in der Liste

        // Führe neun Reduktionen durch
        for (let i = 0; i < 9; i++) {
            const randomIndex = Math.floor(Math.random() * placesForReduction.length);
            const selectedPlace = placesForReduction[randomIndex];
            newDrawnInfectionCards.push(selectedPlace);

            // Reduziere die Supplies des ausgewählten Ortes
            config = config.map(place => {
                if (place.name === selectedPlace) {
                return { ...place, supplies: Math.max(0, place.supplies - 1) };
                }
                return place;
            });

            // Entferne den ausgewählten Ort aus der Liste für zukünftige Reduktionen
            placesForReduction.splice(randomIndex, 1);
        }

        return config;
    });
    drawnInfectionCards.set(newDrawnInfectionCards);
}