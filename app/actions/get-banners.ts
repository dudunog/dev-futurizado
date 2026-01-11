import type { Banner } from "@/lib/types/banner";

import { prisma } from "@/lib/prisma";

export async function getBanners(): Promise<Banner[]> {
  return await prisma.banner.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
}
