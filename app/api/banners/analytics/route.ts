import { prisma } from "@/lib/prisma";
import { createErrorResponse } from "@/lib/api/errors";
import { createAnalyticsEventSchema } from "@/lib/validations/ab-test";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createAnalyticsEventSchema.parse(body);

    const banner = await prisma.banner.findUnique({
      where: { id: validatedData.bannerId },
    });

    if (!banner) {
      return Response.json({ error: "Banner não encontrado" }, { status: 404 });
    }

    const analytics = await prisma.bannerAnalytics.create({
      data: validatedData,
    });

    return Response.json(analytics, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
