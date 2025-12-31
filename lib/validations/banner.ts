import { z } from "zod";

export const createBannerSchema = z.object({
  targetUrl: z.url({ message: "Invalid target URL" }),
  imageUrl: z.url({ message: "Invalid image URL" }),
  imageAlt: z.string().optional(),
  startTime: z
    .string()
    .regex(
      /^\d{2}:\d{2}:\d{2}$/,
      "Invalid format. Use HH:MM:SS (e.g., 08:00:00)"
    )
    .optional(),
  endTime: z
    .string()
    .regex(
      /^\d{2}:\d{2}:\d{2}$/,
      "Invalid format. Use HH:MM:SS (e.g., 12:00:00)"
    )
    .optional(),
  timezone: z.string().default("UTC"),
  clickUrl: z.url({ message: "Invalid destination URL" }).optional(),
  displayDuration: z
    .number()
    .int()
    .positive("Duration must be a positive number")
    .optional(),
  animationType: z
    .enum(["fade", "slide", "bounce"], {
      message: "Animation type must be: fade, slide, or bounce",
    })
    .optional(),
  priority: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateBannerSchema = createBannerSchema.partial();

export const queryBannerSchema = z.object({
  url: z.url({ message: "Invalid URL parameter" }),
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>;
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;
export type QueryBannerInput = z.infer<typeof queryBannerSchema>;
