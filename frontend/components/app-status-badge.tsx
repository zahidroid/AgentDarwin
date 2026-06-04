"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ApiStatus = "checking" | "live" | "mock";

export function AppStatusBadge() {
  const [status, setStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";
        const base = API.replace(/\/api\/v1\/?$/, "");
        const res = await fetch(`${base}/health`, {
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeout);
        setStatus(res.ok ? "live" : "mock");
      } catch {
        setStatus("mock");
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (status === "checking") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-zinc-800/60 px-3 py-2 text-xs font-medium text-zinc-400">
        <span className="size-2 rounded-full bg-zinc-500 skeleton" />
        Connecting…
      </div>
    );
  }

  if (status === "live") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[rgba(0,212,170,0.1)] px-3 py-2 text-xs font-semibold text-[#00d4aa] border border-[rgba(0,212,170,0.2)]">
        <span className="relative flex size-2">
          <span className="animate-live absolute inline-flex h-full w-full rounded-full bg-[#00d4aa] opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-[#00d4aa]" />
        </span>
        API Live
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 rounded-lg bg-[rgba(245,158,11,0.1)] px-3 py-2 text-xs font-semibold text-[#f59e0b] border border-[rgba(245,158,11,0.2)]"
      title="Backend unreachable — showing mock data"
    >
      <span className="size-2 rounded-full bg-[#f59e0b]" />
      Mock Data
    </div>
  );
}
