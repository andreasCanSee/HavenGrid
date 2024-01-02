<script lang="ts">
    import Field from "../../Field.svelte";
    import type { Line, Field as FieldType } from "../../Models/types";
    import { createCurvePath } from "./boardUtils";
    export let svgWidth: number;
    export let svgHeight: number;
    export let lines: Line[];
    export let fields: FieldType[];
    export let gridSize:number;

</script>

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
        <slot></slot>
  </svg>