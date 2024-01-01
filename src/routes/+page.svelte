<script lang="ts">
    import { onMount } from 'svelte';
    import Board from '../lib/Board.svelte';
    import { players, getInitialPlayers, activePlayerIndex, initialBoardConfig, boardConfig, drawnInfectionCards, finalizeTurn, currentTurnActions } from '../lib/store';
    import type { Action } from '../lib/player'; 
    import PlayerInteractionArea from '../lib/PlayerInteractionArea.svelte';

    onMount(() => {
        restartGame();
    })


    $: currentActions = $currentTurnActions.filter(action => !action.freeAction).length;

    function endActionPhase() {
        finalizeTurn($activePlayerIndex);
        activePlayerIndex.update(index => (index + 1) % $players.length);
    }

    function undoMoveToAction(action: Action) {
        players.update(currentPlayers => {
            const currentPlayer = currentPlayers[$activePlayerIndex];
            
            let newLocation = '';
            for (let i = $currentTurnActions.length - 1; i >= 0; i--) {
                if ($currentTurnActions[i].type === 'moveTo') {
                    newLocation = $currentTurnActions[i].location || '';
                    break;
                }
            }

            // Wenn keine moveTo-Aktion in currentTurnActions gefunden wurde, durchsuche die actionsHistory
            if (!newLocation) {
                for (let i = currentPlayer.actionsHistory.length - 1; i >= 0; i--) {
                    for (let j = currentPlayer.actionsHistory[i].length - 1; j >= 0; j--) {
                        if (currentPlayer.actionsHistory[i][j].type === 'moveTo') {
                            newLocation = currentPlayer.actionsHistory[i][j].location || '';
                            break;
                        }
                    }
                    if (newLocation) break;
                }
            }
            newLocation = newLocation || currentPlayer.actionsHistory[0][0]?.location || '';
            currentPlayer.currentLocation = newLocation;

            return currentPlayers;
        });         
    }

    function undoPickUpSuppliesAction(action: Action) {

        players.update(currentPlayers => {
            if (currentPlayers[$activePlayerIndex].supplies > 0) {
                currentPlayers[$activePlayerIndex].supplies--;
            }
            return currentPlayers;
        });

        boardConfig.update(fields => {
            let fieldToUpdate = fields.find(f => f.name === action.location);
            if (fieldToUpdate) {
                fieldToUpdate.supplies += 1;
            }
            return fields;
        });
    }

    function undoMakeSupplyAction(){
        players.update(currentPlayers => {
            if (currentPlayers[$activePlayerIndex].supplies > 0) {
                currentPlayers[$activePlayerIndex].supplies--;
            }
            return currentPlayers;
        });

    }

    function undoDeliverSuppliesAction(action: Action) {

            players.update(currentPlayers => {
                let currentPlayer = currentPlayers[$activePlayerIndex];
                currentPlayer.supplies += action.supplies ?? 0; // Vorräte des Spielers erhöhen
                return currentPlayers;
            });

    boardConfig.update(fields => {
        let fieldToUpdate = fields.find(f => f.name === action.location);
        if (fieldToUpdate && typeof action.supplies === 'number') {
            fieldToUpdate.supplies -= action.supplies; // Vorräte des Feldes reduzieren
            fieldToUpdate.supplies = Math.max(0, fieldToUpdate.supplies); // Verhindere negative Vorräte
        }
        return fields;
    });
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
                    undoMoveToAction(lastActionRemoved);
                    break;
                case 'pickUpSupplies':
                    undoPickUpSuppliesAction(lastActionRemoved);
                    break;
                case 'makeSupply':
                    undoMakeSupplyAction();
                    break;
                case 'deliverSupplies':
                    undoDeliverSuppliesAction(lastActionRemoved);
                    break;
            }
        }
       
    }

    function restartGame(){
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

</script>
  
  <header>
    <h1>Pandemic Legacy Season 2 Prolog</h1>
  </header>
 
  
  <main>
    
    <Board />
    <div>
        <p>Verbleibende Aktionen: {4 - currentActions}</p>
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
 
    <PlayerInteractionArea />
  </main>

  