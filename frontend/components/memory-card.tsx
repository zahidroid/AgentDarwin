import { formatScore, getMemoryScore, getStrengths, getImprovements, getWinnerName } from "@/lib/utils";
import type { WinnerMemory } from "@/types/darwin";

export function MemoryCard({ memory }: { memory: WinnerMemory }) {
  const strengths = getStrengths(memory.reasons);
  const improvements = getImprovements(memory.reasons);

  const traitKeys = ["creativity", "risk", "depth", "skepticism", "execution_focus"] as const;

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-5 transition-all hover:bg-[#161921] hover:border-white/14">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-base font-semibold text-[#f1f5f9]">{getWinnerName(memory)}</div>
          <div className="text-sm font-bold text-[#00d4aa] mt-0.5">
            Score {formatScore(getMemoryScore(memory))}
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-[#0d0f14] px-3 py-1 text-xs font-semibold text-[#8892a4]">
          Gen {memory.generation}
        </span>
      </div>

      {/* Genome traits */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {traitKeys.map((key) => {
          const val = Number(memory.genome?.[key] ?? 0);
          return (
            <div key={key} className="rounded-lg bg-[#0d0f14] border border-white/5 px-2 py-2 text-center">
              <div className="text-[9px] uppercase tracking-wider text-[#4a5568] mb-1">
                {key.replace("_", " ")}
              </div>
              <div
                className="text-sm font-bold"
                style={{
                  color: `rgba(0, 212, 170, ${0.4 + (val / 100) * 0.6})`,
                }}
              >
                {val}
              </div>
              {/* Mini bar */}
              <div className="mt-1.5 h-1 rounded-full bg-white/5">
                <div
                  className="h-1 rounded-full bg-[#00d4aa]/60"
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {strengths.slice(0, 3).map((s, i) => (
            <span
              key={i}
              className="rounded-full bg-[rgba(0,212,170,0.08)] border border-[rgba(0,212,170,0.15)] px-2.5 py-0.5 text-[11px] text-[#00d4aa]"
            >
              {s.length > 60 ? s.slice(0, 57) + "…" : s}
            </span>
          ))}
        </div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {improvements.slice(0, 2).map((imp, i) => (
            <span
              key={i}
              className="rounded-full bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.15)] px-2.5 py-0.5 text-[11px] text-[#f59e0b]"
            >
              ↑ {imp.length > 55 ? imp.slice(0, 52) + "…" : imp}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
