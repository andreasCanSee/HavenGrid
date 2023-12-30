<script lang="ts">
    import Board from '../lib/Board.svelte';
    import { createPlayer } from '../lib/player';
    import { players, initialPlayers, activePlayerIndex, initialBoardConfig, boardConfig, drawnInfectionCards } from '../lib/store';

    $: activePlayer = $players[$activePlayerIndex];
    $: actionsMade = activePlayer.actionsMade;

    function endActionPhase() {
        players.update(currentPlayers => {
            currentPlayers[$activePlayerIndex].actionsMade = 0;
            return currentPlayers;
        });
        activePlayerIndex.update(index => (index + 1) % $players.length);
    }
    
    function undoLastMove() {
        if (actionsMade > 0) {
            players.update(currentPlayers => {
                const updatedHistory = currentPlayers[$activePlayerIndex].actionsHistory.slice(0, -1);
                currentPlayers[$activePlayerIndex].actionsHistory = updatedHistory;
                currentPlayers[$activePlayerIndex].currentLocation = updatedHistory[updatedHistory.length - 1];
                currentPlayers[$activePlayerIndex].actionsMade -= 1;
                return currentPlayers;
            });
        }
    }

    function restartGame(){
        players.set(initialPlayers.map(player => {
            return { ...player };
        }));
        activePlayerIndex.set(0);
        
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

</script>
  
  <header>
    <h1>Pandemic Legacy Season 2 Prolog</h1>
  </header>
 
  <main>
    <Board />
    <div>
        <p>Verbleibende Aktionen: {4 - actionsMade}</p>
        <button on:click={undoLastMove}>Umkehren</button>
        <button on:click={endActionPhase}>Aktionsphase abschließen</button>
        <button on:click={restartGame}>Neustart</button>
    </div>
    <details>
        <summary>Infektionsablagestapel</summary>
        <ul>
            {#each $drawnInfectionCards as card}
              <li>{card}</li>
            {/each}
        </ul>
    </details>
  </main>

  