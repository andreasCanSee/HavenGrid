<script lang="ts">
    import { players, activePlayerIndex } from "./playerStore";
    import { addToDiscardPile, cardsStore } from "./cardsStore";
    import { addActionToCurrentTurn } from "./store";
    import type { Action } from "./player";
    import { animateFerry } from "./utils";
    import { charterBoatMode } from '../lib/store';

    export let name: string;
    export let color: string;
    export let buildAreaColor: string | null;

    $: activePlayer = $players[$activePlayerIndex];
    $: isCurrentLocation = activePlayer.currentLocation === name;

    async function sailToLocation() {
        if (!isCurrentLocation) {
            const cardToDiscard = {
                cardType: 'city', // oder ein anderer passender Wert für cardType
                data: { name, color },
                inBuildArea: false
            };
            addToDiscardPile(cardToDiscard);
            await animateFerry(activePlayer.currentLocation, name, 120, 'sailTo');
            
            players.update(allPlayers => {
                const updatedPlayers = [...allPlayers];
                const player = updatedPlayers[$activePlayerIndex];
                const cardIndex = player.handCards.findIndex(card => card.data.name === name);

                if (cardIndex !== -1) {
                    // Entferne die gefundene Karte aus den Handkarten
                    player.handCards.splice(cardIndex, 1);
                }

                player.currentLocation = name;
                return updatedPlayers;
            });

            const sailToLocation: Action = {
                type: 'sailTo',
                location: name,
                freeAction: false
            };
            addActionToCurrentTurn(sailToLocation);
        } 
    }

    function charterToLocation() {
    // Aktiviere den Charter Boat Mode
    charterBoatMode.set(true);

    // Setze einen einmaligen Event Listener, der auf den nächsten Klick wartet
    setTimeout(() => {
        window.addEventListener('click', () => {
            charterBoatMode.set(false);
        }, { once: true });
    }, 0);
}

    function handleCardClick() {
        if (!isCurrentLocation) {
            sailToLocation();
        } else {
            charterToLocation();
        }
    }

    $: showBorder = $charterBoatMode && isCurrentLocation;
    $: borderStyle = showBorder ? `5px solid ${activePlayer.color}` : 'none';

    function handleDragStart(event: DragEvent) {
        if (event.dataTransfer) {
            event.dataTransfer.setData('text/plain', JSON.stringify({ name, color }));
        }
    }

    
    function handleDragEnd(event: DragEvent) {
        // Logik für Drag-Ende
    }
    
    
</script>

<button class="player-card" 
        draggable={buildAreaColor === color}
        on:dragstart={handleDragStart}
        on:dragend={handleDragEnd}
        style="display: block; 
               width: 150px; /* Feste Breite */
               height: 40px; /* Feste Höhe */
               background-color: {color}; 
               padding: 5px; 
               color: {color === 'yellow' ? 'black' : 'white'}; 
               margin-bottom: 5px; 
               border: {borderStyle}; 
               cursor: pointer; 
               text-align: center;"
        on:click={handleCardClick}>
    {name} 
    {isCurrentLocation ? '🚢': '🛥️'}
</button>
