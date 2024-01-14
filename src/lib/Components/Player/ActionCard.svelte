<script lang="ts">
import type { ActionCard } from "../../Models/types";
import { gameState } from "../../Stores/gameStateStore";
import { produceSuppliesAction } from "../../GameLogic/Actions/eventActions";

export let actionCard: ActionCard;
export let playerIndex: number;
export let isActive: boolean;
export let playerLocation: string;
export let canDiscard: boolean;
export let isAtActivePlayerLocation: boolean;

let canProduceSupplies = false;

$: canProduceSupplies = isActive && $gameState.boardState.some(field => 
    field.name === playerLocation && field.hasSupplyCenter
);

$: isCardDraggable = ((isActive || isAtActivePlayerLocation) && canDiscard)

function executeAction() {
    if (canProduceSupplies && actionCard.eventType === 'produceSupplies') {
        produceSuppliesAction(playerLocation, playerIndex); 
    }
}

function handleCardDragStart(event: DragEvent, card: ActionCard, playerIndex: number) {
        const dragData = {
            type: 'discardCard',
            cardData: card,
            fromPlayerIndex: playerIndex,
        };
        if(event.dataTransfer){
            event.dataTransfer.setData("application/json", JSON.stringify(dragData));
        }
    }
</script>

<button 
    on:click={executeAction}
    on:dragstart={event => handleCardDragStart(event, actionCard, playerIndex)}
    draggable={isCardDraggable}
    disabled={!canProduceSupplies}
    style="display: block; 
           width: 100px; 
           height: 50px; 
           background-color: {canProduceSupplies ? 'OrangeRed' : 'LightGray'};
           background-color: OrangeRed; 
           padding: 10px; 
           margin: 5px; 
           color: white;
           border-radius: 5px; 
           cursor: pointer; 
           border: none;
           text-align: center;">
        {actionCard.name}
</button>