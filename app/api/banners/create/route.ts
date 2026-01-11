import { prisma } from "@/lib/prisma";
import { createBannerSchema } from "@/lib/validations/banner";
import { createErrorResponse } from "@/lib/api/errors";
import { normalizeUrl } from "@/lib/utils/url";
import { parseDate } from "@/lib/utils/time";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = createBannerSchema.parse(body);

    const normalizedTargetUrl = normalizeUrl(validatedData.targetUrl);

    const banner = await prisma.banner.create({
      data: {
        ...validatedData,
        targetUrl: normalizedTargetUrl,
        startDate: parseDate(validatedData.startDate),
        endDate: parseDate(validatedData.endDate),
      },
    });

    return Response.json(banner, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
