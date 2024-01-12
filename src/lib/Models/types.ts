// UI

export type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export type ExtendedPlayerData = PlayerState & {
  name: string;
  color: string;
  image: string;
  playerIndex?: number;
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
  playerIndex: number;
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
  type: 'moveTo' | 'startAt' | 'makeSupply' | 'pickUpSupplies' | 'deliverSupplies' | 'transferSupplies' | 'sailTo' | 'charterBoatTo' | 'exchangeCard' | 'buildSupplyCenter' | 'discardCard';
  location?: string;
  startLocation?: string;
  supplies?: number;
  freeAction: boolean;
  transferringPlayerIndex?: number;
  receivingPlayerIndex?: number;
  cards?: CityCard[]
}