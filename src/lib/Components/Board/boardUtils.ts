import type { Line } from "../../Models/types";
import { initialBoardState } from "../../Models/initialBoardData";
import { showBoat } from "../../Stores/uiStore";
import { tweened } from 'svelte/motion';
import { cubicOut, quadInOut } from 'svelte/easing';
import { gridSize } from "./config";

export function calculateSvgDimensions(gridSize: number) {
    const maxX = Math.max(...initialBoardState.map(field => field.coordinates.x));
    const maxY = Math.max(...initialBoardState.map(field => field.coordinates.y));
    return {
      width: (maxX)* gridSize,
      height: (maxY) * gridSize
    };
}

// Funktion zur Berechnung der Linienpositionen
export function calculateLines(gridSize: number): Line[] {
    let lines: Line[] = [];
    let processedConnections = new Set();
    let fieldsMap = new Map(initialBoardState.map(field => [field.name, field]));

    initialBoardState.forEach(field => {
      field.connections.forEach(connection => {
        const connectionKey = `${field.name}-${connection}`;
        const reverseConnectionKey = `${connection}-${field.name}`;
        if (!processedConnections.has(connectionKey) && !processedConnections.has(reverseConnectionKey)) {
            const target = fieldsMap.get(connection);
            if (target) {
              lines.push({
                x1: field.coordinates.x * gridSize - gridSize / 2,
                y1: field.coordinates.y * gridSize - gridSize / 2,
                x2: target.coordinates.x * gridSize - gridSize / 2,
                y2: target.coordinates.y * gridSize - gridSize / 2
              });

              processedConnections.add(connectionKey);
              processedConnections.add(reverseConnectionKey);
            }
        }
      });
    });
    return lines;
  }

  export function createCurvePath(line: Line): string {
    const midX = (line.x1 + line.x2) / 2;
    const midY = (line.y1 + line.y2) / 2;

    // Bestimmung der Richtung der Krümmung
    const isVertical = Math.abs(line.x1 - line.x2) < Math.abs(line.y1 - line.y2);
    const curveIntensity = Math.max(Math.abs(line.x1 - line.x2), Math.abs(line.y1 - line.y2)) / 6;
    
    // Krümmungspunkt
    let curveX = midX;
    let curveY = midY;

    if (isVertical) {
        // Vertikale Linie: Krümmung nach rechts
        curveX += curveIntensity;
    } else {
        // Horizontale Linie: Krümmung nach unten
        curveY += curveIntensity;
    }

    return `M ${line.x1} ${line.y1} Q ${curveX} ${curveY}, ${line.x2} ${line.y2}`;
    }

    export function getCoordinates(locationName: string): { x: number; y: number } | null {
      const location = initialBoardState.find(f => f.name === locationName);
        if (location) {
            return { 
                x: location.coordinates.x * gridSize - gridSize / 2, 
                y: location.coordinates.y * gridSize - gridSize / 2 
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
      actionType: 'moveTo' | 'sailTo' | 'charterBoatTo' // Neuer Parameter
    ): Promise<void> {
        return new Promise((resolve) => {
            const startCoordinates = getCoordinates(startLocation);
            const endCoordinates = getCoordinates(endLocation);
    
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