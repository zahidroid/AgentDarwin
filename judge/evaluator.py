import json
from utils.llm import llm


def evaluate_solution(task, solution):

    judge_prompt = f"""
You are an expert evaluator.

TASK:
{task}

SOLUTION:
{solution}

Evaluate the solution on:

1. Novelty (0-10)
2. Feasibility (0-10)
3. Completeness (0-10)
4. Clarity (0-10)

Return ONLY valid JSON.

Example:

{{
    "novelty": 8,
    "feasibility": 9,
    "completeness": 7,
    "clarity": 8,
    "total": 32
}}
"""

    response = llm.invoke(judge_prompt)

    content = response.content.strip()

    try:
        start = content.find("{")
        end = content.rfind("}") + 1

        json_text = content[start:end]

        return json.loads(json_text)

    except Exception:

        return {
            "novelty": 0,
            "feasibility": 0,
            "completeness": 0,
            "clarity": 0,
            "total": 0
        }