<script lang="ts">
    import SupplyCube from "../../SupplyCube.svelte";
    import { addActionToCurrentTurn } from '../../store';
    import { showBoat } from "../../Stores/boardStore";
    import { boardConfig } from '../../Stores/boardStore';
    import { players, activePlayerIndex } from '../../playerStore'
    import type { Action } from "../../Models/types";

    export let capacity: number;
    export let supplies: number;
    export let name: string;
    export let cubeSize: number;
    export let cubeMargin: number;

    function deliverSupplies(index: number){
        let deliveryQuantity = index - supplies + 1;

        const currentPlayer = $players[$activePlayerIndex];
        if ( deliveryQuantity <= $players[$activePlayerIndex].supplies && currentPlayer.currentLocation === name && !$showBoat){

            players.update(currentPlayers => {
                let currentPlayer = currentPlayers[$activePlayerIndex];
                if (currentPlayer.supplies >= deliveryQuantity) {
                    currentPlayer.supplies -= deliveryQuantity;
                } /*else {
                    // Optional: Benachrichtigung an den Benutzer, dass nicht genügend Vorräte vorhanden sind
                    console.log("Nicht genügend Vorräte für die Lieferung.");
                }*/
                return currentPlayers;
            });

            boardConfig.update(fields => {
                let currentField = fields.find(f => f.name === name);
                if(currentField){
                    currentField.supplies = Math.min(currentField.supplies +deliveryQuantity ,capacity)
                }
                return fields;
            })

            const action: Action = {
                type: 'deliverSupplies',
                location: name,
                supplies: deliveryQuantity,
                freeAction: false // nur zum testen
            }
            addActionToCurrentTurn(action);
            // console.log(get(currentTurnActions))
        }
        /*else{
            console.log("Du hast NICHT genug Supplies, um diese Aktion ausführen zu können");
        }*/
    }

</script>

<!-- Würfel entsprechend der Kapazität und tatsächlichen Supplies -->
{#each Array(capacity) as _, index}
  {#if index < supplies}
    <SupplyCube 
      x={index * (cubeSize + cubeMargin)} 
      y={0} 
      size={cubeSize} 
      name={name} />
  {:else}
    <rect 
      x={index * (cubeSize + cubeMargin)} 
      y={0} 
      width={cubeSize} 
      height={cubeSize}
      fill="transparent"
      stroke="black"
      on:click={()=> deliverSupplies(index)}/>
  {/if}
{/each}