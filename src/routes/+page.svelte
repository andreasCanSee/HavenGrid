<script lang="ts">
    import { onMount } from 'svelte';
    import Board from '../lib/Board.svelte';
    import { drawnInfectionCards, finalizeTurn, currentTurnActions } from '../lib/store';
    import { initialBoardConfig, boardConfig } from '../lib/boardStore';
    import { players, getInitialPlayers, activePlayerIndex } from '../lib/playerStore'
    import type { Action } from '../lib/player'; 
    import * as undoFunctions from '../lib/undoFunctions';
    import PlayerInteractionArea from '../lib/PlayerInteractionArea.svelte';
    import { resetCardsStore, cardsStore } from '../lib/cardsStore';

    onMount(() => {
        restartGame();
    })

    $: currentActions = $currentTurnActions.filter(action => !action.freeAction).length;

    $: {
    console.log('Aktuelle Zugaktionen:', $currentTurnActions);
  }

    function undoLastMove() {
        let lastActionRemoved: Action | undefined;
        currentTurnActions.update(actions => {
            if (actions.length > 0) {
                lastActionRemoved = actions.pop();
            }
            return actions;
        });
        
        if (lastActionRemoved) {
            switch (lastActionRemoved.type) {
                case 'moveTo':
                    undoFunctions.undoMoveToAction();
                    break;
                case 'pickUpSupplies':
                    undoFunctions.undoPickUpSuppliesAction(lastActionRemoved);
                    break;
                case 'makeSupply':
                    undoFunctions.undoMakeSupplyAction();
                    break;
                case 'deliverSupplies':
                    undoFunctions.undoDeliverSuppliesAction(lastActionRemoved);
                    break;
                case 'transferSupplies':
                    undoFunctions.undoTransferSuppliesAction(lastActionRemoved);
                    break;
            }
        }
       
    }

    function restartGame(){
        players.set(getInitialPlayers());
        activePlayerIndex.set(0);

        currentTurnActions.set([]);

        resetCardsStore();
        // console.log($cardsStore)
        
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

    export function endActionPhase() {
        finalizeTurn($activePlayerIndex);
        activePlayerIndex.update(index => (index + 1) % $players.length);
}

</script>
  
  <header>
    <h1>Pandemic Legacy Season 2 Prolog</h1>
  </header>
 
  
  <main>
    
    <Board />
    <div>
        <p>Verbleibende Aktionen: {4 - currentActions}</p>
        <button on:click={undoLastMove}>Aktion zurücknehmen ⏮️</button>
        <button on:click={endActionPhase}>Aktionsphase abschließen ☑️</button>
        <button on:click={restartGame}>Neustart 🔄</button>
    </div>
    <details>
        <summary>Infektionsablagestapel</summary>
        <ul>
            {#each $drawnInfectionCards as card}
              <li>{card}</li>
            {/each}
        </ul>
    </details>
 
    <PlayerInteractionArea />
  </main>

  