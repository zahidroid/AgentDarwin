import time, urllib.request, json, sys

time.sleep(4)

def get(url):
    with urllib.request.urlopen(url, timeout=5) as r:
        return json.loads(r.read())

tests = [
    ("health",     "http://127.0.0.1:8000/health"),
    ("history",    "http://127.0.0.1:8000/history"),
    ("winner-mem", "http://127.0.0.1:8000/winner-memory"),
    ("rules",      "http://127.0.0.1:8000/rules"),
    ("analytics",  "http://127.0.0.1:8000/api/v1/analytics"),
]

all_ok = True
for name, url in tests:
    try:
        d = get(url)
        if name == "history":
            n = len(d.get("history", []))
            ok = n > 0
            print(f"[{'OK' if ok else 'FAIL'}] {name}: records={n}")
        elif name == "winner-mem":
            n = len(d.get("memories", []))
            ok = n > 0
            print(f"[{'OK' if ok else 'FAIL'}] {name}: records={n}")
        elif name == "rules":
            s = len(d.get("strengths", []))
            p = len(d.get("pitfalls", []))
            ok = s > 0
            print(f"[{'OK' if ok else 'FAIL'}] {name}: strengths={s} pitfalls={p}")
        elif name == "analytics":
            tg = d["total_generations"]
            tp = len(d["trait_evolution"])
            eg = d["meta"]["enriched_generations"]
            ok = tg > 0
            print(f"[{'OK' if ok else 'FAIL'}] {name}: total_gen={tg} trait_pts={tp} enriched={eg}")
        else:
            ok = True
            print(f"[OK] {name}: {list(d.keys())}")
        if not ok:
            all_ok = False
    except Exception as e:
        print(f"[FAIL] {name}: {e}")
        all_ok = False

print()
print("ALL CLEAR" if all_ok else "FAILURES DETECTED")
sys.exit(0 if all_ok else 1)
