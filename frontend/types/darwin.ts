export type AgentGenome = {
  name?: string;
  creativity?: number;
  risk?: number;
  depth?: number;
  skepticism?: number;
  execution_focus?: number;
};

export type WinnerReasons = {
  strengths?: string[];
  improvements?: string[];
  [key: string]: unknown;
};

export type WinnerMemory = {
  generation: number;
  winner?: string;
  winner_name?: string;
  agent_name?: string;
  score?: number;
  best_score?: number;
  genome?: AgentGenome;
  reasons?: WinnerReasons | null;
};

export type EvolutionHistoryItem = {
  generation: number;
  winner?: string;
  best_score?: number;
  score?: number;
  timestamp?: string;
};

export type RunEvolutionRequest = {
  task: string;
  generations: number;
};

export type RunEvolutionResponse = {
  task: string;
  generations: number;
  winner: string | null;
  best_score: number;
  history: EvolutionHistoryItem[];
  winner_memory: WinnerMemory[];
};

export type DashboardData = {
  history: EvolutionHistoryItem[];
  memories: WinnerMemory[];
};

export type DiscoveredRule = {
  label: string;
  count: number;
  confidence: number;
};

export type TraitInsight = {
  trait: keyof AgentGenome;
  label: string;
  value: number;
  summary: string;
};

// ── Analytics types (Phase 1) ───────────────────────────────────────────────

export type TraitEvolutionPoint = {
  generation: number;
  creativity: number | null;
  risk: number | null;
  depth: number | null;
  skepticism: number | null;
  execution_focus: number | null;
};

export type DiversityPoint = {
  generation: number;
  diversity_score: number | null;
  population_min: number | null;
  population_max: number | null;
  population_mean: number | null;
};

export type AnalyticsMeta = {
  tasks: string[];
  enriched_generations: number;
  legacy_generations: number;
};

export type AnalyticsData = {
  trait_evolution: TraitEvolutionPoint[];
  diversity_series: DiversityPoint[];
  total_generations: number;
  meta: AnalyticsMeta;
};
