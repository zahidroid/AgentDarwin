import { BrainCircuit, CheckCircle2, Network } from "lucide-react";

import type { DiscoveredRule, TraitInsight } from "@/types/darwin";

export function RuleList({
  rules,
  insights,
}: {
  rules: DiscoveredRule[];
  insights: TraitInsight[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-xl border border-white/7 bg-[#111318] p-5 h-full">
        <div className="flex items-center gap-3 mb-5">
          <Network className="size-5 text-[#00d4aa]" />
          <h2 className="text-base font-semibold text-[#f1f5f9]">Discovered Rules</h2>
        </div>
        <div className="space-y-3">
          {rules.length === 0 ? (
            <div className="text-sm text-[#4a5568] py-4 text-center">
              No rules discovered yet.
            </div>
          ) : (
            rules.map((rule) => (
              <div
                key={rule.label}
                className="grid gap-3 rounded-lg border border-white/5 bg-[#0d0f14] px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center transition-colors hover:bg-white/5"
              >
                <div>
                  <div className="text-sm font-medium text-[#f1f5f9]">{rule.label}</div>
                  <div className="mt-1 text-xs text-[#8892a4]">
                    Observed {rule.count} times
                  </div>
                </div>
                <div className="rounded-md bg-[rgba(0,212,170,0.1)] border border-[rgba(0,212,170,0.2)] px-2 py-1 text-xs font-bold text-[#00d4aa]">
                  {rule.confidence}%
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-white/7 bg-[#111318] p-5 h-full">
        <div className="flex items-center gap-3 mb-5">
          <BrainCircuit className="size-5 text-[#f59e0b]" />
          <h2 className="text-base font-semibold text-[#f1f5f9]">Trait Insights</h2>
        </div>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div key={insight.trait} className="rounded-lg border border-white/5 bg-[#0d0f14] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-[#f1f5f9]">
                  <CheckCircle2 className="size-4 text-[#00d4aa]" />
                  {insight.label}
                </div>
                <span className="text-sm font-bold text-[#f59e0b]">{insight.value}</span>
              </div>
              <div className="mt-2.5 h-1.5 rounded-full bg-white/5">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-[#f59e0b]/60 to-[#f59e0b]"
                  style={{ width: `${Math.min(100, insight.value)}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-[#8892a4]">
                {insight.summary}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
