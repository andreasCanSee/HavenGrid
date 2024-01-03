<script lang="ts">
    import { boardConfig } from "../../Stores/boardStore";
    import { gridSize } from "../Board/config";
    import { handleFocus, handleKeyPress } from "./uiHandlers";
    import { moveToLocation } from "./fieldActions";

    export let name: string;
    
    let hasSupplyCenter: boolean;
    let imageUrl: string, imageSize: number, imageX: number, imageY: number;

    $: {
        const fieldData = $boardConfig.find(field => field.name === name);
        if (fieldData) {
            hasSupplyCenter = fieldData.hasSupplyCenter;

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