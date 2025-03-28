"use server";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { Prisma } from "@prisma/client";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";
import { completeLearningSession } from "../LearningSession/completeLearningSession.action";

export type CompleteGameSessionRequest = {
    gameSessionId: string;
    learningSessionId: string;
    score: number;
    duration: number;
    rounds: {
        wordId?: string;
        correct: boolean;
        timeTaken?: number;
    }[];
}

export type CompleteGameSessionResponse = {
    data?: {
        gameSession: any;
        achievements?: any[];
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

export async function completeGameSession(
    request: CompleteGameSessionRequest
): Promise<CompleteGameSessionResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Complete the game session
        const result = await runTransactionWithRetries(async (prismaClient) => {
            // Check if game session exists
            const gameSession = await prismaClient.gameSession.findUnique({
                where: { id: request.gameSessionId },
                include: {
                    learningSession: {
                        where: {
                            userId: decoded.id
                        }
                    }
                }
            });

            if (!gameSession) {
                throw new Error("Game session not found");
            }

            if (gameSession.completed) {
                throw new Error("Game session already completed");
            }

            // Verify the session belongs to the user
            if (gameSession.learningSession.length === 0) {
                throw new Error("Game session not associated with this user");
            }

            // Update game session
            const updatedGameSession = await prismaClient.gameSession.update({
                where: { id: request.gameSessionId },
                data: {
                    score: request.score,
                    completed: true,
                    duration: request.duration
                }
            });

            // Create game rounds
            if (request.rounds && request.rounds.length > 0) {
                await prismaClient.gameRound.createMany({
                    data: request.rounds.map((round, index) => ({
                        gameSessionId: request.gameSessionId,
                        roundNumber: index + 1,
                        wordId: round.wordId,
                        correct: round.correct,
                        timeTaken: round.timeTaken
                    }))
                });
            }

            // Update word stats
            await Promise.all(request.rounds
                .filter(round => round.wordId)
                .map(async (round) => {
                    await prismaClient.word.update({
                        where: { id: round.wordId },
                        data: {
                            attempts: {
                                increment: 1
                            },
                            errors: round.correct ? undefined : {
                                increment: 1
                            }
                        }
                    });

                    // Update user word stats
                    const userWord = await prismaClient.userWords.findFirst({
                        where: {
                            userId: decoded.id,
                            wordId: round.wordId
                        }
                    });

                    if (userWord) {
                        await prismaClient.userWords.update({
                            where: { id: userWord.id },
                            data: {
                                attempts: {
                                    increment: 1
                                },
                                errors: round.correct ? undefined : {
                                    increment: 1
                                },
                                streak: round.correct ? {
                                    increment: 1
                                } : 0,
                                lastAttempt: new Date(),
                                lastError: round.correct ? undefined : new Date(),
                                lastSuccess: round.correct ? new Date() : undefined,
                                notLearned: false
                            }
                        });
                    }
                })
            );

            return updatedGameSession;
        });

        // Complete the learning session
        const learningSessionResponse = await completeLearningSession({
            sessionId: request.learningSessionId,
            wordsLearned: request.rounds.filter(r => r.correct).length,
            wordsSeen: request.rounds.length
        });

        // Return combined response
        return {
            data: {
                gameSession: result,
                achievements: learningSessionResponse.data?.achievements
            },
            msg: "Game session completed successfully"
        };
    } catch (error) {
        console.error("Error completing game session:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to complete game session"
        };
    }
}
