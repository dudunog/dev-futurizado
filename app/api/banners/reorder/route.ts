import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, createErrorResponse } from "@/lib/api/errors";
import { z } from "zod";

const reorderSchema = z.object({
  banners: z.array(
    z.object({
      id: z.string(),
      priority: z.number().int().min(1),
    })
  ),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const result = reorderSchema.safeParse(body);

    if (!result.success) {
      throw new ApiError(400, "Dados inválidos", result.error.flatten());
    }

    const { banners } = result.data;

    await prisma.$transaction(
      banners.map((banner) =>
        prisma.banner.update({
          where: { id: banner.id },
          data: { priority: banner.priority },
        })
      )
    );

    return Response.json({
      success: true,
      message: "Prioridades atualizadas com sucesso",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return createErrorResponse(error);
    }

    return createErrorResponse(new ApiError(500, "Erro interno do servidor"));
  }
}
