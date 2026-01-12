import type { Banner } from "@/lib/types/banner";

/**
 * Creates a deterministic hash from a string.
 * Used to ensure consistent A/B test assignment for the same user/session.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Selects a banner from a group of banners that may include A/B test variants.
 * If banners are part of an A/B test, selects based on traffic split distribution.
 * Uses a deterministic hash to ensure the same user/session always sees the same variant.
 *
 * @param banners - Array of banners that may include A/B test variants
 * @param sessionId - Optional session ID for consistent assignment (defaults to random)
 * @returns Selected banner or null if no banners provided
 */
export function selectABTestBanner(
  banners: Banner[],
  sessionId?: string | null
): Banner | null {
  if (banners.length === 0) return null;
  if (banners.length === 1) return banners[0];

  // Separate banners with and without A/B testing
  const bannersWithAB = banners.filter((b) => b.abTestVariant);
  const bannersWithoutAB = banners.filter((b) => !b.abTestVariant);

  // If no A/B test banners, return first non-A/B banner
  if (bannersWithAB.length === 0) {
    return bannersWithoutAB[0] || null;
  }

  // Group by testGroupId
  const testGroups = new Map<string, typeof bannersWithAB>();
  for (const banner of bannersWithAB) {
    if (!banner.abTestVariant) continue;
    const groupId = banner.abTestVariant.testGroupId;
    if (!testGroups.has(groupId)) {
      testGroups.set(groupId, []);
    }
    testGroups.get(groupId)!.push(banner);
  }

  // Select from the first group found
  for (const [, groupBanners] of testGroups) {
    // Filter to ensure all banners have abTestVariant
    const bannersWithVariant = groupBanners.filter(
      (
        b
      ): b is Banner & {
        abTestVariant: NonNullable<Banner["abTestVariant"]>;
      } => !!b.abTestVariant
    );
    if (bannersWithVariant.length > 0) {
      const selectedBanner = selectByTrafficSplit(
        bannersWithVariant,
        sessionId
      );
      return selectedBanner;
    }
  }

  return banners[0];
}

/**
 * Selects a banner from a group of A/B test variants based on traffic split.
 * Uses a deterministic hash to ensure consistent assignment for the same session.
 *
 * @param banners - Array of banners with A/B test variants
 * @param sessionId - Optional session ID for consistent assignment
 * @returns Selected banner
 */
function selectByTrafficSplit(
  banners: (Banner & {
    abTestVariant: NonNullable<Banner["abTestVariant"]>;
  })[],
  sessionId?: string | null
): Banner {
  // Sort by traffic split (descending)
  const sorted = [...banners].sort(
    (a, b) =>
      (b.abTestVariant.trafficSplit || 0) - (a.abTestVariant.trafficSplit || 0)
  );

  // Generate deterministic number between 0 and 100 based on sessionId
  // If no sessionId provided, use random (for testing purposes)
  let value: number;
  if (sessionId) {
    // Use hash of sessionId + testGroupId for deterministic assignment
    const testGroupId = sorted[0]?.abTestVariant.testGroupId || "";
    const hash = hashString(`${sessionId}-${testGroupId}`);
    value = (hash % 10000) / 100; // Convert to 0-100 range
  } else {
    // Fallback to random if no sessionId (shouldn't happen in production)
    value = Math.random() * 100;
  }

  let cumulative = 0;

  // Select based on cumulative traffic split
  for (const banner of sorted) {
    cumulative += banner.abTestVariant.trafficSplit || 0;
    if (value <= cumulative) {
      return banner;
    }
  }

  // Fallback: return control variant or first banner
  return sorted.find((b) => b.abTestVariant.isControl) || sorted[0];
}
