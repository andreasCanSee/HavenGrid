<script lang="ts">
    import PlayerTableau from "./PlayerTableau.svelte";
    import { players,  activePlayerIndex } from '../lib/playerStore';
    import type { Player } from "./Models/types";


     // Funktion zum Rotieren der Spielerliste
     function rotatePlayers(players: Player[], activeIndex: number) {
        return [...players.slice(activeIndex), ...players.slice(0, activeIndex)];
    }

    let rotatedPlayers: Player[] = [];

    $: if ($players && $players.length > 0 && typeof $activePlayerIndex === 'number') {
        rotatedPlayers = rotatePlayers($players, $activePlayerIndex);
    } 

</script>

<main>
    {#each rotatedPlayers as player}
        <PlayerTableau {player} isActive={$players[$activePlayerIndex].name === player.name} />
    {/each}

</main>

