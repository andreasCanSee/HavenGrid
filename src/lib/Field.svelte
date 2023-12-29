<script lang="ts">
  import { boardConfig, currentLocation, moveHistory } from './store';
  export let size: number; // Standardgröße, kann überschrieben werden
  export let name: string;
  export let color: string;

  let gridSize = size / 3; // Größe eines einzelnen Quadrats im Raster

  // Berechnungen für den Hintergrund des Textes
  const textBackgroundWidth = size * 0.8;
  const textBackgroundHeight = 15;
  const textBackgroundX = (size - textBackgroundWidth) / 2;
  const textBackgroundY = size / 2.2 + 35 - textBackgroundHeight / 2;

  // Berechnungen für die Würfel
  const diceSize = 15; // Größe eines Würfels
  const diceMargin = 5; // Abstand zwischen den Würfeln
  const diceY = size / 2 - 40; // Y-Position der Würfel
  const diceXStart = size / 2 - (1.5 * diceSize + diceMargin); // X-Startposition für die Würfel


  function findPath(target) {
    let queue = [{ name: $currentLocation, path: [] }];
    let visited = new Set();

    while (queue.length > 0) {
      let { name, path } = queue.shift();

      if (name === target) {
        return path.concat(name); // Pfad gefunden
      }

      if (!visited.has(name)) {
        visited.add(name);
        const neighbors = $boardConfig.find(f => f.name === name)?.connections || [];
        neighbors.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            queue.push({ name: neighbor, path: path.concat(name) });
          }
        });
      }
    }

    return []; // Kein Pfad gefunden
  }

  function handleClick() {
    let path = findPath(name);
    if (path && path.length > 1 && (5 - $moveHistory.length - path.length + 1) >= 0) {
      moveHistory.update(history => {
        const updatedHistory = history.slice(0, -1);
        return [...updatedHistory, ...path];
      });
      console.log($moveHistory)
    } else {
      console.log("Ungültiger Zug!");
    }
  }

  $: {
    if ($moveHistory.length > 0) {
      currentLocation.set($moveHistory[$moveHistory.length - 1]);
    }
  }


</script>

<svg width={size} height={size} xmlns="http://www.w3.org/2000/svg">
  <!-- Erstellung des 3x3-Rasters -->
  {#each Array(9) as _, index}
    <rect x={index % 3 * gridSize} y={Math.floor(index / 3) * gridSize} width={gridSize} height={gridSize} fill="transparent"  />
  {/each}

  <!-- Kreis im mittleren Quadrat -->
  <circle cx={size / 2} cy={size / 2} r="10" fill={color} on:click={handleClick}/>

  <!-- Ring um den Kreis, wenn es der aktuelle Standort ist -->
  {#if $currentLocation === name}
    <circle cx={size / 2} cy={size / 2} r="15" stroke="red" stroke-width="3" fill="none"/>
  {/if}
  
  <!-- Hintergrund für den Namen des Feldes -->
  <rect x={textBackgroundX} y={textBackgroundY} width={textBackgroundWidth} height={textBackgroundHeight} fill="white" fill-opacity="0.7"/>

  <!-- Name des Feldes oberhalb des Kreises -->
  <text x={size / 2} y={size / 2.2 + 40} text-anchor="middle" fill="navy">{name}</text>

  <!-- Drei braune Würfel unter dem Kreis -->
  {#each Array(3) as _, index}
  <rect x={diceXStart + index * (diceSize + diceMargin)} y={diceY} width={diceSize} height={diceSize} fill="#412B15" />
{/each}
</svg>
