"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useMounted } from "@/components/charts/use-mounted";
import { getHistoryScore, getHistoryWinner } from "@/lib/utils";
import type { EvolutionHistoryItem } from "@/types/darwin";

export function WinnerProgressChart({ history }: { history: EvolutionHistoryItem[] }) {
  const mounted = useMounted();
  const data = history.map((item) => ({
    generation: `G${item.generation}`,
    winner: getHistoryWinner(item),
    score: getHistoryScore(item),
  }));

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-5 h-[260px] flex flex-col">
      <h2 className="text-sm font-semibold text-[#f1f5f9] mb-4">Winner Progress Chart</h2>
      <div className="flex-1">
        {mounted && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="generation" tickLine={false} axisLine={false} tick={{ fill: "#8892a4", fontSize: 11 }} />
              <YAxis width={36} tickLine={false} axisLine={false} tick={{ fill: "#8892a4", fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "#0d0f14",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  color: "#f1f5f9",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="score" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : mounted && data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#4a5568]">
            No history yet — run an evolution to see winner progress
          </div>
        ) : (
          <div className="h-full rounded-lg skeleton" />
        )}
      </div>
    </div>
  );
}
