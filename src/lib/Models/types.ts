// UI
export type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export type ExtendedPlayerData = PlayerState & {
  color: string;
  image: string;
}
export type ExtendedFieldData = FieldState & {
  coordinates: {
    x: number;
    y: number;
  };
  connections: string[];
  color: string;
  capacity: number;
}

// Geschäftslogik

export type GameState = {
  boardState: FieldState[];
  infectionDeck: DeckState<InfectionCard>;
  players: PlayerState[];
  playerDeck: DeckState<CityCard>;
  activePlayerIndex: number;
  infectionRate: number;
  outbreaks: number;
};

export type PlayerState = {
  name: string;
  currentLocation: string
  supplies: number;
  handCards: CityCard[]
}

export type FieldState = {
  name: string;
  supplies: number;
  hasSupplyCenter: boolean;
}

export type Card = CityCard | InfectionCard;

export type CityCard = {
    cardType: string;
    data: {
      name: string;
      color: string;
    };
    inBuildArea: boolean;
}

  export type InfectionCard = {
    cardType: string;
    data: {
        name: string;  
        color: string;
    };
};

export type DeckState<T> = {
  deck: T[];
  discardPile: T[];
};

export type Action = {
  type: 'moveTo' | 'startAt' | 'makeSupply' | 'pickUpSupplies' | 'deliverSupplies' | 'transferSupplies' | 'sailTo' | 'charterBoatTo';
  location?: string;
  startLocation?: string;
  supplies?: number;
  freeAction: boolean;
  transactionPartner?: string;
}

/*
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
*/
/* 
    Interfaces sind in der Regel die beste Wahl, wenn du Objektstrukturen für Klassen 
    oder Objektliteralen definierst, die eine Implementierung haben könnten. 
    Interfaces unterstützen auch das Erweitern (Extending), was bei größeren Projekten nützlich sein kann.

    Types sind flexibler und können eine Vielzahl von Strukturen definieren, 
    einschließlich Unions und Tuples. 
    Sie sind nützlich, wenn du komplexe oder verbundene Typen definieren möchtest.
*/