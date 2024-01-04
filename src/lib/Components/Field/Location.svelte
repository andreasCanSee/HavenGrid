<script lang="ts">
    import { gridSize } from "../Board/config";
    import { handleFocus, handleKeyPress } from "./uiHandlers";
    import { moveToLocation } from "./fieldActions";
    import { derived } from "svelte/store";
    import { gameState } from "../../Stores/gameStateStore";

    export let name: string;

    const boardState = derived(gameState, $gameState => 
        $gameState.boardState.find(field => field.name === name)
    );
    
    let hasSupplyCenter: boolean;
    let imageUrl: string, imageSize: number, imageX: number, imageY: number;

    $: if ($boardState){
            hasSupplyCenter = $boardState.hasSupplyCenter;

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