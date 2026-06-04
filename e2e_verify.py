"""
Production end-to-end verification for Agent Darwin.
Checks all API endpoints, then runs a real 1-generation evolution.
"""
import urllib.request
import urllib.error
import json
import sys
import time

BACKEND = "http://127.0.0.1:8000"

def get(path, timeout=6):
    try:
        with urllib.request.urlopen(BACKEND + path, timeout=timeout) as r:
            return r.status, json.loads(r.read()), None
    except urllib.error.HTTPError as e:
        return e.code, None, f"HTTP {e.code}: {e.reason}"
    except Exception as e:
        return None, None, str(e)

def post(path, body, timeout=10):
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        BACKEND + path, data=data,
        headers={"Content-Type": "application/json"}, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, json.loads(r.read()), None
    except urllib.error.HTTPError as e:
        body_err = e.read().decode("utf-8", errors="replace")[:200]
        return e.code, None, f"HTTP {e.code}: {body_err}"
    except Exception as e:
        return None, None, str(e)

results = {}

print("=" * 60)
print("AGENT DARWIN — PRODUCTION END-TO-END VERIFICATION")
print("=" * 60)

# ── STEP 1: API Endpoints ──────────────────────────────────────
print("\n[1] API ENDPOINTS")

checks = [
    ("GET", "/health",           "Health"),
    ("GET", "/history",          "History"),
    ("GET", "/winner-memory",    "Winner Memory"),
    ("GET", "/rules",            "Rules"),
    ("GET", "/api/v1/analytics", "Analytics"),
]

for method, path, label in checks:
    s, d, e = get(path)
    ok = s == 200
    results[label] = ok
    detail = ""
    if d:
        if "history" in d:      detail = f"records={len(d['history'])}"
        elif "memories" in d:   detail = f"records={len(d['memories'])}"
        elif "strengths" in d:  detail = f"strengths={len(d['strengths'])} pitfalls={len(d.get('pitfalls',[]))}"
        elif "total_generations" in d: detail = f"total_gen={d['total_generations']}"
        elif "status" in d:     detail = f"status={d['status']}"
    tag = "OK  " if ok else "FAIL"
    print(f"  [{tag}] {method} {path:30} {detail or ''}")
    if e: print(f"         Error: {e}")

# ── STEP 2: POST /api/v1/run-evolution ────────────────────────
print("\n[2] POST /api/v1/run-evolution")
print("  Sending: task='Design an AI interview preparation platform.' generations=1")
print("  (This calls real LLM — may take 60-120s)...")

s, d, e = post("/api/v1/run-evolution", {
    "task": "Design an AI interview preparation platform.",
    "generations": 1
}, timeout=180)

if s == 200 and d:
    results["run-evolution"] = True
    print(f"  [OK  ] HTTP {s}")
    print(f"         best_winner  = {d.get('best_winner')}")
    print(f"         best_score   = {d.get('best_score')}")
    print(f"         generations  = {d.get('generations')}")
    hist = d.get("history", [])
    mem  = d.get("winner_memory", [])
    print(f"         history      = {len(hist)} records")
    print(f"         winner_memory= {len(mem)} records")
else:
    results["run-evolution"] = False
    print(f"  [FAIL] HTTP {s}")
    print(f"         Error: {e}")

# ── STEP 3: Confirm state updated ─────────────────────────────
print("\n[3] POST-RUN STATE VERIFICATION")

s, d, e = get("/history")
h_count = len(d.get("history", [])) if d else 0
print(f"  History records  : {h_count}")

s, d, e = get("/winner-memory")
m_count = len(d.get("memories", [])) if d else 0
print(f"  Winner memories  : {m_count}")

s, d, e = get("/api/v1/analytics")
tg = d.get("total_generations", 0) if d else 0
print(f"  Analytics total  : {tg}")

print("\n" + "=" * 60)
print("RESULTS")
print("=" * 60)

working = [k for k, v in results.items() if v]
broken  = [k for k, v in results.items() if not v]

print(f"\n  WORKING ({len(working)}): {', '.join(working) or 'none'}")
print(f"  BROKEN  ({len(broken)}): {', '.join(broken) or 'none'}")

overall = all(results.values())
print(f"\n  VERDICT: {'ALL SYSTEMS GO' if overall else 'FAILURES DETECTED'}")
sys.exit(0 if overall else 1)
