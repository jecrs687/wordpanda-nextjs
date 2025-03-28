"use server";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { addDays, addHours, startOfDay } from "date-fns";
import { cookies, headers } from "next/headers";

export type GetLearningScheduleResponse = {
    data?: {
        preferredLearningTime: string;
        dailyGoal: number;
        nextReviewSession: {
            date: Date;
            wordCount: number;
            estimatedTimeMinutes: number;
        };
        recommendedSessions: {
            date: Date;
            type: 'REVIEW' | 'NEW' | 'MIXED';
            wordCount: number;
            estimatedTimeMinutes: number;
        }[];
        dueToday: number;
        dueThisWeek: number;
    };
    err?: string | null;
    msg?: string;
}

export async function getLearningSchedule(): Promise<GetLearningScheduleResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Get user preferences
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                preferredLearningTime: true,
                dailyGoal: true,
                languageId: true
            }
        });

        if (!user) {
            return { err: "User not found", msg: "User not found in the database" };
        }

        // Get user's learning patterns from sessions
        const sessions = await prisma.learningSession.findMany({
            where: {
                userId: decoded.id,
                endTime: { not: null }
            },
            orderBy: {
                startTime: 'desc'
            },
            take: 20
        });

        // Calculate average session duration
        const avgSessionDuration = sessions.length > 0
            ? sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / sessions.length
            : 900; // Default 15 minutes if no data

        // Calculate average words per session
        const avgWordsPerSession = sessions.length > 0
            ? sessions.reduce((sum, session) => sum + (session.wordsLearned || 0), 0) / sessions.length
            : 10; // Default 10 words if no data

        // Get words due for review
        const now = new Date();
        const today = startOfDay(now);
        const nextWeek = addDays(today, 7);

        // Count words due today and this week
        const dueToday = await prisma.userWords.count({
            where: {
                userId: decoded.id,
                nextAttempt: {
                    lte: addDays(today, 1)
                },
                userLanguage: {
                    languageId: user.languageId
                }
            }
        });

        const dueThisWeek = await prisma.userWords.count({
            where: {
                userId: decoded.id,
                nextAttempt: {
                    lte: nextWeek
                },
                userLanguage: {
                    languageId: user.languageId
                }
            }
        });

        // Calculate preferred study time
        let preferredTime = user.preferredLearningTime || 'Evening';
        const preferredHour =
            preferredTime === 'Morning' ? 9 :
                preferredTime === 'Afternoon' ? 14 :
                    preferredTime === 'Evening' ? 19 : 21;

        // Create next review session recommendation
        const nextSessionDate = dueToday > 0
            ? addHours(today, preferredHour)
            : addHours(addDays(today, 1), preferredHour);

        const nextReviewSession = {
            date: nextSessionDate,
            wordCount: Math.min(dueToday, user.dailyGoal || 20),
            estimatedTimeMinutes: Math.ceil((Math.min(dueToday, user.dailyGoal || 20) * avgSessionDuration) / avgWordsPerSession / 60)
        };

        // Create recommended sessions for the next week
        const recommendedSessions = [];

        for (let i = 0; i < 7; i++) {
            const date = addHours(addDays(today, i), preferredHour);
            const isToday = i === 0;

            // Skip today if we already have a next review session today
            if (isToday && dueToday > 0) continue;

            // Calculate words due by this date
            const wordsDue = Math.round(dueThisWeek / (7 - i) * 0.8);
            const newWords = Math.max(1, Math.round((user.dailyGoal || 20) - wordsDue));

            const sessionType = wordsDue > newWords * 2 ? 'REVIEW' : wordsDue < newWords / 2 ? 'NEW' : 'MIXED';
            const totalWords = Math.min(wordsDue + newWords, user.dailyGoal || 20);

            recommendedSessions.push({
                date,
                type: sessionType,
                wordCount: totalWords,
                estimatedTimeMinutes: Math.ceil((totalWords * avgSessionDuration) / avgWordsPerSession / 60)
            });
        }

        return {
            data: {
                preferredLearningTime: preferredTime,
                dailyGoal: user.dailyGoal || 20,
                nextReviewSession,
                recommendedSessions,
                dueToday,
                dueThisWeek
            },
            msg: "Learning schedule retrieved successfully"
        };
    } catch (error) {
        console.error("Error generating learning schedule:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to generate learning schedule"
        };
    }
}
