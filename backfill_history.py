"""
Backfill history.json from winner_memory.json.
Run once to populate history for existing winner memories.
"""
import json
import os

memory_dir = os.path.join(os.path.dirname(__file__), "memory")
winner_path = os.path.join(memory_dir, "winner_memory.json")
history_path = os.path.join(memory_dir, "history.json")

with open(winner_path, "r", encoding="utf-8") as f:
    memories = json.load(f)

print(f"Loaded {len(memories)} winner memory records")

# Build history records from winner memories
history = []
for m in memories:
    record = {
        "generation": m.get("generation", 0),
        "best_score": m.get("score", 0),
        "winner": m.get("winner", "Unknown"),
    }
    genome = m.get("genome")
    if genome:
        trait_snapshot = {k: v for k, v in genome.items() if k != "name"}
        if trait_snapshot:
            record["trait_snapshot"] = trait_snapshot

    history.append(record)

# Sort by generation number
history.sort(key=lambda x: x["generation"])

# Deduplicate by (generation, winner) keeping highest score
seen = {}
for rec in history:
    key = (rec["generation"], rec["winner"])
    if key not in seen or rec["best_score"] > seen[key]["best_score"]:
        seen[key] = rec

deduped = sorted(seen.values(), key=lambda x: x["generation"])

with open(history_path, "w", encoding="utf-8") as f:
    json.dump(deduped, f, indent=4)

print(f"Wrote {len(deduped)} records to memory/history.json")
for r in deduped[:5]:
    print(f"  Gen {r['generation']}: {r['winner']} (score={r['best_score']})")
