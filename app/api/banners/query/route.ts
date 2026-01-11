import { prisma } from "@/lib/prisma";
import { queryBannerSchema } from "@/lib/validations/banner";
import { createErrorResponse } from "@/lib/api/errors";
import { normalizeUrl } from "@/lib/utils/url";
import {
  formatTime,
  formatDate,
  isTimeInRange,
  isDateInRange,
  parseDateToString,
} from "@/lib/utils/time";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");

    const { url } = queryBannerSchema.parse({ url: urlParam });

    const normalizedUrl = normalizeUrl(url);

    const allBanners = await prisma.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    const matchingBanners = allBanners.filter((banner) => {
      const bannerNormalizedUrl = normalizeUrl(banner.targetUrl);
      return bannerNormalizedUrl === normalizedUrl;
    });

    const now = new Date();
    const currentDate = formatDate(now);
    const currentTime = formatTime(now);

    const activeBanners = matchingBanners.filter((banner) => {
      const startDateStr = parseDateToString(banner.startDate);
      const endDateStr = parseDateToString(banner.endDate);

      if (!isDateInRange(currentDate, startDateStr, endDateStr)) {
        return false;
      }

      if (banner.startTime && banner.endTime) {
        return isTimeInRange(currentTime, banner.startTime, banner.endTime);
      }

      return true;
    });

    const banner = activeBanners.length > 0 ? activeBanners[0] : null;

    return Response.json({ banner });
  } catch (error) {
    return createErrorResponse(error);
  }
}
