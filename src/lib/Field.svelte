<script lang="ts">
  import { currentTurnActions, addActionToCurrentTurn } from '../lib/store';
  import { showBoat, boardConfig } from "./boardStore";
  import { players, activePlayerIndex } from '../lib/playerStore'
  import type { Action } from '../lib/player';
  import { findPath, animateFerry } from '../lib/utils';
  import SupplyArea from './SupplyArea.svelte';
  import { charterBoatMode } from '../lib/store';
  import { addToDiscardPile, cardsStore } from './cardsStore';

  export let size: number; // Standardgröße, kann überschrieben werden
  export let name: string;
  export let color: string;

  let capacity: number;
  let supplies: number;
  let hasSupplyCenter: boolean;

  $: activePlayer = $players[$activePlayerIndex];
  $: currentActions = $currentTurnActions.filter(action => !action.freeAction).length;

  $: {
    const place = $boardConfig.find(p => p.name === name);
    if (place) {
      capacity = place.capacity;
      supplies = place.supplies;
      hasSupplyCenter = place.hasSupplyCenter;
    }
  }

  // Berechnungen für den Hintergrund des Textes
  const textBackgroundWidth = size * 0.8;
  const textBackgroundHeight = 15;
  const textBackgroundX = (size - textBackgroundWidth) / 2;
  const textBackgroundY = size / 2.2 + 35 - textBackgroundHeight / 2;

  const cubeSize = 15; // Größe eines Würfels
  const cubeMargin = cubeSize / 3; // Abstand zwischen den Würfeln

  const imageWidth = 80; // Breite des Bildes, anpassen nach Bedarf
  const imageHeight = 30; // Höhe des Bildes, anpassen nach Bedarf
  const offset = 25; // Abstand über dem Kreis, anpassen nach Bedarf

  function calculateXPosition(index: number, totalPlayersAtLocation: number, size: number, activePlayerIndex: number) {
        const baseX = size / 2;
        if (totalPlayersAtLocation === 1) {
            return baseX;
        }
        const offset = (index === activePlayerIndex ? -1 : 1) * 20; // Verändert den Offset-Wert
        return baseX + offset;
    }

    $: totalPlayersAtLocation = $players.filter(p => p.currentLocation === name).length;

  async function moveToLocation(targetLocation: string) {

    let currentLocation = activePlayer.currentLocation;

    if($charterBoatMode && targetLocation !== currentLocation){
      await animateFerry(currentLocation, targetLocation, size, 'charterBoatTo');

      players.update(allPlayers => {
        const updatedPlayers = [...allPlayers];
        const player = updatedPlayers[$activePlayerIndex];
        const cardIndex = player.handCards.findIndex(card => card.data.name === currentLocation);

        if (cardIndex !== -1) {
            // Entferne die gefundene Karte aus den Handkarten
            player.handCards.splice(cardIndex, 1);
        }

        player.currentLocation = targetLocation;
        return updatedPlayers;
      });

      let locationColor = '';
        $boardConfig.forEach(place => {
        if (place.name === currentLocation) {
          locationColor = place.color;
        }
      });

      const cardToDiscard = {
        cardType: 'city', // oder ein anderer passender Wert für cardType
        data: { name: currentLocation, color: locationColor },
        inBuildArea: false
      };
      addToDiscardPile(cardToDiscard);
      console.log($cardsStore);
    

      const charterBoatToLocation: Action = {
        type: 'charterBoatTo',
        startLocation: currentLocation,
        location: targetLocation,
        freeAction: false
      };
      addActionToCurrentTurn(charterBoatToLocation);

    }
    else{ 
    let path = findPath(currentLocation, targetLocation, $boardConfig);

     // Überprüfen, ob der Zielort direkt mit dem aktuellen Ort verbunden ist
     if (path.length > 0 && currentActions + path.length <= 4) {
      for (const location of path) {
            await animateFerry(currentLocation, location, size, 'moveTo');
            // Aktion zur Bewegung hinzufügen
            const action: Action = { type: 'moveTo', location, freeAction: false };
            addActionToCurrentTurn(action);

            // Aktualisierung der Spielerposition für den nächsten Schritt
            currentLocation = location;
      }

        // Spielerposition im Store aktualisieren
        players.update(currentPlayers => {
            let updatedPlayers = [...currentPlayers];
            updatedPlayers[$activePlayerIndex].currentLocation = targetLocation;
            return updatedPlayers;
        });
    } 
  }
}
</script>

<svg width={size} height={size} xmlns="http://www.w3.org/2000/svg">
  <!-- Erstellung des 3x3-Rasters
  {#each Array(9) as _, index}
    <rect x={index % 3 * (size / 3)} y={Math.floor(index / 3) * (size / 3)} width={(size / 3)} height={(size / 3)} stroke="white" fill="transparent"  />
  {/each}
  -->
  
 
  <!-- Kreis im mittleren Quadrat -->
  <circle cx={size / 2} cy={size / 2} class="location-circle" r="10" fill={color} on:click={() => !$showBoat &&  moveToLocation(name)}/>

  <defs>
    <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Ringe in Spielerfarben -->
  {#each $players as player, index}
    {#if player.currentLocation === name }
      {#if $activePlayerIndex !== index || !$showBoat}
        <circle cx={calculateXPosition(index, totalPlayersAtLocation, size, $activePlayerIndex)} 
                cy={size / 2} r={$activePlayerIndex === index ? "17" : "15"}
                stroke={player.color} 
                stroke-width={$activePlayerIndex === index ? "6" : "3"} 
                fill="none"
                style:filter={$activePlayerIndex === index ? 'url(#strongGlow)' : ''} />
      {/if}
    {/if}
  {/each}

  {#if hasSupplyCenter}
  <image href="/supplyCenter.png" 
  x={size / 2 - imageWidth / 2} 
  y={size / 2 - imageHeight / 2 - offset} 
  width={imageWidth} 
  height={imageHeight} 
  preserveAspectRatio="xMidYMid meet"/>
{/if}

  <!-- Hintergrund für den Namen des Feldes -->
  <rect x={textBackgroundX} y={textBackgroundY} width={textBackgroundWidth} height={textBackgroundHeight} fill="white" fill-opacity="0.7"/>

  <!-- Name des Feldes unterhalb des Kreises -->
  <text x={size / 2} y={size / 2.2 + 40} text-anchor="middle" fill="navy">{name}</text>

  <g transform={`translate(${size / 2 - (capacity * cubeSize + (capacity - 1) * cubeMargin) / 2}, ${hasSupplyCenter ? size / 2 - 60 : size / 2 - 35})`}>
    <SupplyArea {name} {supplies} {capacity} {cubeSize} {cubeMargin}/>
  </g>

</svg>