<script lang="ts">

    import { players, activePlayerIndex, addActionToCurrentTurn, boardConfig, showBoat } from '../lib/store';
    import type { Action } from '../lib/player';

    export let x: number;
    export let y: number;
    export let size: number;
    export let name: string;
  
    function pickUpSupplies() {
        if ($players[$activePlayerIndex].currentLocation === name && !$showBoat) {
        // Aktion hinzufügen
        const action: Action = {
            type: 'pickUpSupplies',
            location: name,
            freeAction: true
        };
        addActionToCurrentTurn(action);

        players.update(currentPlayers => {
            let updatedPlayers = [...currentPlayers];
            updatedPlayers[$activePlayerIndex].supplies += 1;
            return updatedPlayers;
        });

        boardConfig.update(fields => {
            let updatedFields = [...fields];
            let fieldToUpdate = updatedFields.find(f => f.name === name);

            if (fieldToUpdate) {
                fieldToUpdate.supplies -= 1; 
            }

            return updatedFields;
            });
        }
    }

  </script>
  
  <rect x={x} y={y} width={size} height={size}
        fill="firebrick"
        stroke="firebrick"
        on:click={pickUpSupplies}
 />