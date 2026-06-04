import { Activity, ChevronRight, DatabaseZap, Lightbulb, Trophy, TriangleAlert } from "lucide-react";

import { formatScore, getImprovements, getStrengths, getWinnerName } from "@/lib/utils";
import type { RunEvolutionResponse, WinnerMemory } from "@/types/darwin";

interface ResultsViewerProps {
  result: RunEvolutionResponse | null;
}

export function ResultsViewer({ result }: ResultsViewerProps) {
  if (!result) return null;

  const latestMemory: WinnerMemory | undefined =
    result.winner_memory[result.winner_memory.length - 1] as WinnerMemory | undefined;

  const strengths = getStrengths(latestMemory?.reasons);
  const improvements = getImprovements(latestMemory?.reasons);

  return (
    <div className="space-y-5">

      {/* ── Summary bar ─────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-t-2 border-t-[#f59e0b] bg-[#111318] px-5 py-4">
          <Trophy className="mb-2 size-4 text-[#f59e0b]" />
          <div className="text-xs text-[#8892a4] uppercase tracking-wider mb-1">Best Winner</div>
          <div className="text-lg font-bold text-[#f1f5f9] truncate">
            {result.winner ?? getWinnerName(latestMemory)}
          </div>
        </div>

        <div className="rounded-xl border border-t-2 border-t-[#00d4aa] bg-[#111318] px-5 py-4">
          <Activity className="mb-2 size-4 text-[#00d4aa]" />
          <div className="text-xs text-[#8892a4] uppercase tracking-wider mb-1">Best Score</div>
          <div className="text-lg font-bold text-[#00d4aa]">
            {formatScore(result.best_score)}
          </div>
        </div>

        <div className="rounded-xl border border-t-2 border-t-[#8b5cf6] bg-[#111318] px-5 py-4">
          <DatabaseZap className="mb-2 size-4 text-[#8b5cf6]" />
          <div className="text-xs text-[#8892a4] uppercase tracking-wider mb-1">Generations</div>
          <div className="text-lg font-bold text-[#f1f5f9]">
            {result.generations}
          </div>
        </div>
      </div>

      {/* ── Score progression ───────────────────────────────────────── */}
      {result.history && result.history.length > 0 && (
        <div className="rounded-xl border border-white/7 bg-[#111318] p-5">
          <h3 className="text-sm font-semibold text-[#f1f5f9] mb-4">Score Progression</h3>
          <div className="flex items-end gap-2 h-20">
            {result.history.map((h, i) => {
              const score = Number(h.best_score ?? h.score ?? 0);
              const maxScore = Math.max(...result.history.map(
                (x) => Number(x.best_score ?? x.score ?? 0)
              ), 1);
              const height = Math.max(8, (score / maxScore) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[10px] text-[#00d4aa] font-mono font-bold">
                    {score}
                  </div>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-[#00d4aa]/30 to-[#00d4aa] transition-all duration-700"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-[9px] text-[#4a5568]">G{h.generation}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Winner Insights ─────────────────────────────────────────── */}
      {(strengths.length > 0 || improvements.length > 0) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="rounded-xl border border-white/7 bg-[#111318] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="size-4 text-[#00d4aa]" />
                <h3 className="text-sm font-semibold text-[#f1f5f9]">Winner Strengths</h3>
              </div>
              <ul className="space-y-2">
                {strengths.slice(0, 5).map((s, i) => (
                  <li key={i} className="flex gap-2 text-xs text-[#8892a4]">
                    <ChevronRight className="size-3 shrink-0 mt-0.5 text-[#00d4aa]" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements / Pitfalls */}
          {improvements.length > 0 && (
            <div className="rounded-xl border border-white/7 bg-[#111318] p-5">
              <div className="flex items-center gap-2 mb-4">
                <TriangleAlert className="size-4 text-[#f59e0b]" />
                <h3 className="text-sm font-semibold text-[#f1f5f9]">Gaps to Address</h3>
              </div>
              <ul className="space-y-2">
                {improvements.slice(0, 5).map((imp, i) => (
                  <li key={i} className="flex gap-2 text-xs text-[#8892a4]">
                    <ChevronRight className="size-3 shrink-0 mt-0.5 text-[#f59e0b]" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── Raw JSON for devs ───────────────────────────────────────── */}
      <details className="rounded-xl border border-white/7 bg-[#0d0f14] overflow-hidden">
        <summary className="cursor-pointer px-5 py-3 text-xs font-semibold text-[#4a5568] hover:text-[#8892a4] transition-colors select-none">
          Raw Response JSON
        </summary>
        <pre className="px-5 pb-5 pt-2 text-[11px] text-[#8892a4] font-mono overflow-auto max-h-80 whitespace-pre-wrap leading-relaxed">
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>
    </div>
  );
}
