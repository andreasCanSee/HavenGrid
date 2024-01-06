<script lang="ts">
    import PlayerSupplyArea from "./PlayerSupplyArea.svelte";
    import { transferSupplies } from "./playerActions";

    export let name: string;
    export let color: string;
    export let image: string;
    export let isActive: boolean;

    function handleDragOver(event: DragEvent) {
        event.preventDefault();  // Ermöglicht das Ablegen
    }

    function handleDrop(event: DragEvent, targetPlayerName: string) {
        event.preventDefault();
        if (!event.dataTransfer) return; 
        const dragData = JSON.parse(event.dataTransfer.getData("application/json"));
        if (dragData && dragData.type === 'supplies') {
            console.log(`Supply wurde von ${dragData.fromPlayer} an ${targetPlayerName} übergeben.`);
            transferSupplies(dragData.fromPlayer, targetPlayerName);
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
        on:drop={event => handleDrop(event, name)}
        on:dragover={handleDragOver}
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
            <PlayerSupplyArea {name} {isActive}/>
        </div>  
    </div> 
    <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center;">
        <!--CardManagementArea playerIndex={playerIndex}/-->
    </div>
</div>