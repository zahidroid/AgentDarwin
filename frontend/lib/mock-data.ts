import type {
  EvolutionHistoryItem,
  RunEvolutionResponse,
  WinnerMemory,
} from "@/types/darwin";

export const mockHistory: EvolutionHistoryItem[] = [
  { generation: 1, winner: "Agent_2",     best_score: 74 },
  { generation: 2, winner: "Child_G2_1",  best_score: 83 },
  { generation: 3, winner: "Child_G3_2",  best_score: 88 },
  { generation: 4, winner: "Child_G4_1",  best_score: 91 },
  { generation: 5, winner: "Child_G5_3",  best_score: 96 },
];

export const mockWinnerMemory: WinnerMemory[] = [
  {
    generation: 1,
    winner: "Agent_2",
    score: 74,
    genome: { name: "Agent_2", creativity: 72, risk: 44, depth: 81, skepticism: 59, execution_focus: 76 },
    reasons: {
      strengths: [
        "Comprehensive AI integration across all core features.",
        "Strong execution path with defined milestones.",
      ],
      improvements: [
        "Include specific KPIs and measurable success metrics.",
        "Provide concrete pricing tiers with example price points.",
      ],
    },
  },
  {
    generation: 2,
    winner: "Child_G2_1",
    score: 83,
    genome: { name: "Child_G2_1", creativity: 78, risk: 47, depth: 84, skepticism: 62, execution_focus: 82 },
    reasons: {
      strengths: [
        "Hyper-personalization through adaptive learning paths.",
        "Comprehensive AI integration across all core features.",
      ],
      improvements: [
        "Include specific KPIs and measurable success metrics.",
        "Add explicit competitive landscape analysis naming specific competitors.",
      ],
    },
  },
  {
    generation: 3,
    winner: "Child_G3_2",
    score: 88,
    genome: { name: "Child_G3_2", creativity: 82, risk: 51, depth: 88, skepticism: 66, execution_focus: 86 },
    reasons: {
      strengths: [
        "Hyper-personalization through adaptive learning paths.",
        "Granular and actionable AI-driven feedback.",
      ],
      improvements: [
        "Provide concrete pricing tiers with example price points.",
        "Include specific KPIs and measurable success metrics.",
      ],
    },
  },
  {
    generation: 4,
    winner: "Child_G4_1",
    score: 91,
    genome: { name: "Child_G4_1", creativity: 85, risk: 54, depth: 91, skepticism: 68, execution_focus: 90 },
    reasons: {
      strengths: [
        "Granular and actionable AI-driven feedback.",
        "Robust business model with scalable B2B partnerships.",
      ],
      improvements: [
        "Add explicit competitive landscape analysis naming specific competitors.",
        "Elaborate on go-to-market strategy for acquiring individual users.",
      ],
    },
  },
  {
    generation: 5,
    winner: "Child_G5_3",
    score: 96,
    genome: { name: "Child_G5_3", creativity: 89, risk: 57, depth: 93, skepticism: 71, execution_focus: 92 },
    reasons: {
      strengths: [
        "Hyper-personalization through adaptive learning paths.",
        "Granular and actionable AI-driven feedback.",
        "Robust business model with scalable B2B partnerships.",
      ],
      improvements: [
        "Include specific KPIs and measurable success metrics.",
        "Deeper ethical AI considerations beyond bias.",
      ],
    },
  },
];

export function createMockRunResult(task: string, generations: number): RunEvolutionResponse {
  const history = mockHistory.slice(0, Math.max(1, Math.min(generations, mockHistory.length)));
  const winnerMemory = mockWinnerMemory.slice(0, history.length);
  const best = winnerMemory[winnerMemory.length - 1];

  return {
    task,
    generations,
    winner: best?.winner ?? "Child_G5_3",
    best_score: best?.score ?? 96,
    history,
    winner_memory: winnerMemory,
  };
}
