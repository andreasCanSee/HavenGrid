import { gameState } from "../Stores/gameStateStore";
// Funktion zur Änderung der Versorgungsgüter in einer Stadt
export function updateSuppliesInLocations(affectedLocations: string[], change: number | 'removeAll' | 'fillToCapacity') {
    gameState.update(state => {
      state.boardState = state.boardState.map(city => {
        // Überprüfen, ob die Stadt in der Liste der betroffenen Orte enthalten ist
        if (affectedLocations.includes(city.name)) {
          let newSupplies;
          if (change === 'removeAll') {
            newSupplies = 0;
          } else if (change === 'fillToCapacity') {
            newSupplies = city.capacity;
          } else {
            const reductionCount = change === -1 ? affectedLocations.filter(name => name === city.name).length : 1;
            newSupplies = Math.min(Math.max(city.supplies + change * reductionCount, 0), city.capacity);
          }
          return { ...city, supplies: newSupplies };
        }
        // Keine Änderung, wenn die Stadt nicht betroffen ist
        return city;
      });
      return state;
    });
  }
  