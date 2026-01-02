"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BannerDisplaySettingsProps<
  TFieldValues extends FieldValues = FieldValues
> = {
  control: Control<TFieldValues>;
};

export function BannerDisplaySettings<
  TFieldValues extends FieldValues = FieldValues
>({ control }: BannerDisplaySettingsProps<TFieldValues>) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Configurações de Exibição</h2>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name={"startTime" as Path<TFieldValues>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário de Início</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="08:00:00"
                  {...field}
                  pattern="\d{2}:\d{2}:\d{2}"
                />
              </FormControl>
              <FormDescription>Formato HH:MM:SS</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={"endTime" as Path<TFieldValues>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário de Término</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="12:00:00"
                  {...field}
                  pattern="\d{2}:\d{2}:\d{2}"
                />
              </FormControl>
              <FormDescription>Formato HH:MM:SS</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={"timezone" as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fuso Horário</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fuso horário" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/Sao_Paulo">
                  America/Sao_Paulo
                </SelectItem>
                <SelectItem value="America/New_York">
                  America/New_York
                </SelectItem>
                <SelectItem value="Europe/London">Europe/London</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Fuso horário para o horário de exibição
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={"isActive" as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Ativo</FormLabel>
              <FormDescription>
                Habilitar ou desabilitar este banner
              </FormDescription>
            </div>
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="h-5 w-5 rounded border-input cursor-pointer"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
