<script>
    import SupplyCube from "./SupplyCube.svelte";

    export let capacity;
    export let supplies;
    export let name;
    export let size;

      // Berechnungen für die Würfel
        const cubeSize = 15; // Größe eines Würfels
        const cubeMargin = 5; // Abstand zwischen den Würfeln
        const cubeY = size / 2 - 40; // Y-Position der Würfel
        const cubeXStart = size / 2 - (1.5 * cubeSize + cubeMargin); // X-Startposition für die Würfel

</script>

<!-- Würfel entsprechend der Kapazität und tatsächlichen Supplies -->
{#each Array(capacity) as _, index}
  {#if index < supplies}
    <SupplyCube 
      x={cubeXStart + index * (cubeSize + cubeMargin)} 
      y={cubeY} 
      size={cubeSize} 
      name={name} />
  {:else}
    <rect 
      x={cubeXStart + index * (cubeSize + cubeMargin)} 
      y={cubeY} 
      width={cubeSize} 
      height={cubeSize}
      fill="transparent"
      stroke="black"/>
  {/if}
{/each}