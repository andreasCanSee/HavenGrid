// UI

export type Field = {
    name: string;
    coordinates: {
      x: number;
      y: number;
    };
    connections: string[];
    color: string;
    capacity: number;
    supplies: number;
    hasSupplyCenter: boolean;
};

export type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

// Geschäftslogik

export type Card = {
    cardType: string;
    data: {
      name: string;
      color: string;
    };
    inBuildArea: boolean;
  }

export type Action = {
  type: 'moveTo' | 'startAt' | 'makeSupply' | 'pickUpSupplies' | 'deliverSupplies' | 'transferSupplies' | 'sailTo' | 'charterBoatTo';
  location?: string;
  startLocation?: string;
  supplies?: number;
  freeAction: boolean;
  transactionPartner?: string;
}

export type Player = {
    name: string;
    currentLocation: string
    supplies: number;
    actionsHistory: Action[][];
    color: string;
    image: string;
    handCards: Card[]
}

export type GameHistoryEntry = {
  actionType: 'PlayerAction' | 'DrawCard' | 'Infect';
  timestamp: Date;
  details: PlayerActionDetails | DrawCardDetails | InfectDetails;
};

export type PlayerActionDetails = {
  player: Player; 
  action: Action;
};

export type DrawCardDetails = {
  player: Player; 
  cards: Card[];
};

export type InfectDetails = {
  cards: Card[];
};

/* 
    Interfaces sind in der Regel die beste Wahl, wenn du Objektstrukturen für Klassen 
    oder Objektliteralen definierst, die eine Implementierung haben könnten. 
    Interfaces unterstützen auch das Erweitern (Extending), was bei größeren Projekten nützlich sein kann.

    Types sind flexibler und können eine Vielzahl von Strukturen definieren, 
    einschließlich Unions und Tuples. 
    Sie sind nützlich, wenn du komplexe oder verbundene Typen definieren möchtest.
*/