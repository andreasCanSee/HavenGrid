<script lang="ts">
    import PlayerTableau from "./PlayerTableau.svelte";
    import { players,  activePlayerIndex } from '../lib/playerStore';
    import type { Player } from "./playerStore";

     // Funktion zum Rotieren der Spielerliste
     function rotatePlayers(players: Player[], activeIndex: number) {
        return [...players.slice(activeIndex), ...players.slice(0, activeIndex)];
    }

    $: rotatedPlayers = rotatePlayers($players, $activePlayerIndex);

</script>

{#each rotatedPlayers as player}
    <PlayerTableau {player} isActive={$players[$activePlayerIndex].name === player.name} />
{/each}