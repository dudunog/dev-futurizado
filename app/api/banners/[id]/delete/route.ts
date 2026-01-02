import { prisma } from "@/lib/prisma";
import { ApiError, createErrorResponse } from "@/lib/api/errors";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      throw new ApiError(404, "Banner não encontrado");
    }

    await prisma.banner.delete({
      where: { id },
    });

    return Response.json({ message: "Banner removido com sucesso" });
  } catch (error) {
    return createErrorResponse(error);
  }
}
