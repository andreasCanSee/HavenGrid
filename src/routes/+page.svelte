<script lang="ts">
    import Board from '../lib/Components/Board/Board.svelte';
    import { players, activePlayerIndex } from '../lib/Stores/playerStore'
    import { undoLastMove } from '../lib/Utilities/undoFunctions';
    import PlayerTableau from '../lib/Components/Player/PlayerTableau.svelte';
    import type { Player } from '../lib/Models/types';
    import { endActionPhase } from '../lib/GameLogic/gameLogicController';
    import { startGame } from '../lib/GameLogic/gameLogicController';
    import { onMount } from 'svelte';

    /*let infectionDeck;
    let originalDeck = [];
    let deckAfterDraw = [];
    let discardPile = [];

    onMount(() => {
        infectionDeck = InfectionDeck.initialize();
        originalDeck = [...infectionDeck.state.deck];
        infectionDeck.drawAndDiscard(9);
        deckAfterDraw = [...infectionDeck.state.deck];
        discardPile = [...infectionDeck.state.discardPile];
    });*/

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
        <button on:click={startGame} style="margin-right: 20px">Neustart 🔄</button>
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

 
<!--
{#if infectionDeck}
<div class="deck-container">
    <div class="deck">
        <h3>Ursprüngliches Deck</h3>
        <ul>
            {#each originalDeck as card}
                <li>{card.data.name} - {card.data.color}</li>
            {/each}
        </ul>
    </div>
    
    <div class="deck">
        <h3>Deck nach Ziehen</h3>
        <ul>
            {#each deckAfterDraw as card}
                <li>{card.data.name} - {card.data.color}</li>
            {/each}
        </ul>
    </div>
    
    <div class="deck">
        <h3>Ablagestapel</h3>
        <ul>
            {#each discardPile as card}
                <li>{card.data.name} - {card.data.color}</li>
            {/each}
        </ul>
    </div>
</div>
{/if}




<style>
    .deck-container {
        display: flex;
        margin-top: 20px;
    }
    .deck {
        margin: 0 10px;
        padding: 10px;
    }
    ul {
        padding: 0;
        list-style-type: none;
    }
</style>
  -->