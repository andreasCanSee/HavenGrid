import type { Field, Line } from "../../Models/types";
import { initialBoardConfig } from "../../Stores/boardStore";
import { showBoat } from "../../Stores/boardStore";
import { tweened } from 'svelte/motion';
import { cubicOut, quadInOut } from 'svelte/easing';

export function calculateSvgDimensions(fields: Field[], gridSize: number) {
    const maxX = Math.max(...fields.map(field => field.x));
    const maxY = Math.max(...fields.map(field => field.y));
    return {
      width: (maxX)* gridSize,
      height: (maxY) * gridSize
    };
}

// Funktion zur Berechnung der Linienpositionen
export function calculateLines(fields: Field[], gridSize: number): Line[] {
    let lines: Line[] = [];
    fields.forEach(field => {
      field.connections.forEach(connection => {
        const target = fields.find(f => f.name === connection);
        if (target) {
          lines.push({
            x1: field.x * gridSize - gridSize / 2,
            y1: field.y * gridSize - gridSize / 2,
            x2: target.x * gridSize - gridSize / 2,
            y2: target.y * gridSize - gridSize / 2
          });
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