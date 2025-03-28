-- CreateTable
CREATE TABLE "MarketingBenchmark" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "users" INTEGER DEFAULT 0,
    "revenue" INTEGER DEFAULT 0,
    "registered" INTEGER DEFAULT 0,
    "active" INTEGER DEFAULT 0,
    "login" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingBenchmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketingBenchmark_name_key" ON "MarketingBenchmark"("name");
