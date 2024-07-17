-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'BKO', 'ADMIN');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'VIDEO', 'AUDIO', 'SERIE', 'DOCUMENTARY', 'SHORT', 'BOOK', 'PODCAST', 'MUSIC', 'Dataset', 'TEXT');

-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('TRANSLATION', 'MEANING', 'EXAMPLE', 'SYNONYMS', 'ANTONYMS', 'DEFINITION', 'PRONUNCIATION', 'WORD', 'PHRASE', 'IDIOM');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('TRANSLATION', 'MEANING', 'EXAMPLE', 'SYNONYMS', 'ANTONYMS', 'DEFINITION', 'PRONUNCIATION', 'WORD', 'PHRASE', 'IDIOM');

-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL,
    "word_id" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "meaning" VARCHAR(512),
    "meaning_translated" VARCHAR(512),
    "reports" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProbableUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ProbableUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissingMedia" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MissingMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" VARCHAR(90),
    "last_name" VARCHAR(90),
    "username" TEXT,
    "phone" TEXT,
    "email" VARCHAR(90),
    "password" VARCHAR(120),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "language_id" INTEGER NOT NULL DEFAULT 1,
    "score" INTEGER NOT NULL DEFAULT 0,
    "last_login_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "actived_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_language" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_word" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "word_id" TEXT NOT NULL,
    "user_language_id" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "errors" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "last_attempt" TIMESTAMP(3),
    "last_error" TIMESTAMP(3),
    "last_success" TIMESTAMP(3),
    "not_learned" BOOLEAN DEFAULT true,
    "progress" INTEGER DEFAULT 0,
    "quality" INTEGER DEFAULT 0,
    "interval" INTEGER DEFAULT 0,
    "next_attempt" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "is_not_possible_translate" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "reports" INTEGER DEFAULT 0,
    "difficulty" INTEGER DEFAULT 0,
    "attempts" INTEGER DEFAULT 0,
    "errors" INTEGER DEFAULT 0,
    "frequency" INTEGER DEFAULT 0,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL DEFAULT 'https://picsum.photos/500/1000',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Serie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Serie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SerieMedia" (
    "id" TEXT NOT NULL,
    "serie_id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "episode" INTEGER NOT NULL DEFAULT 1,
    "season" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "SerieMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subtitle" (
    "id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "downloaded" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Subtitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'VIDEO',
    "platform_id" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL DEFAULT 'https://picsum.photos/500/1000',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaLanguages" (
    "id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MediaLanguages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaImage" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "media_language_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MediaImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaWords" (
    "id" TEXT NOT NULL,
    "word_id" TEXT NOT NULL,
    "frequency" INTEGER DEFAULT 0,
    "media_language_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MediaWords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaUser" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "progress" INTEGER DEFAULT 0,
    "words_learned" INTEGER DEFAULT 0,
    "media_language_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MediaUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "subjects" TEXT[],
    "bookshelves" TEXT[],
    "copyright" BOOLEAN NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "formats" JSONB NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookLanguage" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "languageId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "BookLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookImage" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "book_language_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "BookImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookWord" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "BookWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth" TIMESTAMP(3) NOT NULL,
    "death" TIMESTAMP(3) NOT NULL,
    "mediaType" "MediaType" NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth" TIMESTAMP(3) NOT NULL,
    "death" TIMESTAMP(3) NOT NULL,
    "mediaType" "MediaType" NOT NULL,

    CONSTRAINT "Translator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordGameQuiz" (
    "id" TEXT NOT NULL,
    "word_id" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "type" "QuizType",
    "phrase" VARCHAR(512) NOT NULL,
    "options" VARCHAR(512)[],
    "answer" VARCHAR(512) NOT NULL,
    "reports" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "WordGameQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Games" (
    "id" TEXT NOT NULL,
    "word_id" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "type" "GameType",
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_translationsTo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BookToTranslator" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AuthorToBook" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Translation_word_id_language_id_key" ON "Translation"("word_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProbableUser_email_key" ON "ProbableUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_user_id_key" ON "Subscription"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_language_user_id_language_id_key" ON "user_language"("user_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_word_user_id_user_language_id_word_id_key" ON "user_word"("user_id", "user_language_id", "word_id");

-- CreateIndex
CREATE UNIQUE INDEX "Word_word_language_id_key" ON "Word"("word", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "Word_id_language_id_key" ON "Word"("id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "MediaLanguages_media_id_language_id_key" ON "MediaLanguages"("media_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "MediaWords_word_id_media_language_id_key" ON "MediaWords"("word_id", "media_language_id");

-- CreateIndex
CREATE UNIQUE INDEX "MediaUser_user_id_media_language_id_key" ON "MediaUser"("user_id", "media_language_id");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE UNIQUE INDEX "BookLanguage_bookId_languageId_key" ON "BookLanguage"("bookId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "_translationsTo_AB_unique" ON "_translationsTo"("A", "B");

-- CreateIndex
CREATE INDEX "_translationsTo_B_index" ON "_translationsTo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BookToTranslator_AB_unique" ON "_BookToTranslator"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToTranslator_B_index" ON "_BookToTranslator"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorToBook_AB_unique" ON "_AuthorToBook"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorToBook_B_index" ON "_AuthorToBook"("B");

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissingMedia" ADD CONSTRAINT "MissingMedia_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_language" ADD CONSTRAINT "user_language_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_language" ADD CONSTRAINT "user_language_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word" ADD CONSTRAINT "user_word_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word" ADD CONSTRAINT "user_word_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word" ADD CONSTRAINT "user_word_user_language_id_fkey" FOREIGN KEY ("user_language_id") REFERENCES "user_language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SerieMedia" ADD CONSTRAINT "SerieMedia_serie_id_fkey" FOREIGN KEY ("serie_id") REFERENCES "Serie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SerieMedia" ADD CONSTRAINT "SerieMedia_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtitle" ADD CONSTRAINT "Subtitle_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtitle" ADD CONSTRAINT "Subtitle_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaLanguages" ADD CONSTRAINT "MediaLanguages_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaLanguages" ADD CONSTRAINT "MediaLanguages_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaImage" ADD CONSTRAINT "MediaImage_media_language_id_fkey" FOREIGN KEY ("media_language_id") REFERENCES "MediaLanguages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaWords" ADD CONSTRAINT "MediaWords_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaWords" ADD CONSTRAINT "MediaWords_media_language_id_fkey" FOREIGN KEY ("media_language_id") REFERENCES "MediaLanguages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaUser" ADD CONSTRAINT "MediaUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaUser" ADD CONSTRAINT "MediaUser_media_language_id_fkey" FOREIGN KEY ("media_language_id") REFERENCES "MediaLanguages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLanguage" ADD CONSTRAINT "BookLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLanguage" ADD CONSTRAINT "BookLanguage_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookImage" ADD CONSTRAINT "BookImage_book_language_id_fkey" FOREIGN KEY ("book_language_id") REFERENCES "BookLanguage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookWord" ADD CONSTRAINT "BookWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookWord" ADD CONSTRAINT "BookWord_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BookLanguage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordGameQuiz" ADD CONSTRAINT "WordGameQuiz_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordGameQuiz" ADD CONSTRAINT "WordGameQuiz_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_translationsTo" ADD CONSTRAINT "_translationsTo_A_fkey" FOREIGN KEY ("A") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_translationsTo" ADD CONSTRAINT "_translationsTo_B_fkey" FOREIGN KEY ("B") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToTranslator" ADD CONSTRAINT "_BookToTranslator_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToTranslator" ADD CONSTRAINT "_BookToTranslator_B_fkey" FOREIGN KEY ("B") REFERENCES "Translator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToBook" ADD CONSTRAINT "_AuthorToBook_A_fkey" FOREIGN KEY ("A") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToBook" ADD CONSTRAINT "_AuthorToBook_B_fkey" FOREIGN KEY ("B") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
