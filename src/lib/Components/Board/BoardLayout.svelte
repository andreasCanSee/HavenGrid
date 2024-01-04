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

<div style="position: relative;">
    <!-- Oberes Rechteck -->
    <svg width={`${svgWidth + 60}px`} height="30" style="position: absolute; top: 0; left:0px; z-index: 10;">
        <rect width={`${svgWidth + 60}px`} height="30" fill="deepskyblue" opacity="0.5"/>
    </svg>
    <!-- Linkes Rechteck -->
    <svg width="30" height={svgHeight} style="position: absolute; top: 30px; left: 0; z-index: 10;">
        <rect width="30" height={svgHeight} fill="deepskyblue" opacity="0.5"/>
    </svg>

    <!-- Rechtes Rechteck -->
    <svg width="30" height={svgHeight} style={`position: absolute; top: 30px; left: ${svgWidth + 30}px; z-index: 10;`}>
        <rect width="30" height={svgHeight} fill="deepskyblue" opacity="0.5"/>
    </svg>

    <svg width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 30px;left: 30px;">
        <rect width={svgWidth} height={svgHeight} fill="deepskyblue" opacity="0.5"/>
            {#each lines as line}
                <path d={createCurvePath(line)} stroke="navy" stroke-width="3" fill="none"  stroke-dasharray="3,6"/>
            {/each}
            {#each initialBoardConfig as field (field.name)}
                <g transform={`translate(${(field.coordinates.x - 1) * gridSize}, ${(field.coordinates.y - 1) * gridSize})`}>
                    <Field name={field.name} color={field.color} capacity={field.capacity} />
                </g>
            {/each}
            <slot></slot>
    </svg>
</div>