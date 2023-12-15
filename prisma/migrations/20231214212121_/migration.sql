-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'BKO', 'ADMIN');

-- CreateTable
CREATE TABLE "Translation" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(90),
    "last_name" VARCHAR(90),
    "username" TEXT,
    "phone" TEXT,
    "email" VARCHAR(90),
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_word" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "attemps" INTEGER NOT NULL DEFAULT 0,
    "errors" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "last_attemp" TIMESTAMP(3),
    "last_error" TIMESTAMP(3),
    "last_success" TIMESTAMP(3),
    "not_learned" BOOLEAN DEFAULT true,
    "progress" INTEGER DEFAULT 0,
    "quality" INTEGER DEFAULT 0,
    "interval" INTEGER DEFAULT 0,
    "next_attemp" TIMESTAMP(3),

    CONSTRAINT "user_word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "languageId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "userId" INTEGER,
    "difficulty" INTEGER DEFAULT 0,
    "attemps" INTEGER DEFAULT 0,
    "errors" INTEGER DEFAULT 0,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "_translations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_word_user_id_word_id_key" ON "user_word"("user_id", "word_id");

-- CreateIndex
CREATE UNIQUE INDEX "Word_word_languageId_key" ON "Word"("word", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "_translations_AB_unique" ON "_translations"("A", "B");

-- CreateIndex
CREATE INDEX "_translations_B_index" ON "_translations"("B");

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word" ADD CONSTRAINT "user_word_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word" ADD CONSTRAINT "user_word_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_translations" ADD CONSTRAINT "_translations_A_fkey" FOREIGN KEY ("A") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_translations" ADD CONSTRAINT "_translations_B_fkey" FOREIGN KEY ("B") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
