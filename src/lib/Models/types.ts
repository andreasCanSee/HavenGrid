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
  playerDeck: DeckState<PlayerCard>;
  activePlayerIndex: number;
  infectionRate: number;
  outbreaks: number;
};

export type PlayerState = {
  playerIndex: number;
  currentLocation: string;
  supplies: number;
  handCards: PlayerHand;
}

export type FieldState = {
  name: string;
  supplies: number;
  hasSupplyCenter: boolean;
}

export type PlayerHand = {
  cityCards: CityCard[];
  actionCards: (EventCard | ProduceSuppliesCard)[];
}

export type Card = PlayerCard | InfectionCard;
export type PlayerCard = EpidemicCard | PlayerHandCard;
export type PlayerHandCard = CityCard | EventCard | ProduceSuppliesCard;

export type CityCard = {
    cardType: 'city';
    name: string;
    inBuildArea: boolean;
}

export type EventCard = {
  cardType: 'event',
  name: string,
  action: undefined
}

export type ProduceSuppliesCard = {
  cardType: 'produceSupplies',
  action: undefined
}

export type EpidemicCard = {
  cardType: 'epidemic',
  action: undefined
}

export type InfectionCard = {
  cardType: 'infection';
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