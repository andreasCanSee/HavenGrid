<script lang="ts">
    import { derived } from 'svelte/store';
    import Board from '../lib/Components/Board/Board.svelte';
    import PlayerDashboard from '../lib/Components/Player/PlayerDashboard.svelte';
    import { gameState } from '../lib/Stores/gameStateStore';
    import { setupNewGame } from '../lib/GameLogic/setupGame';
    import { initialPlayerData } from '../lib/Models/initialPlayerData';
    import { endTurn} from '../lib/GameLogic/turnCycleLogic';
    import { undoLastMove } from '../lib/Utilities/undoFunctions';
    import { isDiscardMode } from '../lib/Stores/uiStore';
    import type { InfectionCard } from '../lib/Models/types';
    import { currentTurnActions } from '../lib/Stores/turnStateStore';

    function createPlayerOrder(activePlayerIndex: number, totalPlayers: number) {
        return Array.from({ length: totalPlayers }, (_, i) => (activePlayerIndex + i) % totalPlayers);
    }

    const playerOrder = derived(
        gameState,
        $gameState => createPlayerOrder($gameState.activePlayerIndex, initialPlayerData.length)
    );

    let reversedDiscardPile: InfectionCard[] = [];

    $: {
        const discardPile: InfectionCard[] = $gameState.infectionDeck.discardPile;
        reversedDiscardPile = [...discardPile].reverse();
    }

    $: remainingActions = 4 - $currentTurnActions.filter(action => !action.freeAction).length;
</script>
  
<header>


    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;background-color: rgba(0,0,128, 0.7);">
            <h1><span style="color: firebrick; margin-left: 10px;padding: 10px;">Pandemic Legacy Season 2:</span><span style="color: deepskyblue">Prolog</span></h1>

            <button 
            on:click={setupNewGame} 
            style="
                background-color: deepskyblue; 
                color: firebrick;
                padding: 10px;
                font-size: 16px;
                cursor: pointer;
                text-align: center;
                border-radius: 5px;
                margin-right: 20px;
                border: none;
                font-size: 1em;">
            Neustart 🔄
        </button>
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
            playerColor={initialPlayerData[index].color}
            image={initialPlayerData[index].image}
            isActive={index === $gameState.activePlayerIndex}
            playerIndex={index}
        />
            {#if index === $gameState.activePlayerIndex}
        
                <div style="margin-bottom: 30px; display: flex;">
                    <div style="
                        background-color: {initialPlayerData[index].color}; 
                        color: white;
                        padding: 10px; 
                        margin-right: 20px;  
                        font-weight: bold;
                        display: flex;
                        align-items: center">
                    Noch {remainingActions} {remainingActions === 1 ? 'Zug' : 'Züge'}
                    </div>
                    <button on:click={undoLastMove} style="padding: 10px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 14px;
                    background-color: navy;
                    color: firebrick;
                    text-align: center;
                    border-radius: 5px;
                    margin-right: 20px;
                    border: none;">Aktion zurück-<br>nehmen ⏮️</button>
                    <button on:click={endTurn} disabled={$isDiscardMode.active} style="padding: 10px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 700;
                    background-color: navy;
                    color: firebrick;
                    text-align: center;
                    border-radius: 5px;
                    margin-right: 20px;
                    border: none;"> Aktionsphase <br>abschließen ☑️</button>
                </div>
            {/if}
        {/each}   
        </div>
    </div>


  <div style="margin-top: 50px">
    <table style="width: 50%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid white; padding: 10px; color: black;">Infektionskartenablagestapel</th>
            </tr>
        </thead>
        <tbody>
            {#each reversedDiscardPile as card}
                <tr>
                    <td style="border: 1px solid white; padding: 10px; text-align: center; background-color: {card.data.color}; color: {card.data.color === 'yellow' ? 'black' : 'white'};">
                        {card.data.name}
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
    </main>