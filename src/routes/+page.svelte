<script lang="ts">
    import Board from '../lib/Components/Board/Board.svelte';
    import { undoLastMove } from '../lib/Utilities/undoFunctions';
    import PlayerTableau from '../lib/Components/Player/PlayerTableau.svelte';
    import type { Player } from '../lib/Models/types';
    import { endActionPhase } from '../lib/GameLogic/gameLogicController';
    import { startGame } from '../lib/GameLogic/gameLogicController';
    import { initialPlayerData } from '../lib/Models/initialPlayerData';
    import { onMount } from 'svelte';
    import { gameState } from '../lib/Stores/gameStateStore';

     // Funktion zum Rotieren der Spielerliste
     function rotatePlayers(players: Player[], activeIndex: number) {
        return [...players.slice(activeIndex), ...players.slice(0, activeIndex)];
    }

    let rotatedPlayersWithStaticData = [];

$: if ($gameState.players && $gameState.players.length > 0) {
    rotatedPlayersWithStaticData = rotatePlayers($gameState.players, $gameState.activePlayerIndex)
        .map(player => {
            const staticData = initialPlayerData.find(p => p.name === player.name);
            return { ...player, color: staticData?.color, image: staticData?.image };
        });
}
</script>
  
<header>
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-left: 10px">
            <h1><span style="color: firebrick">Pandemic Legacy Season 2</span> <span style="color: navy">Prolog</span></h1>
        <button on:click={startGame} style="margin-right: 20px">Neustart 🔄</button>
    </div>
</header>
 
  
  <main>
    <div style="display: flex; width:100%">
        <div style="flex: 1; min-width: 0;">
            <Board/>
        </div>

        <div style="display: block; margin-right: 10px">
            {#each rotatedPlayersWithStaticData as player}
            <PlayerTableau {player} isActive={$gameState.players[$gameState.activePlayerIndex].name === player.name} color={player.color} image={player.image} />
                {#if player.name === $gameState.players[$gameState.activePlayerIndex].name}
                <div style="margin-bottom: 30px">
                    <button on:click={undoLastMove}>Aktion zurücknehmen ⏮️</button>
                    <button on:click={endActionPhase}>Aktionsphase abschließen ☑️</button>
                </div>
                {/if}
            {/each}
        </div>
    </div>
  </main>
