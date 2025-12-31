import { prisma } from "@/lib/prisma";
import { createErrorResponse } from "@/lib/api/errors";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const where = active === "true" ? { isActive: true } : undefined;

    const [banners, total] = await Promise.all([
      prisma.banner.findMany({
        where,
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        take: limit ? parseInt(limit, 10) : undefined,
        skip: offset ? parseInt(offset, 10) : undefined,
      }),
      prisma.banner.count({ where }),
    ]);

    return Response.json({
      banners,
      total,
      limit: limit ? parseInt(limit, 10) : null,
      offset: offset ? parseInt(offset, 10) : null,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
