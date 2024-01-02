<script lang="ts">
    import Field from './Field.svelte';
    import { showBoat } from "./boardStore";
    import { boardConfig } from '../lib/boardStore';
    import { fade } from 'svelte/transition';
    import { animatedPlayerPosition } from './utils';
    import { currentTurnActions } from './store';

    $: remainingActions = $currentTurnActions.filter(action => !action.freeAction).length;
  
    type Field = {
        name: string;
        x: number;
        y: number;
        connections: string[];
        color: string;
        capacity: number;
        supplies: number;
    };
  
    type Line = {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
  
    let fields: Field[] = [];
    boardConfig.subscribe((value: Field[]) => {
        fields = value;
    });
  
    const gridSize = 120; // Größe eines Feldes in Pixeln

    const dimensions = calculateSvgDimensions();
    const svgWidth = dimensions.width;
    const svgHeight = dimensions.height;

    function calculateSvgDimensions() {
        const maxX = Math.max(...fields.map(field => field.x));
        const maxY = Math.max(...fields.map(field => field.y));
        return {
          width: (maxX)* gridSize,
          height: (maxY) * gridSize
        };
    }
  
    let lines: Line[] = calculateLines(); // Berechnen der Linien

    // Funktion zur Berechnung der Linienpositionen
    function calculateLines(): Line[] {
    let lines: Line[] = [];
    fields.forEach(field => {
      field.connections.forEach(connection => {
        const target = fields.find(f => f.name === connection);
        if (target) {
          lines.push({
            x1: field.x * gridSize - gridSize / 2,
            y1: field.y * gridSize - gridSize / 2,
            x2: target.x * gridSize - gridSize / 2,
            y2: target.y * gridSize - gridSize / 2
          });
        }
      });
    });
    return lines;
  }

function createCurvePath(line: Line): string {
    const midX = (line.x1 + line.x2) / 2;
    const midY = (line.y1 + line.y2) / 2;

    // Bestimmung der Richtung der Krümmung
    const isVertical = Math.abs(line.x1 - line.x2) < Math.abs(line.y1 - line.y2);
    const curveIntensity = Math.max(Math.abs(line.x1 - line.x2), Math.abs(line.y1 - line.y2)) / 6;
    
    // Krümmungspunkt
    let curveX = midX;
    let curveY = midY;

    if (isVertical) {
        // Vertikale Linie: Krümmung nach rechts
        curveX += curveIntensity;
    } else {
        // Horizontale Linie: Krümmung nach unten
        curveY += curveIntensity;
    }

    return `M ${line.x1} ${line.y1} Q ${curveX} ${curveY}, ${line.x2} ${line.y2}`;
    }
    
  </script>
  

  <div style="position: relative;">
  <svg width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
    <rect width={svgWidth} height={svgHeight} />
    <image href="/waterworld.webp" width={svgWidth} height={svgHeight} x="0" y="0" preserveAspectRatio="xMidYMid slice"/>
        {#each lines as line}
         <path d={createCurvePath(line)} stroke="deepskyblue" stroke-width="3" fill="none"  stroke-dasharray="1,4"/>
        {/each}
        {#each fields as field (field.name)}
            <g transform={`translate(${(field.x - 1) * gridSize}, ${(field.y - 1) * gridSize})`}>
                <Field size={gridSize} name={field.name} color={field.color} />
            </g>
        {/each}

        {#if $showBoat}
          <g transform={`translate(${($animatedPlayerPosition.x)}, ${($animatedPlayerPosition.y)}) scale(${$animatedPlayerPosition.scaleX}, 1)`}> 
            <image 
              href={$animatedPlayerPosition.imageFile} 
              width=30
              height=30
              preserveAspectRatio="xMidYMid meet"
              in:fade={{ duration: 100 }}
              out:fade={{ duration: 300 }}
            />
          </g>
        {/if}

      <!-- Info-Box am Rand des Spielfelds -->
      <rect x={svgWidth - 280} y={svgHeight - 150} width={250} height={120} fill="transparent" stroke="white" stroke-width="5"/>
        <text x={svgWidth - 270} y={svgHeight - 120} fill="white" font-size="18px" font-family="Arial, sans-serif">
          Verbleibende Aktionen: {4 - remainingActions}
        </text>
  </svg>
 
</div>
  