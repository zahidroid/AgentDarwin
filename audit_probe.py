import urllib.request
import urllib.error
import json
import sys

def get(url, timeout=5):
    try:
        with urllib.request.urlopen(url, timeout=timeout) as r:
            return r.status, json.loads(r.read()), None
    except urllib.error.HTTPError as e:
        return e.code, None, str(e)
    except Exception as e:
        return None, None, str(e)

def post(url, body, timeout=8):
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        url, data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, json.loads(r.read()), None
    except urllib.error.HTTPError as e:
        return e.code, None, str(e)
    except Exception as e:
        return None, None, str(e)

print("=" * 60)
print("AGENT DARWIN — DEMO READINESS AUDIT")
print("=" * 60)

# 1. Health
s, d, e = get("http://127.0.0.1:8000/health")
print("\n[1] BACKEND HEALTH")
print("  Status:", s, "OK" if s == 200 else "FAIL")
if e: print("  ERROR:", e)

# 2. History
s, d, e = get("http://127.0.0.1:8000/history")
history_records = len(d.get("history", [])) if d else 0
print("\n[2] HISTORY ENDPOINT")
print("  Status:", s, "OK" if s == 200 else "FAIL")
print("  Records:", history_records)
if e: print("  ERROR:", e)

# 3. Winner memory
s, d, e = get("http://127.0.0.1:8000/winner-memory")
mem_records = len(d.get("memories", [])) if d else 0
print("\n[3] WINNER MEMORY ENDPOINT")
print("  Status:", s, "OK" if s == 200 else "FAIL")
print("  Records:", mem_records)
if e: print("  ERROR:", e)

# 4. Rules
s, d, e = get("http://127.0.0.1:8000/rules")
print("\n[4] RULES ENDPOINT")
print("  Status:", s, "OK" if s == 200 else "FAIL")
if d:
    print("  Strengths:", len(d.get("strengths", [])))
    print("  Pitfalls:", len(d.get("pitfalls", [])))
if e: print("  ERROR:", e)

# 5. Analytics
s, d, e = get("http://127.0.0.1:8000/api/v1/analytics")
print("\n[5] ANALYTICS ENDPOINT")
print("  Status:", s, "OK" if s == 200 else "FAIL")
if d:
    print("  total_generations:", d.get("total_generations"))
    print("  trait_evolution points:", len(d.get("trait_evolution", [])))
    print("  diversity_series points:", len(d.get("diversity_series", [])))
    print("  enriched_generations:", d.get("meta", {}).get("enriched_generations"))
    print("  legacy_generations:", d.get("meta", {}).get("legacy_generations"))
    # Check if any trait_snapshot has actual data
    enriched = [p for p in d.get("trait_evolution", []) if p.get("creativity") is not None]
    print("  points with trait data:", len(enriched))
if e: print("  ERROR:", e)

# 6. SSE stream — read first event only
print("\n[6] SSE STREAM (first event only, 1 gen)")
try:
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/v1/run-evolution/stream",
        data=json.dumps({"task": "AUDIT: design a product", "generations": 1}).encode(),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    print("  Connecting to SSE...")
    with urllib.request.urlopen(req, timeout=120) as r:
        print("  HTTP Status:", r.status)
        ct = r.headers.get("Content-Type", "")
        print("  Content-Type:", ct)
        if "text/event-stream" not in ct:
            print("  WARN: Content-Type is not text/event-stream")
        
        # Read up to 4096 bytes or until we get a data: line
        buf = b""
        for _ in range(200):
            chunk = r.read(128)
            if not chunk:
                break
            buf += chunk
            if b"\n\n" in buf:
                break
        
        text = buf.decode("utf-8", errors="replace")
        lines = [l for l in text.split("\n") if l.startswith("data:")]
        if lines:
            payload = json.loads(lines[0][5:].strip())
            print("  First SSE event keys:", list(payload.keys()))
            print("  generation:", payload.get("generation"))
            print("  winner:", payload.get("winner"))
            print("  score:", payload.get("score"))
            print("  winner_genome:", payload.get("winner_genome"))
            print("  population_scores:", payload.get("population_scores"))
            print("  diversity_score:", payload.get("diversity_score"))
            print("  done:", payload.get("done"))
        else:
            print("  No data: lines received. Raw:", repr(text[:200]))
except Exception as ex:
    print("  FAIL:", ex)

print("\n" + "=" * 60)
print("AUDIT COMPLETE")
print("=" * 60)
