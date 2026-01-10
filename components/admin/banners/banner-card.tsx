"use client";

import type { Banner } from "@/app/generated/prisma/client";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Edit, GripVertical, Trash2 } from "lucide-react";

type BannerCardProps = {
  banner: Banner;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  onDelete?: (id: string) => void;
};

export function BannerCard({
  banner,
  attributes,
  listeners,
  onDelete,
}: BannerCardProps) {
  const ImageWrapper = banner.clickUrl ? (
    <a
      href={banner.clickUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-full cursor-pointer hover:opacity-95 transition-opacity"
    >
      {banner.imageUrl ? (
        <Image
          src={banner.imageUrl}
          alt={banner.imageAlt || "Banner"}
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
          Sem imagem
        </div>
      )}
    </a>
  ) : (
    <>
      {banner.imageUrl ? (
        <Image
          src={banner.imageUrl}
          alt={banner.imageAlt || "Banner"}
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
          Sem imagem
        </div>
      )}
    </>
  );

  return (
    <Card className="group hover:shadow-md transition-shadow overflow-hidden gap-0 py-0">
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/50 border-b">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <div className="shrink-0 cursor-grab active:cursor-grabbing">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground  transition-opacity"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5" />
            </Button>
          </div>
          <Badge className="shrink-0">#{banner.priority}</Badge>
          <span className="text-sm font-medium truncate">
            {banner.targetUrl}
          </span>
          <Badge
            variant={banner.isActive ? "default" : "secondary"}
            className="shrink-0"
          >
            {banner.isActive ? "Ativo" : "Inativo"}
          </Badge>
          {banner.animationType && (
            <Badge variant="outline" className="text-xs shrink-0">
              {banner.animationType}
            </Badge>
          )}
          {banner.startTime && banner.endTime && (
            <span className="text-xs text-muted-foreground shrink-0">
              {banner.startTime} - {banner.endTime}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
            <Link href={`/admin/banners/${banner.id}`}>
              <Edit className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete?.(banner.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="relative w-full aspect-4/1 bg-muted">{ImageWrapper}</div>
    </Card>
  );
}
