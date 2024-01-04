<script lang="ts">
    import Board from '../lib/Components/Board/Board.svelte';
    import { players, activePlayerIndex } from '../lib/Stores/playerStore'
    import { undoLastMove } from '../lib/Utilities/undoFunctions';
    import PlayerTableau from '../lib/PlayerTableau.svelte';
    import type { Player } from '../lib/Models/types';
    import { endActionPhase } from '../lib/gameLogic';
    import { restartGame } from '../lib/gameLogic';

     // Funktion zum Rotieren der Spielerliste
     function rotatePlayers(players: Player[], activeIndex: number) {
        return [...players.slice(activeIndex), ...players.slice(0, activeIndex)];
    }

    let rotatedPlayers: Player[] = [];

    $: if ($players && $players.length > 0 && typeof $activePlayerIndex === 'number') {
        rotatedPlayers = rotatePlayers($players, $activePlayerIndex);
    } 

</script>
  
<header>
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-left: 10px">
            <h1><span style="color: firebrick">Pandemic Legacy Season 2</span> <span style="color: navy">Prolog</span></h1>
        <button on:click={restartGame} style="margin-right: 20px">Neustart 🔄</button>
    </div>
</header>
 
  
  <main>
    <div style="display: flex; width:100%">
        <div style="flex: 1; min-width: 0;">
            <Board/>
        </div>

        <div style="display: block; margin-right: 10px">
            {#each rotatedPlayers as player}
                <PlayerTableau {player} isActive={$players[$activePlayerIndex].name === player.name} />
                {#if player.name === $players[$activePlayerIndex].name}
                <div style="margin-bottom: 30px">
                    <button on:click={undoLastMove}>Aktion zurücknehmen ⏮️</button>
                    <button on:click={endActionPhase}>Aktionsphase abschließen ☑️</button>
                </div>
                {/if}
            {/each}
        </div>
    </div>
  </main>

  