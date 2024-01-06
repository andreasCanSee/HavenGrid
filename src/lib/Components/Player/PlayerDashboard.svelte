<script lang="ts">
    import { derived } from "svelte/store";
    import PlayerSupplyArea from "./PlayerSupplyArea.svelte";
    import CardManagementArea from "./CardManagementArea.svelte";
    import { gameState } from "../../Stores/gameStateStore";
    import type { PlayerState, CityCard } from "../../Models/types";
    import { transferSupplies, transferCityCard } from "./playerActions";

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
    
    let playerLocation: string, playerSupplies: number, playerHandCards: CityCard[];
    $: if(player){
        playerLocation = player.currentLocation;
        playerSupplies = player.supplies;
        playerHandCards = player.handCards;
    }

    let isAtActivePlayerLocation: boolean;
    $: isAtActivePlayerLocation = !isActive && player?.currentLocation === $gameState.players[$gameState.activePlayerIndex].currentLocation;

    let isDropzone: boolean;
    $: isDropzone = isActive || isAtActivePlayerLocation;

    function handleDragOver(event: DragEvent) {
        event.preventDefault();  // Ermöglicht das Ablegen
    }

    function handleDrop(event: DragEvent, targetPlayerName: string) {
        event.preventDefault();
        if (!event.dataTransfer) return; 
        const dragData = JSON.parse(event.dataTransfer.getData("application/json"));
        
        const fromPlayer = $playersStore.find(p => p.name === dragData.fromPlayer);
        const toPlayer = $playersStore.find(p => p.name === targetPlayerName);
        if (dragData && dragData.type === 'supplies') {
            if (fromPlayer && toPlayer && fromPlayer.currentLocation === toPlayer.currentLocation) {;
                transferSupplies(dragData.fromPlayer, targetPlayerName);
            }
        }
        else if (dragData && dragData.type === 'cityCard'){
            let cityName = dragData.cardData.name; 
            if (fromPlayer && toPlayer && fromPlayer.currentLocation === toPlayer.currentLocation) {
            transferCityCard(dragData.fromPlayer, targetPlayerName, cityName);
        }
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
        <div style="width: 100%; background-color:white; border-radius: 15px;text-align: center;">

            <p style="color: {color}; margin-top: 0px; font-weight: bold;">{name}</p>
        </div>
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
        <CardManagementArea 
        {name} 
        {isActive} 
        {playerLocation}
        {playerHandCards}
        {isAtActivePlayerLocation} />
    </div>
</div>