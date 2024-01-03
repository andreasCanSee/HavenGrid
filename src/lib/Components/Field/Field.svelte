<script lang="ts">
  import { showBoat } from "../../Stores/boardStore";
  import { players, activePlayerIndex } from '../../playerStore'
  import { gridSize } from "../Board/config";
  import { moveToLocation } from './fieldActions';
  import { boardConfig } from "../../Stores/boardStore";
  import PlayerDisplay from "./PlayerDisplay.svelte";
  import SupplyCube from "../../SupplyCube.svelte";
  import { deliverSupplies } from "./fieldActions";
  import FieldLabel from "./FieldLabel.svelte";

  export let name: string;
  export let color: string;
  export let capacity: number;

  let supplies: number;
  let hasSupplyCenter: boolean;

  // Reaktive Zuweisung für die dynamischen Eigenschaften
  $: {
        const fieldData = $boardConfig.find(field => field.name === name);
        if (fieldData) {
            supplies = fieldData.supplies;
            hasSupplyCenter = fieldData.hasSupplyCenter;
        }
    };

  $: activePlayer = $players[$activePlayerIndex];
  $: playersAtLocation = $players.filter(player => player.currentLocation === name);

  const cubeSize = 15; // Größe eines Würfels
  const cubeMargin = cubeSize / 3; // Abstand zwischen den Würfeln

  let imageUrl: string, imageSize: number, imageX: number, imageY: number;

  $: {
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

  function handleMoveAction() {
    if (!$showBoat) {
      moveToLocation(activePlayer.currentLocation, name);
    }
  }

  function handleMoveKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleMoveAction()
    }
  }

  function handleSupplyKeyPress(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleSupplyAction(index);
    }
  }

  function handleSupplyAction(index: number) {
      deliverSupplies(index, $activePlayerIndex, supplies, capacity, name);
  }

  function handleFocus(event: FocusEvent) {
    const element = event.target as HTMLElement; // Casten zu HTMLElement
    element.blur(); // Entfernt den Fokus vom Element
  }

</script>

<svg width={gridSize} height={gridSize} xmlns="http://www.w3.org/2000/svg">
  <!-- Erstellung des 3x3-Rasters 
  {#each Array(9) as _, index}
    <rect x={index % 3 * (gridSize / 3)} y={Math.floor(index / 3) * (gridSize / 3)} width={(gridSize / 3)} height={(gridSize / 3)} stroke="grey" fill="transparent"  />
  {/each}-->
 
  <FieldLabel {name} {color}/>

  <image href="{imageUrl}"
    x={imageX}
    y={imageY}
    width={imageSize}
    height={imageSize}
    preserveAspectRatio="xMidYMid meet"
    role="button"
    tabindex="0"
    on:keydown={handleMoveKeyPress}
    on:focus={handleFocus}
    on:click={handleMoveAction}/>
           
  <PlayerDisplay {playersAtLocation} {activePlayer}/>

  <g transform={`translate(${gridSize / 2 - (capacity * cubeSize + (capacity - 1) * cubeMargin) / 2}, ${hasSupplyCenter ? gridSize / 2 - 60 : gridSize / 2 - 35})`}>
    {#each Array(capacity) as _, index}
      {#if index < supplies}
        <SupplyCube 
          x={index * (cubeSize + cubeMargin)} 
          y={0} 
          size={cubeSize} 
          name={name} />
      {:else}
        <rect 
          x={index * (cubeSize + cubeMargin)} 
          y={0} 
          width={cubeSize} 
          height={cubeSize}
          fill="transparent"
          stroke="black"
          role="button"
          tabindex="0"
          on:keydown={event => handleSupplyKeyPress(event, index)}
          on:focus={handleFocus}
          on:click={() => handleSupplyAction(index)}/>
      {/if}
    {/each}
  </g>

</svg>