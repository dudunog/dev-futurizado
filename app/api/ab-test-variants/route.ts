import { prisma } from "@/lib/prisma";
import { ApiError, createErrorResponse } from "@/lib/api/errors";
import { createAbTestVariantSchema } from "@/lib/validations/ab-test";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testGroupId = searchParams.get("testGroupId");
    const bannerId = searchParams.get("bannerId");

    const where: {
      testGroupId?: string;
      bannerId?: string;
    } = {};

    if (testGroupId) {
      where.testGroupId = testGroupId;
    }
    if (bannerId) {
      where.bannerId = bannerId;
    }

    const variants = await prisma.abTestVariant.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        banner: true,
        testGroup: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return Response.json({ variants });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createAbTestVariantSchema.parse(body);

    const banner = await prisma.banner.findUnique({
      where: { id: validatedData.bannerId },
    });

    if (!banner) {
      throw new ApiError(404, "Banner não encontrado");
    }

    const existingVariant = await prisma.abTestVariant.findUnique({
      where: { bannerId: validatedData.bannerId },
    });

    if (existingVariant) {
      throw new ApiError(400, "Banner já possui uma variante de teste A/B");
    }

    const testGroup = await prisma.abTestGroup.findUnique({
      where: { id: validatedData.testGroupId },
    });

    if (!testGroup) {
      throw new ApiError(404, "Grupo de teste não encontrado");
    }

    const variant = await prisma.abTestVariant.create({
      data: validatedData,
      include: {
        banner: true,
        testGroup: true,
      },
    });

    return Response.json(variant, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
