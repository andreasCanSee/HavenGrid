const INFECTION_RATE_SEQUENCE = [2, 2, 2, 3, 3, 4];

// Funktion zum Erhöhen des Infektionsraten-Index
export function increaseInfectionIndex(currentIndex: number): number {
    const newIndex = currentIndex + 1;
    return newIndex < INFECTION_RATE_SEQUENCE.length ? newIndex : currentIndex;
  }

export function getCurrentInfectionRate(index: number): number {
    return INFECTION_RATE_SEQUENCE[index];
}

// Funktion zur Ermittlung der aktuellen und nächsten Infektionsrate
export function getInfectionRates(currentIndex: number): { current: number; next: number | 'MAX' } {
    const currentRate = getCurrentInfectionRate(currentIndex);
    const nextIndex = currentIndex + 1;
    const nextRate = nextIndex < INFECTION_RATE_SEQUENCE.length
      ? getCurrentInfectionRate(nextIndex)
      : 'MAX';
  
    return { current: currentRate, next: nextRate };
}