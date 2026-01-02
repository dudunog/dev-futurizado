"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BannerPreview } from "./banner-preview";
import { BannerBasicInfo } from "./banner-basic-info";
import { BannerDisplaySettings } from "./banner-display-settings";
import { BannerAdvancedSettings } from "./banner-advanced-settings";

import { useBannerForm } from "./hooks/use-banner-form";

import {
  createBannerSchema,
  updateBannerSchema,
  type CreateBannerInput,
} from "@/lib/validations/banner";

import { Loader2 } from "lucide-react";

type BannerFormProps = {
  initialData?: Partial<CreateBannerInput>;
  bannerId?: string;
  mode: "create" | "edit";
};

export function BannerForm({ initialData, bannerId, mode }: BannerFormProps) {
  const schema = mode === "create" ? createBannerSchema : updateBannerSchema;
  type FormData = z.infer<typeof schema>;

  const defaultValues: Partial<CreateBannerInput> = {
    targetUrl: initialData?.targetUrl || "",
    imageUrl: initialData?.imageUrl || "",
    imageAlt: initialData?.imageAlt || "",
    startTime: initialData?.startTime || "",
    endTime: initialData?.endTime || "",
    timezone: initialData?.timezone || "UTC",
    clickUrl: initialData?.clickUrl || "",
    displayDuration: initialData?.displayDuration || undefined,
    animationType: initialData?.animationType || undefined,
    priority: initialData?.priority ?? 0,
    isActive: initialData?.isActive ?? true,
  };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as Partial<FormData>,
    mode: "onChange",
  });

  const watchedValues = form.watch();
  const { onSubmit, isSubmitting, submitError, router } = useBannerForm({
    mode,
    bannerId,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <BannerBasicInfo
              control={form.control}
              errors={form.formState.errors}
            />
            <BannerDisplaySettings control={form.control} />
            <BannerAdvancedSettings control={form.control} />
          </div>

          <div className="lg:sticky lg:top-4 lg:h-fit">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <BannerPreview
                imageUrl={watchedValues.imageUrl}
                imageAlt={watchedValues.imageAlt}
                clickUrl={watchedValues.clickUrl}
                animationType={watchedValues.animationType}
                displayDuration={watchedValues.displayDuration}
              />
            </div>
          </div>
        </div>

        {submitError && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{submitError}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-4 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Criar Banner" : "Atualizar Banner"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
