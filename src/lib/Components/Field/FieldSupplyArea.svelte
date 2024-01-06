<script lang="ts">

import { derived } from "svelte/store";
import { gameState } from "../../Stores/gameStateStore";
import { handleFocus, handleKeyPress  } from "../../Utilities/uiHandlers";
import { gridSize } from "../Board/config";
import { pickUpSupplies, deliverSupplies } from "../../GameLogic/Actions/supplyManagement";

export let name: string;
export let capacity: number;

let hoveredIndex = -1;

const supplySize = gridSize / 6; // Größe eines Würfels
const supplyMargin = supplySize / 3; // Abstand zwischen den Würfeln

const activePlayerIndex = derived(gameState, $gameState => $gameState.activePlayerIndex);
const players = derived(gameState, $gameState => $gameState.players);

$: playerSupplies = $players[$activePlayerIndex].supplies;

// Abgeleiteter Store für supplies
const suppliesStore = derived(gameState, $gameState => 
        $gameState.boardState.find(field => field.name === name)?.supplies || 0
    );

    // Verwende den abgeleiteten Store für supplies
    let supplies: number;
    $: supplies = $suppliesStore;

</script>

<svg>
<g transform={`translate(${gridSize / 2 - (capacity * supplySize + (capacity - 1) * supplyMargin) / 2}, ${gridSize / 2 - 50 })`}>
    {#each Array(capacity) as _, index}
      {#if index < supplies}
        <rect 
          role="button"
          aria-label="Pick up supplies"
          x={index * (supplySize + supplyMargin)} 
          y={0} 
          width={supplySize} 
          height={supplySize}
          fill="firebrick"
          stroke="firebrick"
          tabindex="0"
          on:click={() => pickUpSupplies(name)}
          on:focus={handleFocus}
          on:keydown={event => handleKeyPress(event, () => pickUpSupplies(name))}
        />
      {:else}
        <rect 
          x={index * (supplySize + supplyMargin)} 
          y={0} 
          width={supplySize} 
          height={supplySize}
          fill="transparent"
          stroke="firebrick"
          role="button"
          tabindex="0"
          on:click={() => deliverSupplies(index, supplies, capacity, name)}
          on:focus={handleFocus}
          on:keydown={event => handleKeyPress(event, () => deliverSupplies(index, supplies, capacity, name))}
          class:hover-effect={index >= supplies && index < supplies + playerSupplies && index <= hoveredIndex}
          on:mouseenter={() => hoveredIndex = index}
          on:mouseleave={() => hoveredIndex = -1}
        />
      {/if}
    {/each}
  </g>
</svg>

  <style>
    .hover-effect {
      fill: rgb(177, 92, 92); /* Mattes Rot für Hover-Effekt */
    }
  </style>
  
