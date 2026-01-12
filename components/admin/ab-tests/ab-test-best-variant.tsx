import type { VariantStat } from "@/lib/types/ab-test";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Target } from "lucide-react";

type Props = {
  bestVariant: VariantStat | null;
  totalVariants: number;
};

export function AbTestBestVariant({ bestVariant, totalVariants }: Props) {
  if (!bestVariant || totalVariants <= 1) {
    return null;
  }

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle>Melhor Performance</CardTitle>
        </div>
        <CardDescription>Variante com maior taxa de conversão</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">Variante {bestVariant.variant}</Badge>
              {bestVariant.isControl && (
                <Badge variant="outline">Controle</Badge>
              )}
            </div>
            <div className="text-2xl font-bold text-primary">
              {bestVariant.ctr.toFixed(2)}% CTR
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {bestVariant.clicks.toLocaleString()} cliques de{" "}
              {bestVariant.impressions.toLocaleString()} impressões
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
