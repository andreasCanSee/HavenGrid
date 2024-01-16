<script lang="ts">
    import Field from "../Field/Field.svelte";
    import type { Line } from "../../Models/types";
    import { initialBoardState } from "../../Models/initialBoardData";
    import { createCurvePath } from "./boardUtils";
    import { calculateLines } from "./boardUtils";

    export let svgWidth: number;
    export let svgHeight: number;
    export let gridSize: number;
    
    let lines: Line[] = calculateLines(gridSize); // Berechnen der Linien
</script>

<div>
    <svg width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
        <rect width={svgWidth} height={svgHeight} fill="deepskyblue" opacity="0.5"/>
            <!-- Die Pfade einzeichnen -->
            {#each lines as line}
                <path d={createCurvePath(line)} stroke="navy" stroke-width="3" fill="none"  stroke-dasharray="3,6"/>
            {/each}
            <!-- Die Felder für die Orte einzeichnen -->
            {#each initialBoardState as field (field.name)}
                <g transform={`translate(${(field.coordinates.x - 1) * gridSize}, ${(field.coordinates.y - 1) * gridSize})`}>
                    <Field name={field.name} color={field.color} capacity={field.capacity} {gridSize} />
                </g>
            {/each}
            <slot></slot>
    </svg>
</div>