import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type {
  AgentGenome,
  EvolutionHistoryItem,
  WinnerMemory,
  WinnerReasons,
} from "@/types/darwin";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWinnerName(memory?: WinnerMemory | null) {
  return memory?.winner ?? memory?.winner_name ?? memory?.agent_name ?? "Unknown";
}

export function getMemoryScore(memory?: WinnerMemory | null) {
  return Number(memory?.score ?? memory?.best_score ?? 0);
}

export function getHistoryScore(item?: EvolutionHistoryItem | null) {
  return Number(item?.best_score ?? item?.score ?? 0);
}

export function getHistoryWinner(item?: EvolutionHistoryItem | null) {
  return item?.winner ?? "Unknown";
}

export function getLatestMemory(memories: WinnerMemory[]) {
  return [...memories].sort((a, b) => b.generation - a.generation)[0] ?? null;
}

export function getBestScore(history: EvolutionHistoryItem[], memories: WinnerMemory[]) {
  const historyScores = history.map(getHistoryScore);
  const memoryScores = memories.map(getMemoryScore);
  return Math.max(0, ...historyScores, ...memoryScores);
}

export function formatScore(score: number) {
  return Number.isInteger(score) ? score.toString() : score.toFixed(1);
}

export function getGenomeValue(genome: AgentGenome | undefined, key: keyof AgentGenome) {
  const value = genome?.[key];
  return typeof value === "number" ? value : 0;
}

export function getStrengths(reasons?: WinnerReasons | null) {
  return Array.isArray(reasons?.strengths) ? reasons.strengths : [];
}

export function getImprovements(reasons?: WinnerReasons | null) {
  return Array.isArray(reasons?.improvements) ? reasons.improvements : [];
}
