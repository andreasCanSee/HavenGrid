<script>
    import Board from '../lib/Board.svelte';
    import { currentLocation, moveHistory } from '$lib/store';

    function undoLastMove() {
        moveHistory.update(history => {
        if (history.length > 1) {
            // Setze die currentLocation auf den vorletzten Standort
            currentLocation.set(history[history.length - 2]);
            return history.slice(0, -1);
        }
        return history;
        });
  }
  </script>
  
  <header>
    <h1>Pandemic Legacy Season 2 Prolog</h1>
  </header>
 
  <main>
    <Board />
    <div>
        <p>Verbleibende Züge: {5 - $moveHistory.length}</p>
        <button on:click={undoLastMove}>Umkehren</button>
      </div>
  </main>

  <style>
    main {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh; /* oder eine andere passende Höhe */
    }
  </style>