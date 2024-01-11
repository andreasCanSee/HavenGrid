<script lang="ts">
    import { charterBoatMode } from "../../Stores/uiStore";
    import { sailToLocation } from "../../GameLogic/Actions/playerMovements";
    import type { CityCard as CityCardType } from "../../Models/types";
    export let cityCard: CityCardType;
    export let playerLocation: string;
    export let playerIndex: number;
    export let isActive: boolean;
    export let isAtActivePlayerLocation: boolean;
    export let playerColor: string;
    export let canDiscard: boolean;

    const cardName = cityCard.data.name;
    const cardColor = cityCard.data.color;

    $: isCardDraggable = (((isActive || isAtActivePlayerLocation) && canDiscard)) || (((isActive || isAtActivePlayerLocation) && cardName === playerLocation))

    let isSelected: boolean = false;

     // Charterflug aktivieren
     function setCharterMode() {
        // Aktiviere den Charter Boat Mode
        charterBoatMode.set(true);
        isSelected = true; // Markiere den Button

        // Setze einen einmaligen Event Listener, der auf den nächsten Klick wartet
        setTimeout(() => {
            window.addEventListener('click', () => {
                charterBoatMode.set(false);
                isSelected = false;
            }, { once: true });
        }, 0);
    }

    // Karten tauschen

    function handleCardDragStart(event: DragEvent, card: CityCardType, playerIndex: number, isDiscardOnly: boolean) {
        const dragData = {
            type: isDiscardOnly ? 'discardCard' : 'cityCard',
            fromPlayerIndex: playerIndex,
            cardData: card.data,
        };
        if(event.dataTransfer){
            event.dataTransfer.setData("application/json", JSON.stringify(dragData));
        }
    }

    function handleCardClick(playerLocation: string, cardName: string, cardColor: string, playerIndex: number) {
        if (playerLocation !== cardName) {
            sailToLocation(playerLocation, cardName, cardColor, playerIndex);
        } else {
            setCharterMode();
        }
    }

</script>

<button 
    style = "display: block; 
            width: 80px; /* Feste Breite */
            height: 40px; /* Feste Höhe */
            background-color: {cardColor}; 
            padding: 5px; 
            color: {cardColor === 'yellow' ? 'black' : 'white'}; 
            margin-bottom: 5px; 
            cursor: pointer; 
            border: {isSelected ? `3px solid ${playerColor}` : 'none'}; /* Dynamischer Stil für den Rahmen */
            text-align: center;"
            disabled={!isActive}
            on:click={() => handleCardClick(playerLocation, cardName, cardColor, playerIndex)}
            draggable={isCardDraggable}
            on:dragstart={event => handleCardDragStart(event, cityCard, playerIndex, canDiscard)}>
                {cardName} {cardName === playerLocation ? '🚢': '🛥️' }
</button>
