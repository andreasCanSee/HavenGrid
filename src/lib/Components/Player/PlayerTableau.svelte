<script lang="ts">
    import { currentTurnActions, addActionToCurrentTurn } from '../../store';
    import { showBoat } from '../../Stores/uiStore';
    import type { Action, Player } from '../../Models/types';
    import { gameState } from '../../Stores/gameStateStore';
    import PlayerCardsArea from './PlayerCardsArea.svelte';

    export let player: Player;
    export let isActive: boolean;
    export let color: string;
    export let image: string;

    $: currentActions = $currentTurnActions.filter(action => !action.freeAction).length;

    function handleIncreaseClick() {
        if(isActive && currentActions < 4 && !$showBoat){
            gameState.update(state => {
                const updatedPlayers = [...state.players];
                const activePlayer = updatedPlayers.find(p => p.name === player.name);
                if (activePlayer) {
                    activePlayer.supplies++;
                }
                return { ...state, players: updatedPlayers };
            });
        }
    }

    function handleDragStart(event: DragEvent, playerName: string) {
        const fromPlayer = $gameState.players.find(p => p.name === playerName);
        if (fromPlayer && event.dataTransfer) {
            event.dataTransfer.setData("text/plain", fromPlayer.name);
        }
    }

    function handleDrop(event: DragEvent, targetPlayerName: string) {
    event.preventDefault();
    if (!event.dataTransfer) return; 
    const draggedPlayerName = event.dataTransfer.getData("text/plain");

    if(targetPlayerName !== draggedPlayerName){
        gameState.update(state => {
            const fromPlayerIndex = state.players.findIndex(p => p.name === draggedPlayerName);
            const toPlayerIndex = state.players.findIndex(p => p.name === targetPlayerName);
            const fromPlayer = state.players[fromPlayerIndex];
            const toPlayer = state.players[toPlayerIndex];

            if (fromPlayer && toPlayer && fromPlayer.currentLocation === toPlayer.currentLocation && fromPlayer.supplies > 0) {
                fromPlayer.supplies--;
                toPlayer.supplies++;

                const action: Action = {
                        type: 'transferSupplies',
                        supplies: state.activePlayerIndex === fromPlayerIndex ? -1 : 1, 
                        freeAction: true,
                        transactionPartner: state.activePlayerIndex === fromPlayerIndex ? toPlayer.name : fromPlayer.name
                    };
                addActionToCurrentTurn(action);              
            }
            return { ...state };
        });
    }
}


$: playerIndex = $gameState.players.findIndex(p => p.name === player.name);
$: isDropzone = isActive || player.currentLocation === $gameState.players[$gameState.activePlayerIndex].currentLocation;

</script>

<div class="player-tableau"  on:dragover={event => isDropzone && event.preventDefault()} on:drop={event => isDropzone && handleDrop(event, player.name)} style="border: 2px solid {color}; padding: 10px;margin-bottom:10px; display: flex; align-items: start; justify-content: flex-start; width: 430px; opacity: {isActive ? 0.8 : 0.5};">
    <div class="player-info" style="flex-shrink: 0;">
        <div style="font-weight: bold; margin-bottom:10px">{player.name}</div>
        <img src={image} alt="🥷" style="max-width: 100px; max-height: 200px; object-fit: contain;" />
        <div class="supply-area" style="margin-top: 10px; display: flex; width: 100px; flex-wrap: wrap;">
            {#each Array(player.supplies) as _, index}
                <div 
                    draggable={isActive || (player.currentLocation === $gameState.players[$gameState.activePlayerIndex].currentLocation)}
                    on:dragstart={(event) => handleDragStart(event, player.name)}
                    style="width: 20px; height: 20px; background-color: firebrick; margin-right: 5px; margin-bottom: 5px">
                </div>
            {/each}
            <div 
                style="width: 18px; height: 18px; background-color: transparent; border: 1px solid black; margin-right: 5px;"
                on:click={handleIncreaseClick}>
            </div>
        </div>  
    </div> 
    <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center;">
        <PlayerCardsArea playerIndex={playerIndex}/>
    </div>
</div>