from utils.llm import llm

from cache.cache_manager import (
    get_cached_response,
    save_response
)


def run_agent(prompt):

    cached = get_cached_response(
        prompt
    )

    if cached:

        print(
            "[CACHE HIT]"
        )

        return cached

    print(
        "[GEMINI CALL]"
    )

    response = llm.invoke(
        prompt
    )

    content = response.content

    save_response(
        prompt,
        content
    )

    return content