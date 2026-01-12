import { prisma } from "@/lib/prisma";
import { ApiError, createErrorResponse } from "@/lib/api/errors";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const banner = await prisma.banner.findUnique({
      where: { id },
      include: {
        abTestVariant: {
          include: {
            testGroup: true,
          },
        },
      },
    });

    if (!banner) {
      throw new ApiError(404, "Banner não encontrado");
    }

    return Response.json(banner);
  } catch (error) {
    return createErrorResponse(error);
  }
}
