import type { Field } from './Models/types';
import { showBoat } from "./Stores/boardStore";
import { initialBoardConfig } from './Stores/boardStore';
import { tweened } from 'svelte/motion';
import { cubicOut, quadInOut } from 'svelte/easing';


export function findPath(currentLocation: string, target: string, boardConfig: Field[]): string[] {

   
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