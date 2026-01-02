import { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";

type UseBannerFormProps = {
  mode: "create" | "edit";
  bannerId?: string;
};

export function useBannerForm<TFieldValues extends FieldValues = FieldValues>({
  mode,
  bannerId,
}: UseBannerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: TFieldValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const url =
        mode === "create"
          ? "/api/banners/create"
          : `/api/banners/${bannerId}/update`;

      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao salvar banner");
      }

      const result = await response.json();

      if (mode === "create") {
        router.push(`/admin/banners/${result.id}`);
        router.refresh();
      } else {
        setSubmitError(null);
        router.refresh();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting,
    submitError,
    router,
  };
}
