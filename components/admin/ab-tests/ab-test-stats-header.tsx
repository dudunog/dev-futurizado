import type { AbTestGroup } from "@/lib/types/ab-test";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";

type Props = {
  testGroup: AbTestGroup;
};

export function AbTestStatsHeader({ testGroup }: Props) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/admin/ab-tests">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{testGroup.name}</h1>
        {testGroup.description && (
          <p className="text-muted-foreground mt-2">{testGroup.description}</p>
        )}
      </div>
      <Badge variant={testGroup.isActive ? "default" : "secondary"}>
        {testGroup.isActive ? "Ativo" : "Inativo"}
      </Badge>
    </div>
  );
}
