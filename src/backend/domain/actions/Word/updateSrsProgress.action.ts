"use server";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { Prisma } from "@prisma/client";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

export type UpdateSrsProgressRequest = {
    wordId: string;
    quality: number; // 0-5, 0=complete fail, 5=perfect recall
    responseTimeMs?: number;
    context?: string;
    personalNotes?: string;
    mediaId?: string;
}

export type UpdateSrsProgressResponse = {
    data?: {
        userWord: any;
        nextReview: Date;
        interval: number;
    };
    err?: string | null;
    msg?: string;
}

/**
 * Executes a transaction with retry logic on conflict or deadlock.
 */
const runTransactionWithRetries = async <T>(
    fn: (prisma: any) => Promise<T>,
    maxRetries: number = 3
): Promise<T> => {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            return await prisma.$transaction(fn, {
                isolationLevel: "Serializable",
                maxWait: 15000,
                timeout: 30000,
            });
        } catch (err) {
            if (
                err instanceof Prisma.PrismaClientKnownRequestError &&
                (err.code === "P2034" || err.message.includes("deadlock"))
            ) {
                retries++;
                console.warn(`Transaction failed (attempt ${retries}/${maxRetries}): ${err.message}`);
                if (retries === maxRetries) {
                    throw new Error("Max retries reached due to persistent write conflict or deadlock");
                }
                await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, retries))); // Exponential backoff
            } else {
                throw err; // Re-throw non-conflict errors
            }
        }
    }
    throw new Error("Unexpected retry loop exit");
};

export async function updateSrsProgress(
    request: UpdateSrsProgressRequest
): Promise<UpdateSrsProgressResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Validate quality parameter
        if (request.quality < 0 || request.quality > 5) {
            return { err: "Invalid quality value", msg: "Quality must be between 0 and 5" };
        }

        // Clear relevant caches
        await cacheClient.del(`srsReviewWords:${decoded.id}:*`);

        return await runTransactionWithRetries(async (prismaClient) => {
            // Get the word and user language
            const word = await prismaClient.word.findUnique({
                where: { id: request.wordId },
                select: {
                    id: true,
                    languageId: true
                }
            });

            if (!word) {
                return { err: "Word not found", msg: "The specified word does not exist" };
            }

            // Get or create user language
            let userLanguage = await prismaClient.userLanguage.findFirst({
                where: {
                    userId: decoded.id,
                    languageId: word.languageId
                }
            });

            if (!userLanguage) {
                userLanguage = await prismaClient.userLanguage.create({
                    data: {
                        userId: decoded.id,
                        languageId: word.languageId
                    }
                });
            }

            // Get or create user word
            let userWord = await prismaClient.userWords.findFirst({
                where: {
                    userId: decoded.id,
                    wordId: word.id
                },
                include: {
                    word: true
                }
            });

            if (!userWord) {
                userWord = await prismaClient.userWords.create({
                    data: {
                        userId: decoded.id,
                        wordId: word.id,
                        userLanguageId: userLanguage.id
                    },
                    include: {
                        word: true
                    }
                });
            }

            // Update media user if mediaId is provided
            if (request.mediaId) {
                const mediaLanguage = await prismaClient.mediaLanguages.findFirst({
                    where: {
                        mediaId: request.mediaId,
                        languageId: word.languageId
                    }
                });

                if (mediaLanguage) {
                    let mediaUser = await prismaClient.mediaUser.findFirst({
                        where: {
                            userId: decoded.id,
                            mediaLanguageId: mediaLanguage.id
                        }
                    });

                    if (!mediaUser) {
                        await prismaClient.mediaUser.create({
                            data: {
                                userId: decoded.id,
                                mediaLanguageId: mediaLanguage.id
                            }
                        });
                    } else {
                        // Increment words learned count if quality was good
                        if (request.quality >= 3) {
                            await prismaClient.mediaUser.update({
                                where: { id: mediaUser.id },
                                data: {
                                    wordsLearned: {
                                        increment: 1
                                    }
                                }
                            });
                        }
                    }
                }
            }

            // Apply SuperMemo2 Algorithm for SRS
            const now = new Date();
            const isFirstReview = userWord.notLearned === true;

            // Default values for new words
            let interval = userWord.interval || 0;
            let easeFactor = userWord.easeFactor || 2.5;
            let nextReviewDate: Date;

            // Calculate new values based on SM-2 algorithm
            if (isFirstReview) {
                // First review handles differently
                if (request.quality >= 3) {
                    // If remembered, set initial interval based on quality
                    interval = request.quality === 3 ? 1 : request.quality === 4 ? 3 : 5;
                } else {
                    // If not remembered, keep at 0 for review same day
                    interval = 0;
                }
            } else {
                // Apply standard SM-2 algorithm for review cards
                if (request.quality >= 3) {
                    // Successful recall - increase interval
                    if (interval === 0) interval = 1;
                    else if (interval === 1) interval = 6;
                    else interval = Math.round(interval * easeFactor);

                    // Cap interval at 365 days
                    interval = Math.min(interval, 365);
                } else {
                    // Failed recall - reset interval
                    interval = 0;
                }

                // Update ease factor based on performance
                easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - request.quality) * (0.08 + (5 - request.quality) * 0.02)));
            }

            // Calculate next review date
            if (interval === 0) {
                // Review again today (in a few hours)
                nextReviewDate = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
            } else {
                nextReviewDate = new Date(now);
                nextReviewDate.setDate(nextReviewDate.getDate() + interval);
            }

            // Calculate confidence level based on quality and history
            const confidenceLevel = Math.min(5, Math.max(0,
                Math.floor(
                    (request.quality * 0.6) +
                    (userWord.streak * 0.2) +
                    (userWord.attempts > 0 ? (1 - userWord.errors / userWord.attempts) * 2 : 0)
                )
            ));

            // Calculate progress percentage (0-100)
            const progress = Math.min(100, Math.max(0,
                Math.floor(
                    (userWord.streak * 5) +
                    (interval * 2) +
                    (confidenceLevel * 10) +
                    (request.quality * 5)
                )
            ));

            // Determine if word is mastered
            const isMastered = progress >= 95 && confidenceLevel >= 4 && interval >= 30;

            // Update user word with new values
            const updatedUserWord = await prismaClient.userWords.update({
                where: { id: userWord.id },
                data: {
                    attempts: {
                        increment: 1
                    },
                    errors: request.quality < 3 ? {
                        increment: 1
                    } : undefined,
                    streak: request.quality >= 3 ? {
                        increment: 1
                    } : 0,
                    lastAttempt: now,
                    lastError: request.quality < 3 ? now : undefined,
                    lastSuccess: request.quality >= 3 ? now : undefined,
                    lastRecallSpeed: request.responseTimeMs,
                    lastErrorType: request.quality < 3 ? 'RECALL' : undefined,
                    notLearned: false,
                    progress,
                    easeFactor,
                    interval,
                    nextAttempt: nextReviewDate,
                    confidenceLevel,
                    mastered: isMastered,
                    masteredAt: isMastered && !userWord.mastered ? now : userWord.masteredAt,
                    context: request.context || userWord.context,
                    personalNotes: request.personalNotes || userWord.personalNotes
                },
                include: {
                    word: true
                }
            });

            // Update word global statistics
            await prismaClient.word.update({
                where: { id: word.id },
                data: {
                    attempts: {
                        increment: 1
                    },
                    errors: request.quality < 3 ? {
                        increment: 1
                    } : undefined,
                    difficulty: {
                        set: Math.min(10, Math.max(1, 10 - Math.floor(progress / 10)))
                    },
                    averageRecallTime: request.responseTimeMs ? {
                        set: userWord.attempts === 0
                            ? request.responseTimeMs
                            : Math.round(
                                (userWord.lastRecallSpeed || 0) * userWord.attempts + request.responseTimeMs
                            ) / (userWord.attempts + 1)
                    } : undefined
                }
            });

            return {
                data: {
                    userWord: {
                        id: updatedUserWord.id,
                        wordId: updatedUserWord.wordId,
                        word: updatedUserWord.word.word,
                        progress,
                        interval,
                        streak: updatedUserWord.streak,
                        attempts: updatedUserWord.attempts,
                        errors: updatedUserWord.errors,
                        mastered: isMastered
                    },
                    nextReview: nextReviewDate,
                    interval
                },
                msg: "SRS progress updated successfully"
            };
        });
    } catch (error) {
        console.error("Error updating SRS progress:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to update SRS progress"
        };
    }
}
