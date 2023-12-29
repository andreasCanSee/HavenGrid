<script lang="ts">

  export let size: number; // Standardgröße, kann überschrieben werden
  let gridSize = size / 3; // Größe eines einzelnen Quadrats im Raster
  export let name: string;
</script>

<svg width={size} height={size} xmlns="http://www.w3.org/2000/svg">
  <!-- Erstellung des 3x3-Rasters -->
  {#each Array(9) as _, index}
    <rect x={index % 3 * gridSize} y={Math.floor(index / 3) * gridSize} width={gridSize} height={gridSize} fill="transparent" stroke="black" stroke-width="2" />
  {/each}

  <!-- Kreis im mittleren Quadrat -->
  <circle cx={size / 2} cy={size / 2} r="10" fill="white" />

  <!-- Name des Feldes oberhalb des Kreises -->
  <text x={size / 2} y={size / 2 - 15} text-anchor="middle" fill="yellow">{name}</text>
</svg>