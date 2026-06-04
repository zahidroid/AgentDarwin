import json
import hashlib
import os


CACHE_FILE = "cache/cache_data.json"


def load_cache():

    if not os.path.exists(
        CACHE_FILE
    ):

        return {}

    with open(
        CACHE_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


def save_cache(
    cache
):

    with open(
        CACHE_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            cache,
            file,
            indent=4
        )


def create_key(
    prompt
):

    return hashlib.md5(
        prompt.encode()
    ).hexdigest()


def get_cached_response(
    prompt
):

    cache = load_cache()

    key = create_key(
        prompt
    )

    return cache.get(key)


def save_response(
    prompt,
    response
):

    cache = load_cache()

    key = create_key(
        prompt
    )

    cache[key] = response

    save_cache(cache)