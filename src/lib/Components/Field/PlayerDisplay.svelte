<script lang="ts">
    import type { Player } from "../../Models/types";
    import { gridSize } from "../Board/config";
    import { players, activePlayerIndex } from "../../playerStore";
    import { showBoat } from "../../Stores/boardStore";

    export let playersAtLocation: Player[];
    export let activePlayer: Player;

    function calculateXPosition(index: number, totalPlayers: number) {
        const baseX = gridSize / 2;
        if (totalPlayers === 1) {
            return baseX;
        }
        const offset = (index === $activePlayerIndex ? -1 : 1) * 20; // Verändert den Offset-Wert
        return baseX + offset;
    }

</script>

<svg width={gridSize} height={gridSize}>  
    <defs>
        <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
        </filter>
    </defs>

    <!-- Ringe in Spielerfarben -->
    {#each playersAtLocation as player, index}
        {#if !$showBoat || player !== activePlayer}
        <circle cx={calculateXPosition(index, playersAtLocation.length)} 
                cy={gridSize / 2} 
                r={player === activePlayer ? "10" : "8"}
                stroke-width={player === activePlayer ? "6" : "1"} 
                fill={player.color}
                style:filter={player === activePlayer  ? 'url(#strongGlow)' : ''} />
        {/if}
    {/each}
</svg>