import {
  createMockRunResult,
  mockHistory,
  mockWinnerMemory,
} from "@/lib/mock-data";
import type {
  AnalyticsData,
  DashboardData,
  EvolutionHistoryItem,
  RunEvolutionRequest,
  RunEvolutionResponse,
  WinnerMemory,
} from "@/types/darwin";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

const API_COMPAT_ROOT = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

async function requestJson<T>(
  path: string,
  init?: RequestInit,
  fallback?: T,
  useCompatPath = false,
): Promise<T> {
  const urls = [`${API_BASE_URL}${path}`];

  if (useCompatPath && API_COMPAT_ROOT !== API_BASE_URL) {
    urls.push(`${API_COMPAT_ROOT}${path}`);
  }

  for (const url of urls) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(url, {
        ...init,
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        continue;
      }

      return (await response.json()) as T;
    } catch {
      continue;
    } finally {
      clearTimeout(timeout);
    }
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Unable to reach Agent Darwin API at ${API_BASE_URL}`);
}

export async function getHistory(): Promise<EvolutionHistoryItem[]> {
  const data = await requestJson<EvolutionHistoryItem[] | { history?: EvolutionHistoryItem[] }>(
    "/history",
    undefined,
    { history: mockHistory },
    true,
  );

  return Array.isArray(data) ? data : data.history ?? mockHistory;
}

export async function getWinnerMemory(): Promise<WinnerMemory[]> {
  const data = await requestJson<
    WinnerMemory[] | { memories?: WinnerMemory[]; winner_memory?: WinnerMemory[] }
  >(
    "/winner-memory",
    undefined,
    { memories: mockWinnerMemory },
    true,
  );

  if (Array.isArray(data)) return data;
  return data.memories ?? data.winner_memory ?? mockWinnerMemory;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [history, memories] = await Promise.all([
    getHistory(),
    getWinnerMemory(),
  ]);

  return { history, memories };
}

export async function runEvolution(
  request: RunEvolutionRequest,
): Promise<RunEvolutionResponse> {
  return requestJson<RunEvolutionResponse>(
    "/run-evolution",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
    createMockRunResult(request.task, request.generations),
  );
}

export async function getRules() {
  const fallback = {
    strengths: [
      { label: "High execution focus correlates with better outcomes", count: 3 },
      { label: "Depth improves generation-to-generation stability", count: 2 },
    ],
    pitfalls: [
      { label: "Weak competitor analysis", count: 2 },
    ],
  };

  return requestJson(
    "/rules",
    undefined,
    fallback,
    true,
  );
}

// ── Analytics (Phase 1) ─────────────────────────────────────────────────────
// GET /api/v1/analytics lives at the same base prefix as other routes.
// Fallback is empty-but-valid so the genome page never crashes when the
// backend has not been started yet.

const ANALYTICS_FALLBACK: AnalyticsData = {
  trait_evolution: [],
  diversity_series: [],
  total_generations: 0,
  meta: { tasks: [], enriched_generations: 0, legacy_generations: 0 },
};

export async function getAnalytics(): Promise<AnalyticsData> {
  return requestJson<AnalyticsData>(
    "/analytics",
    undefined,
    ANALYTICS_FALLBACK,
  );
}
