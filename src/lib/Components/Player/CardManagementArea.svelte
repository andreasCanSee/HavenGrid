<script lang="ts">
    import type { PlayerHand, CityCard as CityCardType } from "../../Models/types";
    import { gameState } from "../../Stores/gameStateStore";
    import CityCard from "./CityCard.svelte";
    import BuildArea from "./BuildArea.svelte";
    import { isDiscardMode } from "../../Stores/uiStore";
    import { getColorOfCity } from "../../Models/initialBoardData";

    export let playerIndex: number;
    export let playerHandCards: PlayerHand;
    export let playerColor: string;
    export let isActive: boolean;
    export let isAtActivePlayerLocation: boolean;
    export let playerLocation: string;

    type GroupedCardsType = {
        yellow: CityCardType[];
        blue: CityCardType[];
        black: CityCardType[];
    };

    const cardColors: Array<{ color: keyof GroupedCardsType }> = [
        { color: 'yellow' },
        { color: 'blue' },
        { color: 'black' }
    ];

    // Trennen von CityCards und ActionCards
    $: cityCards = playerHandCards.cityCards;
    $: actionCards = playerHandCards.actionCards;
    
    let showDiscardMessage: boolean;
    $: showDiscardMessage = $isDiscardMode.active && $isDiscardMode.playerIndex === playerIndex;

    $: groupedCards = cityCards.reduce((acc: GroupedCardsType, card) => {
        if (!card.inBuildArea) {
            const cityName = card.name;
            const color = getColorOfCity(cityName) as keyof GroupedCardsType;
            acc[color].push(card);
        }
        return acc;
    }, { yellow: [], blue: [], black: [] } as GroupedCardsType);

    // Funktion, die die Farbe zurückgibt, wenn drei oder mehr Karten dieser Farbe vorhanden sind
    $: buildAreaColor = (() => {
            const colorCounts = cityCards.reduce((acc: Record<string, number>, card) => {
                const cityName = card.name;
                const color = getColorOfCity(cityName);
                acc[color] = (acc[color] || 0) + 1;
                return acc;
            }, {});

            return Object.keys(colorCounts).find(color => colorCounts[color] >= 5) || null;
    })();

    $: if (buildAreaColor == null || !isActive) {
        resetBuildArea();
    }

    function handleUpdateCard(event: CustomEvent<any>) {
        const { originalIndex, inBuildArea } = event.detail;

        gameState.update(state => {
            const activePlayer = state.players[playerIndex];
            // Identifiziere die Karte anhand des Namens und des Indexes
            const cardToUpdate = activePlayer.handCards.cityCards[originalIndex];

        if (cardToUpdate) {
            cardToUpdate.inBuildArea = inBuildArea;
        }
            return state;
        });
    }

    function resetBuildArea() {
        gameState.update(state => {
            const activePlayer = state.players[playerIndex];
            activePlayer.handCards.cityCards.forEach(card => {
                card.inBuildArea = false;
            });
            return state;
        });
    }

    $: selectedCityCards = cityCards
        .map((card, originalIndex) => ({ card, originalIndex }))
        .filter(({ card }) => getColorOfCity(card.name) === buildAreaColor);

</script>
<!-- 
<div style="display: flex; flex-direction: column;">
    {#if showDiscardMessage && (isActive || isAtActivePlayerLocation)}
        <p style="color: red; text-align: center;">
            Bitte Karten abwerfen, bis maximal 7 Karten übrig bleiben!
        </p>
    {/if}
    {#if playerHandCards.cityCards.length > 0}
        <div style="display: flex;">
            {#each cardColors as cardColor}
                <div class="card-stack" style="margin: 5px;"> 
                    {#each groupedCards[cardColor.color] as cityCard, index (cityCard.name + '-' + index)}
                        <CityCard {cityCard} {playerLocation} {playerIndex} {isActive} {isAtActivePlayerLocation} {playerColor} canDiscard={showDiscardMessage}/>
                    {/each}
                </div>
            {/each}
        </div>
        {#if buildAreaColor && isActive}
            <BuildArea {buildAreaColor} cityCards={playerHandCards
                .map((card, originalIndex) => ({ card, originalIndex }))
                .filter(({ card }) => card.data.color === buildAreaColor)} {playerLocation} on:updateCard={handleUpdateCard} />
        {/if}          
    {/if}
</div>
 -->
 <div style="display: flex; flex-direction: column;"> 
    {#if showDiscardMessage && (isActive || isAtActivePlayerLocation)}
        <p style="color: red; text-align: center;">
            Bitte Karten abwerfen, bis maximal 7 Karten übrig bleiben!
        </p>
    {/if}
    {#if cityCards.length > 0}
        <div style="display: flex;">
            {#each cardColors as cardColor}
                <div class="card-stack" style="margin: 5px;">
                    {#each groupedCards[cardColor.color] as cityCard, index (cityCard.name + '-' + index)}
                        <CityCard {cityCard} cardColor={cardColor.color} {playerLocation} {playerIndex} {isActive} {isAtActivePlayerLocation} {playerColor} canDiscard={showDiscardMessage}/>
                    {/each}
                </div>
            {/each}
        </div>
        {#if buildAreaColor && isActive}
            <BuildArea {buildAreaColor} {selectedCityCards} {playerLocation} on:updateCard={handleUpdateCard} />
        {/if} 
    {/if}
</div>

 