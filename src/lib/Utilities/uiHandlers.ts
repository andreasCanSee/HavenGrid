export function handleFocus(event: FocusEvent) {
    const element = event.target as HTMLElement; // Casten zu HTMLElement
    element.blur(); // Entfernt den Fokus vom Element
  }

export function handleKeyPress(event: KeyboardEvent, action: () => void) {
    if (event.key === 'Enter' || event.key === ' ') {
      action();
    }
}