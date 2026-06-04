import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Agent Darwin — Evolutionary AI Research Console",
    template: "%s | Agent Darwin",
  },
  description:
    "Watch AI agents evolve in real time. Agent Darwin runs multi-generational evolutionary AI to discover the best solutions through natural selection, mutation, and cross-generational learning.",
  keywords: ["evolutionary AI", "agent simulation", "LLM", "genetic algorithm", "AI research"],
  openGraph: {
    title: "Agent Darwin — Evolutionary AI Research Console",
    description: "Multi-generational evolutionary AI research platform.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
