import type { Player } from "../Models/types";

export const initialPlayerData  = [
  {
    name: "Spieler 1",
    currentLocation: "Atlantis",
    color: "purple",
    image: '/survivor-male.png',
    supplies: 0,
    handCards: [], // Initialisiere mit leeren Handkarten, die später verteilt werden
  },
  {
    name: "Spieler 2",
    currentLocation: "Avalon",
    color: "orange",
    image: '/survivor-female.png',
    supplies: 0,
    handCards: [], // Initialisiere mit leeren Handkarten, die später verteilt werden
  },
];
