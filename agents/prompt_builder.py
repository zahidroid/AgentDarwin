from memory.lesson_synthesizer import (
    synthesize_lessons
)
from memory.reflection import reflect


def build_agent_prompt(
    genome,
    task,
    winner_memory=None,
    history=None
):

    lessons_block = ""
    pitfalls_block = ""
    reflection_block = ""

    if winner_memory:

        lessons = synthesize_lessons(
            winner_memory
        )

        strengths = lessons.get(
            "strengths",
            []
        )

        pitfalls = lessons.get(
            "pitfalls",
            []
        )

        # ── Strengths block (existing behaviour, unchanged) ────────────────

        if strengths:

            lessons_block = f"""

Lessons learned from successful agents:

{chr(10).join(
    '- ' + s
    for s in strengths
)}

Consider these lessons,
but do not blindly copy them.
"""

        # ── Pitfalls block — recurring gaps even in winning solutions ──────

        if pitfalls:

            pitfalls_block = f"""

Common gaps even in winning solutions — do not omit:

{chr(10).join(
    '- ' + p
    for p in pitfalls
)}
"""

    # ── Reflection block — regression / stagnation warning ────────────────

    if history is not None:

        warning = reflect(history, winner_memory)

        if warning:

            reflection_block = f"""

{warning}
"""

    prompt = f"""
You are an autonomous problem-solving agent.

Your personality traits:

Creativity: {genome.creativity}/100
Risk Tolerance: {genome.risk}/100
Depth of Analysis: {genome.depth}/100
Skepticism: {genome.skepticism}/100
Execution Focus: {genome.execution_focus}/100
{lessons_block}{pitfalls_block}{reflection_block}
Approach the following task according to these traits.

TASK:
{task}

Provide a detailed solution.
"""

    return prompt