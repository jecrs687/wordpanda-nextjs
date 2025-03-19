"use server";

import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { translateWords } from "@infra/openai/Translate";
import { Prisma } from "@prisma/client";
import { chunkArray } from "@utils/chunkarray";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";
import { WordsPostRequest, WordsPostResponse } from "src/app/api/words/route";

/**
 * Metrics object to track performance and usage statistics.
 */
interface Metrics {
    totalTime: number;
    dbQueryTime: number;
    translationTime: number;
    wordsRequested: number;
    wordsFetchedFromDb: number;
    wordsTranslated: number;
    wordsNotTranslated: number;
    wordsCreated: number;
    retries: number;
}

/**
 * Calculates a score for sorting words based on user interaction and frequency.
 */
const calculateWordScore = (word: any): number => {
    const userWord = word.userWords?.[0];
    if (!userWord) return word.frequency || 0;

    const errorRate = userWord.errors / (userWord.attempts || 1);
    const lastSuccess = userWord.lastSuccess ? new Date(userWord.lastSuccess).getTime() : 0;
    const lastError = userWord.lastError ? new Date(userWord.lastError).getTime() : 0;
    const lastAttempt = userWord.lastAttempt ? new Date(userWord.lastAttempt).getTime() : 0;

    return errorRate * 1000 + (lastError - lastSuccess) / 1000 + lastAttempt / 1000000;
};

/**
 * Sorts words based on their calculated scores in descending order.
 */
const sortWords = (a: any, b: any): number => calculateWordScore(b) - calculateWordScore(a);

/**
 * Retrieves the authenticated user's ID from token in cookies or headers.
 */
const getUserId = async (): Promise<string | null> => {
    const cookie = await cookies();
    const header = await headers();
    const token = cookie.get(TOKEN_KEY)?.value || header.get("Authorization");
    const decoded = validateToken(token);
    return decoded?.decoded?.id || null;
};

/**
 * Executes a transaction with retry logic on conflict or deadlock.
 */
const runTransactionWithRetries = async <T>(
    fn: (prisma: any) => Promise<T>,
    maxRetries: number = 3,
    metrics: Metrics
): Promise<T> => {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            return await prisma.$transaction(fn, {
                isolationLevel: "Serializable",
                maxWait: 60000,
                timeout: 120000,
            });
        } catch (err) {
            if (
                err instanceof Prisma.PrismaClientKnownRequestError &&
                (err.code === "P2034" || err.message.includes("deadlock"))
            ) {
                retries++;
                metrics.retries = retries;
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

/**
 * Fetches words for a user, translates them if necessary, and returns them with metrics.
 */
export const getWords = async (body: WordsPostRequest): Promise<WordsPostResponse> => {
    const metrics: Metrics = {
        totalTime: 0,
        dbQueryTime: 0,
        translationTime: 0,
        wordsRequested: body.limit,
        wordsFetchedFromDb: 0,
        wordsTranslated: 0,
        wordsNotTranslated: 0,
        wordsCreated: 0,
        retries: 0,
    };

    console.time("totalTime");

    try {
        // --- Pre-Transaction Setup ---
        const userId = await getUserId();
        if (!userId) {
            return { err: "Not authorized", msg: "Error" };
        }

        console.time("dbQueryTime");
        const [user, language] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                include: { language: true },
            }),
            prisma.language.findFirst({
                where: {
                    OR: [
                        { id: body.languageId },
                        { code: { startsWith: body.language?.toLowerCase()?.split("-")[0] } },
                        { language: { contains: body.language?.toLowerCase() } },
                    ],
                },
            }),
        ]);
        console.timeEnd("dbQueryTime");

        if (!user) return { err: "User not found", msg: "Error" };
        if (!language) return { err: "Language not found", msg: "Error" };

        const translationLanguage = await prisma.language.findFirst({
            where: { id: user.languageId },
        });
        if (!translationLanguage) return { err: "Translation language not found", msg: "Error" };

        // --- Main Transaction ---
        return await runTransactionWithRetries(
            async (prisma) => {
                // --- Construct Words Query ---
                const wordsWhere: any = {
                    languageId: language.id,
                    isNotPossibleTranslate: false,
                };
                if (body.words?.length) {
                    wordsWhere.word = { in: body.words.map((word) => word.toLowerCase()) };
                }
                if (body.mediaId) {
                    wordsWhere.mediaWords = { some: { mediaLanguage: { mediaId: body.mediaId } } };
                }

                // --- Fetch Initial Words ---
                console.time("dbQueryTime");
                const wordsOnDb = await prisma.word.findMany({
                    where: wordsWhere,
                    take: body.limit * 3,
                    orderBy: [
                        { userWords: { _count: "asc" } },
                        { frequency: "desc" },
                        { errors: "desc" },
                        { attempts: "asc" },
                    ],
                    include: {
                        userWords: { where: { userId } },
                        translations: {
                            where: { languageId: translationLanguage.id },
                            include: { translations: { where: { languageId: translationLanguage.id } } },
                        },
                        mediaWords: { include: { mediaLanguage: true } },
                    },
                });
                metrics.wordsFetchedFromDb = wordsOnDb.length;
                console.timeEnd("dbQueryTime");

                const sortedWords = wordsOnDb.sort(sortWords).slice(0, body.limit * 2);
                const wordsWithTranslations = sortedWords.filter((word) => word.translations.length > 0);

                if (wordsWithTranslations.length >= body.limit) {
                    return {
                        data: {
                            wordsOnDb: sortedWords,
                            wordsNotOnDb: [],
                            words: wordsWithTranslations.slice(0, body.limit),
                        },
                        err: null,
                        msg: "Words fetched",
                    };
                }

                // --- Identify Words Needing Translation ---
                const wordsWithoutTranslation = sortedWords.filter((word) => word.translations.length === 0);
                const wordsNotOnDb =
                    body.words?.filter(
                        (word) => !wordsOnDb.some((w) => w.word.toLowerCase() === word.toLowerCase())
                    ) || [];

                // --- Translate Words (Outside Transaction if Possible) ---
                const wordsToTranslate = wordsWithoutTranslation.map((word) => word.word.toLowerCase());
                let translatedWords = {};
                if (wordsToTranslate.length > 0) {
                    console.time("translationTime");
                    const chunks = chunkArray(wordsToTranslate, 40);
                    const translationPromises = chunks.map((chunk) =>
                        translateWords(chunk, language.code, translationLanguage.code)
                    );
                    const translationResults = await Promise.all(translationPromises);
                    translatedWords = translationResults.reduce((acc, val) => ({ ...acc, ...val }), {});
                    metrics.wordsTranslated = Object.keys(translatedWords).length;
                    console.timeEnd("translationTime");
                }

                // --- Process Translations ---
                console.time("dbQueryTime");
                const translationEntries = Object.entries(translatedWords)
                    .flatMap(([key, words]) =>
                        (words as { translation?: string[] })?.translation?.map((value: string) => [key, value]) || []
                    );
                const translationWordsList = translationEntries.map(([, word]) => word.toLowerCase());

                const translationsOnDb = await prisma.word.findMany({
                    where: { word: { in: translationWordsList }, languageId: translationLanguage.id },
                });
                const translationsOnDbSet = new Set(translationsOnDb.map((t) => t.word.toLowerCase()));
                const translationsNotOnDb = translationEntries.filter(
                    ([, word]) => !translationsOnDbSet.has(word.toLowerCase())
                );

                // --- Handle Untranslatable Words ---
                const notTranslatedWords = wordsToTranslate.filter((word) => !translatedWords[word]);
                metrics.wordsNotTranslated = notTranslatedWords.length;
                if (notTranslatedWords.length > 0) {
                    await prisma.word.updateMany({
                        where: { word: { in: notTranslatedWords }, languageId: language.id },
                        data: { isNotPossibleTranslate: true },
                    });
                }

                // --- Create New Translation Words ---
                const newTranslationWords = [...new Set(translationsNotOnDb.map(([, word]) => word.toLowerCase()))];
                if (newTranslationWords.length > 0) {
                    await prisma.word.createMany({
                        data: newTranslationWords.map((word) => ({
                            word,
                            languageId: translationLanguage.id,
                        })),
                        skipDuplicates: true,
                    });
                    metrics.wordsCreated = newTranslationWords.length;
                }

                // --- Link Translations to Original Words ---
                const allTranslationWords = await prisma.word.findMany({
                    where: { word: { in: translationWordsList }, languageId: translationLanguage.id },
                });

                for (const [originalWord, translationData] of Object.entries(translatedWords)) {
                    const word = wordsOnDb.find((w) => w.word.toLowerCase() === originalWord.toLowerCase());
                    if (!word) continue;

                    const translations = allTranslationWords.filter((t) =>
                        (translationData as any)?.translation
                            ?.map((w: string) => w.toLowerCase())
                            .includes(t.word.toLowerCase())
                    );

                    await prisma.word.update({
                        where: { id: word.id },
                        data: {
                            translations: {
                                upsert: {
                                    where: {
                                        wordId_languageId: { wordId: word.id, languageId: translationLanguage.id },
                                    },
                                    create: {
                                        meaning: (translationData as any)?.meaning?.join("\n") || "",
                                        meaningTranslated: (translationData as any)?.meaningTranslated?.join("\n") || "",
                                        translations: { connect: translations.map((t) => ({ id: t.id })) },
                                        languageId: translationLanguage.id,
                                    },
                                    update: {
                                        meaning: (translationData as any)?.meaning?.join("\n") || "",
                                        meaningTranslated: (translationData as any)?.meaningTranslated?.join("\n") || "",
                                        translations: { set: translations.map((t) => ({ id: t.id })) },
                                    },
                                },
                            },
                        },
                    });
                }

                // --- Fetch Final Words ---
                const finalWords = await prisma.word.findMany({
                    where: {
                        ...wordsWhere,
                        translations: { some: { languageId: translationLanguage.id } },
                    },
                    include: {
                        userWords: { where: { userId } },
                        translations: {
                            where: { languageId: translationLanguage.id },
                            include: { translations: { where: { languageId: translationLanguage.id } } },
                        },
                    },
                });
                console.timeEnd("dbQueryTime");

                const sortedFinalWords = finalWords.sort(sortWords).slice(0, body.limit);

                return {
                    data: { wordsOnDb: sortedWords, wordsNotOnDb, words: sortedFinalWords },
                    err: null,
                    msg: "Words fetched",
                };
            },
            3, // Max retries
            metrics
        );
    } catch (err) {
        console.error("Error in getWords:", err);
        return { err: (err as Error).message || "An unexpected error occurred", msg: "Error" };
    } finally {
        console.timeEnd("totalTime");

        console.log("Request Metrics:", {
            "Total Time (ms)": console.timeEnd("totalTime"), // Logged separately
            "DB Query Time (ms)": console.timeEnd("dbQueryTime"),
            "Translation Time (ms)": console.timeEnd("translationTime"),
            "Words Requested": metrics.wordsRequested,
            "Words Fetched from DB": metrics.wordsFetchedFromDb,
            "Words Translated": metrics.wordsTranslated,
            "Words Not Translated": metrics.wordsNotTranslated,
            "Words Created": metrics.wordsCreated,
            "Transaction Retries": metrics.retries,
        });
    }
};