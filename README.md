# Pandemic Legacy Season 2 Prologue

## Project Background
This project is a web application that recreates the prologue of "Pandemic Legacy Season 2." Developed with Svelte and TypeScript, it represents my first foray into TypeScript. Inspired by my passion for cooperative board games and the challenge of maintaining the game experience for my friends and me between our infrequent meetups, this app aims to make the prologue of the game, which becomes inaccessible after the game starts, digitally available.

The "Pandemic" board game is a cooperative game where players work together as members of a disease control team to manage outbreaks and save the world from four deadly diseases. "Pandemic Legacy: Season 2" is a sequel and standalone game set in the same universe, featuring an evolving narrative and gameplay that changes over time, set in a post-apocalyptic world where players face new challenges and a unique storyline that unfolds over a year of gameplay.

## Key Facts

- All Player Actions (somewhat) Implemented: ✅ [Full Rulebook](https://images-cdn.zmangames.com/us-east-1/filer_public/38/ec/38ec25b0-821b-4c2e-b925-27c)
    - DRIVE / FERRY
        - Move to an adjacent location connected by a line
    - SAIL
        - Discard a card to move to the city named on the card, provided you can trace a sea route to it
    - CHARTER BOAT
        - Discard the City card that matches your current city to move to any location, provided you can trace a sea route to it
    - MAKE SUPPLIES
        - Take 1 Supply cube from the stockpile and put it onto your Character card
    - DELIVER SUPPLIES
        - Put as many Supply cubes as you like from your Character card into your location
    - SHARE KNOWLEDGE
        - Give a City card that matches the city you are in to another player, or take a City card that matches the city you are in from another player. The other player must also be in the city with you. 
    - BUILD SUPPLY CENTER
        -  Discard 5 cards matching your current city’s color. Take a supply center and place it into that city.
    - FREE ACTIONS
        - PICK UP SUPPLIES: Take as many Supply cubes as you like from your location and put them onto your Character card
        - TRANSFER SUPPLIES: Give as many Supply cubes as you like to a player in your location or take as many Supply cubes as you like from that player 
- **Game Board as SVG**: A new challenge for me was to recreate the board game in digital form
- **DALL-E Generated Images**: All graphics used are created by DALL-E

![Vorschau des Projekts](/static/preview.png)


## Project Structure

### Game Board Visualization and Interaction
 
**Board Components (`Board.svelte`, `BoardLayout.svelte`):** These form the heart of the game's visual interface. `Board.svelte` dynamically overlays game states onto the board, while `BoardLayout.svelte`  is responsible for the static aspects of the game board.

**Field Components (`Field.svelte`, `Location.svelte`, etc.):**
They represent individual locations on the board, handling both the display (labels, supply areas) and player interactions (like moving and action execution).

### Player Interaction and Management
**Player Dashboard (`PlayerDashboard.svelte`):** This is a central hub for player interactions, bifurcating into areas like PlayerSupplyArea for managing player supplies and CardManagementArea for handling player cards.

**City Cards and Build Area:** These components manage specific player actions like building supply centers, showcasing some creative approach to UI design with features like sliders for confirming construction actions.

### Game Logic and Mechanics
**Action Handlers (`actionUtils.ts`, `playerMovements.ts`, etc.):** These scripts define the logic for each player action, crucial for the game mechanics.

**Deck Management (`deckInitialization.ts`, `playerDeck.ts`, etc.):** They handle the initialization and dynamics of the game decks, a core part of Pandemic's gameplay.

### Advanced State Management
**GameState Store:** It serves as a 'single source of truth', tracking all the dynamic elements of a game session for robust state management.

**TurnState Store:** This store captures the sequence of actions in a turn, allowing for features like undoing actions. It employs a player-agnostic approach and an efficient data structure.

## Current Development

📌  **Integration of TailwindCSS**: To replace the provisional inline styling.

📌 **Disease and Epidemic Mechanics**: A key game component yet to be realized.

📌  **Implementation of Victory/Loss Conditions**: Adding these elements will complete the game loop, bringing it closer to the original board game experience.

📌  **Event Cards and Character Abilities**: Game elements still to be implemented, will introduce more depth and variety to the gameplay.

📌 **GameHistory Store:** For a complete tracking of the game progression.