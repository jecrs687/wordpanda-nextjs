-- CreateTable
CREATE TABLE "MediaUser" (
    "id" SERIAL NOT NULL,
    "media_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "progress" INTEGER DEFAULT 0,
    "wordsLearned" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MediaUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MediaUser" ADD CONSTRAINT "MediaUser_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaUser" ADD CONSTRAINT "MediaUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
