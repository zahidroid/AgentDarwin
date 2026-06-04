"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BrainCircuit,
  ChartSpline,
  DatabaseZap,
  Dna,
  Home,
  Play,
  Fingerprint,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AppStatusBadge } from "@/components/app-status-badge";

const navigation = [
  { href: "/",       label: "Dashboard",  icon: Home        },
  { href: "/history",label: "History",    icon: ChartSpline },
  { href: "/memory", label: "Memory",     icon: DatabaseZap },
  { href: "/genome", label: "Genome",     icon: Fingerprint },
  { href: "/rules",  label: "Rules",      icon: BrainCircuit},
  { href: "/run",    label: "Run",        icon: Play        },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen research-grid">

      {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 lg:flex flex-col border-r border-white/7 bg-[rgba(8,9,12,0.92)] backdrop-blur-2xl">

        {/* Logo */}
        <Link href="/" className="flex h-16 items-center gap-3 px-5 border-b border-white/7">
          <span className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#00a880] shadow-lg shadow-[rgba(0,212,170,0.3)]">
            <Dna className="size-5 text-[#08090c]" />
          </span>
          <span>
            <span className="block text-sm font-bold text-[#f1f5f9] tracking-tight">Agent Darwin</span>
            <span className="block text-[10px] text-[#4a5568] font-medium uppercase tracking-widest">Research Console</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#4a5568]">
            Navigation
          </p>
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200",
                  "text-[#8892a4] hover:bg-white/5 hover:text-[#f1f5f9]",
                  active && "nav-active"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/7 p-4 space-y-2">
          <AppStatusBadge />
          <p className="text-[10px] text-[#4a5568] text-center">
            Powered by Gemini · Evolutionary AI
          </p>
        </div>
      </aside>

      {/* ── Mobile Top Bar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-white/7 bg-[rgba(8,9,12,0.9)] backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#f1f5f9]">
            <Dna className="size-5 text-[#00d4aa]" />
            Agent Darwin
          </Link>
          <nav className="flex items-center gap-1">
            {navigation.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg text-[#8892a4] transition-colors",
                    active && "bg-[rgba(0,212,170,0.12)] text-[#00d4aa]"
                  )}
                >
                  <Icon className="size-4" />
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
