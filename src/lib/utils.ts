import type { FieldConfig } from "../lib/boardStore";
import { showBoat } from "./boardStore";
import { initialBoardConfig } from '../lib/boardStore';
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


// Annahme: Diese Konstante repräsentiert die Dauer der Animation in Millisekunden
const ANIMATION_DURATION = 2000;

export function animateFerry(
  startLocation: string, 
  endLocation: string, 
  gridSize: number,
  actionType: 'moveTo' | 'sailTo' | 'charterBoatTo' // Neuer Parameter
): Promise<void> {
    return new Promise((resolve) => {
        const startCoordinates = getCoordinates(startLocation, gridSize);
        const endCoordinates = getCoordinates(endLocation, gridSize);

        let imageFile: string;

        switch (actionType){
          case 'sailTo':
            imageFile = '/ship.png';
            break;
          case 'charterBoatTo':
            imageFile = '/cruiser.png';
            break;
          default:
            imageFile = '/boat.png'
        }

        if (startCoordinates && endCoordinates) {
            showBoat.set(true); // Boot anzeigen

            const scaleX = startCoordinates.x > endCoordinates.x ? 1 : -1;

            // Anpassung der Startkoordinaten für die Animation
            startCoordinates.x -= scaleX * 15;
            startCoordinates.y -= 15;
            endCoordinates.x -= 15 * scaleX;
            endCoordinates.y -= 15;
  
            // Startposition setzen und Animation sofort starten
            animatedPlayerPosition.set(
                { x: startCoordinates.x, y: startCoordinates.y, scaleX, imageFile }, 
                { duration: 0 }
            );

            // Animiere zur Endposition
            animatedPlayerPosition.set(
                { x: endCoordinates.x, y: endCoordinates.y, scaleX, imageFile }
            );

            // Setzen Sie die Dauer entsprechend der Animationsdauer
            setTimeout(() => {
                showBoat.set(false); // Boot ausblenden
                resolve(); // Promise auflösen, wenn die Animation endet
            }, ANIMATION_DURATION);
        } else {
            resolve(); // Sofort auflösen, wenn keine Animation erforderlich ist
        }
    });
}

export const animatedPlayerPosition = tweened({ x: 0, y: 0,  scaleX: -1, imageFile: '/boat.png' }, { duration: 2000, easing: quadInOut });