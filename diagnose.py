"""Full system diagnostic for Agent Darwin."""
import urllib.request
import urllib.error
import json
import socket
import subprocess
import sys

BACKEND = "http://127.0.0.1:8000"
FRONTEND = "http://localhost:3000"

def check(url, label, timeout=4):
    try:
        with urllib.request.urlopen(url, timeout=timeout) as r:
            body = r.read()
            ct = r.headers.get("Content-Type", "")
            try:
                data = json.loads(body)
            except Exception:
                data = body[:120].decode("utf-8", errors="replace")
            return True, r.status, data, ct
    except urllib.error.HTTPError as e:
        return False, e.code, str(e), ""
    except Exception as e:
        return False, None, str(e), ""

print("=" * 65)
print("AGENT DARWIN — FULL SYSTEM DIAGNOSTIC")
print("=" * 65)

# ── Backend checks ─────────────────────────────────────────────
print("\n[BACKEND] http://127.0.0.1:8000")

endpoints = [
    ("/health",            "Health"),
    ("/history",           "History"),
    ("/winner-memory",     "Winner Memory"),
    ("/rules",             "Rules"),
    ("/api/v1/analytics",  "Analytics"),
]

backend_ok = True
for path, label in endpoints:
    ok, status, data, ct = check(BACKEND + path, label)
    if ok:
        detail = ""
        if isinstance(data, dict):
            if "history" in data:
                detail = f"records={len(data['history'])}"
            elif "memories" in data:
                detail = f"records={len(data['memories'])}"
            elif "strengths" in data:
                detail = f"strengths={len(data['strengths'])} pitfalls={len(data.get('pitfalls',[]))}"
            elif "total_generations" in data:
                detail = f"total_gen={data['total_generations']} trait_pts={len(data.get('trait_evolution',[]))}"
            elif "status" in data:
                detail = f"status={data['status']}"
        print(f"  [OK ]  {label:18} HTTP {status}  {detail}")
    else:
        print(f"  [FAIL] {label:18} HTTP {status}  {data[:80]}")
        backend_ok = False

# ── Frontend check ─────────────────────────────────────────────
print("\n[FRONTEND] http://localhost:3000")
ok, status, data, ct = check(FRONTEND + "/", "Homepage", timeout=6)
if ok:
    is_html = "text/html" in ct
    has_content = len(str(data)) > 100
    print(f"  [OK ]  Homepage HTTP {status}  html={is_html}  content_len={len(str(data))}")
else:
    print(f"  [FAIL] Homepage  HTTP {status}  {data[:120]}")

# also check if port 3000 is even listening
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.settimeout(2)
port_open = sock.connect_ex(("127.0.0.1", 3000)) == 0
sock.close()
print(f"  Port 3000 listening: {port_open}")

# ── Core evolution logic check ─────────────────────────────────
print("\n[CORE LOGIC] Agent Darwin evolution engine")
sys.path.insert(0, ".")
sys.path.insert(0, "backend")

try:
    from agents.agent_genome import generate_random_agent
    a = generate_random_agent(1)
    print(f"  [OK ]  agent_genome        agent={a.name}  genome={a.to_dict()}")
except Exception as e:
    print(f"  [FAIL] agent_genome         {e}")

try:
    from memory.winner_memory import WinnerMemory
    wm = WinnerMemory()
    wm.file_path = "memory/winner_memory.json"
    wm.load()
    print(f"  [OK ]  winner_memory       records={len(wm.memories)}")
except Exception as e:
    print(f"  [FAIL] winner_memory        {e}")

try:
    from memory.evolution_history import EvolutionHistory
    eh = EvolutionHistory()
    eh.file_path = "memory/history.json"
    eh.load()
    print(f"  [OK ]  evolution_history   records={len(eh.generations)}")
except Exception as e:
    print(f"  [FAIL] evolution_history    {e}")

try:
    from memory.lesson_synthesizer import synthesize_lessons
    from memory.winner_memory import WinnerMemory
    wm2 = WinnerMemory()
    wm2.file_path = "memory/winner_memory.json"
    wm2.load()
    lessons = synthesize_lessons(wm2)
    print(f"  [OK ]  lesson_synthesizer  strengths={len(lessons.get('strengths',[]))} pitfalls={len(lessons.get('pitfalls',[]))}")
except Exception as e:
    print(f"  [FAIL] lesson_synthesizer   {e}")

try:
    from memory.rule_extractor import extract_rules
    rules = extract_rules(wm2)
    print(f"  [OK ]  rule_extractor      strengths={len(rules['strengths'])} pitfalls={len(rules['pitfalls'])}")
except Exception as e:
    print(f"  [FAIL] rule_extractor       {e}")

try:
    from agents.prompt_builder import build_agent_prompt
    from agents.agent_genome import generate_random_agent
    agent = generate_random_agent(1)
    wm3 = WinnerMemory()
    wm3.file_path = "memory/winner_memory.json"
    wm3.load()
    prompt = build_agent_prompt(agent, "Test task", wm3)
    print(f"  [OK ]  prompt_builder      prompt_len={len(prompt)} chars")
except Exception as e:
    print(f"  [FAIL] prompt_builder       {e}")

try:
    from cache import cache_manager
    print(f"  [OK ]  cache_manager       loaded")
except Exception as e:
    print(f"  [FAIL] cache_manager        {e}")

try:
    from judge.global_judge import rank_solutions
    print(f"  [OK ]  global_judge        loaded")
except Exception as e:
    print(f"  [FAIL] global_judge         {e}")

try:
    from evolution.generation_runner import create_next_generation
    print(f"  [OK ]  generation_runner   loaded")
except Exception as e:
    print(f"  [FAIL] generation_runner    {e}")

# ── .env check ─────────────────────────────────────────────────
print("\n[ENV] Configuration")
import os
from dotenv import load_dotenv
load_dotenv(".env")
api_key = os.getenv("GEMINI_API_KEY", "")
if api_key:
    print(f"  [OK ]  GEMINI_API_KEY      set (len={len(api_key)})")
else:
    print(f"  [FAIL] GEMINI_API_KEY      NOT SET — evolution will fail!")

print("\n" + "=" * 65)
print("DIAGNOSTIC COMPLETE")
print("=" * 65)
