<script lang="ts">
    import type { CityCard as CityCardType } from "../../Models/types";
    import { createEventDispatcher } from "svelte";
    import { getColorOfCity } from "../../Models/initialBoardData";
    import { buildSupplyCenter } from "../../GameLogic/Actions/cardsAction";

    export let buildAreaColor: string;
    export let selectedCityCards: CardWithOriginalIndex[];
    export let playerLocation: string;

    type CardWithOriginalIndex = {
        card: CityCardType;
        originalIndex: number;
    }

  

    type GroupedCards = {
        [key: string]: CardWithOriginalIndex[];
    }

    $: groupedCityCards = selectedCityCards.reduce((acc: GroupedCards, cardWithIndex) => {
        const cardName = cardWithIndex.card.name;
        (acc[cardName] = acc[cardName] || []).push(cardWithIndex);
        return acc;
    }, {});

    $: showBuildButton = (
        selectedCityCards.length >= 3 && 
        selectedCityCards.filter(({ card }) => card.inBuildArea).length === 3 &&
        getColorOfCity(playerLocation) === buildAreaColor
    );

    const dispatch = createEventDispatcher();

    function handleSliderChange(originalIndex: number, event: Event) {
        const target = event.target as HTMLInputElement;
        if (target) {
            const value = parseInt(target.value);
            const inBuildArea = value === 10;
            dispatch('updateCard', { originalIndex, inBuildArea });
        }
    }

</script>

<div style="display: flex; flex-direction: row; align-items: center; justify-content: center; margin: 7px; padding: 7px; border: 2px solid black; background-color: {buildAreaColor};">
    {#each Object.keys(groupedCityCards) as cardName}
        <div style="margin: 3.5px; padding: 3.5px; border: 1px solid #ccc; background-color: white;">
            <div style="font-size: 70%;">{cardName}</div>
            {#each groupedCityCards[cardName] as cardWithIndex}
                <input type="range" id={`slider-${cardWithIndex.card.name}-${cardWithIndex.originalIndex}`} style="width: 70%;" min="0" max="10" value={cardWithIndex.card.inBuildArea ? 10 : 0}
                on:change={(event) => handleSliderChange(cardWithIndex.originalIndex, event)}>
            {/each}

        </div>
    {/each}
    {#if showBuildButton}
        <button 
                style="flex-grow: 1; flex-shrink: 0;"
                on:click={() => buildSupplyCenter(playerLocation)}>🏗️</button>
    {/if}
</div>
