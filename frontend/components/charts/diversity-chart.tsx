"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

import { useMounted } from "@/components/charts/use-mounted";
import type { DiversityPoint } from "@/types/darwin";

type ChartRow = {
  gen: string;
  diversity: number | null;
  mean: number | null;
  min: number | null;
  max: number | null;
};

function buildRows(points: DiversityPoint[]): ChartRow[] {
  return points.map((p) => ({
    gen:      `G${p.generation}`,
    diversity: p.diversity_score,
    mean:      p.population_mean,
    min:       p.population_min,
    max:       p.population_max,
  }));
}

interface DiversityChartProps {
  points: DiversityPoint[];
}

export function DiversityChart({ points }: DiversityChartProps) {
  const mounted = useMounted();
  const data = buildRows(points);

  // Compute mean diversity to draw a reference line
  const diversities = points
    .map((p) => p.diversity_score)
    .filter((v): v is number => v !== null);
  const meanDiversity =
    diversities.length > 0
      ? Math.round(diversities.reduce((a, b) => a + b, 0) / diversities.length)
      : null;

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-5 flex flex-col h-[280px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#f1f5f9]">Population Diversity</h2>
        <span className="text-[10px] text-[#4a5568] uppercase tracking-wider">
          Score std-dev · higher = more diverse
        </span>
      </div>

      <div className="flex-1">
        {mounted && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -10, right: 12, top: 4, bottom: 0 }}>
              <defs>
                {/* Violet gradient for diversity */}
                <linearGradient id="diversityGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                </linearGradient>
                {/* Teal gradient for mean score */}
                <linearGradient id="meanGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%"  stopColor="#00d4aa" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00d4aa" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="gen"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#8892a4", fontSize: 11 }}
              />
              <YAxis
                width={34}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#8892a4", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "#0d0f14",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  color: "#f1f5f9",
                  fontSize: 12,
                }}
                cursor={{ stroke: "rgba(139,92,246,0.2)", strokeWidth: 1 }}
                formatter={(value, name) => {
                  const n = typeof value === "number" ? value.toFixed(2) : "—";
                  const label = name === "diversity" ? "Diversity (σ)" : String(name);
                  return [n, label] as [string, string];
                }}
              />

              {/* Reference line at mean diversity */}
              {meanDiversity !== null && (
                <ReferenceLine
                  y={meanDiversity}
                  stroke="rgba(139,92,246,0.3)"
                  strokeDasharray="4 4"
                  label={{
                    value: `avg ${meanDiversity}`,
                    position: "right",
                    fill: "#4a5568",
                    fontSize: 9,
                  }}
                />
              )}

              {/* Mean score band */}
              <Area
                dataKey="mean"
                name="Pop. Mean Score"
                fill="url(#meanGrad)"
                stroke="#00d4aa"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                type="monotone"
                dot={false}
                connectNulls
              />

              {/* Diversity score — the headline series */}
              <Area
                dataKey="diversity"
                name="Diversity (σ)"
                fill="url(#diversityGrad)"
                stroke="#8b5cf6"
                strokeWidth={2}
                type="monotone"
                dot={{ fill: "#8b5cf6", r: 3, strokeWidth: 0 }}
                activeDot={{ fill: "#8b5cf6", r: 5, strokeWidth: 0, filter: "drop-shadow(0 0 5px #8b5cf6)" }}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : mounted ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
            <span className="text-xs text-[#4a5568]">No diversity data yet</span>
            <span className="text-[10px] text-[#2d3748]">
              Run an evolution to see population spread over generations
            </span>
          </div>
        ) : (
          <div className="h-full rounded-lg skeleton" />
        )}
      </div>
    </div>
  );
}
