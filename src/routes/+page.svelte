<script lang="ts">
    import { derived } from 'svelte/store';
    import Board from '../lib/Components/Board/Board.svelte';
    import PlayerDashboard from '../lib/Components/Player/PlayerDashboard.svelte';
    import { gameState } from '../lib/Stores/gameStateStore';
    import { resetGameState } from '../lib/Stores/gameStateStore';
    import { initialPlayerData } from '../lib/Models/initialPlayerData';
    import { endActionPhase } from '../lib/GameLogic/gameLogic';
    import { undoLastMove } from '../lib/Utilities/undoFunctions';


    function createPlayerOrder(activePlayerIndex: number, totalPlayers: number) {
        return Array.from({ length: totalPlayers }, (_, i) => (activePlayerIndex + i) % totalPlayers);
    }

    const playerOrder = derived(
        gameState,
        $gameState => createPlayerOrder($gameState.activePlayerIndex, initialPlayerData.length)
    );
</script>
  
<header>
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-left: 10px">
            <h1><span style="color: firebrick">Pandemic Legacy Season 2</span> <span style="color: navy">Prolog</span></h1>
        <button on:click={resetGameState} style="margin-right: 20px">Neustart 🔄</button>
    </div>
</header>
 
  
  <main>
    <div style="display: flex; width:100%">
        <div style="flex: 1; min-width: 0;">
            <Board/>
        </div>
        <div style="display: block; margin-right: 10px">
    {#each $playerOrder as index}
  
        <PlayerDashboard 
            name={initialPlayerData[index].name}
            color={initialPlayerData[index].color}
            image={initialPlayerData[index].image}
            isActive={index === $gameState.activePlayerIndex}
        />
            {#if index === $gameState.activePlayerIndex}
                <div style="margin-bottom: 30px">
                    <button on:click={undoLastMove}>Aktion zurücknehmen ⏮️</button>
                    <button on:click={endActionPhase}>Aktionsphase abschließen ☑️</button>
                </div>
            {/if}
        {/each}   
        </div>
    </div>
  </main>