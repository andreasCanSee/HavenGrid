<script lang="ts">
    import { gameState } from "../../Stores/gameStateStore";
    import { handleFocus } from "../Field/uiHandlers";
    import { increasePlayerSupplies } from "./playerActions";
    import { handleKeyPress } from "../Field/uiHandlers";

    export let isActive: Boolean;
    export let name: string;

    $: player = $gameState.players.find(p => p.name === name);
    $: playerSupplies = player ? player.supplies : 0;

    function handleDragStart(event:  DragEvent, playerName: string) {
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
    style="min-height: 30px; min-width: 100px;margin-top: 10px; display: flex; width: 100px; flex-wrap: wrap;"

    >
    {#each Array(playerSupplies) as _, index}
        <div 
            style="width: 20px; height: 20px; background-color: firebrick;border: 2px solid firebrick; margin-right: 5px; margin-bottom: 5px"
            draggable="true"
            on:dragstart={(event) => handleDragStart(event, name)}
            role="button"
            tabindex="0">
        </div>
    {/each}
    {#if isActive}
        <div 
            style="width: 20px; height: 20px; background-color: transparent; border: 2px solid firebrick; margin-right: 5px;"
            draggable="true"
            role="button"
            tabindex="0"
            on:focus={handleFocus}
            on:click={()=>increasePlayerSupplies(name)}
            on:keydown={event => handleKeyPress(event, () => increasePlayerSupplies(name))}>
        </div>
    {/if}
</div>