<script>
    import CityCard from "./CityCard.svelte";
    export let playerIndex;
    import { gameState } from "../../Stores/gameStateStore";


    $: player = $gameState.players[playerIndex];
    $: playerCards = player.handCards;

    // Deklariere groupedCards
    let groupedCards = { yellow: [], blue: [], black: [] };
    let buildAreaColor = null;

    // Reaktive Anweisung, um Änderungen an playerCards zu überwachen
    $: {
        groupedCards = {
            yellow: playerCards.filter(card => card.data.color === 'yellow' && !card.inBuildArea),
            blue: playerCards.filter(card => card.data.color === 'blue' && !card.inBuildArea),
            black: playerCards.filter(card => card.data.color === 'black' && !card.inBuildArea)
        };
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        const { name: droppedCardName, color: droppedCardColor } = JSON.parse(event.dataTransfer.getData('text/plain'));

        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const activePlayerIndex = state.activePlayerIndex;
            const activePlayer = updatedPlayers[activePlayerIndex];
           
            let cardFound = false; // Flag zum Verfolgen, ob die Karte gefunden wurde
                
            const updatedHandCards = activePlayer.handCards.map(card => {
                if (!cardFound && card.data.name === droppedCardName && card.data.color === droppedCardColor && !card.inBuildArea) {
                    cardFound = true; // Karte gefunden und wird aktualisiert
                    return { ...card, inBuildArea: true };
                }
                return card;
            });

            activePlayer.handCards = updatedHandCards;
            return { ...state, players: updatedPlayers };
        });
    }

    async function cancelBuildArea() {
        gameState.update(state => {
            const updatedPlayers = [...state.players];
            const activePlayer = updatedPlayers[state.activePlayerIndex]

            const updatedHandCards = activePlayer.handCards.map(card => {
                if (card.inBuildArea) {
                return { ...card, inBuildArea: false };
            }
            return card;
      
            });
            activePlayer.handCards = updatedHandCards;
            return { ...state, players: updatedPlayers };
        });
        // console.log('Nach dem Zurücksetzen', $players[$activePlayerIndex].handCards)
    }

    $: {
    if ($gameState.players.length > 0 && playerIndex !== undefined) {
        const colorCounts = $gameState.players[playerIndex].handCards.reduce((acc, { data: { color }}) => {
            acc[color] = (acc[color] || 0) + 1;
            return acc;
        }, {});

        buildAreaColor = Object.keys(colorCounts).find(color => colorCounts[color] >= 3);
    } else {
        buildAreaColor = null;
    }
}

    let buildAreaCardsCount = 0;

    $: {
        buildAreaCardsCount = player.handCards.filter(card => card.inBuildArea).length;
    }

    let previousCardCount = 0;

    // Reaktive Anweisung zur Überwachung der Änderungen in der Anzahl der Handkarten
    $: if (player && player.handCards) {
        const currentCardCount = player.handCards.length;
        if (currentCardCount !== previousCardCount) {
            //console.log(`Veränderung der Handkarten: war ${previousCardCount}, ist jetzt ${currentCardCount}`);
            previousCardCount = currentCardCount;
            cancelBuildArea();
            // Detailliertes Logging für jede Karte
            /*player.handCards.forEach(card => {
                console.log(`Stadt: ${card.data.name}, inBuildArea: ${card.inBuildArea}`);
            });*/
        }
    }

    function handleBuildCenter() {
        const currentLocationColor = $gameState.boardState.find(location => location.name === player.currentLocation)?.color;
        if (currentLocationColor === buildAreaColor) {
            const cardCount = player.handCards.filter(card => card.data.color === currentLocationColor && card.inBuildArea).length;

            if (cardCount >= 3) {
                console.log('Success');
                // Aktualisiere hasSupplyCenter für den aktuellen Standort
                gameState.update(state => {
                const updatedBoardState = state.boardState.map(location => {
                    if (location.name === player.currentLocation) {
                        return { ...location, hasSupplyCenter: true };
                    }
                    return location;
                });
                return {...state, boardState: updatedBoardState};
            });

                /* Werfe alle Karten aus der Build Area ab
                player.handCards.forEach(card => {
                    if (card.inBuildArea) {
                        addToDiscardPile(card);
                    }
                });*/

                // Setze inBuildArea für alle Karten zurück
                //cancelBuildArea();
            } else {
                console.log('Nicht genügend Karten in der Build Area der erforderlichen Farbe.');
            }
        } else {
            console.log('Spieler befindet sich nicht in einer Stadt der Build Area-Farbe.');
        }
    
    
    }

</script>
  
<div class="player-cards-area" style="display: flex; flex-direction: column;">
    <div style="display: flex;">
        {#each ['yellow', 'blue', 'black'] as color}
            <div class="card-stack" style="margin: 5px;">
                {#each groupedCards[color] as card}
                    <CityCard name={card.data.name} color={card.data.color} {buildAreaColor}/>
                {/each}
            </div>
        {/each}
    </div>
    {#if buildAreaColor}
    <div class="build-area-container" on:dragover={handleDragOver} on:drop={handleDrop} style="border: solid black">
        <div class="build-area" style="background-color: {buildAreaColor}; padding: 10px; margin-top: 5px; display: flex;max-width: 300px; height:30px">
            {#each player.handCards as card}
        {       #if card.inBuildArea}
                    <CityCard name={card.data.name} color={card.data.color} {buildAreaColor}/>
                {/if}
            {/each}
        </div>
            <button on:click={cancelBuildArea}>Abbrechen</button>
            {#if buildAreaCardsCount >= 3}
                <button on:click={handleBuildCenter}>Versorgungszentrum bauen</button>
            {/if}
    </div>
    {/if}
</div>