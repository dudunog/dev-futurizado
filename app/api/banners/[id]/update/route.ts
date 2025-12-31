import { prisma } from "@/lib/prisma";
import { updateBannerSchema } from "@/lib/validations/banner";
import { ApiError, createErrorResponse } from "@/lib/api/errors";
import { normalizeUrl } from "@/lib/utils/url";

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
      throw new ApiError(404, "Banner not found");
    }

    const validatedData = updateBannerSchema.parse(body);

    const updateData = validatedData.targetUrl
      ? { ...validatedData, targetUrl: normalizeUrl(validatedData.targetUrl) }
      : validatedData;

    const banner = await prisma.banner.update({
      where: { id },
      data: updateData,
    });

    return Response.json(banner);
  } catch (error) {
    return createErrorResponse(error);
  }
}
