"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { useMounted } from "@/components/charts/use-mounted";
import type { TraitInsight } from "@/types/darwin";

export function TraitBarChart({ insights }: { insights: TraitInsight[] }) {
  const mounted = useMounted();
  const data = insights.map((insight) => ({
    trait: insight.label,
    value: insight.value,
  }));

  return (
    <div className="rounded-xl border border-white/7 bg-[#111318] p-5 h-[300px] flex flex-col">
      <h2 className="text-sm font-semibold text-[#f1f5f9] mb-4">Trait Insights</h2>
      <div className="flex-1">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="trait" tickLine={false} axisLine={false} tick={{ fill: "#8892a4", fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#8892a4", fontSize: 11 }} />
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
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => {
                  const val = entry.value;
                  const intensity = val / 100;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={`rgba(0, 212, 170, ${0.3 + intensity * 0.7})`}
                      style={{
                        filter: `drop-shadow(0 0 ${8 * intensity}px rgba(0, 212, 170, ${intensity}))`,
                      }}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-lg skeleton" />
        )}
      </div>
    </div>
  );
}
