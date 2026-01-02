import { z } from "zod";

const TIME_FORMAT_REGEX = /^\d{2}:\d{2}:\d{2}$/; // HH:MM:SS format (e.g., 08:00:00, 12:30:45)

export const createBannerSchema = z.object({
  targetUrl: z.url({ message: "URL de destino inválida" }),
  imageUrl: z.url({ message: "URL da imagem inválida" }),
  imageAlt: z.string().optional(),
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
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "URL de destino inválida"
    )
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
