-- AlterTable
ALTER TABLE "MarketingBenchmark" ADD COLUMN     "avg_session_duration" INTEGER DEFAULT 0,
ADD COLUMN     "churn_rate" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "conversion_rate" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "customer_acquisition_cost" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "daily_active_users" INTEGER DEFAULT 0,
ADD COLUMN     "desktop" INTEGER DEFAULT 0,
ADD COLUMN     "lifetime_value" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "mobile" INTEGER DEFAULT 0,
ADD COLUMN     "monthly_active_users" INTEGER DEFAULT 0,
ADD COLUMN     "organic_traffic" INTEGER DEFAULT 0,
ADD COLUMN     "paid_traffic" INTEGER DEFAULT 0,
ADD COLUMN     "referral_traffic" INTEGER DEFAULT 0,
ADD COLUMN     "retention_rate" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "social_traffic" INTEGER DEFAULT 0,
ADD COLUMN     "tablet" INTEGER DEFAULT 0,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "MarketingCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "budget" DOUBLE PRECISION,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "impressions" INTEGER DEFAULT 0,
    "clicks" INTEGER DEFAULT 0,
    "leads" INTEGER DEFAULT 0,
    "conversions" INTEGER DEFAULT 0,
    "revenue" DOUBLE PRECISION DEFAULT 0,
    "roi" DOUBLE PRECISION DEFAULT 0,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_content" TEXT,
    "utm_term" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MarketingCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAcquisition" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "medium" TEXT,
    "campaign" TEXT,
    "landing_page" TEXT,
    "referral_code" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_content" TEXT,
    "utm_term" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "operating_system" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "first_touch_point" TEXT,
    "last_touch_point" TEXT,
    "touch_points_json" JSONB,
    "marketing_campaign_id" TEXT,
    "converted_to_trial" BOOLEAN NOT NULL DEFAULT false,
    "converted_to_paid" BOOLEAN NOT NULL DEFAULT false,
    "trial_start_date" TIMESTAMP(3),
    "conversion_date" TIMESTAMP(3),
    "acquisition_cost" DOUBLE PRECISION,
    "lifetime_value" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAcquisition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrer_id" TEXT NOT NULL,
    "referee_id" TEXT,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "referrer_reward" TEXT,
    "referrer_reward_amount" DOUBLE PRECISION,
    "referee_reward" TEXT,
    "referee_reward_amount" DOUBLE PRECISION,
    "reward_claimed" BOOLEAN NOT NULL DEFAULT false,
    "reward_claimed_at" TIMESTAMP(3),
    "shared_platform" TEXT,
    "shared_url" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content_type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "content" TEXT,
    "image_url" TEXT,
    "video_url" TEXT,
    "target_url" TEXT,
    "campaign_id" TEXT,
    "impressions" INTEGER DEFAULT 0,
    "clicks" INTEGER DEFAULT 0,
    "conversions" INTEGER DEFAULT 0,
    "publish_at" TIMESTAMP(3),
    "unpublish_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MarketingContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ABTest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "test_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "hypothesis" TEXT,
    "goal_metric" TEXT NOT NULL,
    "control_variant" TEXT NOT NULL,
    "experimental_variants" TEXT[],
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "sample_size" INTEGER DEFAULT 0,
    "control_size" INTEGER DEFAULT 0,
    "control_conversions" INTEGER DEFAULT 0,
    "results_json" JSONB,
    "winner" TEXT,
    "confidence_level" DOUBLE PRECISION,
    "campaign_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ABTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSegment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "criteria" JSONB NOT NULL,
    "user_count" INTEGER DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "UserSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subject" TEXT NOT NULL,
    "preheader" TEXT,
    "from_name" TEXT NOT NULL,
    "from_email" TEXT NOT NULL,
    "reply_to_email" TEXT,
    "content_id" TEXT,
    "segment_id" TEXT,
    "scheduled_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "recipients" INTEGER DEFAULT 0,
    "opens" INTEGER DEFAULT 0,
    "unique_opens" INTEGER DEFAULT 0,
    "clicks" INTEGER DEFAULT 0,
    "unique_clicks" INTEGER DEFAULT 0,
    "bounces" INTEGER DEFAULT 0,
    "complaints" INTEGER DEFAULT 0,
    "unsubscribes" INTEGER DEFAULT 0,
    "open_rate" DOUBLE PRECISION,
    "click_rate" DOUBLE PRECISION,
    "click_to_open_rate" DOUBLE PRECISION,
    "bounce_rate" DOUBLE PRECISION,
    "campaign_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFeedback" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nps_score" INTEGER,
    "nps_comment" TEXT,
    "survey_id" TEXT,
    "responses_json" JSONB,
    "title" TEXT,
    "content" TEXT,
    "rating" INTEGER,
    "source" TEXT NOT NULL,
    "feature" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MarketingContentToMarketingTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MarketingContentToMarketingTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Referral_code_key" ON "Referral"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingTag_name_key" ON "MarketingTag"("name");

-- CreateIndex
CREATE INDEX "_MarketingContentToMarketingTag_B_index" ON "_MarketingContentToMarketingTag"("B");

-- AddForeignKey
ALTER TABLE "UserAcquisition" ADD CONSTRAINT "UserAcquisition_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAcquisition" ADD CONSTRAINT "UserAcquisition_marketing_campaign_id_fkey" FOREIGN KEY ("marketing_campaign_id") REFERENCES "MarketingCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingContent" ADD CONSTRAINT "MarketingContent_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "MarketingCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABTest" ADD CONSTRAINT "ABTest_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "MarketingCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "MarketingContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "UserSegment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "MarketingCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeedback" ADD CONSTRAINT "UserFeedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketingContentToMarketingTag" ADD CONSTRAINT "_MarketingContentToMarketingTag_A_fkey" FOREIGN KEY ("A") REFERENCES "MarketingContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketingContentToMarketingTag" ADD CONSTRAINT "_MarketingContentToMarketingTag_B_fkey" FOREIGN KEY ("B") REFERENCES "MarketingTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
