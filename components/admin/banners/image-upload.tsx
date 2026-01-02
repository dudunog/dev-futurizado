"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadBannerImage } from "@/lib/storage";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  error?: string;
}

export function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setUploadError(null);
      setIsUploading(true);

      // Create local preview
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      try {
        const result = await uploadBannerImage(file);
        onChange(result.url);
        setPreview(result.url);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Falha ao fazer upload da imagem";
        setUploadError(errorMessage);
        setPreview(null);
        onChange("");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFile(file);
      } else {
        setUploadError("Por favor, solte um arquivo de imagem");
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    onChange("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-2">
      <Label>Imagem do Banner</Label>

      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg border border-border overflow-hidden bg-muted">
            <Image
              src={preview}
              alt="Preview do banner"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50",
            error || uploadError ? "border-destructive" : ""
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Enviando...</p>
                  <p className="text-xs text-muted-foreground">
                    Aguarde enquanto enviamos sua imagem
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-full bg-muted p-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Clique para enviar ou arraste e solte
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF ou WEBP (máx. 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="text-xs text-muted-foreground">
          Ou insira a URL da imagem manualmente
        </Label>
        <div className="flex gap-2">
          <Input
            id="imageUrl"
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={value || ""}
            onChange={(e) => {
              onChange(e.target.value);
              setPreview(e.target.value || null);
              setUploadError(null);
            }}
            disabled={isUploading}
            className={cn(error || uploadError ? "border-destructive" : "")}
          />
          {value && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {(error || uploadError) && (
        <p className="text-sm text-destructive">{error || uploadError}</p>
      )}
    </div>
  );
}
