<script lang="ts">
  import { derived } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import BoardLayout from './BoardLayout.svelte';
  import { gameState } from '../../Stores/gameStateStore';
  import type { CityCard } from '../../Models/types';
  import { showBoat, isDiscardMode } from '../../Stores/uiStore';
  import { discardExcessCityCard } from '../../GameLogic/Actions/cardsAction';
  import { animatedPlayerPosition, calculateSvgDimensions } from './boardUtils';
  import { handleDragOver } from '../../Utilities/uiHandlers';
  import { getInfectionRates } from '../../Models/infectionRate';

  const gameInfo = derived(gameState, $gameState => ({
    infectionRateInfo: getInfectionRates($gameState.infectionRateIndex),
    outbreaks: $gameState.outbreaks
  }));

  const dimensions = calculateSvgDimensions();
  const svgWidth = dimensions.width;
  const svgHeight = dimensions.height;

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        if (!event.dataTransfer) return;
        const dragData = JSON.parse(event.dataTransfer.getData("application/json"));
  
        if (dragData && dragData.type === 'discardCityCard') {
          const card = {
            cardType: 'city',
            name: dragData.cardName, 
            inBuildArea: false  // Standardwert setzen
        } as CityCard;
          discardExcessCityCard(dragData.fromPlayerIndex, card)
      }
    }

</script>
  
<div on:dragover={ $isDiscardMode.active ? handleDragOver : undefined} on:drop={ $isDiscardMode.active ? event => handleDrop(event) : undefined } role="listbox" tabindex="0">
  <BoardLayout {svgWidth} {svgHeight}>
    {#if $showBoat}
      <g transform={`translate(${($animatedPlayerPosition.x)}, ${($animatedPlayerPosition.y)}) scale(${$animatedPlayerPosition.scaleX}, 1)`}> 
        <image 
          href={$animatedPlayerPosition.imageFile} 
          width=30
          height=30
          preserveAspectRatio="xMidYMid meet"
          in:fade={{ duration: 100 }}
          out:fade={{ duration: 300 }}/>
      </g>
    {/if}

    <rect x={svgWidth - 320} y={svgHeight - 150} width={300} height={80} fill="transparent" stroke="navy" stroke-width="5"/>
    <text x={svgWidth - 310} y={svgHeight - 90} fill="navy" font-size="18px" font-family="Arial, sans-serif">
      Vorfälle: {$gameInfo.outbreaks} / 8 = 💀
    </text>
    <text x={svgWidth - 310} y={svgHeight - 120} fill="navy" font-size="18px" font-family="Arial, sans-serif">
      Infektionsrate: {$gameInfo.infectionRateInfo.current} (nächste Stufe: {$gameInfo.infectionRateInfo.next})
    </text>

  </BoardLayout>
</div>