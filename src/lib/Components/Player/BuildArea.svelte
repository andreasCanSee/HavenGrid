<script lang="ts">
    import type { CityCard as CityCardType } from "../../Models/types";
    import { createEventDispatcher } from "svelte";
    import { getColorOfCity } from "../../Models/initialBoardData";
    import { buildSupplyCenter } from "../../GameLogic/Actions/cardsAction";

    export let buildAreaColor: string;
    export let cityCards: CityCardType[];
    export let playerLocation: string;

    interface GroupedCards {
        [key: string]: CityCardType[];
    }

    $: groupedCityCards = cityCards.reduce((acc: GroupedCards, card) => {
        (acc[card.data.name] = acc[card.data.name] || []).push(card);
        return acc;
    }, {});

    $: inBuildAreaCount = cityCards.reduce((count, card) => card.inBuildArea ? count + 1 : count, 0);
    $: showBuildButton = inBuildAreaCount === 3 && getColorOfCity(playerLocation) === buildAreaColor;

    const dispatch = createEventDispatcher();

    function handleSliderChange(cardName: string, event: Event) {
        const target = event.target as HTMLInputElement;
        if (target) {
            const value = parseInt(target.value);
            const inBuildArea = value === 10;
            dispatch('updateCard', { cardName, inBuildArea });
        }
    }

</script>

<div style="display: flex; flex-direction: row; align-items: center; justify-content: center; margin: 7px; padding: 7px; border: 2px solid black; background-color: {buildAreaColor};">
    {#each Object.keys(groupedCityCards) as cardName}
        <div style="margin: 3.5px; padding: 3.5px; border: 1px solid #ccc; background-color: white;">
            <div style="font-size: 70%;">{cardName}</div>
            {#each groupedCityCards[cardName] as card, index}
                <input type="range" style="width: 70%;" min="0" max="10" value={card.inBuildArea ? 10 : 0}
                on:change={(event) => handleSliderChange(card.data.name, event)}>
            {/each}

        </div>
    {/each}
    {#if showBuildButton}
    <button 
            style="flex-grow: 1; flex-shrink: 0;"
            on:click={() => buildSupplyCenter(playerLocation)}>🏗️</button>
{/if}
</div>

