import { cn } from "@/lib/utils";

type AccentColor = "teal" | "amber" | "violet" | "rose" | "zinc";

const accentConfig: Record<
  AccentColor,
  { border: string; icon: string; bg: string }
> = {
  teal:   { border: "border-t-[#00d4aa]",  icon: "text-[#00d4aa]",  bg: "bg-[rgba(0,212,170,0.08)]"   },
  amber:  { border: "border-t-[#f59e0b]",  icon: "text-[#f59e0b]",  bg: "bg-[rgba(245,158,11,0.08)]"  },
  violet: { border: "border-t-[#8b5cf6]",  icon: "text-[#8b5cf6]",  bg: "bg-[rgba(139,92,246,0.08)]"  },
  rose:   { border: "border-t-[#f43f5e]",  icon: "text-[#f43f5e]",  bg: "bg-[rgba(244,63,94,0.08)]"   },
  zinc:   { border: "border-t-zinc-500",    icon: "text-zinc-400",    bg: "bg-zinc-800/30"              },
};

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  accent?: AccentColor;
  sub?: string;
}

export function StatCard({ icon: Icon, label, value, accent = "teal", sub }: StatCardProps) {
  const cfg = accentConfig[accent];

  return (
    <div
      className={cn(
        "rounded-xl border border-t-2 p-5 transition-all duration-300",
        "bg-[#111318] hover:bg-[#161921] hover:border-white/14",
        cfg.border
      )}
    >
      <div className={cn("mb-3 inline-flex rounded-lg p-2", cfg.bg)}>
        <Icon className={cn("size-4", cfg.icon)} />
      </div>
      <div className="text-xs font-medium text-[#8892a4] uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold text-[#f1f5f9] tracking-tight">
        {value}
      </div>
      {sub && (
        <div className="mt-1 text-xs text-[#4a5568]">{sub}</div>
      )}
    </div>
  );
}
