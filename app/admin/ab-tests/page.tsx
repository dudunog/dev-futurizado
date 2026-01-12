import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { BarChart3, Eye, MousePointerClick, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Testes A/B | Admin",
  description: "Gerencie e visualize estatísticas de testes A/B",
};

async function getTestGroups() {
  const groups = await prisma.abTestGroup.findMany({
    include: {
      variants: {
        include: {
          banner: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const groupsWithStats = await Promise.all(
    groups.map(async (group) => {
      const stats = await Promise.all(
        group.variants.map(async (variant) => {
          const [impressions, clicks] = await Promise.all([
            prisma.bannerAnalytics.count({
              where: {
                bannerId: variant.bannerId,
                eventType: "impression",
              },
            }),
            prisma.bannerAnalytics.count({
              where: {
                bannerId: variant.bannerId,
                eventType: "click",
              },
            }),
          ]);

          return {
            variant: variant.variant,
            impressions,
            clicks,
            ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
          };
        })
      );

      const totalImpressions = stats.reduce((sum, s) => sum + s.impressions, 0);
      const totalClicks = stats.reduce((sum, s) => sum + s.clicks, 0);
      const avgCtr =
        stats.length > 0
          ? stats.reduce((sum, s) => sum + s.ctr, 0) / stats.length
          : 0;

      return {
        id: group.id,
        name: group.name,
        description: group.description,
        isActive: group.isActive,
        variantsCount: group.variants.length,
        totalImpressions,
        totalClicks,
        avgCtr,
      };
    })
  );

  return groupsWithStats;
}

export default async function AbTestsPage() {
  const testGroups = await getTestGroups();

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testes A/B</h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie seus testes A/B e suas estatísticas
          </p>
        </div>

        {testGroups.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum teste A/B encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Crie grupos de teste A/B nos banners para começar a coletar
                estatísticas
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testGroups.map((group) => (
              <Card key={group.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-1">{group.name}</CardTitle>
                      {group.description && (
                        <CardDescription>{group.description}</CardDescription>
                      )}
                    </div>
                    <Badge variant={group.isActive ? "default" : "secondary"}>
                      {group.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Eye className="h-4 w-4" />
                          <span>Impressões</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {group.totalImpressions.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <MousePointerClick className="h-4 w-4" />
                          <span>Cliques</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {group.totalClicks.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>CTR Médio</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {group.avgCtr.toFixed(2)}%
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {group.variantsCount} variante
                      {group.variantsCount !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/admin/ab-tests/${group.id}`}>
                        Ver Estatísticas Detalhadas
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
