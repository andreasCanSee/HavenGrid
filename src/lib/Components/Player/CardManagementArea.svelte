<script lang="ts">
    import type { CityCard } from "../../Models/types";
    export let playerIndex: number;
    export let isActive: boolean;
    export let playerHandCards: CityCard[];
    export let isAtActivePlayerLocation: boolean;
    export let playerLocation: string;

    let groupedCards: Record<string, CityCard[]>;

    $: groupedCards = {
        yellow: playerHandCards.filter(card => card.data.color === 'yellow' && !card.inBuildArea),
        blue: playerHandCards.filter(card => card.data.color === 'blue' && !card.inBuildArea),
        black: playerHandCards.filter(card => card.data.color === 'black' && !card.inBuildArea)
    };

    function handleCardDragStart(event: DragEvent, card: CityCard, playerIndex: number) {
        const dragData = {
            type: 'cityCard',
            fromPlayerIndex: playerIndex,
            cardData: card.data
        };
        if(event.dataTransfer){
            event.dataTransfer.setData("application/json", JSON.stringify(dragData));
            console.log(dragData)
        }
    }
 
</script>

<div style="display: flex; flex-direction: column;">
    {#if playerHandCards.length > 0}
    <div style="display: flex;">
            {#each ['yellow', 'blue', 'black'] as color}
                <div class="card-stack" style="margin: 5px;"> 
                    {#each groupedCards[color] as card}
                        <button style="
                                    display: block; 
                                    width: 80px; /* Feste Breite */
                                    height: 40px; /* Feste Höhe */
                                    background-color: {card.data.color}; 
                                    padding: 5px; 
                                    color: {card.data.color === 'yellow' ? 'black' : 'white'}; 
                                    margin-bottom: 5px; 
                                    cursor: pointer; 
                                    border: none;
                                    text-align: center;"
                                    draggable={(isActive || isAtActivePlayerLocation) && card.data.name === playerLocation}
                                    on:dragstart={event => handleCardDragStart(event, card, playerIndex)}>
                            {card.data.name}
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>