<script>
    import { get } from 'svelte/store';
    import { players } from '../lib/store';
    export let player;
    import { increaseSupplies } from '../lib/store';

function handleIncreaseClick() {
    increaseSupplies(player.name);
    console.log(get(players))
}
</script>

<div style="border: 2px solid {player.color}; padding: 10px; margin-top: 20px">
    <div style="font-weight: bold;">{player.name}</div>
    <div style="margin-top: 10px;">
        {#each Array(player.supplies + 1) as _, index}
            <svg width="20" height="20" style="margin-right: 5px;">
                <rect 
                    x="0" 
                    y="0" 
                    width="20" 
                    height="20" 
                    fill={index < player.supplies ? '#412B15' : 'transparent'} 
                    stroke={index < player.supplies ? 'none' : 'black'} 
                    on:click={index === player.supplies ? handleIncreaseClick : null} />
            </svg>
        {/each}
    </div>
</div>