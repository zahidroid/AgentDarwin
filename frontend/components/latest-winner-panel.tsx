import { ChevronRight, Trophy } from "lucide-react";

import { formatScore, getMemoryScore, getStrengths, getWinnerName } from "@/lib/utils";
import type { WinnerMemory } from "@/types/darwin";

export function LatestWinnerPanel({ memory }: { memory: WinnerMemory | null }) {
  const strengths = getStrengths(memory?.reasons);

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#f1f5f9]">Latest Winner</h2>
        <span className="flex items-center gap-1.5 rounded-full bg-[rgba(245,158,11,0.12)] px-3 py-1 text-[11px] font-semibold text-[#f59e0b] border border-[rgba(245,158,11,0.2)]">
          <Trophy className="size-3" />
          Gen {memory?.generation ?? 0}
        </span>
      </div>

      {/* Winner name + score */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-[#f1f5f9] tracking-tight">
          {getWinnerName(memory)}
        </div>
        <div className="mt-1 text-sm text-[#00d4aa] font-semibold">
          Score {formatScore(getMemoryScore(memory))}
        </div>
      </div>

      {/* Strengths */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[#4a5568]">
          Top Strengths
        </p>
        {(strengths.length ? strengths.slice(0, 4) : ["Awaiting live memory…"]).map(
          (strength, i) => (
            <div
              key={i}
              className="flex gap-2 rounded-lg bg-[rgba(0,212,170,0.05)] border border-white/5 px-3 py-2 text-xs text-[#8892a4]"
            >
              <ChevronRight className="size-3 shrink-0 mt-0.5 text-[#00d4aa]" />
              <span className="line-clamp-2">{strength}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
