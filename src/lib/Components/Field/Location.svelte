<script lang="ts">
    import { gridSize } from "../Board/config";
    import { handleFocus, handleKeyPress } from "../../Utilities/uiHandlers";
    import { moveToLocation } from "../../GameLogic/Actions/playerMovements";
    import { derived } from "svelte/store";
    import { gameState } from "../../Stores/gameStateStore";

    export let name: string;

    const boardState = derived(gameState, $gameState => 
        $gameState.boardState.find(field => field.name === name)
    );
    
    let hasSupplyCenter: boolean;
    let plagueLevel: number;
    let imageUrl: string, imageSize: number, imageX: number, imageY: number;

    $: if ($boardState){
            hasSupplyCenter = $boardState.hasSupplyCenter;
            plagueLevel = $boardState.plagueLevel;

            if (hasSupplyCenter) {
                imageUrl = "/supplyCenter.png";
                imageSize = gridSize * 3 / 4;
            } else {
                imageUrl = "/harbor.png";
                imageSize = gridSize / 3;
            }
            imageX = (gridSize - imageSize) / 2;
            imageY = (gridSize - imageSize) / 2;
        }
    

</script>

<g>
    {#if plagueLevel > 0}
    <rect x={(gridSize - gridSize / 2) / 2} y={(gridSize - gridSize / 2) / 2} width={gridSize / 2} height={gridSize / 2} style="fill: rgba(0, 250, 0, 0.7); transform: rotate(45deg); transform-origin: center center;border-radius: 20px;"/>
    {/if}

    {#if plagueLevel > 1}
    <!-- Rahmen für Plague-Level 3 -->
    <rect x={(gridSize - gridSize /1.75) / 2} y={(gridSize - gridSize /1.75) / 2} width={gridSize /1.75} height={gridSize/1.75} style="fill: none; stroke: rgba(0, 250, 0, 0.7); stroke-width: 3px;transform: rotate(45deg); transform-origin: center center;border-radius: 20px;"/>
    {/if}

    {#if plagueLevel > 2}
        <!-- Rahmen für Plague-Level 2 -->
        <rect x={(gridSize - gridSize / 1.5) / 2} y={(gridSize - gridSize / 1.5) / 2} width={gridSize / 1.5} height={gridSize / 1.5} style="fill: none; stroke: rgba(0, 250, 0, 0.7); stroke-width: 3px; transform: rotate(45deg); transform-origin: center center;border-radius: 20px;"/>
    {/if}

   

    <image href="{imageUrl}"
        x={imageX}
        y={imageY}
        width={imageSize}
        height={imageSize}
        preserveAspectRatio="xMidYMid meet"
        role="button"
        tabindex="0"
        on:keydown={event => handleKeyPress(event, () => moveToLocation(name))}
        on:focus={handleFocus}
        on:click={() => moveToLocation(name)}
    />
</g>