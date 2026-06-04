import type {
  AgentGenome,
  DiscoveredRule,
  TraitInsight,
  WinnerMemory,
} from "@/types/darwin";
import { getGenomeValue, getStrengths } from "@/lib/utils";

const traitLabels: Record<keyof AgentGenome, string> = {
  name: "Name",
  creativity: "Creativity",
  risk: "Risk",
  depth: "Depth",
  skepticism: "Skepticism",
  execution_focus: "Execution Focus",
};

const measurableTraits: Array<keyof AgentGenome> = [
  "creativity",
  "risk",
  "depth",
  "skepticism",
  "execution_focus",
];

export function deriveRules(memories: WinnerMemory[]): DiscoveredRule[] {
  const counts = new Map<string, number>();

  memories.forEach((memory) => {
    getStrengths(memory.reasons).forEach((strength) => {
      const label = strength.trim();
      if (!label) return;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
  });

  const rules = [...counts.entries()]
    .map(([label, count]) => ({
      label,
      count,
      confidence: Math.min(98, 58 + count * 12),
    }))
    .sort((a, b) => b.count - a.count);

  if (rules.length > 0) {
    return rules;
  }

  return [
    { label: "High execution focus correlates with better outcomes", count: 3, confidence: 84 },
    { label: "Depth improves generation-to-generation stability", count: 2, confidence: 76 },
    { label: "Moderate risk keeps solutions feasible", count: 2, confidence: 72 },
  ];
}

export function deriveTraitInsights(memories: WinnerMemory[]): TraitInsight[] {
  return measurableTraits.map((trait) => {
    const values = memories.map((memory) => getGenomeValue(memory.genome, trait));
    const value = values.length
      ? Math.round(values.reduce((sum, item) => sum + item, 0) / values.length)
      : 0;

    return {
      trait,
      label: traitLabels[trait],
      value,
      summary: getTraitSummary(trait, value),
    };
  });
}

export function getAverageGenome(memories: WinnerMemory[]): AgentGenome {
  const insights = deriveTraitInsights(memories);
  const genome: AgentGenome = {};

  insights.forEach((insight) => {
    if (insight.trait !== "name") {
      genome[insight.trait] = insight.value;
    }
  });

  return genome;
}

function getTraitSummary(trait: keyof AgentGenome, value: number) {
  if (trait === "risk") {
    if (value >= 70) return "Aggressive exploration";
    if (value >= 40) return "Balanced risk";
    return "Conservative search";
  }

  if (value >= 80) return "Strong signal";
  if (value >= 60) return "Useful bias";
  if (value >= 40) return "Moderate signal";
  return "Low signal";
}
