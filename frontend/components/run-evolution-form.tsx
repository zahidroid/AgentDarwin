"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import { Activity, CheckCircle, Play, Trophy } from "lucide-react";

import { EvolutionDna } from "@/components/evolution-dna";
import { ResultsViewer } from "@/components/results-viewer";
import { AppStatusBadge } from "@/components/app-status-badge";
import type { RunEvolutionResponse } from "@/types/darwin";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

interface GenerationEvent {
  generation: number;
  total_generations: number;
  winner: string;
  score: number;
  done: boolean;
  task?: string;
  generations?: number;
  best_winner?: string;
  best_score?: number;
  history?: unknown[];
  winner_memory?: unknown[];
}

interface GenerationCard {
  generation: number;
  winner: string;
  score: number;
  done: boolean;
}

export function RunEvolutionForm() {
  const [task, setTask] = useState(
    "Design a startup that helps college students prepare for technical interviews using AI.",
  );
  const [generations, setGenerations] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RunEvolutionResponse | null>(null);
  const [cards, setCards] = useState<GenerationCard[]>([]);
  const [currentGen, setCurrentGen] = useState(0);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      setError(null);
      setResult(null);
      setCards([]);
      setCurrentGen(0);

      try {
        // Attempt SSE streaming first
        const response = await fetch(`${API_BASE}/run-evolution/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task, generations }),
        });

        if (!response.ok || !response.body) {
          throw new Error("stream_unavailable");
        }

        const reader = response.body.getReader();
        readerRef.current = reader;
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const json = line.slice(5).trim();
            if (!json) continue;

            try {
              const event: GenerationEvent = JSON.parse(json);
              setCurrentGen(event.generation);
              setCards((prev) => [
                ...prev.filter((c) => c.generation !== event.generation),
                {
                  generation: event.generation,
                  winner: event.winner,
                  score: event.score,
                  done: event.done,
                },
              ]);

              if (event.done && event.best_winner !== undefined) {
                setResult({
                  task: event.task ?? task,
                  generations: event.generations ?? generations,
                  winner: event.best_winner,
                  best_score: event.best_score ?? event.score,
                  history: (event.history as RunEvolutionResponse["history"]) ?? [],
                  winner_memory: (event.winner_memory as RunEvolutionResponse["winner_memory"]) ?? [],
                });
              }
            } catch {
              // malformed SSE line — skip
            }
          }
        }
      } catch {
        // Fallback: regular POST (mock or non-streaming backend)
        try {
          const { runEvolution } = await import("@/services/darwin-api");
          const res = await runEvolution({ task, generations });
          setResult(res);
          // Synthesise generation cards from history
          if (res.history?.length) {
            setCards(
              res.history.map((h) => ({
                generation: h.generation,
                winner: h.winner ?? "Unknown",
                score: Number(h.best_score ?? h.score ?? 0),
                done: true,
              })),
            );
          }
        } catch (fallbackErr) {
          setError(
            fallbackErr instanceof Error ? fallbackErr.message : "Evolution run failed",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [task, generations],
  );

  return (
    <div className="space-y-6">
      {/* ── Form + Status ──────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-xl border border-white/7 bg-[#111318] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-[#f1f5f9]">Run Evolution</h2>
            <AppStatusBadge />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="task" className="block text-xs font-semibold uppercase tracking-wider text-[#8892a4]">
                Task
              </label>
              <textarea
                id="task"
                rows={5}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
                disabled={loading}
                placeholder="Describe the problem for Darwin to evolve a solution..."
                className="w-full rounded-lg border border-white/8 bg-[#0d0f14] px-4 py-3 text-sm text-[#f1f5f9] placeholder:text-[#4a5568] focus:border-[#00d4aa] focus:outline-none focus:ring-1 focus:ring-[rgba(0,212,170,0.3)] transition-colors resize-none disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="generations" className="block text-xs font-semibold uppercase tracking-wider text-[#8892a4]">
                Generations
              </label>
              <input
                id="generations"
                type="number"
                min={1}
                max={20}
                value={generations}
                onChange={(e) => setGenerations(Number(e.target.value))}
                disabled={loading}
                className="w-full rounded-lg border border-white/8 bg-[#0d0f14] px-4 py-2.5 text-sm text-[#f1f5f9] focus:border-[#00d4aa] focus:outline-none focus:ring-1 focus:ring-[rgba(0,212,170,0.3)] transition-colors disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-[rgba(244,63,94,0.3)] bg-[rgba(244,63,94,0.08)] px-4 py-3 text-sm text-[#f43f5e]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !task.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#00d4aa] px-4 py-2.5 text-sm font-semibold text-[#08090c] transition-all hover:bg-[#00bfa0] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[rgba(0,212,170,0.25)] hover:shadow-[rgba(0,212,170,0.4)]"
            >
              {loading ? (
                <>
                  <span className="size-4 rounded-full border-2 border-[#08090c]/30 border-t-[#08090c] animate-spin" />
                  Evolving…
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Execute Evolution
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Live Generation Feed ───────────────────────────────────── */}
        <div className="rounded-xl border border-white/7 bg-[#111318] p-6 min-h-[300px] flex flex-col">
          <h2 className="text-base font-semibold text-[#f1f5f9] mb-4">
            Generation Feed
          </h2>

          {!loading && cards.length === 0 && !result && (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <div className="mb-3 inline-flex rounded-full bg-[rgba(0,212,170,0.08)] p-4">
                  <Activity className="size-6 text-[#00d4aa]/50" />
                </div>
                <p className="text-sm text-[#4a5568]">
                  Submit a task to watch Darwin evolve in real-time
                </p>
              </div>
            </div>
          )}

          {loading && cards.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <EvolutionDna label={`Initialising generation ${currentGen + 1}…`} size={60} />
            </div>
          )}

          {cards.length > 0 && (
            <div className="space-y-3">
              {cards.map((card) => (
                <div
                  key={card.generation}
                  className="flex items-center gap-4 rounded-lg border border-white/7 bg-[#0d0f14] px-4 py-3 transition-all"
                >
                  <div className="shrink-0 flex size-8 items-center justify-center rounded-lg bg-[rgba(0,212,170,0.1)] text-xs font-bold text-[#00d4aa]">
                    G{card.generation}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Trophy className="size-3 text-[#f59e0b] shrink-0" />
                      <span className="text-sm font-medium text-[#f1f5f9] truncate">
                        {card.winner}
                      </span>
                    </div>
                    <div className="text-xs text-[#8892a4] mt-0.5">
                      Generation {card.generation} of {generations}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-lg font-bold text-[#00d4aa]">{card.score}</div>
                    <div className="text-[10px] text-[#4a5568] uppercase tracking-wider">score</div>
                  </div>
                  {card.done ? (
                    <CheckCircle className="size-4 text-[#00d4aa] shrink-0" />
                  ) : (
                    <span className="size-4 rounded-full border-2 border-[#00d4aa]/30 border-t-[#00d4aa] animate-spin shrink-0" />
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-white/10">
                  <EvolutionDna label="" size={20} />
                  <span className="text-sm text-[#8892a4] animate-live">
                    Running generation {currentGen + 1}…
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Results Panel ─────────────────────────────────────────────── */}
      {result && <ResultsViewer result={result} />}
    </div>
  );
}
