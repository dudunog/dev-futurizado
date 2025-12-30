-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "target_url" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_alt" TEXT,
    "start_time" TEXT,
    "end_time" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "click_url" TEXT,
    "display_duration" INTEGER,
    "animation_type" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_banners_target_url" ON "banners"("target_url");

-- CreateIndex
CREATE INDEX "idx_banners_active" ON "banners"("is_active");

-- CreateIndex
CREATE INDEX "idx_banners_time" ON "banners"("start_time", "end_time");

-- CreateIndex
CREATE INDEX "idx_banners_priority" ON "banners"("priority");
