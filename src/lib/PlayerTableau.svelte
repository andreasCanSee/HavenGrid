<script>
    import { increaseSupplies, currentTurnActions, showBoat, players, activePlayerIndex } from '../lib/store';

    export let player;
    export let isActive;

    $: currentActions = $currentTurnActions.filter(action => !action.freeAction).length;

    function handleIncreaseClick() {
        if(isActive && currentActions < 4 && !$showBoat){
            increaseSupplies(player.name);
        }
    }

    let currentDrag = {
        fromPlayer: null,
        toPlayer: null
    }

    function handleDragStart(event, playerName) {
        const fromPlayer = $players.find(p => p.name === playerName);
        if (fromPlayer) {
            currentDrag = {
                fromPlayer: playerName,
                fromLocation: fromPlayer.currentLocation
            };
            event.dataTransfer.setData("text", JSON.stringify(currentDrag));
        }
    }

    function handleDrop(event, targetPlayerName) {
        event.preventDefault();
        const draggedPlayerName = JSON.parse(event.dataTransfer.getData("text")).fromPlayer;

        players.update(allPlayers => {
            const fromPlayer = allPlayers.find(p => p.name === draggedPlayerName);
            const toPlayer = allPlayers.find(p => p.name === targetPlayerName);

            if (fromPlayer && toPlayer && fromPlayer.currentLocation === toPlayer.currentLocation) {
                fromPlayer.supplies--;
                toPlayer.supplies++;
            }
            return allPlayers;
        });

        // Reset currentDrag object
        currentDrag = { fromPlayer: null, toPlayer: null };
    }

    $: isDropzone = isActive || player.currentLocation === $players[$activePlayerIndex].currentLocation;
</script>

<div  on:dragover={event => isDropzone && event.preventDefault()} 
    on:drop={event => isDropzone && handleDrop(event, player.name)} style="border: 2px solid {player.color}; padding: 10px; margin-top: 20px; opacity: {isActive ? 1 : 0.5};">
    <div style="font-weight: bold;">{player.name}</div>
    <img src={player.image} alt="🥷" style="max-width: 100px; max-height: 200px; object-fit: contain;" />
    <div style="margin-top: 10px; display: flex;">
        {#each Array(player.supplies) as _, index}
            <div 
            draggable={isActive || (player.currentLocation === $players[$activePlayerIndex].currentLocation)}
                on:dragstart={(event) => handleDragStart(event, player.name)}
                style="width: 20px; height: 20px; background-color: firebrick; margin-right: 5px;">
            </div>
        {/each}
        <div 
            style="width: 20px; height: 20px; background-color: transparent; border: 1px solid black; margin-right: 5px;"
            on:click={handleIncreaseClick}>
        </div>
    </div>
</div>