"use client";

import { useMemo } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type BannerPreviewProps = {
  imageUrl?: string;
  imageAlt?: string;
  clickUrl?: string;
  animationType?: "fade" | "slide" | "bounce" | null;
  displayDuration?: number | null;
};

export function BannerPreview({
  imageUrl,
  imageAlt,
  clickUrl,
  animationType,
  displayDuration,
}: BannerPreviewProps) {
  const animationClass = useMemo(() => {
    if (!animationType) return "animate-fade-in";
    switch (animationType) {
      case "fade":
        return "animate-fade-in";
      case "slide":
        return "animate-slide-down";
      case "bounce":
        return "animate-bounce-in";
      default:
        return "animate-fade-in";
    }
  }, [animationType]);

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Preview do Banner
          </p>
          <p className="text-xs text-muted-foreground">
            Envie uma imagem para ver o preview
          </p>
        </div>
      </div>
    );
  }

  const BannerContent = clickUrl ? (
    <a
      href={clickUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <Image
        src={imageUrl}
        alt={imageAlt || "Preview do banner"}
        width={800}
        height={200}
        className={cn("w-full h-auto object-cover rounded-lg", animationClass)}
        unoptimized
      />
    </a>
  ) : (
    <Image
      src={imageUrl}
      alt={imageAlt || "Preview do banner"}
      width={800}
      height={200}
      className={cn("w-full h-auto object-cover rounded-lg", animationClass)}
      unoptimized
    />
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Preview</h3>
        <div className="relative rounded-lg border border-border overflow-hidden bg-background shadow-sm">
          {BannerContent}
          {displayDuration && displayDuration > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Fechar automaticamente: {displayDuration}s
            </div>
          )}
        </div>
      </div>

      {animationType && (
        <div className="text-xs text-muted-foreground">
          Animação:{" "}
          <span className="font-medium capitalize">{animationType}</span>
        </div>
      )}
    </div>
  );
}
