import type { Banner } from "@/lib/types/banner";

import { prisma } from "@/lib/prisma";

export async function getBanners(): Promise<Banner[]> {
  return await prisma.banner.findMany({
    include: {
      abTestVariant: {
        include: {
          testGroup: true,
        },
      },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
}
