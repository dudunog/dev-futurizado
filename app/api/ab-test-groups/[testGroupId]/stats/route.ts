import { prisma } from "@/lib/prisma";
import { ApiError, createErrorResponse } from "@/lib/api/errors";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ testGroupId: string }> }
) {
  try {
    const { testGroupId } = await params;

    const testGroup = await prisma.abTestGroup.findUnique({
      where: { id: testGroupId },
      include: {
        variants: {
          include: {
            banner: true,
          },
        },
      },
    });

    if (!testGroup) {
      throw new ApiError(404, "Grupo de teste não encontrado");
    }

    const stats = await Promise.all(
      testGroup.variants.map(async (variant) => {
        const [impressions, clicks] = await Promise.all([
          prisma.bannerAnalytics.count({
            where: {
              bannerId: variant.bannerId,
              eventType: "impression",
            },
          }),
          prisma.bannerAnalytics.count({
            where: {
              bannerId: variant.bannerId,
              eventType: "click",
            },
          }),
        ]);

        return {
          variant: variant.variant,
          bannerId: variant.bannerId,
          bannerImageUrl: variant.banner.imageUrl,
          bannerTargetUrl: variant.banner.targetUrl,
          impressions,
          clicks,
          ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
          trafficSplit: variant.trafficSplit,
          isControl: variant.isControl,
        };
      })
    );

    const totalImpressions = stats.reduce((sum, s) => sum + s.impressions, 0);
    const totalClicks = stats.reduce((sum, s) => sum + s.clicks, 0);
    const overallCtr =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    const bestVariant = stats.reduce((best, current) => {
      if (current.ctr > best.ctr) return current;
      return best;
    }, stats[0] || null);

    return Response.json({
      testGroup: {
        id: testGroup.id,
        name: testGroup.name,
        description: testGroup.description,
        isActive: testGroup.isActive,
      },
      stats,
      totalImpressions,
      totalClicks,
      overallCtr,
      bestVariant,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
