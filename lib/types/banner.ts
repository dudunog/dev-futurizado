import type { AbTestGroup, AbTestVariant } from "./ab-test";

export type Banner = {
  id: string;
  targetUrl: string;
  imageUrl: string;
  imageAlt: string | null;
  startDate: Date | null;
  endDate: Date | null;
  startTime: string | null;
  endTime: string | null;
  timezone: string;
  isActive: boolean;
  clickUrl: string | null;
  displayDuration: number | null;
  animationType: string | null;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  abTestVariant?: (AbTestVariant & { testGroup: AbTestGroup }) | null;
};
