import { initialBoardState } from "../Models/initialBoardData";
import type { PlayerState } from "../Models/types";

export function findPath(currentLocation: string, target: string): string[] {

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
        const neighbors = initialBoardState.find(f => f.name === name)?.connections || [];
        neighbors.forEach((neighbor: string) => {
          if (!visited.has(neighbor)) {
            queue.push({ name: neighbor, path: path.concat(name) });
          }
        });
      }
    }

    return []; // Kein Pfad gefunden
  }

// Funktion zum Rotieren der Spielerliste
export function rotatePlayers(players: PlayerState[], activeIndex: number) {
   return [...players.slice(activeIndex), ...players.slice(0, activeIndex)];
}