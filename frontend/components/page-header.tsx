import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#00d4aa]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-[#f1f5f9]">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-[#8892a4]">{description}</p>
        )}
      </div>
      {action && <div className="mt-3 sm:mt-0 sm:shrink-0">{action}</div>}
    </div>
  );
}
