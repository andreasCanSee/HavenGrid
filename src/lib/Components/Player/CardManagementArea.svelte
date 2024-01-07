<script lang="ts">
    import type { CityCard as CityCardType } from "../../Models/types";
    import CityCard from "./CityCard.svelte";

    export let playerIndex: number;
    export let playerHandCards: CityCardType[];
    export let playerColor: string;
    export let isActive: boolean;
    export let isAtActivePlayerLocation: boolean;
    export let playerLocation: string;

    let groupedCards: Record<string, CityCardType[]>;
    
    $: groupedCards = {
        yellow: playerHandCards.filter(card => card.data.color === 'yellow' && !card.inBuildArea),
        blue: playerHandCards.filter(card => card.data.color === 'blue' && !card.inBuildArea),
        black: playerHandCards.filter(card => card.data.color === 'black' && !card.inBuildArea)
    }

    // Funktion, die die Farbe zurückgibt, wenn drei oder mehr Karten dieser Farbe vorhanden sind
    $: buildAreaColor = (() => {
        const colorCounts = playerHandCards.reduce((acc: Record<string, number>, card) => {
            const color = card.data.color;
            acc[color] = (acc[color] || 0) + 1;
            return acc;
        }, {});

        for (const color in colorCounts) {
            if (colorCounts[color] >= 3) {
                return color;
            }
        }

        return null;
        })();
    
</script>

<div style="display: flex; flex-direction: column;">
    {#if playerHandCards.length > 0}
        <div style="display: flex;">
            {#each ['yellow', 'blue', 'black'] as color}
                <div class="card-stack" style="margin: 5px;"> 
                    {#each groupedCards[color] as cityCard, index (cityCard.data.name + '-' + index)}
                        <CityCard {cityCard} {playerLocation} {playerIndex} {isActive} {isAtActivePlayerLocation} {playerColor}/>
                    {/each}
                </div>
            {/each}
        </div>          
    {/if}
</div>