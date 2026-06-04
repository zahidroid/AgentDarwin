from memory.rule_extractor import (
    extract_rules
)


def show_rules(winner_memory):

    rules = extract_rules(winner_memory)

    strength_rules = rules.get("strengths", [])
    pitfall_rules = rules.get("pitfalls", [])

    print("\nDISCOVERED SUCCESS RULES\n")

    if strength_rules:

        for rule, count in strength_rules:

            print(f"[STRENGTH x{count}] {rule}")

    else:

        print("No recurring strengths yet (need >= 2 matching winners).")

    print("\nDISCOVERED PITFALL PATTERNS\n")

    if pitfall_rules:

        for rule, count in pitfall_rules:

            print(f"[PITFALL x{count}] {rule}")

    else:

        print("No recurring pitfalls yet (need >= 2 matching winners).")