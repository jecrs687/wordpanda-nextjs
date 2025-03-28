"use server";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

export type GetSrsReviewWordsRequest = {
    languageId?: number;
    limit?: number;
    includeNew?: boolean;
    newWordRatio?: number; // 0-1, percentage of new words to include
    mediaId?: string;
}

export type GetSrsReviewWordsResponse = {
    data?: {
        reviewWords: any[];
        newWords: any[];
        stats: {
            dueCount: number;
            reviewedToday: number;
            learnedToday: number;
            totalWords: number;
        };
    };
    err?: string | null;
    msg?: string;
}

export async function getSrsReviewWords(
    request: GetSrsReviewWordsRequest = {}
): Promise<GetSrsReviewWordsResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        const limit = request.limit || 20;
        const newWordRatio = request.includeNew ? (request.newWordRatio || 0.3) : 0;
        const newWordLimit = Math.floor(limit * newWordRatio);
        const reviewWordLimit = limit - newWordLimit;

        // Get user's language preference if not specified
        let languageId = request.languageId;
        if (!languageId) {
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { languageId: true }
            });
            languageId = user?.languageId;
        }

        if (!languageId) {
            return {
                err: "No language specified",
                msg: "Please specify a language or set a default language preference"
            };
        }

        // Check cache first for quick responses
        const cacheKey = `srsReviewWords:${decoded.id}:${languageId}:${limit}:${newWordRatio}:${request.mediaId || ''}`;
        const cachedData = await cacheClient.get(cacheKey);

        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const now = new Date();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        // Get user language for the specified language
        const userLanguage = await prisma.userLanguage.findFirst({
            where: {
                userId: decoded.id,
                languageId
            }
        });

        if (!userLanguage) {
            // Create user language if it doesn't exist
            await prisma.userLanguage.create({
                data: {
                    userId: decoded.id,
                    languageId
                }
            });
        }

        // Get words due for review
        const dueWords = await prisma.userWords.findMany({
            where: {
                userId: decoded.id,
                userLanguage: {
                    languageId
                },
                OR: [
                    { nextAttempt: { lte: now } },
                    { nextAttempt: null, notLearned: false } // Words that have been seen but don't have a next attempt date
                ],
                ...(request.mediaId && {
                    word: {
                        mediaWords: {
                            some: {
                                mediaLanguage: {
                                    mediaId: request.mediaId,
                                    languageId
                                }
                            }
                        }
                    }
                })
            },
            orderBy: [
                { interval: 'asc' }, // Shorter intervals first
                { lastAttempt: 'asc' } // Oldest attempts first
            ],
            include: {
                word: {
                    include: {
                        translations: {
                            where: {
                                languageId: await getUserTargetLanguageId(decoded.id)
                            },
                            include: {
                                translations: true
                            }
                        }
                    }
                }
            },
            take: reviewWordLimit
        });

        // Get new words if requested
        let newWords: any[] = [];
        if (newWordLimit > 0) {
            // Get words the user hasn't learned yet
            const existingWordIds = await prisma.userWords.findMany({
                where: {
                    userId: decoded.id
                },
                select: {
                    wordId: true
                }
            });

            const existingWordIdSet = new Set(existingWordIds.map(w => w.wordId));

            const mediaClause = request.mediaId ? {
                mediaWords: {
                    some: {
                        mediaLanguage: {
                            mediaId: request.mediaId,
                            languageId
                        }
                    }
                }
            } : {};

            newWords = await prisma.word.findMany({
                where: {
                    languageId,
                    id: {
                        notIn: Array.from(existingWordIdSet)
                    },
                    ...mediaClause
                },
                orderBy: {
                    frequency: 'desc'
                },
                include: {
                    translations: {
                        where: {
                            languageId: await getUserTargetLanguageId(decoded.id)
                        },
                        include: {
                            translations: true
                        }
                    }
                },
                take: newWordLimit
            });
        }

        // Get stats for the user
        const todayReviewedCount = await prisma.userWords.count({
            where: {
                userId: decoded.id,
                userLanguage: {
                    languageId
                },
                lastAttempt: {
                    gte: today
                }
            }
        });

        const todayLearnedCount = await prisma.userWords.count({
            where: {
                userId: decoded.id,
                userLanguage: {
                    languageId
                },
                notLearned: false,
                createdAt: {
                    gte: today
                }
            }
        });

        const totalWordsCount = await prisma.userWords.count({
            where: {
                userId: decoded.id,
                userLanguage: {
                    languageId
                }
            }
        });

        const dueWordsCount = await prisma.userWords.count({
            where: {
                userId: decoded.id,
                userLanguage: {
                    languageId
                },
                OR: [
                    { nextAttempt: { lte: now } },
                    { nextAttempt: null, notLearned: false }
                ]
            }
        });

        // Format response
        const formattedDueWords = dueWords.map(formatUserWord);
        const formattedNewWords = newWords.map(formatWord);

        const response: GetSrsReviewWordsResponse = {
            data: {
                reviewWords: formattedDueWords,
                newWords: formattedNewWords,
                stats: {
                    dueCount: dueWordsCount,
                    reviewedToday: todayReviewedCount,
                    learnedToday: todayLearnedCount,
                    totalWords: totalWordsCount
                }
            },
            msg: "SRS review words retrieved successfully"
        };

        // Cache the response
        await cacheClient.set(cacheKey, JSON.stringify(response), { EX: 300 }); // Cache for 5 minutes

        return response;
    } catch (error) {
        console.error("Error getting SRS review words:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to get SRS review words"
        };
    }
}

async function getUserTargetLanguageId(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { languageId: true }
    });

    return user?.languageId || 1; // Default to English (id 1) if not found
}

function formatUserWord(userWord: any) {
    return {
        id: userWord.wordId,
        userWordId: userWord.id,
        word: userWord.word.word,
        translations: formatTranslations(userWord.word.translations),
        progress: userWord.progress || 0,
        interval: userWord.interval || 0,
        easeFactor: userWord.easeFactor || 2.5,
        streak: userWord.streak || 0,
        nextReview: userWord.nextAttempt,
        attempts: userWord.attempts || 0,
        errors: userWord.errors || 0,
        isNew: false,
        personalNotes: userWord.personalNotes || '',
        context: userWord.context || ''
    };
}

function formatWord(word: any) {
    return {
        id: word.id,
        word: word.word,
        translations: formatTranslations(word.translations),
        frequency: word.frequency || 0,
        isNew: true
    };
}

function formatTranslations(translations: any[]) {
    if (!translations || translations.length === 0) return [];

    const mainTranslation = translations[0];
    return {
        meaning: mainTranslation?.meaning || '',
        meaningTranslated: mainTranslation?.meaningTranslated || '',
        words: mainTranslation?.translations?.map((t: any) => t.word) || []
    };
}
