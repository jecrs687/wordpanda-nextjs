/*
  Warnings:

  - You are about to drop the column `quality` on the `user_word` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "daily_goal" INTEGER DEFAULT 30,
ADD COLUMN     "difficulty_preference" INTEGER DEFAULT 1,
ADD COLUMN     "learning_style" TEXT,
ADD COLUMN     "level" INTEGER DEFAULT 1,
ADD COLUMN     "longest_streak" INTEGER DEFAULT 0,
ADD COLUMN     "preferred_learning_time" TEXT,
ADD COLUMN     "streak" INTEGER DEFAULT 0,
ADD COLUMN     "total_points" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "avg_recall_time" INTEGER DEFAULT 0,
ADD COLUMN     "context_examples" TEXT[];

-- AlterTable
ALTER TABLE "_AuthorToBook" ADD CONSTRAINT "_AuthorToBook_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AuthorToBook_AB_unique";

-- AlterTable
ALTER TABLE "_BookToTranslator" ADD CONSTRAINT "_BookToTranslator_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BookToTranslator_AB_unique";

-- AlterTable
ALTER TABLE "_translationsTo" ADD CONSTRAINT "_translationsTo_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_translationsTo_AB_unique";

-- AlterTable
ALTER TABLE "user_word" DROP COLUMN "quality",
ADD COLUMN     "confidence_level" INTEGER DEFAULT 0,
ADD COLUMN     "context" VARCHAR(512),
ADD COLUMN     "ease_factor" DOUBLE PRECISION DEFAULT 2.5,
ADD COLUMN     "last_error_type" TEXT,
ADD COLUMN     "last_recall_speed" INTEGER,
ADD COLUMN     "mastered" BOOLEAN DEFAULT false,
ADD COLUMN     "mastered_at" TIMESTAMP(3),
ADD COLUMN     "personal_notes" VARCHAR(512);

-- CreateTable
CREATE TABLE "LearningSession" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "duration" INTEGER,
    "words_seen" INTEGER DEFAULT 0,
    "words_learned" INTEGER DEFAULT 0,
    "media_language_id" TEXT,
    "book_language_id" TEXT,
    "game_session_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "requirement" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "achievement_id" TEXT NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "friend_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNote" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ref_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "duration" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameRound" (
    "id" TEXT NOT NULL,
    "game_session_id" TEXT NOT NULL,
    "round_number" INTEGER NOT NULL,
    "word_id" TEXT,
    "correct" BOOLEAN NOT NULL DEFAULT false,
    "time_taken" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameRound_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_user_id_achievement_id_key" ON "UserAchievement"("user_id", "achievement_id");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_user_id_friend_id_key" ON "Friendship"("user_id", "friend_id");

-- AddForeignKey
ALTER TABLE "LearningSession" ADD CONSTRAINT "LearningSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningSession" ADD CONSTRAINT "LearningSession_media_language_id_fkey" FOREIGN KEY ("media_language_id") REFERENCES "MediaLanguages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningSession" ADD CONSTRAINT "LearningSession_book_language_id_fkey" FOREIGN KEY ("book_language_id") REFERENCES "BookLanguage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningSession" ADD CONSTRAINT "LearningSession_game_session_id_fkey" FOREIGN KEY ("game_session_id") REFERENCES "GameSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNote" ADD CONSTRAINT "UserNote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRound" ADD CONSTRAINT "GameRound_game_session_id_fkey" FOREIGN KEY ("game_session_id") REFERENCES "GameSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRound" ADD CONSTRAINT "GameRound_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word"("id") ON DELETE SET NULL ON UPDATE CASCADE;
