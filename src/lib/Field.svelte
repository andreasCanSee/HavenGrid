<script lang="ts">
  import { players, activePlayerIndex, boardConfig } from '../lib/store';
  import { getCurrentLocationFromHistory } from '../lib/utils';
  export let size: number; // Standardgröße, kann überschrieben werden
  export let name: string;
  export let color: string;

  let capacity: number;
  let supplies: number;

  $: activePlayer = $players[$activePlayerIndex];
  $: actionsHistory = activePlayer.actionsHistory;

  $: {
    const place = $boardConfig.find(p => p.name === name);
    if (place) {
      capacity = place.capacity;
      supplies = place.supplies;
    }
  }

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

  function findPath(target: string) {
    let currentLocation = getCurrentLocationFromHistory(actionsHistory);

    interface QueueItem {
      name: string;
      path: string[];
    }

    let queue: QueueItem[] = [{ name: currentLocation, path: [] }];
    let visited = new Set();

    while (queue.length > 0) {
      let { name, path } = queue.shift() as QueueItem;

      if (name === target) {
        return path.concat(name).slice(1); // Pfad gefunden
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

  function moveToLocation(targetLocation: string) {
    let path = findPath(targetLocation);
    if (path.length > 0 && activePlayer.actionsMade + path.length <= 4){
      players.update(currentPlayers => {
        let updatedPlayer = {...activePlayer};
        // Füge jede Zwischenstation als Aktion hinzu
        path.forEach(location => {
          updatedPlayer.actionsHistory.push({ type: 'moveTo', location });
          updatedPlayer.actionsMade++;
        });
        currentPlayers[$activePlayerIndex] = updatedPlayer;
        return currentPlayers;
      });
 
    } else {
      console.log("Zug nicht möglich oder maximale Aktionen erreicht!");
    }
}

</script>

<svg width={size} height={size} xmlns="http://www.w3.org/2000/svg">
  <!-- Erstellung des 3x3-Rasters -->
  {#each Array(9) as _, index}
    <rect x={index % 3 * gridSize} y={Math.floor(index / 3) * gridSize} width={gridSize} height={gridSize} stroke="black" fill="transparent"  />
  {/each}

  <!-- Kreis im mittleren Quadrat -->
  <circle cx={size / 2} cy={size / 2} r="10" fill={color} on:click={() => moveToLocation(name)}/>

  <defs>
    <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  {#each $players as player, index}
    {#if getCurrentLocationFromHistory(player.actionsHistory) === name}
    <circle cx={size / 2} cy={size / 2} r={$activePlayerIndex === index ? "17" : "15"}
    stroke={player.color} stroke-width={$activePlayerIndex === index ? "6" : "3"} fill="none"
    style:filter={$activePlayerIndex === index ? 'url(#strongGlow)' : ''} />
    {/if}
  {/each}


  <!-- Hintergrund für den Namen des Feldes -->
  <rect x={textBackgroundX} y={textBackgroundY} width={textBackgroundWidth} height={textBackgroundHeight} fill="white" fill-opacity="0.7"/>

  <!-- Name des Feldes oberhalb des Kreises -->
  <text x={size / 2} y={size / 2.2 + 40} text-anchor="middle" fill="navy">{name}</text>

  <!-- Würfel entsprechend der Kapazität und tatsächlichen Supplies -->
  {#each Array(capacity) as _, index}
    <rect x={diceXStart + index * (diceSize + diceMargin)} y={diceY} width={diceSize} height={diceSize}
          fill={index < supplies ? "#412B15" : "transparent"}
          stroke={index >= supplies ? "black" : "none"} />
  {/each}

</svg>
