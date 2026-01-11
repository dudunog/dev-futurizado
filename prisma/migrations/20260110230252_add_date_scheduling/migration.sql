-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "end_date" DATE,
ADD COLUMN     "start_date" DATE;

-- CreateIndex
CREATE INDEX "idx_banners_date" ON "banners"("start_date", "end_date");
