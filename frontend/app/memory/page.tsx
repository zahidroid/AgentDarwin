import { MemoryCard } from "@/components/memory-card";
import { PageHeader } from "@/components/page-header";
import { TraitRadarChart } from "@/components/charts/trait-radar-chart";
import { WinnerDetails } from "@/components/winner-details";
import { getLatestMemory, getWinnerName } from "@/lib/utils";
import { getWinnerMemory } from "@/services/darwin-api";

export const dynamic = "force-dynamic";


export default async function MemoryPage() {
  const memories = await getWinnerMemory();
  const latest = getLatestMemory(memories);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Memory"
        title="Winner Memory"
        description="Stored winners, selected genomes, and winner reasons."
      />

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <WinnerDetails memory={latest} />
        <TraitRadarChart genome={latest?.genome} />
      </section>

      <section className="grid gap-4">
        {memories.map((memory) => (
          <MemoryCard key={`${memory.generation}-${getWinnerName(memory)}`} memory={memory} />
        ))}
      </section>
    </div>
  );
}
