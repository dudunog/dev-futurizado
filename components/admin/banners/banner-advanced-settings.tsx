"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BannerAdvancedSettingsProps<
  TFieldValues extends FieldValues = FieldValues
> = {
  control: Control<TFieldValues>;
};

export function BannerAdvancedSettings<
  TFieldValues extends FieldValues = FieldValues
>({ control }: BannerAdvancedSettingsProps<TFieldValues>) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Configurações Avançadas</h2>

      <FormField
        control={control}
        name={"clickUrl" as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL de Clique</FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="https://exemplo.com/landing"
                {...field}
              />
            </FormControl>
            <FormDescription>
              URL para redirecionar quando o banner for clicado
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={"displayDuration" as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duração de Exibição (segundos)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                placeholder="0 (permanente)"
                {...field}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription>
              Fechar automaticamente após X segundos (0 = permanente)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={"animationType" as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Animação</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a animação" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="slide">Slide</SelectItem>
                <SelectItem value="bounce">Bounce</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Efeito de animação quando o banner aparecer
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={"priority" as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prioridade</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="0"
                {...field}
                onChange={(e) =>
                  field.onChange(parseInt(e.target.value, 10) || 0)
                }
                value={field.value}
              />
            </FormControl>
            <FormDescription>
              Banners com maior prioridade aparecem primeiro
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
