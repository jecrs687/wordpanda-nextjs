"use server";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

export type GetWordOfTheDayRequest = {
    languageId?: number;
}

export type GetWordOfTheDayResponse = {
    data?: {
        word: string;
        wordId: string;
        translations: {
            meaning: string;
            meaningTranslated: string;
            translations: string[];
        };
        example?: string;
        difficulty: number;
        languageId: number;
        languageName: string;
        date: string;
    };
    err?: string | null;
    msg?: string;
}

export async function getWordOfTheDay(
    request: GetWordOfTheDayRequest = {}
): Promise<GetWordOfTheDayResponse> {
    try {
        // Word of the day can be accessed without authentication
        let userId = null;
        let userLanguageId = null;

        // Try to get user info if authenticated
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        if (token) {
            const { decoded } = validateToken(token);
            if (decoded) {
                userId = decoded.id;

                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { languageId: true }
                });

                userLanguageId = user?.languageId;
            }
        }

        // Use requested or user's language, or default to English (ID 1)
        const languageId = request.languageId || userLanguageId || 1;

        // Generate today's date string for cache key
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const cacheKey = `wordOfTheDay:${languageId}:${dateString}`;

        // Try to get from cache first
        const cachedWord = await cacheClient.get(cacheKey);
        if (cachedWord) {
            return { data: JSON.parse(cachedWord), msg: "Word of the day retrieved from cache" };
        }

        // Get language details
        const language = await prisma.language.findUnique({
            where: { id: languageId }
        });

        if (!language) {
            return { err: "Language not found", msg: "Invalid language ID" };
        }

        // Generate a pseudo-random word based on the date
        // This ensures everyone gets the same word on the same day
        const dateSeed = parseInt(dateString.replace(/-/g, ''));

        // Fetch a high-frequency word with translations
        // We order by frequency and use the date seed to select a different word each day
        const wordCount = await prisma.word.count({
            where: {
                languageId,
                frequency: { gt: 0 },
                translations: { some: {} }
            }
        });

        if (wordCount === 0) {
            return { err: "No words available", msg: "No suitable words found for the selected language" };
        }

        // Select a word based on the date seed
        const skipCount = dateSeed % Math.max(1, wordCount);

        const word = await prisma.word.findFirst({
            where: {
                languageId,
                frequency: { gt: 0 },
                translations: { some: {} }
            },
            orderBy: { frequency: 'desc' },
            skip: skipCount,
            include: {
                translations: {
                    include: {
                        translations: true
                    }
                }
            }
        });

        if (!word) {
            return { err: "Word not found", msg: "Failed to get word of the day" };
        }

        // Format the response
        let example = "";
        if (word.contextExamples && word.contextExamples.length > 0) {
            example = word.contextExamples[0];
        }

        const translations = word.translations[0] || { meaning: "", meaningTranslated: "", translations: [] };

        const responseData = {
            word: word.word,
            wordId: word.id,
            translations: {
                meaning: translations.meaning || "",
                meaningTranslated: translations.meaningTranslated || "",
                translations: translations.translations?.map(t => t.word) || []
            },
            example,
            difficulty: word.difficulty || Math.floor(Math.random() * 5) + 1,
            languageId: language.id,
            languageName: language.language,
            date: dateString
        };

        // Cache for 24 hours
        await cacheClient.set(cacheKey, JSON.stringify(responseData), { EX: 86400 });

        // If user is authenticated, add to their learning history
        if (userId) {
            try {
                await prisma.userNote.create({
                    data: {
                        userId,
                        type: 'WORD_OF_DAY',
                        refId: word.id,
                        content: dateString
                    }
                });
            } catch (e) {
                // Silently handle duplicate entries if user has already seen this word of the day
                console.log("Word of the day already recorded for user");
            }
        }

        return {
            data: responseData,
            msg: "Word of the day retrieved successfully"
        };
    } catch (error) {
        console.error("Error getting word of the day:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to get word of the day"
        };
    }
}
