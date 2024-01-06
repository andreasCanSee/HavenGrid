<script lang="ts">
    import { derived } from "svelte/store";
    import PlayerSupplyArea from "./PlayerSupplyArea.svelte";
    import { transferSupplies } from "./playerActions";
    import { gameState } from "../../Stores/gameStateStore";
    import type { PlayerState } from "../../Models/types";

    export let name: string;
    export let color: string;
    export let image: string;
    export let isActive: boolean;

    const playersStore = derived(
        gameState,
        $gameState => $gameState.players
    );

    let player: PlayerState | undefined;
    $: player = $playersStore.find(p => p.name === name);
    
    let playerLocation: string, playerSupplies: number;
    $: if(player){
        playerLocation = player.currentLocation;
        playerSupplies = player.supplies;
    }

    let isAtActivePlayerLocation: boolean;
    $: isAtActivePlayerLocation = !isActive && player?.currentLocation === $gameState.players[$gameState.activePlayerIndex].currentLocation;

    $: isDropzone = isActive || (player && player.currentLocation === $gameState.players[$gameState.activePlayerIndex].currentLocation);

    function handleDragOver(event: DragEvent) {
        event.preventDefault();  // Ermöglicht das Ablegen
    }

    function handleDrop(event: DragEvent, targetPlayerName: string) {
        event.preventDefault();
        if (!event.dataTransfer) return; 
        const dragData = JSON.parse(event.dataTransfer.getData("application/json"));
        
        if (dragData && dragData.type === 'supplies') {
            const fromPlayer = $gameState.players.find(p => p.name === dragData.fromPlayer);
            const toPlayer = $gameState.players.find(p => p.name === targetPlayerName);

            if (fromPlayer && toPlayer && fromPlayer.currentLocation === toPlayer.currentLocation) {;
                transferSupplies(dragData.fromPlayer, targetPlayerName);
            }
        }
        else if (dragData && dragData.type === 'cityCard'){
            // Karte tauschen
        }
    }

</script>

<div style=
        "border: 6px solid {color}; 
        padding: 10px;
        margin-bottom:10px; 
        display: flex; 
        align-items: start; 
        justify-content: flex-start; 
        box-shadow: {isActive ? `0px 0px 10px ${color}` : 'none'};
        filter: {!isActive ? 'blur(1px)'  : 'none'};
        width: 430px; 
        opacity: {isActive ? 0.8 : 0.5};"
        on:drop={isDropzone ? event => handleDrop(event, name) : undefined}
        on:dragover={isDropzone ? handleDragOver : undefined}
        role="listbox"
        tabindex="0">
    <div>
        <h2 style="color: {color}; margin-top: 0px;">{name}</h2>
        <img src={image} alt="🥷" style="max-width: 100px; 
                                        max-height: 200px; 
                                        border-radius: 15px;
                                        box-shadow: 0px 0px 10px #000;
                                        object-fit: contain;" />
        <div class="supply-area" style="margin-top: 10px; 
                                        display: flex; 
                                        width: 100px; 
                                        flex-wrap: wrap;">
            <PlayerSupplyArea 
                {name} 
                {isActive} 
                {playerSupplies}
                {isAtActivePlayerLocation} />
        </div>  
    </div> 
    <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center;">
        <!--CardManagementArea playerIndex={playerIndex}/-->
    </div>
</div>