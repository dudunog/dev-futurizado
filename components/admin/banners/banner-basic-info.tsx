"use client";

import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./image-upload";

type BannerBasicInfoProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
};

export function BannerBasicInfo<
  TFieldValues extends FieldValues = FieldValues
>({ control, errors }: BannerBasicInfoProps<TFieldValues>) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Informações Básicas</h2>

      <FormField
        control={control}
        name={"targetUrl" as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL de Destino *</FormLabel>
            <FormControl>
              <Input placeholder="https://exemplo.com/pagina" {...field} />
            </FormControl>
            <FormDescription>
              A URL onde este banner deve aparecer
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={"imageUrl" as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imagem do Banner *</FormLabel>
            <FormControl>
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                error={errors?.imageUrl?.message as string | undefined}
              />
            </FormControl>
            <FormDescription>
              Envie uma imagem ou insira uma URL de imagem
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={"imageAlt" as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Texto Alternativo da Imagem</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Texto descritivo para a imagem do banner"
                {...field}
                rows={2}
              />
            </FormControl>
            <FormDescription>
              Texto alternativo para acessibilidade
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
