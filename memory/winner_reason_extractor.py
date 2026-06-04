import json
from utils.llm import llm


def extract_winner_reasons(
    task,
    solution,
    score
):

    prompt = f"""
You are an expert evaluator.

TASK:
{task}

WINNING SOLUTION:
{solution}

FINAL SCORE:
{score}

Analyze the winning solution.

Return ONLY valid JSON.

Example:

{{
    "strengths": [
        "Strong execution",
        "Clear roadmap",
        "Realistic market"
    ],

    "improvements": [
        "Better differentiation",
        "More metrics",
        "Stronger pricing strategy"
    ]
}}
"""

    response = llm.invoke(prompt)

    content = response.content.strip()

    try:

        start = content.find("{")
        end = content.rfind("}") + 1

        json_text = content[start:end]

        return json.loads(json_text)

    except Exception:

        return {
            "strengths": [],
            "improvements": []
        }