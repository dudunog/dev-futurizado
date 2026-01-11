import { z } from "zod";

const TIME_FORMAT_REGEX = /^\d{2}:\d{2}:\d{2}$/; // HH:MM:SS format (e.g., 08:00:00, 12:30:45)

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format (e.g., 2026-01-15)

export const createBannerSchema = z.object({
  targetUrl: z
    .string()
    .url({ message: "URL de destino inválida" })
    .refine((val) => {
      try {
        const url = new URL(val);
        return ["http:", "https:"].includes(url.protocol);
      } catch {
        return false;
      }
    }, "URL deve usar protocolo HTTP ou HTTPS"),
  imageUrl: z
    .string()
    .url({ message: "URL da imagem inválida" })
    .refine((val) => {
      try {
        const url = new URL(val);
        return ["http:", "https:"].includes(url.protocol);
      } catch {
        return false;
      }
    }, "URL da imagem deve usar protocolo HTTP ou HTTPS"),
  imageAlt: z
    .string()
    .max(500, "Texto alternativo deve ter menos de 500 caracteres")
    .optional(),
  startDate: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || DATE_FORMAT_REGEX.test(val),
      "Formato inválido. Use YYYY-MM-DD (ex: 2026-01-15)"
    )
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  endDate: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || DATE_FORMAT_REGEX.test(val),
      "Formato inválido. Use YYYY-MM-DD (ex: 2026-12-31)"
    )
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  startTime: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || TIME_FORMAT_REGEX.test(val),
      "Formato inválido. Use HH:MM:SS (ex: 08:00:00)"
    )
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  endTime: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || TIME_FORMAT_REGEX.test(val),
      "Formato inválido. Use HH:MM:SS (ex: 12:00:00)"
    )
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  timezone: z.string().default("UTC"),
  clickUrl: z
    .string()
    .trim()
    .refine((val) => {
      if (val === "") return true;
      const urlCheck = z.string().url().safeParse(val);
      if (!urlCheck.success) return false;
      try {
        const url = new URL(val);
        return ["http:", "https:"].includes(url.protocol);
      } catch {
        return false;
      }
    }, "URL de clique deve usar protocolo HTTP ou HTTPS")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  displayDuration: z
    .number()
    .int()
    .positive("A duração deve ser um número positivo")
    .optional(),
  animationType: z
    .enum(["fade", "slide", "bounce"], {
      message: "Tipo de animação deve ser: fade, slide ou bounce",
    })
    .optional(),
  priority: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateBannerSchema = createBannerSchema.partial();

export const queryBannerSchema = z.object({
  url: z.url({ message: "Parâmetro URL inválido" }),
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>;
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;
export type QueryBannerInput = z.infer<typeof queryBannerSchema>;
