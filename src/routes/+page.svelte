<script lang="ts">
    import Board from '../lib/Components/Board/Board.svelte';
    import { drawnInfectionCards, finalizeTurn, currentTurnActions } from '../lib/store';
    import { initialBoardConfig, boardConfig } from '../lib/Stores/boardStore';
    import { players, getInitialPlayers, activePlayerIndex } from '../lib/Stores/playerStore'
    import type { Action } from '../lib/Models/types';
    import * as undoFunctions from '../lib/Utilities/undoFunctions';
    import { resetCardsStore } from '../lib/Stores/cardsStore';
    import PlayerTableau from '../lib/PlayerTableau.svelte';
    import type { Player } from '../lib/Models/types';

 
     // Funktion zum Rotieren der Spielerliste
     function rotatePlayers(players: Player[], activeIndex: number) {
        return [...players.slice(activeIndex), ...players.slice(0, activeIndex)];
    }

    let rotatedPlayers: Player[] = [];

    $: if ($players && $players.length > 0 && typeof $activePlayerIndex === 'number') {
        rotatedPlayers = rotatePlayers($players, $activePlayerIndex);
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
                case 'sailTo':
                    undoFunctions.undoSailToAction(lastActionRemoved);
                    break;
                case 'charterBoatTo':
                    undoFunctions.undoCharterBoatToAction(lastActionRemoved);
                    break;
            }
        }
       
    }

    function restartGame(){
        resetCardsStore();

        players.set(getInitialPlayers());
        activePlayerIndex.set(0);

        currentTurnActions.set([]);

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
    <div style="display: flex; align-items: center; justify-content: space-between;">
        <h1>Pandemic Legacy Season 2 Prolog</h1>
        <button on:click={restartGame}>Neustart 🔄</button>
    </div>
  </header>
 
  
  <main>
    <div style="display: flex; width:100%">
        <div style="flex: 1; min-width: 0;">
            <Board/>
        </div>

        <div style="display: block; margin-left: 20px;">
            {#each rotatedPlayers as player}
                <PlayerTableau {player} isActive={$players[$activePlayerIndex].name === player.name} />
            {/each}

            <div >
                <button on:click={undoLastMove}>Aktion zurücknehmen ⏮️</button>
                <button on:click={endActionPhase}>Aktionsphase abschließen ☑️</button>
            </div>
    
            <div style="margin-top:20px">
                <details>
                    <summary>Infektionsablagestapel</summary>
                    <ul>
                        {#each $drawnInfectionCards as card}
                        <li>{card}</li>
                        {/each}
                    </ul>
                </details>
            </div>
            
        </div>
    </div>
  </main>

  