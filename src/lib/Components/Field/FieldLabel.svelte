<script lang="ts">
    import { gridSize } from "../Board/config";
    export let name: string;
    export let color: string;

    // Berechnungen für den Hintergrund des Textes
    const textBackgroundWidth = gridSize * 0.8;
    const textBackgroundHeight = 15;
    const textBackgroundX = (gridSize - textBackgroundWidth) / 2;
    const textBackgroundY = gridSize / 2.2 + 35 - textBackgroundHeight / 2;

    function determineTextColor(bgColor: string): string {
        // Eine einfache Logik, um zu entscheiden, ob die Schriftfarbe dunkel oder hell sein sollte
        // Basierend auf den häufigsten hellen Farben (weiß, gelb)
        return bgColor === 'white' || bgColor === 'yellow' ? 'black' : 'white';
    }

    const textColor = determineTextColor(color);

</script>

<svg>
    <!-- Hintergrund für den Namen des Feldes -->
    <rect x={textBackgroundX} y={textBackgroundY} width={textBackgroundWidth} height={textBackgroundHeight} fill={color} fill-opacity="0.7"/>

    <!-- Name des Feldes unterhalb des Kreises -->
    <text x={gridSize / 2} y={gridSize / 2.2 + 40} text-anchor="middle" fill={textColor}>{name}</text>
</svg>