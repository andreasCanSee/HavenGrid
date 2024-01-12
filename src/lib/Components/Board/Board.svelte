<script lang="ts">
  import { derived } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import BoardLayout from './BoardLayout.svelte';
  import { gameState } from '../../Stores/gameStateStore';
  import { currentTurnActions } from '../../Stores/turnStateStore';
  import { showBoat, isDiscardMode } from '../../Stores/uiStore';
  import { discardExcessCard } from '../../GameLogic/Actions/cardsAction';
  import { animatedPlayerPosition, calculateSvgDimensions } from './boardUtils';
  import { handleDragOver } from '../../Utilities/uiHandlers';

    $: remainingActions = $currentTurnActions.filter(action => !action.freeAction).length;

    const dimensions = calculateSvgDimensions();
    const svgWidth = dimensions.width;
    const svgHeight = dimensions.height;

    const infectionDeck = derived(gameState, $gameState => $gameState.infectionDeck)
    
    let showTooltip = false;

    function toggleTooltip() {
        showTooltip = !showTooltip;
    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        if (!event.dataTransfer) return;
        const dragData = JSON.parse(event.dataTransfer.getData("application/json"));
  
        if (dragData && dragData.type === 'discardCard') {
          const card = {
            data: {
                name: dragData.cardData.name, 
                color: dragData.cardData.color
            },
            cardType: 'city', // oder entsprechend anpassen, falls notwendig
            inBuildArea: false  // Standardwert setzen
        };
          discardExcessCard(dragData.fromPlayerIndex, card)
      }
    }

   // $: rectHeight = $drawnInfectionCards.length * 21;
   //let rectHeight = 21 * 11;


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
        
    <!--width={($animatedPlayerPosition.imageFile == '/ship.png') ? 45 : 30}-->
    <!-- Info-Box als Slot-Inhalt -->
    <rect x={svgWidth - 280} y={svgHeight - 150} width={250} height={120} fill="transparent" stroke="white" stroke-width="5"/>
    <text x={svgWidth - 270} y={svgHeight - 120} fill="white" font-size="18px" font-family="Arial, sans-serif">
      Verbleibende Aktionen: {4 - remainingActions}
    </text>

    <foreignObject x={svgWidth - 270} y={svgHeight - 100} width="250" height="25">
      <div>
        <button on:click={()=> toggleTooltip()}>Infektionskartenablagestapel</button>
          </div>
  </foreignObject>
  {#if showTooltip}
    <rect fill="black" x={svgWidth - 400} y={svgHeight - 300} width="100" height={$infectionDeck.discardPile.length * 21}></rect>
    {#each $infectionDeck.discardPile as card, index}
        <text x={svgWidth - 390} y={svgHeight - 280 + index * 20} fill="white" font-size="16px" font-family="Arial, sans-serif">
            {card.data.name}
        </text>
    {/each}
{/if}
</BoardLayout>
</div>

  