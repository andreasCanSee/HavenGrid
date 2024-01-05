export function drawCards<T>(deck: T[], count: number): [T[], T[]] {
    const drawnCards = deck.slice(-count);
    const remainingDeck = deck.slice(0, -count);
    return [remainingDeck, drawnCards];
}

export function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Tausche Elemente
    }
    return array;
}