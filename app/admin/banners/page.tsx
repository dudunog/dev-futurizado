import Link from "next/link";
import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { BannerListWrapper } from "./banner-list-wrapper";

import { getBanners } from "@/app/actions/get-banners";

import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Banners | Admin",
  description: "Gerencie seus banners",
};

export default async function BannersPage() {
  const banners = await getBanners();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus banners e ajuste a prioridade de exibição
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/banners/novo">
              <Plus className="mr-2 h-4 w-4" />
              Criar Banner
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
          <p>
            Arraste os banners para reordenar a prioridade de exibição. Banners
            no <strong>topo</strong> têm maior prioridade.
          </p>
        </div>

        <BannerListWrapper initialBanners={banners} />
      </div>
    </div>
  );
}
