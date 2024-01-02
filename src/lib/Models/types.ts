// Layout
export type Field = {
    name: string;
    x: number;
    y: number;
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