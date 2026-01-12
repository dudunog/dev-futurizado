import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Eye, MousePointerClick, TrendingUp } from "lucide-react";

type Props = {
  totalImpressions: number;
  totalClicks: number;
  overallCtr: number;
};

export function AbTestStatsOverview({
  totalImpressions,
  totalClicks,
  overallCtr,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Impressões
          </CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalImpressions.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Cliques
          </CardTitle>
          <MousePointerClick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            2{totalClicks.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CTR Geral</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallCtr.toFixed(2)}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
