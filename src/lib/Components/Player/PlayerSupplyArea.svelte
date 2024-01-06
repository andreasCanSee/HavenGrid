<script lang="ts">
    import { handleFocus } from "../../Utilities/uiHandlers";
    import { increasePlayerSupplies } from "../../GameLogic/Actions/supplyManagement";
    import { handleKeyPress } from "../../Utilities/uiHandlers";

    export let playerIndex: number;
    export let isActive: Boolean;
    export let playerSupplies: number;
    export let isAtActivePlayerLocation: boolean;

    function handleDragStart(event: DragEvent, playerIndex: number) {
        const dragData = {
            type: 'supplies',
            fromPlayerIndex: playerIndex
        };
        if (event.dataTransfer) {
            event.dataTransfer.setData("application/json", JSON.stringify(dragData));
        }
    }
  
</script>

<div 
    style="margin-top: 10px; display: flex; flex-wrap: wrap; background-color:grey; padding: 5px; border-radius: 10px; width: 100%">
    {#each Array(playerSupplies) as _}
        <div 
            style="width: 20px; height: 20px; background-color: firebrick;border: 2px solid firebrick; margin-right: 5px; margin-bottom: 5px"
            draggable={(isActive || isAtActivePlayerLocation) ? "true" : "false"}
            on:dragstart={(event) => handleDragStart(event, playerIndex)}
            role="button"
            tabindex="0">
        </div>
    {/each}
    {#if isActive}
        <div 
            style="width: 20px; height: 20px; background-color: transparent; border: 2px solid black; margin-right: 5px;"
            draggable="true"
            role="button"
            tabindex="0"
            on:focus={handleFocus}
            on:click={()=>increasePlayerSupplies(playerIndex)}
            on:keydown={event => handleKeyPress(event, () => increasePlayerSupplies(playerIndex))}>
             🛠️
        </div>
    {/if}
</div>