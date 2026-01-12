"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

type Props<
  TFieldValues extends FieldValues = FieldValues
> = {
  control: Control<TFieldValues>;
};

export function BannerDisplaySettings<
  TFieldValues extends FieldValues = FieldValues
>({ control }: Props<TFieldValues>) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Configurações de Exibição</h2>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Agendamento por Data
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name={"startDate" as Path<TFieldValues>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Quando o banner começa</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={"endDate" as Path<TFieldValues>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Término</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Quando o banner termina</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Agendamento por Horário
        </h3>
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
                    value={field.value || ""}
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
                    value={field.value || ""}
                    pattern="\d{2}:\d{2}:\d{2}"
                  />
                </FormControl>
                <FormDescription>Formato HH:MM:SS</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
              Fuso horário para agendamento de data e horário
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
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
