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

  $: activePlayer = $players[$activePlayerIndex];
  $: currentActions = $currentTurnActions.filter(action => !action.freeAction).length;

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
      await animateFerry(currentLocation, targetLocation, size, 'sailTo');

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
        data: { name: currentLocation, color: locationColor }
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
    <rect x={index % 3 * gridSize} y={Math.floor(index / 3) * gridSize} width={gridSize} height={gridSize} stroke="black" fill="transparent"  />
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

  <!-- Hintergrund für den Namen des Feldes -->
  <rect x={textBackgroundX} y={textBackgroundY} width={textBackgroundWidth} height={textBackgroundHeight} fill="white" fill-opacity="0.7"/>

  <!-- Name des Feldes oberhalb des Kreises -->
  <text x={size / 2} y={size / 2.2 + 40} text-anchor="middle" fill="navy">{name}</text>

  <SupplyArea {name} {supplies} {capacity} {size}/>

</svg>