import { prisma } from "@/lib/prisma";
import { createErrorResponse } from "@/lib/api/errors";
import { createAbTestGroupSchema } from "@/lib/validations/ab-test";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    const where = active === "true" ? { isActive: true } : undefined;

    const groups = await prisma.abTestGroup.findMany({
      where,
      include: {
        variants: {
          include: {
            banner: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ groups });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createAbTestGroupSchema.parse(body);

    const group = await prisma.abTestGroup.create({
      data: validatedData,
    });

    return Response.json(group, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
