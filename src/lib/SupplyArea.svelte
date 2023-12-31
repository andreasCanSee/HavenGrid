<script lang="ts">
    import SupplyCube from "./SupplyCube.svelte";
    import { players, activePlayerIndex, addActionToCurrentTurn, boardConfig, showBoat } from '../lib/store';
    import type { Action } from '../lib/player';

    export let capacity: number;
    export let supplies: number;
    export let name: string;
    export let size: number;

      // Berechnungen für die Würfel
    const cubeSize = 15; // Größe eines Würfels
    const cubeMargin = 5; // Abstand zwischen den Würfeln
    const cubeY = size / 2 - 40; // Y-Position der Würfel
    const cubeXStart = size / 2 - (1.5 * cubeSize + cubeMargin); // X-Startposition für die Würfel

    function deliverSupplies(index: number){
        let deliveryQuantity = index - supplies + 1;
        if ( deliveryQuantity <= $players[$activePlayerIndex].supplies && !$showBoat){

            players.update(currentPlayers => {
                let currentPlayer = currentPlayers[$activePlayerIndex];
                if (currentPlayer.supplies >= deliveryQuantity) {
                    currentPlayer.supplies -= deliveryQuantity;
                } else {
                    // Optional: Benachrichtigung an den Benutzer, dass nicht genügend Vorräte vorhanden sind
                    console.log("Nicht genügend Vorräte für die Lieferung.");
                }
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
        else{
            console.log("Du hast NICHT genug Supplies, um diese Aktion ausführen zu können");
        }
    }

</script>

<!-- Würfel entsprechend der Kapazität und tatsächlichen Supplies -->
{#each Array(capacity) as _, index}
  {#if index < supplies}
    <SupplyCube 
      x={cubeXStart + index * (cubeSize + cubeMargin)} 
      y={cubeY} 
      size={cubeSize} 
      name={name} />
  {:else}
    <rect 
      x={cubeXStart + index * (cubeSize + cubeMargin)} 
      y={cubeY} 
      width={cubeSize} 
      height={cubeSize}
      fill="transparent"
      stroke="black"
      on:click={()=> deliverSupplies(index)}/>
  {/if}
{/each}