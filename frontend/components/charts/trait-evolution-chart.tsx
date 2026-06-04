"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useMounted } from "@/components/charts/use-mounted";
import type { TraitEvolutionPoint } from "@/types/darwin";

// ── Colour palette — one distinct neon per trait ────────────────────────────
const TRAIT_LINES: {
  key: keyof Omit<TraitEvolutionPoint, "generation">;
  label: string;
  color: string;
}[] = [
  { key: "creativity",      label: "Creativity",      color: "#00d4aa" },
  { key: "depth",           label: "Depth",           color: "#8b5cf6" },
  { key: "execution_focus", label: "Execution Focus", color: "#f59e0b" },
  { key: "risk",            label: "Risk",            color: "#f43f5e" },
  { key: "skepticism",      label: "Skepticism",      color: "#38bdf8" },
];

// Recharts needs numeric keys — remap execution_focus → readable label
type ChartRow = {
  gen: string;
  Creativity: number | null;
  Depth: number | null;
  "Execution Focus": number | null;
  Risk: number | null;
  Skepticism: number | null;
};

function buildRows(points: TraitEvolutionPoint[]): ChartRow[] {
  return points.map((p) => ({
    gen: `G${p.generation}`,
    Creativity:       p.creativity,
    Depth:            p.depth,
    "Execution Focus": p.execution_focus,
    Risk:             p.risk,
    Skepticism:       p.skepticism,
  }));
}

interface TraitEvolutionChartProps {
  points: TraitEvolutionPoint[];
}

export function TraitEvolutionChart({ points }: TraitEvolutionChartProps) {
  const mounted = useMounted();
  const data = buildRows(points);

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-5 flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#f1f5f9]">Trait Evolution</h2>
        <span className="text-[10px] text-[#4a5568] uppercase tracking-wider">
          Winner traits per generation
        </span>
      </div>

      <div className="flex-1">
        {mounted && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: -10, right: 12, top: 4, bottom: 0 }}>
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
                domain={[0, 100]}
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
                cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
                formatter={(value) => (
                  <span style={{ color: "#8892a4" }}>{value}</span>
                )}
              />
              {TRAIT_LINES.map(({ key: _key, label, color }) => (
                <Line
                  key={label}
                  dataKey={label}
                  stroke={color}
                  strokeWidth={2}
                  type="monotone"
                  dot={{ fill: color, r: 3, strokeWidth: 0 }}
                  activeDot={{ fill: color, r: 5, strokeWidth: 0, filter: `drop-shadow(0 0 5px ${color})` }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : mounted ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
            <span className="text-xs text-[#4a5568]">
              No trait data yet
            </span>
            <span className="text-[10px] text-[#2d3748]">
              Run an evolution with ≥2 generations to see trait changes
            </span>
          </div>
        ) : (
          <div className="h-full rounded-lg skeleton" />
        )}
      </div>
    </div>
  );
}
