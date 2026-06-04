import { PageHeader } from "@/components/page-header";
import { RunEvolutionForm } from "@/components/run-evolution-form";

export default function RunPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Run"
        title="Run Evolution"
        description="Submit a task and execute the Agent Darwin pipeline."
      />

      <RunEvolutionForm />
    </div>
  );
}
