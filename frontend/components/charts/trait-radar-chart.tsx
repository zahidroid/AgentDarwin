"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useMounted } from "@/components/charts/use-mounted";
import { getGenomeValue } from "@/lib/utils";
import type { AgentGenome } from "@/types/darwin";

const traits: Array<{ key: keyof AgentGenome; label: string }> = [
  { key: "creativity", label: "Creativity" },
  { key: "risk", label: "Risk" },
  { key: "depth", label: "Depth" },
  { key: "skepticism", label: "Skepticism" },
  { key: "execution_focus", label: "Execution" },
];

export function TraitRadarChart({
  genome,
  title = "Trait Visualization",
}: {
  genome?: AgentGenome;
  title?: string;
}) {
  const mounted = useMounted();
  const data = traits.map((trait) => ({
    trait: trait.label,
    value: getGenomeValue(genome, trait.key),
  }));

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-5 h-full min-h-[300px] flex flex-col">
      <h2 className="text-sm font-semibold text-[#f1f5f9] mb-4">{title}</h2>
      <div className="flex-1">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="trait"
                tick={{ fill: "#8892a4", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "#0d0f14",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  color: "#00d4aa",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />
              <Radar
                dataKey="value"
                fill="#00d4aa"
                fillOpacity={0.15}
                stroke="#00d4aa"
                strokeWidth={2}
                activeDot={{ fill: "#00d4aa", r: 4, strokeWidth: 0, filter: "drop-shadow(0 0 6px #00d4aa)" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-lg skeleton" />
        )}
      </div>
    </div>
  );
}
