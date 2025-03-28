"use server";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { addDays, format, startOfDay, subDays } from "date-fns";
import { cookies, headers } from "next/headers";

export type GetUserProgressResponse = {
    data?: {
        streak: {
            current: number;
            longest: number;
            lastActive: Date;
        };
        today: {
            wordsLearned: number;
            wordsReviewed: number;
            timeSpent: number;
            dailyGoalProgress: number;
        };
        overall: {
            totalWords: number;
            mastered: number;
            learning: number;
            toReview: number;
            completion: number;
        };
        languages: {
            id: number;
            name: string;
            code: string;
            wordCount: number;
            progress: number;
        }[];
        recentActivity: {
            date: string;
            wordsLearned: number;
            wordsReviewed: number;
            timeSpent: number;
        }[];
    };
    err?: string | null;
    msg?: string;
}

export async function getUserProgress(): Promise<GetUserProgressResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Check cache
        const cacheKey = `userProgress:${decoded.id}`;
        const cachedData = await cacheClient.get(cacheKey);

        if (cachedData) {
            return JSON.parse(cachedData);
        }

        // Get current user data
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                streak: true,
                longestStreak: true,
                lastLoginAt: true,
                dailyGoal: true
            }
        });

        if (!user) {
            return { err: "User not found", msg: "User not found in the database" };
        }

        const now = new Date();
        const today = startOfDay(now);
        const last14Days = subDays(today, 13);

        // Get user languages with word progress
        const userLanguages = await prisma.userLanguage.findMany({
            where: {
                userId: decoded.id
            },
            include: {
                language: true,
                userWords: {
                    select: {
                        progress: true,
                        mastered: true,
                        nextAttempt: true
                    }
                }
            }
        });

        // Get recent learning sessions
        const learningSessions = await prisma.learningSession.findMany({
            where: {
                userId: decoded.id,
                startTime: {
                    gte: last14Days
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });

        // Get today's learning sessions
        const todayLearningSessions = learningSessions.filter(
            session => session.startTime >= today
        );

        // Calculate streak information
        const streak = {
            current: user.streak || 0,
            longest: user.longestStreak || 0,
            lastActive: user.lastLoginAt || now
        };

        // Calculate today's progress
        const todayWords = await prisma.userWords.count({
            where: {
                userId: decoded.id,
                createdAt: {
                    gte: today
                },
                notLearned: false
            }
        });

        const todayReviews = await prisma.userWords.count({
            where: {
                userId: decoded.id,
                lastAttempt: {
                    gte: today
                }
            }
        });

        const todayTimeSpent = todayLearningSessions.reduce(
            (total, session) => total + (session.duration || 0),
            0
        );

        const dailyGoalProgress = Math.min(
            100,
            Math.round((todayWords / (user.dailyGoal || 20)) * 100)
        );

        // Calculate overall statistics
        const overallStats = {
            totalWords: await prisma.userWords.count({
                where: {
                    userId: decoded.id
                }
            }),
            mastered: await prisma.userWords.count({
                where: {
                    userId: decoded.id,
                    mastered: true
                }
            }),
            learning: await prisma.userWords.count({
                where: {
                    userId: decoded.id,
                    notLearned: false,
                    mastered: false
                }
            }),
            toReview: await prisma.userWords.count({
                where: {
                    userId: decoded.id,
                    nextAttempt: {
                        lte: now
                    },
                    notLearned: false
                }
            }),
            completion: 0 // Initialize with default value
        };

        overallStats.completion = overallStats.totalWords > 0
            ? Math.round((overallStats.mastered / overallStats.totalWords) * 100)
            : 0;

        // Format language data
        const languages = userLanguages.map(lang => {
            const masteredWords = lang.userWords.filter(w => w.mastered).length;
            const totalWords = lang.userWords.length;

            return {
                id: lang.languageId,
                name: lang.language.language,
                code: lang.language.code,
                wordCount: totalWords,
                progress: totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0
            };
        });

        // Process recent activity data
        const recentActivity = [];

        // Create a map of dates for the last 14 days
        const dateMap = new Map();
        for (let i = 0; i < 14; i++) {
            const date = format(addDays(last14Days, i), 'yyyy-MM-dd');
            dateMap.set(date, {
                date,
                wordsLearned: 0,
                wordsReviewed: 0,
                timeSpent: 0
            });
        }

        // Get all user words with activity in the last 14 days
        const recentUserWords = await prisma.userWords.findMany({
            where: {
                userId: decoded.id,
                OR: [
                    { lastAttempt: { gte: last14Days } },
                    { createdAt: { gte: last14Days } }
                ]
            },
            select: {
                createdAt: true,
                lastAttempt: true,
                notLearned: true
            }
        });

        // Process word activities
        recentUserWords.forEach(word => {
            if (word.createdAt && word.createdAt >= last14Days && !word.notLearned) {
                const dateStr = format(word.createdAt, 'yyyy-MM-dd');
                if (dateMap.has(dateStr)) {
                    const data = dateMap.get(dateStr);
                    data.wordsLearned++;
                    dateMap.set(dateStr, data);
                }
            }

            if (word.lastAttempt && word.lastAttempt >= last14Days) {
                const dateStr = format(word.lastAttempt, 'yyyy-MM-dd');
                if (dateMap.has(dateStr)) {
                    const data = dateMap.get(dateStr);
                    data.wordsReviewed++;
                    dateMap.set(dateStr, data);
                }
            }
        });

        // Process session durations
        learningSessions.forEach(session => {
            if (session.startTime) {
                const dateStr = format(session.startTime, 'yyyy-MM-dd');
                if (dateMap.has(dateStr)) {
                    const data = dateMap.get(dateStr);
                    data.timeSpent += session.duration || 0;
                    dateMap.set(dateStr, data);
                }
            }
        });

        // Convert map to array and sort by date
        dateMap.forEach(value => {
            recentActivity.push(value);
        });

        recentActivity.sort((a, b) => a.date.localeCompare(b.date));

        // Prepare response
        const response: GetUserProgressResponse = {
            data: {
                streak,
                today: {
                    wordsLearned: todayWords,
                    wordsReviewed: todayReviews,
                    timeSpent: todayTimeSpent,
                    dailyGoalProgress
                },
                overall: overallStats,
                languages,
                recentActivity
            },
            msg: "User progress retrieved successfully"
        };

        // Cache the response for 5 minutes
        await cacheClient.set(cacheKey, JSON.stringify(response), { EX: 300 });

        return response;
    } catch (error) {
        console.error("Error fetching user progress:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to fetch user progress"
        };
    }
}
