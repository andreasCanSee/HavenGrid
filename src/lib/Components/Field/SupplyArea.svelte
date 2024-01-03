<script lang="ts">

import { handleFocus } from "./uiHandlers";
import { gridSize } from "../Board/config";
import { boardConfig } from "../../Stores/boardStore";
import { pickUpSupplies } from "./fieldActions";
import { deliverSupplies } from "./fieldActions";
import { handleKeyPress } from "./uiHandlers";

export let name: string;
export let capacity: number;

const supplySize = gridSize / 6; // Größe eines Würfels
const supplyMargin = supplySize / 3; // Abstand zwischen den Würfeln

let supplies: number;

// Reaktive Zuweisung für die dynamischen Eigenschaften
$: supplies = $boardConfig.find(field => field.name === name)?.supplies || 0;

</script>

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
          stroke="grey"
          role="button"
          tabindex="0"
          on:click={() => deliverSupplies(index, supplies, capacity, name)}
          on:focus={handleFocus}
          on:keydown={event => handleKeyPress(event, () => deliverSupplies(index, supplies, capacity, name))}
        />
      {/if}
    {/each}
  </g>
