import { prisma } from "@/lib/prisma";
import { ApiError, createErrorResponse } from "@/lib/api/errors";
import { updateAbTestGroupSchema } from "@/lib/validations/ab-test";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ testGroupId: string }> }
) {
  try {
    const { testGroupId } = await params;

    const group = await prisma.abTestGroup.findUnique({
      where: { id: testGroupId },
      include: {
        variants: {
          include: {
            banner: true,
          },
        },
      },
    });

    if (!group) {
      throw new ApiError(404, "Grupo de teste não encontrado");
    }

    return Response.json({ group });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ testGroupId: string }> }
) {
  try {
    const { testGroupId } = await params;
    const body = await request.json();

    const existingGroup = await prisma.abTestGroup.findUnique({
      where: { id: testGroupId },
    });

    if (!existingGroup) {
      throw new ApiError(404, "Grupo de teste não encontrado");
    }

    const validatedData = updateAbTestGroupSchema.parse(body);

    const group = await prisma.abTestGroup.update({
      where: { id: testGroupId },
      data: validatedData,
    });

    return Response.json(group);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ testGroupId: string }> }
) {
  try {
    const { testGroupId } = await params;

    const existingGroup = await prisma.abTestGroup.findUnique({
      where: { id: testGroupId },
    });

    if (!existingGroup) {
      throw new ApiError(404, "Grupo de teste não encontrado");
    }

    await prisma.abTestGroup.delete({
      where: { id: testGroupId },
    });

    return Response.json({ success: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
