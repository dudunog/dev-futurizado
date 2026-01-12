import { z } from "zod";

export const createAbTestGroupSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateAbTestGroupSchema = createAbTestGroupSchema.partial();

export const createAbTestVariantSchema = z.object({
  bannerId: z.uuid({ message: "ID do banner inválido" }),
  testGroupId: z.uuid({ message: "ID do grupo de teste inválido" }),
  variant: z.string().min(1, "Variante é obrigatória"),
  trafficSplit: z
    .number()
    .int()
    .min(0, "Distribuição de tráfego deve ser entre 0 e 100")
    .max(100, "Distribuição de tráfego deve ser entre 0 e 100")
    .default(50),
  isControl: z.boolean().default(false),
});

export const updateAbTestVariantSchema = z.object({
  variant: z.string().min(1).optional(),
  trafficSplit: z.number().int().min(0).max(100).optional(),
  isControl: z.boolean().optional(),
});

export const createAnalyticsEventSchema = z.object({
  bannerId: z.uuid({ message: "ID do banner inválido" }),
  eventType: z.enum(["impression", "click"]),
  sessionId: z.string().nullish(),
  userId: z.string().nullish(),
  userAgent: z.string().nullish(),
  referrer: z.string().nullish(),
});

export type CreateAbTestGroupInput = z.infer<typeof createAbTestGroupSchema>;
export type UpdateAbTestGroupInput = z.infer<typeof updateAbTestGroupSchema>;
export type CreateAbTestVariantInput = z.infer<
  typeof createAbTestVariantSchema
>;
export type UpdateAbTestVariantInput = z.infer<
  typeof updateAbTestVariantSchema
>;
export type CreateAnalyticsEventInput = z.infer<
  typeof createAnalyticsEventSchema
>;
