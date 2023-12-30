<script>
    import Board from '$lib/Board.svelte';
    import { moveHistory, initialBoardConfig, boardConfig, drawnInfectionCards } from '$lib/store';

    let showInfectionCards = false;
    
    function undoLastMove() {
        moveHistory.update(history => {
        if (history.length > 1) {
            // Setze die currentLocation auf den vorletzten Standort
            return history.slice(0, -1);
        }
        return history;
        });
    }

    function restartGame(){
        moveHistory.set(["Atlantis"])
        let newDrawnInfectionCards = [];

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
        console.log($boardConfig);

    }

</script>
  
  <header>
    <h1>Pandemic Legacy Season 2 Prolog</h1>
  </header>
 
  <main>
    <Board />
    <div>
        <p>Verbleibende Züge: {5 - $moveHistory.length}</p>
        <button on:click={undoLastMove}>Umkehren</button>
        <button on:click={restartGame}>Neustart</button>
    </div>
    <div>
        <button on:click={() => showInfectionCards = !showInfectionCards}>Infektionsablagestapel</button>
        {#if showInfectionCards}
          <ul>
            {#each $drawnInfectionCards as card}
              <li>{card}</li>
            {/each}
          </ul>
        {/if}
    </div>
    
  </main>

  