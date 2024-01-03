<script lang="ts">
    import Field from "../Field/Field.svelte";
    import type { Line } from "../../Models/types";
    import { initialBoardConfig } from "../../Stores/boardStore";
    import { createCurvePath } from "./boardUtils";
    import { gridSize } from "./config";
    import { calculateLines } from "./boardUtils";

    export let svgWidth: number;
    export let svgHeight: number;
    
    let lines: Line[] = calculateLines(); // Berechnen der Linien
</script>

<svg width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
    <rect width={svgWidth} height={svgHeight} />
    <image href="/waterworld.webp" width={svgWidth} height={svgHeight} x="0" y="0" preserveAspectRatio="xMidYMid slice"/>
        {#each lines as line}
            <path d={createCurvePath(line)} stroke="deepskyblue" stroke-width="3" fill="none"  stroke-dasharray="1,4"/>
        {/each}
        {#each initialBoardConfig as field (field.name)}
            <g transform={`translate(${(field.coordinates.x - 1) * gridSize}, ${(field.coordinates.y - 1) * gridSize})`}>
                <Field name={field.name} color={field.color} capacity={field.capacity} />
            </g>
        {/each}
        <slot></slot>
  </svg>