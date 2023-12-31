<script>
    import { increaseSupplies } from '../lib/store';

    export let player;
    export let isActive;

function handleIncreaseClick() {
    if(isActive){
        increaseSupplies(player.name);
    }
}
</script>

<div style="border: 2px solid {player.color}; padding: 10px; margin-top: 20px; opacity: {isActive ? 1 : 0.5};">
    <div style="font-weight: bold;">{player.name}</div>
    <img src={player.image} alt="🥷" style="max-width: 100px; max-height: 200px; object-fit: contain;" />
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