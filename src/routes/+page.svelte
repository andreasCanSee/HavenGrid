<script lang="ts">
    import { derived } from 'svelte/store';
    import Board from '../lib/Components/Board/Board.svelte';
    import PlayerDashboard from '../lib/Components/Player/PlayerDashboard.svelte';
    import type { InfectionCard, PlayerCard } from '../lib/Models/types';
    import { gameState } from '../lib/Stores/gameStateStore';
    import { initialPlayerData } from '../lib/Models/initialPlayerData';
    import { endTurn} from '../lib/GameLogic/turnCycleLogic';
    import { undoLastMove } from '../lib/Utilities/undoFunctions';
    import { isDiscardMode, showBoat } from '../lib/Stores/uiStore';
    import { currentTurnActions } from '../lib/Stores/turnStateStore';
    import { getColorOfCity } from '../lib/Models/initialBoardData';
    import Header from '../lib/Components/Header.svelte';

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

    let reversedPlayerDiscardPile: PlayerCard[] = [];

    $: {
        const playerDiscardPile: PlayerCard[] = $gameState.playerDeck.discardPile;
        reversedPlayerDiscardPile = [...playerDiscardPile].reverse();
    }

    $: remainingActions = 4 - $currentTurnActions.filter(action => !action.freeAction).length;

</script>
  

<Header/>

<main class="flex">
    <div class="w-full lg:w-2/3">
        <Board/>
        <div class="w-full lg:w-1/3 flex flex-col">
            {#each $playerOrder as index}
                <PlayerDashboard 
                    name={initialPlayerData[index].name}
                    playerColor={initialPlayerData[index].color}
                    image={initialPlayerData[index].image}
                    isActive={index === $gameState.activePlayerIndex}
                    playerIndex={index}
                />
                {#if index === $gameState.activePlayerIndex}
                    <div>
                        <div style="
                            background-color: {initialPlayerData[index].color}; 
                            color: white; 
                            font-weight: bold;
                            align-items: center">
                            <h3>Noch {remainingActions} {remainingActions === 1 ? 'Aktion' : 'Aktionen'}</h3>
                            <button on:click={() => {!$showBoat  && undoLastMove($currentTurnActions)}} style="padding: 10px;
                                font-weight: 700;
                                font-size: 14px;
                                background-color: navy;
                                cursor: {$showBoat  ? 'not-allowed' : 'pointer'};
                                color: firebrick;
                                text-align: center;
                                border-radius: 5px;
                                margin-left: 20px;
                                border: none;">Aktion zurück-<br>nehmen ⏮️</button>
                        </div>
                  
                        <button on:click={endTurn} disabled={$isDiscardMode.active || $showBoat} style="padding: 10px;
                            font-size: 14px;
                            font-weight: 700;
                            background-color: navy;
                            cursor: {$showBoat || $isDiscardMode.active  ? 'not-allowed' : 'pointer'};
                            color: firebrick;
                            text-align: center;
                            border-radius: 5px;
                            margin-right: 20px;
                            border: none;"> Aktionsphase <br>abschließen ☑️
                        </button>
                    </div>
                {/if}
            {/each}   
        </div>
    </div>
</main>



<div style="margin-top: 50px; display:flex">
    <!-- ... (Infektionskartenablagestapel Tabelle) -->
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

        <!-- Tabelle für playerDeck.discardPile -->
        <table style="width: 50%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid white; padding: 10px; color: black;">Spielerkartenablagestapel</th>
                </tr>
            </thead>
            <tbody>
                {#each reversedPlayerDiscardPile as card}
                    <tr>
                        <td style="border: 1px solid white; padding: 10px; text-align: center;background-color: {getColorOfCity(card.name)}; color: {getColorOfCity(card.name) === 'yellow' ? 'black' : 'white'};">
                            {card.name}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
 