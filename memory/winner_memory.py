import json
import os


class WinnerMemory:

    def __init__(self):

        self.file_path = "memory/winner_memory.json"

        self.memories = []

        self.load()

    def load(self):

        if os.path.exists(self.file_path):

            try:

                with open(
                    self.file_path,
                    "r",
                    encoding="utf-8"
                ) as file:

                    self.memories = json.load(file)

            except Exception:

                self.memories = []

    def save(self):

        with open(
            self.file_path,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                self.memories,
                file,
                indent=4
            )

    def add(
        self,
        generation,
        winner_name,
        score,
        genome,
        reasons=None
    ):

        self.memories.append(
            {
                "generation": generation,
                "winner": winner_name,
                "score": score,
                "genome": genome.to_dict(),
                "reasons": reasons
            }
        )

        self.save()

    def show(self):

        print("\nWINNER MEMORY\n")

        for memory in self.memories:

            print(memory)