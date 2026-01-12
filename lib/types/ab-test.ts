export type AbTestGroup = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AbTestVariant = {
  id: string;
  bannerId: string;
  testGroupId: string;
  variant: string;
  trafficSplit: number;
  isControl: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BannerAnalytics = {
  id: string;
  bannerId: string;
  eventType: string;
  sessionId: string | null;
  userId: string | null;
  userAgent: string | null;
  referrer: string | null;
  createdAt: Date;
};

export type VariantStat = {
  variant: string;
  bannerId: string;
  bannerImageUrl: string | null;
  impressions: number;
  clicks: number;
  ctr: number;
  trafficSplit: number;
  isControl: boolean;
};
