<script lang="ts">
    import Field from './Field.svelte';
    import boardConfig from './store';
  
    type Field = {
        name: string;
        x: number;
        y: number;
        connections: string[];
    };
  
    type Line = {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
  
    let fields: Field[] = [];
    boardConfig.subscribe(value => {
        fields = value;
    });
  
    const gridSize = 120; // Größe eines Feldes in Pixeln

    const dimensions = calculateSvgDimensions();
    const svgWidth = dimensions.width;
    const svgHeight = dimensions.height;

    function calculateSvgDimensions() {
        const maxX = Math.max(...fields.map(field => field.x));
        const maxY = Math.max(...fields.map(field => field.y));
        console.log(maxX);
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
  </script>
  
  <svg width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
    <rect width={svgWidth} height={svgHeight} fill="navy" />
        {#each fields as field (field.name)}
        <g transform={`translate(${(field.x - 1) * gridSize}, ${(field.y - 1) * gridSize})`}>
            <Field size={gridSize} name={field.name} />
        </g>
        {/each}
        {#each lines as line}
        <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="white" stroke-width="3"/>
        {/each}
  </svg>
  