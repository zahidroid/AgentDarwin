def select_survivors(results, top_k=2):

    sorted_results = sorted(
        results,
        key=lambda x: x["score"]["total"],
        reverse=True
    )

    return sorted_results[:top_k]