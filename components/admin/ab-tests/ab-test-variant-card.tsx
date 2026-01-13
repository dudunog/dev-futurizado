import type { VariantStat } from "@/lib/types/ab-test";

import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  variant: VariantStat;
};

export function AbTestVariantCard({ variant }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Variante {variant.variant}</CardTitle>
            {variant.isControl && <Badge variant="outline">Controle</Badge>}
          </div>
          <Badge variant="secondary">{variant.trafficSplit}% tráfego</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative w-full aspect-4/1 bg-muted rounded-lg overflow-hidden">
            {variant.bannerImageUrl ? (
              <Image
                src={variant.bannerImageUrl}
                alt={`Banner da variante ${variant.variant}`}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                Sem imagem
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Impressões
              </div>
              <div className="text-xl font-bold">
                {variant.impressions.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Cliques</div>
              <div className="text-xl font-bold">
                {variant.clicks.toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">
              Taxa de Conversão (CTR)
            </div>
            <div className="text-3xl font-bold">{variant.ctr.toFixed(2)}%</div>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/banners/${variant.bannerId}`}>
                Ver detalhes do banner
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
