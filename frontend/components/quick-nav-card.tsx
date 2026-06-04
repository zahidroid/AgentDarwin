import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type QuickNavCardProps = {
  href: string;
  title: string;
  metric: string;
  icon: LucideIcon;
};

export function QuickNavCard({ href, title, metric, icon: Icon }: QuickNavCardProps) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:border-zinc-950">
        <CardContent className="flex min-h-28 items-center justify-between p-5">
          <div>
            <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Icon className="size-4" />
            </div>
            <div className="mt-4 text-sm font-semibold text-zinc-950">{title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{metric}</div>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}
