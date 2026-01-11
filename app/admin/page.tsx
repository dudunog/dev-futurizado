import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBannerButton } from "@/components/admin/create-banner-button";
import { prisma } from "@/lib/prisma";

import { ImageIcon, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  description: "Painel administrativo",
};

async function getStats() {
  const [totalBanners, activeBanners] = await Promise.all([
    prisma.banner.count(),
    prisma.banner.count({ where: { isActive: true } }),
  ]);

  return {
    totalBanners,
    activeBanners,
    inactiveBanners: totalBanners - activeBanners,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Bem-vindo ao painel de gerenciamento de banners
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Banners
              </CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBanners}</div>
              <p className="text-xs text-muted-foreground">
                banners cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Banners Ativos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.activeBanners}
              </div>
              <p className="text-xs text-muted-foreground">
                atualmente exibindo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Banners Inativos
              </CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {stats.inactiveBanners}
              </div>
              <p className="text-xs text-muted-foreground">
                pausados ou desativados
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateBannerButton />
    </div>
  );
}
