def attach_scores(results, rankings):

    ranking_map = {}

    for item in rankings:

        ranking_map[
            item["agent_name"]
        ] = item

    for result in results:

        agent_name = result["agent"].name

        if agent_name in ranking_map:

            result["score"] = {
                "total":
                ranking_map[agent_name]["score"]
            }

        else:

            # Guard: agent was not ranked by the judge (name mismatch,
            # LLM truncation, etc.).  Default to 0 so the sort in
            # main.py never raises a KeyError.
            result.setdefault(
                "score",
                {"total": 0}
            )

    return results