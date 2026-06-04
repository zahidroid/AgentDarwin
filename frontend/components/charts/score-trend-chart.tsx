"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useMounted } from "@/components/charts/use-mounted";
import { getHistoryScore } from "@/lib/utils";
import type { EvolutionHistoryItem } from "@/types/darwin";

export function ScoreTrendChart({ history }: { history: EvolutionHistoryItem[] }) {
  const mounted = useMounted();
  const data = history.map((item) => ({
    generation: `G${item.generation}`,
    score: getHistoryScore(item),
  }));

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-5 h-[260px] flex flex-col">
      <h2 className="text-sm font-semibold text-[#f1f5f9] mb-4">Score Trend</h2>
      <div className="flex-1">
        {mounted && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -10, right: 8, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreTrendDark" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%"  stopColor="#00d4aa" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00d4aa" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="generation"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#8892a4", fontSize: 11 }}
              />
              <YAxis
                width={36}
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
                cursor={{ stroke: "rgba(0,212,170,0.2)", strokeWidth: 1 }}
              />
              <Area
                dataKey="score"
                fill="url(#scoreTrendDark)"
                stroke="#00d4aa"
                strokeWidth={2}
                type="monotone"
                dot={{ fill: "#00d4aa", r: 3, strokeWidth: 0 }}
                activeDot={{ fill: "#00d4aa", r: 5, strokeWidth: 0, filter: "drop-shadow(0 0 6px #00d4aa)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : mounted && data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#4a5568]">
            No history yet — run an evolution to see the score trend
          </div>
        ) : (
          <div className="h-full rounded-lg skeleton" />
        )}
      </div>
    </div>
  );
}
