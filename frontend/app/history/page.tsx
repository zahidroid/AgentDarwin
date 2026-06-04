import { GenerationTimeline } from "@/components/generation-timeline";
import { PageHeader } from "@/components/page-header";
import { ScoreTrendChart } from "@/components/charts/score-trend-chart";
import { WinnerProgressChart } from "@/components/charts/winner-progress-chart";
import { getHistory } from "@/services/darwin-api";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const history = await getHistory();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="History"
        title="Evolution History"
        description="Generation timeline, winner movement, and score progression."
      />

      <section className="grid gap-5 xl:grid-cols-2">
        <WinnerProgressChart history={history} />
        <ScoreTrendChart history={history} />
      </section>

      <GenerationTimeline history={history} />
    </div>
  );
}
