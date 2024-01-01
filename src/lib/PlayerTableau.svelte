<script lang="ts">
    import { currentTurnActions, addActionToCurrentTurn } from '../lib/store';
    import { showBoat } from './boardStore';
    import { players, activePlayerIndex, increaseSupplies } from './playerStore'
    import type { Action, Player } from './player';
    export let player: Player;
    export let isActive: boolean;

    $: currentActions = $currentTurnActions.filter(action => !action.freeAction).length;

    function handleIncreaseClick() {
        if(isActive && currentActions < 4 && !$showBoat){
            increaseSupplies(player.name);
        }
    }

    function handleDragStart(event: DragEvent, playerName: string) {
        const fromPlayer = $players.find(p => p.name === playerName);
        if (fromPlayer && event.dataTransfer) {
            event.dataTransfer.setData("text/plain", fromPlayer.name);
        }
    }

    function handleDrop(event: DragEvent, targetPlayerName: string) {
        event.preventDefault();
        if (!event.dataTransfer) return; 
        const draggedPlayerName = event.dataTransfer.getData("text/plain");

        if(targetPlayerName !== draggedPlayerName){
            players.update(allPlayers => {
                const fromPlayer = allPlayers.find(p => p.name === draggedPlayerName);
                const toPlayer = allPlayers.find(p => p.name === targetPlayerName);

                if (fromPlayer && toPlayer && fromPlayer.currentLocation === toPlayer.currentLocation && fromPlayer.supplies > 0) {
                    fromPlayer.supplies--;
                    toPlayer.supplies++;

                    const activePlayer = allPlayers[$activePlayerIndex];

                    const action: Action = {
                            type: 'transferSupplies',
                            supplies: activePlayer.name === fromPlayer.name ? -1 : 1, 
                            freeAction: true,
                            transactionPartner: activePlayer.name === fromPlayer.name ? toPlayer.name : fromPlayer.name
                        };
                    addActionToCurrentTurn(action);              
                }
                return allPlayers;
            });
        }
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