import { prisma } from "@/lib/prisma";
import { Banner } from "@/app/generated/prisma/client";

export async function getBanners(): Promise<Banner[]> {
  return await prisma.banner.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
}
