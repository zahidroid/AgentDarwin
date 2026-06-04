import type { Metadata } from "next";
import {
  Activity,
  BrainCircuit,
  Dna,
  GitBranch,
  Layers3,
  TrendingUp,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { TraitEvolutionChart } from "@/components/charts/trait-evolution-chart";
import { DiversityChart } from "@/components/charts/diversity-chart";
import { FitnessLandscape } from "@/components/charts/fitness-landscape";
import { getAnalytics, getWinnerMemory } from "@/services/darwin-api";
import type { TraitEvolutionPoint } from "@/types/darwin";

export const metadata: Metadata = {
  title: "Genome Explorer",
  description:
    "Observe how agent traits evolve across generations. Track creativity, depth, risk, and execution focus as Darwin's population converges toward higher-fitness solutions.",
};

// Opt out of static rendering — this page fetches live data from the backend
export const dynamic = "force-dynamic";

// ── Trait label map ──────────────────────────────────────────────────────────
const TRAIT_META: {
  key: keyof Omit<TraitEvolutionPoint, "generation">;
  label: string;
  color: string;
  desc: string;
}[] = [
  { key: "creativity",      label: "Creativity",      color: "#00d4aa", desc: "Novel approach generation" },
  { key: "depth",           label: "Depth",           color: "#8b5cf6", desc: "Analytical thoroughness"    },
  { key: "execution_focus", label: "Execution",       color: "#f59e0b", desc: "Implementation clarity"     },
  { key: "risk",            label: "Risk",            color: "#f43f5e", desc: "Exploration vs exploitation" },
  { key: "skepticism",      label: "Skepticism",      color: "#38bdf8", desc: "Critical evaluation"        },
];

// ── Winning Trait Patterns (bar chart as inline component) ──────────────────
// Takes the latest enriched trait snapshot and renders horizontal bars —
// no chart library needed, keeping the render server-side.
function WinningTraitPatterns({ latest }: { latest: TraitEvolutionPoint | null }) {
  if (!latest) {
    return (
      <div className="rounded-xl border border-white/7 bg-[#111318] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Dna className="size-4 text-[#00d4aa]" />
          <h2 className="text-sm font-semibold text-[#f1f5f9]">Winning Trait Snapshot</h2>
          <span className="ml-auto text-[10px] text-[#4a5568] uppercase tracking-wider">Latest winner</span>
        </div>
        <div className="flex items-center justify-center h-32 text-xs text-[#4a5568]">
          No winner genome yet — run an evolution first
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-5">
      <div className="flex items-center gap-2 mb-5">
        <Dna className="size-4 text-[#00d4aa]" />
        <h2 className="text-sm font-semibold text-[#f1f5f9]">Winning Trait Snapshot</h2>
        <span className="ml-auto text-[10px] text-[#4a5568] uppercase tracking-wider">
          Generation {latest.generation}
        </span>
      </div>

      <div className="space-y-4">
        {TRAIT_META.map(({ key, label, color, desc }) => {
          const raw = latest[key];
          const value = raw !== null && raw !== undefined ? Math.round(Number(raw)) : null;

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-xs font-semibold text-[#f1f5f9]">{label}</span>
                  <span className="ml-2 text-[10px] text-[#4a5568]">{desc}</span>
                </div>
                <span
                  className="text-xs font-bold tabular-nums"
                  style={{ color }}
                >
                  {value !== null ? value : "—"}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: value !== null ? `${value}%` : "0%",
                    background: color,
                    boxShadow: value !== null ? `0 0 8px ${color}60` : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Genome Heatmap — all winner genomes across generations ──────────────────
// Rows = generations, columns = traits. Cell colour = trait intensity.
function GenomeHeatmap({ points }: { points: TraitEvolutionPoint[] }) {
  if (points.length === 0) {
    return (
      <div className="rounded-xl border border-white/7 bg-[#111318] p-5">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="size-4 text-[#f59e0b]" />
          <h2 className="text-sm font-semibold text-[#f1f5f9]">Genome Heatmap</h2>
          <span className="ml-auto text-[10px] text-[#4a5568] uppercase tracking-wider">All generations</span>
        </div>
        <div className="flex items-center justify-center h-24 text-xs text-[#4a5568]">
          No genome data — run an evolution first
        </div>
      </div>
    );
  }

  const traits = TRAIT_META.map((t) => t.key);

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-5 overflow-x-auto">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="size-4 text-[#f59e0b]" />
        <h2 className="text-sm font-semibold text-[#f1f5f9]">Genome Heatmap</h2>
        <span className="ml-auto text-[10px] text-[#4a5568] uppercase tracking-wider">
          Rows = generations · Columns = traits
        </span>
      </div>

      {/* Header row */}
      <div className="grid gap-1.5 mb-2" style={{ gridTemplateColumns: "48px repeat(5, 1fr)" }}>
        <div />
        {TRAIT_META.map(({ label, color }) => (
          <div
            key={label}
            className="text-center text-[9px] font-semibold uppercase tracking-wider"
            style={{ color }}
          >
            {label.slice(0, 5)}
          </div>
        ))}
      </div>

      {/* Data rows — one per generation */}
      <div className="space-y-1">
        {points.map((p) => (
          <div
            key={p.generation}
            className="grid gap-1.5 items-center"
            style={{ gridTemplateColumns: "48px repeat(5, 1fr)" }}
          >
            <div className="text-[9px] text-[#4a5568] font-mono text-right pr-1">G{p.generation}</div>
            {traits.map((key, idx) => {
              const raw = p[key];
              const val = raw !== null && raw !== undefined ? Number(raw) : 0;
              const intensity = val / 100;
              const color = TRAIT_META[idx].color;

              return (
                <div
                  key={key}
                  className="h-6 rounded-md flex items-center justify-center text-[9px] font-bold"
                  title={`${TRAIT_META[idx].label}: ${val}`}
                  style={{
                    background: raw !== null
                      ? `${color}${Math.round(15 + intensity * 50).toString(16).padStart(2, "0")}`
                      : "rgba(255,255,255,0.03)",
                    boxShadow: raw !== null && intensity > 0.6
                      ? `0 0 6px ${color}40`
                      : "none",
                    color: raw !== null ? color : "#2d3748",
                  }}
                >
                  {raw !== null ? Math.round(val) : "·"}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 flex-wrap">
        <span className="text-[9px] text-[#4a5568] uppercase tracking-wider">Intensity →</span>
        {[0, 25, 50, 75, 100].map((v) => (
          <div key={v} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded"
              style={{ background: `rgba(0, 212, 170, ${0.15 + (v / 100) * 0.7})` }}
            />
            <span className="text-[9px] text-[#4a5568]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function GenomePage() {
  const [analytics, memories] = await Promise.all([
    getAnalytics(),
    getWinnerMemory(),
  ]);

  const { trait_evolution, diversity_series, total_generations, meta } = analytics;

  // Latest enriched point (null means no runs yet or legacy history only)
  const latestEnriched =
    [...trait_evolution].reverse().find((p) => p.creativity !== null) ?? null;

  // Latest diversity for the stat card
  const latestDiversity =
    [...diversity_series]
      .reverse()
      .find((p) => p.diversity_score !== null)?.diversity_score ?? null;

  // Score improvement: compare first vs last enriched score from memories
  const scores = memories.map((m) => Number(m.score ?? m.best_score ?? 0));
  const scoreImprovement =
    scores.length >= 2
      ? Math.round(scores[scores.length - 1] - scores[0])
      : null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Genome Explorer"
        title="Trait Evolution"
        description="Observe how Darwin's population genome converges across generations — tracking creativity, depth, risk, and execution focus in real time."
      />

      {/* ── Research Summary Stats ────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          accent="teal"
          icon={Layers3}
          label="Total Generations"
          value={total_generations}
          sub={total_generations > 0 ? "Across all runs" : "No runs yet"}
        />
        <StatCard
          accent="violet"
          icon={BrainCircuit}
          label="Enriched Generations"
          value={meta.enriched_generations}
          sub={`${meta.legacy_generations} legacy (no genome)`}
        />
        <StatCard
          accent="amber"
          icon={Activity}
          label="Latest Diversity σ"
          value={latestDiversity !== null ? latestDiversity.toFixed(2) : "—"}
          sub="Population score std-dev"
        />
        <StatCard
          accent="rose"
          icon={TrendingUp}
          label="Score Improvement"
          value={scoreImprovement !== null ? (scoreImprovement >= 0 ? `+${scoreImprovement}` : `${scoreImprovement}`) : "—"}
          sub={(() => {
            const t = meta.tasks.length > 0 ? meta.tasks[meta.tasks.length - 1] : null;
            if (!t) return "Run an evolution first";
            return t.length > 40 ? t.slice(0, 40) + "…" : t;
          })()}
        />
      </section>

      {/* ── Trait Evolution Chart (full width) ───────────────────────── */}
      <section>
        <TraitEvolutionChart points={trait_evolution} />
      </section>

      {/* ── Diversity + Winning Trait Snapshot ───────────────────────── */}
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <DiversityChart points={diversity_series} />
        <WinningTraitPatterns latest={latestEnriched} />
      </section>

      {/* ── Fitness Landscape (existing component) ───────────────────── */}
      <section>
        <FitnessLandscape memories={memories} />
      </section>

      {/* ── Genome Heatmap ────────────────────────────────────────────── */}
      <section>
        <GenomeHeatmap points={trait_evolution} />
      </section>
    </div>
  );
}
