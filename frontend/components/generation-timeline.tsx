import { formatScore, getHistoryScore, getHistoryWinner } from "@/lib/utils";
import type { EvolutionHistoryItem } from "@/types/darwin";

export function GenerationTimeline({ history }: { history: EvolutionHistoryItem[] }) {
  const maxScore = Math.max(...history.map(getHistoryScore), 1);

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-5">
      <h2 className="text-sm font-semibold text-[#f1f5f9] mb-4">Generation Timeline</h2>

      {history.length === 0 ? (
        <div className="py-8 text-center text-sm text-[#4a5568]">
          No generations recorded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, idx) => {
            const score = getHistoryScore(item);
            const pct   = (score / maxScore) * 100;
            const prev  = idx > 0 ? getHistoryScore(history[idx - 1]) : null;
            const delta = prev !== null ? score - prev : null;

            return (
              <div
                key={`${item.generation}-${getHistoryWinner(item)}`}
                className="grid gap-3 rounded-lg border border-white/5 bg-[#0d0f14] px-4 py-3 sm:grid-cols-[80px_1fr_80px_auto] sm:items-center"
              >
                <div className="rounded-full bg-[rgba(0,212,170,0.1)] border border-[rgba(0,212,170,0.2)] px-3 py-1 text-xs font-bold text-[#00d4aa] text-center">
                  Gen {item.generation}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#f1f5f9]">{getHistoryWinner(item)}</div>
                  <div className="text-xs text-[#8892a4] mt-0.5">Best score {formatScore(score)}</div>
                </div>
                <div className="text-right">
                  {delta !== null && (
                    <span
                      className={`text-xs font-bold ${delta >= 0 ? "text-[#00d4aa]" : "text-[#f43f5e]"}`}
                    >
                      {delta >= 0 ? "+" : ""}{delta.toFixed(0)}
                    </span>
                  )}
                </div>
                <div className="h-1.5 w-full sm:w-28 rounded-full bg-white/5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-[#00d4aa]/60 to-[#00d4aa] transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
