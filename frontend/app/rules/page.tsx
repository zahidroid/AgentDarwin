import { RuleList } from "@/components/rule-list";
import { PageHeader } from "@/components/page-header";
import { TraitBarChart } from "@/components/charts/trait-bar-chart";
import { TraitRadarChart } from "@/components/charts/trait-radar-chart";
import {
  deriveTraitInsights,
  getAverageGenome,
} from "@/lib/insights";
import { getWinnerMemory, getRules } from "@/services/darwin-api";

export const dynamic = "force-dynamic";


export default async function RulesPage() {
  const memories = await getWinnerMemory();
  const rulesData = await getRules() as any;
  const insights = deriveTraitInsights(memories);
  const averageGenome = getAverageGenome(memories);

  // Map API rules to the component format
  const rules = [
    ...(rulesData.strengths || []).map((r: any) => ({
      label: r.label || r.trait || "Observed strength",
      count: r.count || 1,
      confidence: Math.min(100, Math.round(75 + (r.count || 1) * 5)),
    })),
    ...(rulesData.pitfalls || []).map((r: any) => ({
      label: r.label || "Observed pitfall",
      count: r.count || 1,
      confidence: Math.min(100, Math.round(60 + (r.count || 1) * 5)),
    }))
  ];

  // Sort by count descending
  rules.sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Rules"
        title="Rule Discovery"
        description="Recurring winner patterns and aggregate trait behavior extracted dynamically from live memory."
      />

      <RuleList rules={rules} insights={insights} />

      <section className="grid gap-5 xl:grid-cols-2">
        <TraitBarChart insights={insights} />
        <TraitRadarChart genome={averageGenome} title="Average Trait Genome" />
      </section>
    </div>
  );
}
