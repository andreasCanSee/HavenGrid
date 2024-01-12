<script lang="ts">
    import BoardLayout from './BoardLayout.svelte';
    import { showBoat } from '../../Stores/uiStore';
    import { fade } from 'svelte/transition';
    import { animatedPlayerPosition } from './boardUtils';
    import { currentTurnActions } from '../../Stores/turnStateStore';
    import { calculateSvgDimensions } from './boardUtils';
    import { gameState } from '../../Stores/gameStateStore';
    import { derived } from 'svelte/store';
    import { handleDragOver } from '../../Utilities/uiHandlers';
    import { discardCard } from '../../GameLogic/Actions/actionUtils';
    import { isDiscardMode } from '../../Stores/uiStore';
    import { get } from 'svelte/store';

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
          gameState.update(currentState => {

            let newState = {...currentState};
            let affectedPlayer = { ...newState.players[dragData.fromPlayerIndex]}
            const { newDiscardPile, newHandCards } = discardCard(
                    dragData.cardData.name, 
                    dragData.cardData.color, 
                    affectedPlayer.handCards, 
                    newState.playerDeck.discardPile
                );

            affectedPlayer.handCards = newHandCards;
            newState.playerDeck.discardPile = newDiscardPile;
            newState.players[dragData.fromPlayerIndex] = affectedPlayer;
            
            return newState;
          })

          // Überprüfe den aktualisierten Spielzustand und setze isDiscardMode zurück, falls notwendig
        const updatedState = get(gameState);
       
        if (updatedState.players[dragData.fromPlayerIndex].handCards.length <= 7) {
          isDiscardMode.set({ active: false, playerIndex: null });
        }
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

  