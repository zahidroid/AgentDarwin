import Link from "next/link";
import {
  Activity,
  BrainCircuit,
  ChartSpline,
  DatabaseZap,
  Dna,
  Layers3,
  Play,
  Trophy,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { ScoreTrendChart } from "@/components/charts/score-trend-chart";
import { LatestWinnerPanel } from "@/components/latest-winner-panel";
import {
  formatScore,
  getBestScore,
  getLatestMemory,
  getWinnerName,
} from "@/lib/utils";
import { getDashboardData } from "@/services/darwin-api";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { history, memories } = await getDashboardData();
  const latestMemory = getLatestMemory(memories);
  const bestScore = getBestScore(history, memories);

  const isImproving =
    history.length >= 2 &&
    Number(history[history.length - 1]?.best_score ?? 0) >
      Number(history[history.length - 2]?.best_score ?? 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Agent Darwin"
        title="Evolution Dashboard"
        description="Multi-generational evolutionary AI — watch agents learn, compete, and improve across generations."
        action={
          <Link
            href="/run"
            className="inline-flex items-center gap-2 rounded-lg bg-[#00d4aa] px-4 py-2.5 text-sm font-semibold text-[#08090c] shadow-lg shadow-[rgba(0,212,170,0.25)] hover:bg-[#00bfa0] hover:shadow-[rgba(0,212,170,0.4)] transition-all"
          >
            <Play className="size-4" />
            Run Evolution
          </Link>
        }
      />

      {/* ── Hero stats ────────────────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          accent="amber"
          icon={Trophy}
          label="Latest Winner"
          value={getWinnerName(latestMemory)}
          sub={latestMemory ? `Generation ${latestMemory.generation}` : undefined}
        />
        <StatCard
          accent="teal"
          icon={Activity}
          label="Best Score"
          value={formatScore(bestScore)}
          sub={isImproving ? "↑ Improving" : undefined}
        />
        <StatCard
          accent="violet"
          icon={Layers3}
          label="Generations Run"
          value={history.length}
          sub={history.length > 0 ? "Across all runs" : "No runs yet"}
        />
        <StatCard
          accent="rose"
          icon={DatabaseZap}
          label="Memories Stored"
          value={memories.length}
          sub="In winner memory"
        />
      </section>

      {/* ── Charts ────────────────────────────────────────────────────── */}
      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <LatestWinnerPanel memory={latestMemory} />
        <ScoreTrendChart history={history} />
      </section>

      {/* ── Genome heatmap teaser ─────────────────────────────────────── */}
      {memories.length > 0 && (
        <section className="rounded-xl border border-white/7 bg-[#111318] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Dna className="size-4 text-[#00d4aa]" />
            <h2 className="text-sm font-semibold text-[#f1f5f9]">
              Winner Genome Fingerprint
            </h2>
            <span className="ml-auto text-xs text-[#4a5568]">
              Score-weighted average of all winners
            </span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {(["creativity", "risk", "depth", "skepticism", "execution_focus"] as const).map(
              (trait) => {
                const avg = memories.length
                  ? Math.round(
                      memories.reduce(
                        (sum, m) => sum + Number(m.genome?.[trait] ?? 50),
                        0,
                      ) / memories.length,
                    )
                  : 50;
                const intensity = avg / 100;
                return (
                  <div key={trait} className="flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-lg border border-white/5 flex items-end justify-center overflow-hidden"
                      style={{ height: "80px" }}
                    >
                      <div
                        className="w-full rounded-t-md transition-all duration-700"
                        style={{
                          height: `${avg}%`,
                          background: `rgba(0, 212, 170, ${0.15 + intensity * 0.7})`,
                          boxShadow: `0 0 10px rgba(0, 212, 170, ${intensity * 0.4})`,
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-[#8892a4] text-center leading-tight capitalize">
                      {trait.replace("_", " ")}
                    </div>
                    <div className="text-xs font-bold text-[#00d4aa]">{avg}</div>
                  </div>
                );
              },
            )}
          </div>
        </section>
      )}

      {/* ── Quick nav ─────────────────────────────────────────────────── */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { href: "/history", icon: ChartSpline, title: "Evolution History",
            metric: `${history.length} generations`, color: "#8b5cf6" },
          { href: "/memory",  icon: DatabaseZap,  title: "Winner Memory",
            metric: `${memories.length} memories`,  color: "#00d4aa" },
          { href: "/rules",   icon: BrainCircuit, title: "Rule Discovery",
            metric: "Emergent patterns",             color: "#f59e0b" },
          { href: "/run",     icon: Play,         title: "Run Evolution",
            metric: "Execute pipeline",             color: "#f43f5e" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-xl border border-white/7 bg-[#111318] p-5 transition-all duration-200 hover:bg-[#161921] hover:border-white/14 hover:-translate-y-0.5"
          >
            <div
              className="mb-3 inline-flex rounded-lg p-2.5"
              style={{ background: `${item.color}18` }}
            >
              <item.icon className="size-4" style={{ color: item.color }} />
            </div>
            <div className="text-sm font-semibold text-[#f1f5f9] mb-1">{item.title}</div>
            <div className="text-xs text-[#8892a4]">{item.metric}</div>
          </Link>
        ))}
      </section>
    </div>
  );
}
