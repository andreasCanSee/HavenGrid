
/*function handleIncreaseClick() {
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
}*/