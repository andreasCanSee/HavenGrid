import { writable } from "svelte/store";
import type { GameHistoryEntry } from "../Models/types";

const gameHistory = writable<GameHistoryEntry[]>([]);

export const addHistoryEntry = (entry: GameHistoryEntry) => {
    gameHistory.update(history => [...history, entry]);
};

export const resetGameHistory = () => {
    gameHistory.set([]);
}

export default gameHistory;