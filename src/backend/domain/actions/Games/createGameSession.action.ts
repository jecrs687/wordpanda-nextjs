"use server";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { GameType, Prisma } from "@prisma/client";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";
import { createLearningSession } from "../LearningSession/createLearningSession.action";

export type CreateGameSessionRequest = {
    gameType: GameType;
    wordIds?: string[];
    languageId?: number;
}

export type CreateGameSessionResponse = {
    data?: {
        gameSessionId: string;
        learningSessionId: string;
        words?: any[];
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

export async function createGameSession(
    request: CreateGameSessionRequest
): Promise<CreateGameSessionResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Create the game session
        const result = await runTransactionWithRetries(async (prismaClient) => {
            const gameSession = await prismaClient.gameSession.create({
                data: {
                    gameType: request.gameType,
                    completed: false
                }
            });

            // Fetch the words if provided
            let words = null;
            if (request.wordIds && request.wordIds.length > 0) {
                words = await prismaClient.word.findMany({
                    where: {
                        id: {
                            in: request.wordIds
                        }
                    },
                    include: {
                        translations: {
                            include: {
                                translations: true
                            }
                        }
                    }
                });
            } else if (request.languageId) {
                // Get user's words for review if no specific words provided
                const userWords = await prismaClient.userWords.findMany({
                    where: {
                        userId: decoded.id,
                        userLanguage: {
                            languageId: request.languageId
                        },
                        notLearned: false
                    },
                    orderBy: [
                        { lastAttempt: 'asc' },
                        { progress: 'asc' }
                    ],
                    take: 10,
                    include: {
                        word: {
                            include: {
                                translations: {
                                    include: {
                                        translations: true
                                    }
                                }
                            }
                        }
                    }
                });

                words = userWords.map(uw => uw.word);
            }

            return {
                gameSession,
                words
            };
        });

        // Create the learning session tied to this game session
        const learningSessionResponse = await createLearningSession({
            gameSessionId: result.gameSession.id,
            startTime: new Date()
        });

        if (learningSessionResponse.err) {
            return {
                err: learningSessionResponse.err,
                msg: "Game session created but failed to create learning session"
            };
        }

        return {
            data: {
                gameSessionId: result.gameSession.id,
                learningSessionId: learningSessionResponse.data?.sessionId || "",
                words: result.words
            },
            msg: "Game session created successfully"
        };
    } catch (error) {
        console.error("Error creating game session:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to create game session"
        };
    }
}
