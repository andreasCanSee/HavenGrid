<script lang="ts">
    import { gridSize } from "../Board/config";
    import { showBoat } from "../../Stores/uiStore";
    import { derived } from "svelte/store";
    import { gameState } from "../../Stores/gameStateStore";
    import { initialPlayerData } from "../../Models/initialPlayerData";

    export let name: string; // Füge dies hinzu, um den Standortnamen zu erhalten

    const activePlayerIndex = derived(gameState, $gameState => $gameState.activePlayerIndex);
    const players = derived(gameState, $gameState => $gameState.players)

    $: activePlayer = $players[$activePlayerIndex];
    $: playersAtLocation = $players.filter(player => player.currentLocation === name);

    function calculateXPosition(index: number, totalPlayers: number) {
        const baseX = gridSize / 2;
        if (totalPlayers === 1) {
            return baseX;
        }
        const offset = (index === $activePlayerIndex ? -1 : 1) * 20; // Verändert den Offset-Wert
        return baseX + offset;
    }

    function getPlayerColor(playerIndex: number) {
        const player = initialPlayerData[playerIndex]
        return player ? player.color : 'pink'; 
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

    {#each playersAtLocation as player, index}
        {#if !$showBoat || player !== activePlayer}
        <circle cx={calculateXPosition(index, playersAtLocation.length)} 
                cy={gridSize / 2} 
                r={player === activePlayer ? "10" : "8"}
                stroke-width={player === activePlayer ? "6" : "1"} 
                fill={getPlayerColor(player.playerIndex)}
                style:filter={player === activePlayer ? 'url(#strongGlow)' : ''} />
        {/if}
    {/each}
</svg>