<script>
import { setupNewGame } from '../GameLogic/setupGame';
</script>
  
  <header class="flex justify-between items-center p-4 bg-blue-500 text-white">
    <h1 class="text-xl font-bold">
      Pandemic Legacy Season 2: <span class="text-red-700">Prolog</span>
    </h1>
    <div>
      <a href="https://images-cdn.zmangames.com/us-east-1/filer_public/38/ec/38ec25b0-821b-4c2e-b925-27c4a4038acd/pandemic_legacy_season_2_rules.pdf" class="mr-4 underline" target="_blank" rel="noopener noreferrer">Regeln</a>
      <button on:click={setupNewGame} class="bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded">
        Neustart
      </button>
    </div>
  </header>
  