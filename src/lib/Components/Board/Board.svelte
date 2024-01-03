<script lang="ts">
    import BoardLayout from './BoardLayout.svelte';
    import type { Line, Field as FieldType } from '../../Models/types';
    import { showBoat } from "../../Stores/boardStore";
    import { boardConfig } from '../../Stores/boardStore';
    import { fade } from 'svelte/transition';
    import { animatedPlayerPosition } from './boardUtils';
    import { currentTurnActions } from '../../store';
    import { calculateSvgDimensions, calculateLines } from './boardUtils';
    import { gridSize } from './config';

    $: remainingActions = $currentTurnActions.filter(action => !action.freeAction).length;

    // geht das noch besser? (reaktives Statement?) -> ins Board Layout packen?!
    let fields: FieldType[] = [];
    boardConfig.subscribe((value: FieldType[]) => {
        fields = value;
    });

    const dimensions = calculateSvgDimensions(fields, gridSize);
    const svgWidth = dimensions.width;
    const svgHeight = dimensions.height;

    // kann auch ne Ebene runter?!
    let lines: Line[] = calculateLines(fields, gridSize); // Berechnen der Linien

</script>
  
<div style="position: relative;">
  <BoardLayout {svgWidth} {svgHeight} {lines} {fields}>
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
        
    <!-- Info-Box als Slot-Inhalt -->
    <rect x={svgWidth - 280} y={svgHeight - 150} width={250} height={120} fill="transparent" stroke="white" stroke-width="5"/>
    <text x={svgWidth - 270} y={svgHeight - 120} fill="white" font-size="18px" font-family="Arial, sans-serif">
      Verbleibende Aktionen: {4 - remainingActions}
    </text>
  </BoardLayout>
</div>
  