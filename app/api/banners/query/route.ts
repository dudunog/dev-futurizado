import type { Banner } from "@/lib/types/banner";

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
import { selectABTestBanner } from "@/lib/utils/ab-testing";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");
    const testVariant = searchParams.get("testVariant"); // For testing: ?testVariant=A or B

    const { url } = queryBannerSchema.parse({ url: urlParam });

    const normalizedUrl = normalizeUrl(url);

    const cookies = request.headers.get("cookie") || "";
    let sessionId: string | null = null;

    const sessionIdMatch = cookies.match(/magic-banner-session=([^;]+)/);
    if (sessionIdMatch) {
      sessionId = sessionIdMatch[1];
    } else {
      sessionId = `session-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}`;
    }

    const allBanners = await prisma.banner.findMany({
      where: {
        isActive: true,
      },
      include: {
        abTestVariant: {
          include: {
            testGroup: true,
          },
        },
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
    }) as Banner[];

    const validBanners = activeBanners.filter((banner) => {
      if (banner.abTestVariant) {
        return banner.abTestVariant.testGroup.isActive;
      }
      return true;
    });

    let selectedBanner: Banner | null = null;

    if (testVariant && validBanners.length > 0) {
      const bannersWithAB = validBanners.filter((b) => b.abTestVariant);
      const forcedBanner = bannersWithAB.find(
        (b) =>
          b.abTestVariant?.variant.toUpperCase() === testVariant.toUpperCase()
      );
      if (forcedBanner) {
        selectedBanner = forcedBanner;
      }
    }

    if (!selectedBanner) {
      selectedBanner = selectABTestBanner(validBanners, sessionId);
    }

    const banner = selectedBanner
      ? {
          id: selectedBanner.id,
          targetUrl: selectedBanner.targetUrl,
          imageUrl: selectedBanner.imageUrl,
          imageAlt: selectedBanner.imageAlt,
          startDate: selectedBanner.startDate,
          endDate: selectedBanner.endDate,
          startTime: selectedBanner.startTime,
          endTime: selectedBanner.endTime,
          timezone: selectedBanner.timezone,
          isActive: selectedBanner.isActive,
          clickUrl: selectedBanner.clickUrl,
          displayDuration: selectedBanner.displayDuration,
          animationType: selectedBanner.animationType,
          priority: selectedBanner.priority,
          createdAt: selectedBanner.createdAt,
          updatedAt: selectedBanner.updatedAt,
        }
      : null;

    const response = Response.json({ banner });

    if (!sessionIdMatch) {
      response.headers.set(
        "Set-Cookie",
        `magic-banner-session=${sessionId}; Path=/; Max-Age=31536000; SameSite=Lax`
      );
    }

    return response;
  } catch (error) {
    return createErrorResponse(error);
  }
}
