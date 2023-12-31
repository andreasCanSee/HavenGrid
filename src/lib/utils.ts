import type { FieldConfig } from "./store";
import { showBoat, initialBoardConfig } from "./store";
import { tweened } from 'svelte/motion';
import { cubicOut, quadInOut } from 'svelte/easing';


export function findPath(currentLocation: string, target: string, boardConfig: FieldConfig[]): string[] {

   
    interface QueueItem {
      name: string;
      path: string[];
    }

    let queue: QueueItem[] = [{ name: currentLocation, path: [] }];
    let visited = new Set();

    while (queue.length > 0) {
      let { name, path } = queue.shift() as QueueItem;

      if (name === target) {
        return path.concat(name).slice(1); // Pfad gefunden
      }

      if (!visited.has(name)) {
        visited.add(name);
        const neighbors = boardConfig.find(f => f.name === name)?.connections || [];
        neighbors.forEach((neighbor: string) => {
          if (!visited.has(neighbor)) {
            queue.push({ name: neighbor, path: path.concat(name) });
          }
        });
      }
    }

    return []; // Kein Pfad gefunden
  }

  export function getCoordinates(locationName: string, gridSize: number): { x: number; y: number } | null {
    const location = initialBoardConfig.find(f => f.name === locationName);
    if (location) {
        return { 
            x: location.x * gridSize - gridSize / 2, 
            y: location.y * gridSize - gridSize / 2 
        };
    } else {
        return null;
    }
}

export function animateFerry(
  startLocation: string, 
  endLocation: string, 
  gridSize: number
  ) {
    const startCoordinates = getCoordinates(startLocation, gridSize);
    const endCoordinates = getCoordinates(endLocation, gridSize);

    if (startCoordinates && endCoordinates) {
      showBoat.set(true); // Boot anzeigen

      const scaleX = startCoordinates.x > endCoordinates.x ? 1 : -1;


      startCoordinates.x -= scaleX * 15;
      startCoordinates.y -= 15;
      endCoordinates.x -= 15 * scaleX;
      endCoordinates.y -= 15;
  
      animatedPlayerPosition.set(
        { x: startCoordinates.x, y: startCoordinates.y, scaleX }, // Hier wird scaleX gesetzt
        { duration: 0 }
      );
        animatedPlayerPosition.set({ x: endCoordinates.x, y: endCoordinates.y, scaleX }).then(() => {
            showBoat.set(false); // Boot ausblenden
        });
    }
}

export const animatedPlayerPosition = tweened({ x: 0, y: 0,  scaleX: -1 }, { duration: 2000, easing: quadInOut });