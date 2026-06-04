"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import { useMounted } from "@/components/charts/use-mounted";
import type { WinnerMemory } from "@/types/darwin";

interface FitnessLandscapeProps {
  memories: WinnerMemory[];
}

function scoreToColor(score: number): string {
  // Map 0-100 score → teal (high) to violet (low)
  const t = Math.max(0, Math.min(1, score / 100));
  const r = Math.round(139 * (1 - t));
  const g = Math.round(92 + (212 - 92) * t);
  const b = Math.round(246 * (1 - t) + 170 * t);
  return `rgb(${r},${g},${b})`;
}

export function FitnessLandscape({ memories }: FitnessLandscapeProps) {
  const mounted = useMounted();

  const data = memories.map((m) => ({
    creativity:      Number(m.genome?.creativity ?? 50),
    execution_focus: Number(m.genome?.execution_focus ?? 50),
    score:           Number(m.score ?? 50),
    name:            m.winner ?? "Unknown",
    generation:      m.generation,
  }));

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-5 h-[280px] flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-[#f1f5f9]">Fitness Landscape</h2>
        <span className="text-[10px] text-[#4a5568] uppercase tracking-wider">
          Creativity × Execution · dot size = score
        </span>
      </div>
      <div className="flex-1">
        {mounted && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
              <XAxis
                type="number"
                dataKey="creativity"
                name="Creativity"
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#8892a4", fontSize: 10 }}
                label={{ value: "Creativity →", position: "insideBottom", offset: -2, fill: "#4a5568", fontSize: 10 }}
              />
              <YAxis
                type="number"
                dataKey="execution_focus"
                name="Execution"
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#8892a4", fontSize: 10 }}
                width={30}
              />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.04)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return (
                    <div className="rounded-lg border border-white/10 bg-[#0d0f14] px-3 py-2 text-xs shadow-xl">
                      <div className="font-semibold text-[#f1f5f9]">{d.name}</div>
                      <div className="text-[#8892a4]">Gen {d.generation}</div>
                      <div className="text-[#00d4aa] font-bold">Score: {d.score}</div>
                    </div>
                  );
                }}
              />
              <Scatter data={data}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={scoreToColor(entry.score)}
                    fillOpacity={0.85}
                    r={Math.max(4, (entry.score / 100) * 12)}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        ) : mounted ? (
          <div className="h-full flex items-center justify-center text-xs text-[#4a5568]">
            No data yet — run an evolution to see the fitness landscape
          </div>
        ) : (
          <div className="h-full rounded-lg skeleton" />
        )}
      </div>
    </div>
  );
}
