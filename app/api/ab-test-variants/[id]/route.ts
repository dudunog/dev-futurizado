import { prisma } from "@/lib/prisma";
import { ApiError, createErrorResponse } from "@/lib/api/errors";
import { updateAbTestVariantSchema } from "@/lib/validations/ab-test";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const variant = await prisma.abTestVariant.findUnique({
      where: { id },
      include: {
        banner: true,
        testGroup: true,
      },
    });

    if (!variant) {
      throw new ApiError(404, "Variante não encontrada");
    }

    return Response.json({ variant });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingVariant = await prisma.abTestVariant.findUnique({
      where: { id },
    });

    if (!existingVariant) {
      throw new ApiError(404, "Variante não encontrada");
    }

    const validatedData = updateAbTestVariantSchema.parse(body);

    const variant = await prisma.abTestVariant.update({
      where: { id },
      data: validatedData,
      include: {
        banner: true,
        testGroup: true,
      },
    });

    return Response.json(variant);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingVariant = await prisma.abTestVariant.findUnique({
      where: { id },
    });

    if (!existingVariant) {
      throw new ApiError(404, "Variante não encontrada");
    }

    await prisma.abTestVariant.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
