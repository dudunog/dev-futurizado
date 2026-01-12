"use client";

import type { Banner } from "@/lib/types/banner";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { formatShortDate } from "@/lib/utils/time";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import {
  Calendar,
  Clock,
  Edit,
  GripVertical,
  Trash2,
  TestTube,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  banner: Banner;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
};

export function BannerCard({
  banner,
  attributes,
  listeners,
  onDelete,
  onToggleActive,
}: Props) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleActive = async (checked: boolean) => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      const response = await fetch(`/api/banners/${banner.id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: checked }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar banner");
      }

      onToggleActive?.(banner.id, checked);
      router.refresh();
    } catch (error) {
      console.error("Error toggling banner:", error);
      alert("Erro ao atualizar banner. Tente novamente.");
    } finally {
      setIsToggling(false);
    }
  };
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
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent align="center">
              Arraste para reordenar
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Badge className="shrink-0">#{banner.priority}</Badge>
            </TooltipTrigger>
            <TooltipContent align="center">Prioridade do banner</TooltipContent>
          </Tooltip>
          <span className="text-sm font-medium truncate">
            {banner.targetUrl}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              {banner.abTestVariant &&
                banner.abTestVariant.testGroup.isActive && (
                  <Badge
                    variant="outline"
                    className="text-xs shrink-0 flex items-center gap-1"
                  >
                    <TestTube className="h-3 w-3" />
                    {banner.abTestVariant.variant}
                  </Badge>
                )}
            </TooltipTrigger>
            <TooltipContent align="center">
              Teste A/B ativo:{" "}
              {banner.abTestVariant?.testGroup.name || "Não definido"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              {banner.animationType && (
                <Badge variant="outline" className="text-xs shrink-0">
                  {banner.animationType}
                </Badge>
              )}
            </TooltipTrigger>
            <TooltipContent align="center">
              Tipo de animação: {banner.animationType || "Não definido"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              {(banner.startDate || banner.endDate) && (
                <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {banner.startDate && banner.endDate
                    ? `${formatShortDate(banner.startDate)} - ${formatShortDate(
                        banner.endDate
                      )}`
                    : banner.startDate
                    ? `A partir de ${formatShortDate(banner.startDate)}`
                    : `Até ${formatShortDate(banner.endDate)}`}
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent align="center">
              Data de início e fim:
            </TooltipContent>
          </Tooltip>
          {banner.startTime && banner.endTime && (
            <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {banner.startTime.slice(0, 5)} - {banner.endTime.slice(0, 5)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Tooltip>
            <TooltipTrigger>
              <Switch
                checked={banner.isActive}
                onCheckedChange={handleToggleActive}
                disabled={isToggling}
                className="shrink-0"
              />
            </TooltipTrigger>
            <TooltipContent align="center">
              {banner.isActive ? "Desativar" : "Ativar"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <Link href={`/admin/banners/${banner.id}`}>
                  <Edit className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent align="center">Editar banner</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete?.(banner.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="center">Deletar banner</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="relative w-full aspect-4/1 bg-muted">{ImageWrapper}</div>
    </Card>
  );
}
