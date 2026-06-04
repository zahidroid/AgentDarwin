import { TriangleAlert, Trophy } from "lucide-react";

import {
  formatScore,
  getImprovements,
  getMemoryScore,
  getStrengths,
  getWinnerName,
} from "@/lib/utils";
import type { WinnerMemory } from "@/types/darwin";

export function WinnerDetails({ memory }: { memory: WinnerMemory | null }) {
  const strengths = getStrengths(memory?.reasons);
  const improvements = getImprovements(memory?.reasons);

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-[#f1f5f9]">Winner Profile</h2>
        <span className="flex items-center gap-1.5 rounded-full bg-[rgba(0,212,170,0.1)] px-3 py-1 text-xs font-bold text-[#00d4aa] border border-[rgba(0,212,170,0.2)]">
          <Trophy className="size-3" />
          Generation {memory?.generation ?? 0}
        </span>
      </div>

      <div className="mb-6">
        <div className="text-3xl font-bold text-[#f1f5f9] tracking-tight">
          {getWinnerName(memory)}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-[#8892a4]">Score</span>
          <span className="rounded-md bg-[#0d0f14] px-2 py-0.5 text-sm font-bold text-[#00d4aa] border border-white/5">
            {formatScore(getMemoryScore(memory))}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mb-6" />

      <div className="flex-1 space-y-6">
        {/* Strengths */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="size-4 text-[#00d4aa]" />
            <h3 className="text-sm font-semibold text-[#f1f5f9]">Evaluated Strengths</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(strengths.length ? strengths : ["Awaiting winner reasons"]).map((item) => (
              <span
                key={item}
                className="rounded-lg bg-[rgba(0,212,170,0.05)] border border-[rgba(0,212,170,0.15)] px-3 py-1.5 text-xs text-[#00d4aa]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Improvements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TriangleAlert className="size-4 text-[#f59e0b]" />
            <h3 className="text-sm font-semibold text-[#f1f5f9]">Identified Gaps</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(improvements.length ? improvements : ["No improvement data"]).map((item) => (
              <span
                key={item}
                className="rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] px-3 py-1.5 text-xs text-[#f59e0b]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
