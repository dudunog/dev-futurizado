import { prisma } from "@/lib/prisma";
import { updateBannerSchema } from "@/lib/validations/banner";
import { ApiError, createErrorResponse } from "@/lib/api/errors";
import { normalizeUrl } from "@/lib/utils/url";
import { parseDate } from "@/lib/utils/time";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      throw new ApiError(404, "Banner não encontrado");
    }

    const validatedData = updateBannerSchema.parse(body);

    const updateData = {
      ...validatedData,
      ...(validatedData.targetUrl && {
        targetUrl: normalizeUrl(validatedData.targetUrl),
      }),
      ...(validatedData.startDate !== undefined && {
        startDate: parseDate(validatedData.startDate),
      }),
      ...(validatedData.endDate !== undefined && {
        endDate: parseDate(validatedData.endDate),
      }),
    };

    const banner = await prisma.banner.update({
      where: { id },
      data: updateData,
    });

    return Response.json(banner);
  } catch (error) {
    return createErrorResponse(error);
  }
}
