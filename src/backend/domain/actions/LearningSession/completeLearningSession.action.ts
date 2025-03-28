"use server";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

export type CompleteLearningSessionRequest = {
    sessionId: string;
    wordsLearned?: number;
    wordsSeen?: number;
}

export type CompleteLearningSessionResponse = {
    data?: {
        session: any;
        achievements?: any[];
    };
    err?: string | null;
    msg?: string;
}

export async function completeLearningSession(
    request: CompleteLearningSessionRequest
): Promise<CompleteLearningSessionResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Fetch the session to ensure it belongs to the user
        const session = await prisma.learningSession.findFirst({
            where: {
                id: request.sessionId,
                userId: decoded.id,
                endTime: null // Only complete sessions that aren't already completed
            }
        });

        if (!session) {
            return { err: "Session not found", msg: "Invalid session or already completed" };
        }

        const endTime = new Date();
        const startTime = new Date(session.startTime);
        const durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

        // Update session with completion data
        const updatedSession = await prisma.learningSession.update({
            where: { id: request.sessionId },
            data: {
                endTime,
                duration: durationInSeconds,
                wordsLearned: request.wordsLearned || 0,
                wordsSeen: request.wordsSeen || 0
            },
            include: {
                mediaLanguage: {
                    include: {
                        media: true,
                        language: true
                    }
                },
                bookLanguage: {
                    include: {
                        language: true
                    }
                },
                gameSession: true
            }
        });

        // Update total points for user
        await prisma.user.update({
            where: { id: decoded.id },
            data: {
                totalPoints: {
                    increment: Math.ceil(durationInSeconds / 60) + (request.wordsLearned || 0) * 2
                }
            }
        });

        // Check for achievements
        const newAchievements = await checkAndAwardAchievements(decoded.id);

        // Clear user cache to reflect new stats
        const userCacheKeys = [
            `getUserInformation:${decoded.id}`,
            `getUser:${decoded.id}`
        ];

        for (const key of userCacheKeys) {
            await cacheClient.del(key);
        }

        return {
            data: {
                session: updatedSession,
                achievements: newAchievements
            },
            msg: "Learning session completed successfully"
        };
    } catch (error) {
        console.error("Error completing learning session:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to complete learning session"
        };
    }
}

async function checkAndAwardAchievements(userId: string) {
    // Get user's learning data
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            learningSession: {
                select: {
                    id: true
                }
            },
            UserWords: {
                select: {
                    id: true
                }
            },
            achievements: {
                select: {
                    achievementId: true
                }
            }
        }
    });

    if (!user) return [];

    const sessionsCount = user.learningSession.length;
    const wordsCount = user.UserWords.length;
    const userAchievementIds = user.achievements.map(a => a.achievementId);

    // Get eligible achievements that the user doesn't already have
    const eligibleAchievements = await prisma.achievement.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { type: 'SESSION', requirement: { lte: sessionsCount } },
                        { type: 'WORDS', requirement: { lte: wordsCount } },
                        { type: 'STREAK', requirement: { lte: user.streak || 0 } },
                        { type: 'LEVEL', requirement: { lte: user.level || 1 } }
                    ]
                },
                {
                    id: {
                        notIn: userAchievementIds
                    }
                }
            ]
        }
    });

    if (eligibleAchievements.length === 0) {
        return [];
    }

    // Award new achievements
    const newUserAchievements = await Promise.all(
        eligibleAchievements.map(achievement =>
            prisma.userAchievement.create({
                data: {
                    userId,
                    achievementId: achievement.id,
                    earnedAt: new Date()
                },
                include: {
                    achievement: true
                }
            })
        )
    );

    return newUserAchievements;
}
