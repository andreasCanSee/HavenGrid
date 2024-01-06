<script lang="ts">
    import { handleFocus } from "../Field/uiHandlers";
    import { increasePlayerSupplies } from "./playerActions";
    import { handleKeyPress } from "../Field/uiHandlers";

    export let name: string;
    export let isActive: Boolean;
    export let playerSupplies: number;
    export let isAtActivePlayerLocation: boolean;

    function handleDragStart(event: DragEvent, playerName: string) {
        const dragData = {
            type: 'supplies',
            fromPlayer: playerName
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
            on:dragstart={(event) => handleDragStart(event, name)}
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
            on:click={()=>increasePlayerSupplies(name)}
            on:keydown={event => handleKeyPress(event, () => increasePlayerSupplies(name))}>
             🛠️
        </div>
    {/if}
</div>