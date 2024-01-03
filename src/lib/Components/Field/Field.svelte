<script lang="ts">
  import Location from "./Location.svelte";
  import PlayerDisplay from "./PlayerDisplay.svelte";
  import FieldLabel from "./FieldLabel.svelte";
  import SupplyArea from './SupplyArea.svelte';
  import { gridSize } from "../Board/config";

  export let name: string;
  export let color: string;
  export let capacity: number;

</script>

<svg width={gridSize} height={gridSize} xmlns="http://www.w3.org/2000/svg">
  <!-- Erstellung des 3x3-Rasters 
  {#each Array(9) as _, index}
    <rect x={index % 3 * (gridSize / 3)} y={Math.floor(index / 3) * (gridSize / 3)} width={(gridSize / 3)} height={(gridSize / 3)} stroke="grey" fill="transparent"  />
  {/each}-->
  <Location {name}/>

  <PlayerDisplay {name}/>

  <FieldLabel {name} {color}/>

  <SupplyArea {name} {capacity}/>
</svg>


