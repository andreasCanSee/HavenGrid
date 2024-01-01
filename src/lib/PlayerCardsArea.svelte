<script>
    import CityCard from "./CityCard.svelte";
    export let playerCards = [];

    $: groupedCards = {
        yellow: playerCards.filter(card => card.data.color === 'yellow'),
        blue: playerCards.filter(card => card.data.color === 'blue'),
        black: playerCards.filter(card => card.data.color === 'black')
    };
</script>
  
  <div class="player-cards-area" style="display: flex">
    <!--pre>{JSON.stringify(playerCards, null, 2)}</pre-->
    {#each ['yellow', 'blue', 'black'] as color}
        <div class="card-stack" style="margin: 5px;">
            {#each groupedCards[color] as card}
                <CityCard name={card.data.name} color={card.data.color}/>
            {/each}
        </div>
    {/each}
  </div>