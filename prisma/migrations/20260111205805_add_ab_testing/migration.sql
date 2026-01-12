-- CreateTable
CREATE TABLE "ab_test_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ab_test_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ab_test_variants" (
    "id" TEXT NOT NULL,
    "banner_id" TEXT NOT NULL,
    "test_group_id" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "traffic_split" INTEGER NOT NULL DEFAULT 50,
    "is_control" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ab_test_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner_analytics" (
    "id" TEXT NOT NULL,
    "banner_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "session_id" TEXT,
    "user_id" TEXT,
    "user_agent" TEXT,
    "referrer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banner_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_ab_test_group_active" ON "ab_test_groups"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "ab_test_variants_banner_id_key" ON "ab_test_variants"("banner_id");

-- CreateIndex
CREATE INDEX "idx_ab_test_variant_group" ON "ab_test_variants"("test_group_id");

-- CreateIndex
CREATE INDEX "idx_ab_test_variant_name" ON "ab_test_variants"("variant");

-- CreateIndex
CREATE INDEX "idx_analytics_banner" ON "banner_analytics"("banner_id");

-- CreateIndex
CREATE INDEX "idx_analytics_event" ON "banner_analytics"("event_type");

-- CreateIndex
CREATE INDEX "idx_analytics_date" ON "banner_analytics"("created_at");

-- AddForeignKey
ALTER TABLE "ab_test_variants" ADD CONSTRAINT "ab_test_variants_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_test_variants" ADD CONSTRAINT "ab_test_variants_test_group_id_fkey" FOREIGN KEY ("test_group_id") REFERENCES "ab_test_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_analytics" ADD CONSTRAINT "banner_analytics_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
