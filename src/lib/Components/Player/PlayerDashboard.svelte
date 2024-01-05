<script lang="ts">
    export let name: string;
    export let color: string;
    export let image: string;
    export let isActive: boolean;

</script>

<div class="player-tableau" style="border: 2px solid {color}; padding: 10px;margin-bottom:10px; display: flex; align-items: start; justify-content: flex-start; width: 430px; opacity: {isActive ? 0.8 : 0.5};">
    <div class="player-info" style="flex-shrink: 0;">
        <div style="font-weight: bold; margin-bottom:10px">{name}</div>
        <img src={image} alt="🥷" style="max-width: 100px; max-height: 200px; object-fit: contain;" />
        <div class="supply-area" style="margin-top: 10px; display: flex; width: 100px; flex-wrap: wrap;">
            
            <div 
                style="width: 18px; height: 18px; background-color: transparent; border: 1px solid black; margin-right: 5px;">
            </div>
        </div>  
    </div> 
    <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center;">
        <!--CardManagementArea playerIndex={playerIndex}/-->
    </div>
</div>