import type { ExtendedPlayerData } from "../Models/types";

export const initialPlayerData: ExtendedPlayerData[] = (() => {
  const players = [
    {
      name: "Spieler 1",
      currentLocation: "Atlantis",
      color: "purple",
      image: '/survivor-male.png',
      supplies: 0,
      handCards: [],
    },
    {
      name: "Spieler 2",
      currentLocation: "Avalon",
      color: "orange",
      image: '/survivor-female.png',
      supplies: 0,
      handCards: [],
    },
    // Weitere Spieler können hier hinzugefügt werden
  ];

  return players.map((player, index) => ({ ...player, playerIndex: index }));
})();