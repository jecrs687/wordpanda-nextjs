"use server";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { Prisma } from "@prisma/client";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

export type CreateLearningSessionRequest = {
    startTime?: Date;
    mediaLanguageId?: string;
    bookLanguageId?: string;
    gameSessionId?: string;
}

export type CreateLearningSessionResponse = {
    data?: {
        sessionId: string;
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

export async function createLearningSession(request: CreateLearningSessionRequest): Promise<CreateLearningSessionResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Only one of these IDs should be provided
        if ([request.mediaLanguageId, request.bookLanguageId, request.gameSessionId].filter(Boolean).length > 1) {
            return {
                err: "Invalid request",
                msg: "Only one of mediaLanguageId, bookLanguageId, or gameSessionId should be provided"
            };
        }

        const session = await runTransactionWithRetries(async (prismaClient) => {
            // Create the learning session
            const learningSession = await prismaClient.learningSession.create({
                data: {
                    userId: decoded.id,
                    startTime: request.startTime || new Date(),
                    ...(request.mediaLanguageId && { mediaLanguageId: request.mediaLanguageId }),
                    ...(request.bookLanguageId && { bookLanguageId: request.bookLanguageId }),
                    ...(request.gameSessionId && { gameSessionId: request.gameSessionId }),
                }
            });

            // Update user's streak if needed
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const user = await prismaClient.user.findUnique({
                where: { id: decoded.id },
                select: {
                    streak: true,
                    longestStreak: true,
                    lastLoginAt: true
                }
            });

            if (user) {
                const lastActiveDate = user.lastLoginAt;
                let newStreak = user.streak || 0;

                // If the user was active yesterday or this is their first session today
                if (lastActiveDate) {
                    const lastActiveDay = new Date(lastActiveDate);
                    lastActiveDay.setHours(0, 0, 0, 0);

                    if (lastActiveDay.getTime() === yesterday.getTime()) {
                        // User was active yesterday, increment streak
                        newStreak++;
                    } else if (lastActiveDay.getTime() < yesterday.getTime()) {
                        // User missed a day, reset streak
                        newStreak = 1;
                    }
                    // If lastActiveDay is today, keep the current streak
                } else {
                    // First activity ever
                    newStreak = 1;
                }

                // Update user streak
                await prismaClient.user.update({
                    where: { id: decoded.id },
                    data: {
                        streak: newStreak,
                        lastLoginAt: new Date(),
                        longestStreak: Math.max(newStreak, user.longestStreak || 0)
                    }
                });
            }

            return learningSession;
        });

        return {
            data: { sessionId: session.id },
            msg: "Learning session created successfully"
        };
    } catch (error) {
        console.error("Error creating learning session:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to create learning session"
        };
    }
}
