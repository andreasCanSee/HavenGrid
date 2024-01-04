<script lang="ts">
    import BoardLayout from './BoardLayout.svelte';
    import { showBoat } from "../../Stores/boardStore";
    import { fade } from 'svelte/transition';
    import { animatedPlayerPosition } from './boardUtils';
    import { currentTurnActions } from '../../store';
    import { calculateSvgDimensions } from './boardUtils';
    import { drawnInfectionCards } from '../../store';
    import { derived } from 'svelte/store';

    $: remainingActions = $currentTurnActions.filter(action => !action.freeAction).length;

    const dimensions = calculateSvgDimensions();
    const svgWidth = dimensions.width;
    const svgHeight = dimensions.height;
    
    let showTooltip = false;

    function toggleTooltip() {
        showTooltip = !showTooltip;
    }

    $: rectHeight = $drawnInfectionCards.length * 21;


</script>
  

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
    <rect fill="black" x={svgWidth - 400} y={svgHeight - 300} width="100" height={rectHeight}></rect>
    {#each $drawnInfectionCards as card, index}
        <text x={svgWidth - 390} y={svgHeight - 280 + index * 20} fill="white" font-size="16px" font-family="Arial, sans-serif">
            {card}
        </text>
    {/each}
{/if}
  </BoardLayout>


  