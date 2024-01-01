<script lang="ts">
    import { players, activePlayerIndex } from "./playerStore";
    import { addToDiscardPile, cardsStore } from "./cardsStore";
    import { addActionToCurrentTurn } from "./store";
    import type { Action } from "./player";
    import { animateFerry } from "./utils";

    export let name: string;
    export let color: string;

    $: activePlayer = $players[$activePlayerIndex];
    $: isCurrentLocation = activePlayer.currentLocation === name;

    async function sailToLocation() {
        if (!isCurrentLocation) {
            const cardToDiscard = {
            cardType: 'city', // oder ein anderer passender Wert für cardType
            data: { name, color }
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
                console.log($cardsStore.discardPile)
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
        if (isCurrentLocation) {
            console.log(`Charterflug nach ${name}`);
        } else {
            console.log("Nicht am Ausgangsort für Charterflug");
        }
    }

    function handleCardClick() {
        if (!isCurrentLocation) {
            sailToLocation();
        } else {
            charterToLocation();
        }
    }

</script>

<button class="player-card" 
        style="display: block; 
               width: 150px; /* Feste Breite */
               height: 40px; /* Feste Höhe */
               background-color: {color}; 
               padding: 5px; 
               color: {color === 'yellow' ? 'black' : 'white'}; 
               margin-bottom: 5px; 
               border: none; 
               cursor: pointer; 
               text-align: center;"
        on:click={handleCardClick}>
    {name} 
    <br> 
    {isCurrentLocation ? '🚢': '🛥️'}
</button>
