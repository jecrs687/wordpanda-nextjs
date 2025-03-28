"use server";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { addDays, differenceInDays, format, startOfDay, subDays, subMonths } from "date-fns";
import { cookies, headers } from "next/headers";

export type GetLearningInsightsResponse = {
    data?: {
        summary: {
            wordsLearned: number;
            minutesStudied: number;
            sessionsCompleted: number;
            averageRecallAccuracy: number;
            daysActive: number;
            timePerSession: number;
            wordsPerMinute: number;
            reviewEfficiency: number;
        };
        trends: {
            wordsLearnedByMonth: {
                month: string;
                count: number;
            }[];
            accuracyByMonth: {
                month: string;
                accuracy: number;
            }[];
            studyTimeByDayOfWeek: {
                day: string;
                minutes: number;
            }[];
            studyTimeDistribution: {
                timeSlot: string;
                percentage: number;
            }[];
        };
        forecasts: {
            daysToNextLevel: number;
            estimatedWordsIn30Days: number;
            predictedMasteryDate: string;
            vocabSizeIn6Months: number;
        };
        insights: {
            bestTimeToStudy: string;
            forgettingCurve: {
                days: number[];
                retention: number[];
            };
            challengeWords: string[];
            strengths: string[];
            weaknesses: string[];
            recommendedFocus: string;
        };
    };
    err?: string | null;
    msg?: string;
}

export async function getLearningInsights(): Promise<GetLearningInsightsResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Check cache first
        const cacheKey = `learningInsights:${decoded.id}`;
        const cachedData = await cacheClient.get(cacheKey);

        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const now = new Date();
        const today = startOfDay(now);
        const thirtyDaysAgo = subDays(today, 30);
        const sixMonthsAgo = subMonths(today, 6);

        // Get user data
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                createdAt: true,
                level: true,
                streak: true,
                languageId: true
            }
        });

        if (!user) {
            return { err: "User not found", msg: "User not found in database" };
        }

        // Get user's language for focused analysis
        const language = await prisma.language.findUnique({
            where: { id: user.languageId },
            select: { id: true, language: true }
        });

        // Get all learning sessions
        const learningSessions = await prisma.learningSession.findMany({
            where: {
                userId: decoded.id,
                startTime: {
                    gte: sixMonthsAgo
                },
                endTime: {
                    not: null
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });

        // Get user words with learning progress
        const userWords = await prisma.userWords.findMany({
            where: {
                userId: decoded.id,
                userLanguage: {
                    languageId: user.languageId
                }
            },
            select: {
                wordId: true,
                progress: true,
                mastered: true,
                attempts: true,
                errors: true,
                interval: true,
                lastAttempt: true,
                createdAt: true,
                word: {
                    select: {
                        word: true,
                        difficulty: true
                    }
                }
            }
        });

        // Calculate total words learned over time (by month)
        const wordsByMonth: Record<string, number> = {};
        const accuracyByMonth: Record<string, { correct: number; total: number }> = {};

        // Process user words
        userWords.forEach(userWord => {
            const createdMonth = format(new Date(userWord.createdAt), 'yyyy-MM');
            wordsByMonth[createdMonth] = (wordsByMonth[createdMonth] || 0) + 1;

            // Calculate accuracy data by month (if there are attempts)
            if (userWord.attempts > 0) {
                const correctAttempts = userWord.attempts - userWord.errors;

                if (userWord.lastAttempt) {
                    const attemptMonth = format(new Date(userWord.lastAttempt), 'yyyy-MM');

                    if (!accuracyByMonth[attemptMonth]) {
                        accuracyByMonth[attemptMonth] = { correct: 0, total: 0 };
                    }

                    accuracyByMonth[attemptMonth].correct += correctAttempts;
                    accuracyByMonth[attemptMonth].total += userWord.attempts;
                }
            }
        });

        // Format words by month trend data
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const month = format(subMonths(now, i), 'yyyy-MM');
            return {
                month: format(subMonths(now, i), 'MMM yyyy'),
                count: wordsByMonth[month] || 0
            };
        }).reverse();

        // Format accuracy by month trend data
        const accuracyTrend = Object.entries(accuracyByMonth).map(([month, data]) => ({
            month: format(new Date(month + '-01'), 'MMM yyyy'),
            accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
        })).slice(-6); // Last 6 months

        // Calculate study time by day of week
        const studyTimeByDay: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }; // Sunday-Saturday
        const studyTimeByHour: Record<number, number> = {};

        // Initialize hours
        for (let i = 0; i < 24; i++) {
            studyTimeByHour[i] = 0;
        }

        // Process learning sessions for time patterns
        learningSessions.forEach(session => {
            if (session.duration) {
                const startDate = new Date(session.startTime);
                const dayOfWeek = startDate.getDay(); // 0-6
                const hour = startDate.getHours(); // 0-23

                // Add duration in minutes
                const durationMinutes = Math.floor(session.duration / 60);
                studyTimeByDay[dayOfWeek] += durationMinutes;
                studyTimeByHour[hour] += durationMinutes;
            }
        });

        // Format day of week data
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const studyTimeByDayOfWeek = Object.entries(studyTimeByDay).map(([day, minutes]) => ({
            day: dayNames[parseInt(day)],
            minutes
        }));

        // Create time slot distribution (morning, afternoon, evening, night)
        const timeSlots = {
            'Early Morning (4-8 AM)': Object.entries(studyTimeByHour)
                .filter(([hour]) => parseInt(hour) >= 4 && parseInt(hour) < 8)
                .reduce((sum, [_, mins]) => sum + mins, 0),
            'Morning (8-12 PM)': Object.entries(studyTimeByHour)
                .filter(([hour]) => parseInt(hour) >= 8 && parseInt(hour) < 12)
                .reduce((sum, [_, mins]) => sum + mins, 0),
            'Afternoon (12-4 PM)': Object.entries(studyTimeByHour)
                .filter(([hour]) => parseInt(hour) >= 12 && parseInt(hour) < 16)
                .reduce((sum, [_, mins]) => sum + mins, 0),
            'Evening (4-8 PM)': Object.entries(studyTimeByHour)
                .filter(([hour]) => parseInt(hour) >= 16 && parseInt(hour) < 20)
                .reduce((sum, [_, mins]) => sum + mins, 0),
            'Night (8-12 AM)': Object.entries(studyTimeByHour)
                .filter(([hour]) => parseInt(hour) >= 20 && parseInt(hour) < 24)
                .reduce((sum, [_, mins]) => sum + mins, 0),
            'Late Night (12-4 AM)': Object.entries(studyTimeByHour)
                .filter(([hour]) => parseInt(hour) >= 0 && parseInt(hour) < 4)
                .reduce((sum, [_, mins]) => sum + mins, 0)
        };

        const totalStudyTime = Object.values(timeSlots).reduce((sum, mins) => sum + mins, 0);

        const studyTimeDistribution = Object.entries(timeSlots).map(([timeSlot, minutes]) => ({
            timeSlot,
            percentage: totalStudyTime > 0 ? Math.round((minutes / totalStudyTime) * 100) : 0
        }));

        // Calculate overall metrics
        const totalWordsLearned = userWords.length;
        const totalMinutesStudied = learningSessions.reduce((sum, session) => sum + (session.duration || 0) / 60, 0);
        const totalSessionsCompleted = learningSessions.length;

        // Calculate average recall accuracy
        const totalAttempts = userWords.reduce((sum, word) => sum + word.attempts, 0);
        const totalErrors = userWords.reduce((sum, word) => sum + word.errors, 0);
        const averageRecallAccuracy = totalAttempts > 0
            ? Math.round(((totalAttempts - totalErrors) / totalAttempts) * 100)
            : 0;

        // Calculate days active
        const activeDays = new Set(learningSessions.map(session =>
            format(new Date(session.startTime), 'yyyy-MM-dd')
        )).size;

        // Calculate time per session and words per minute
        const timePerSession = totalSessionsCompleted > 0
            ? Math.round(totalMinutesStudied / totalSessionsCompleted)
            : 0;

        const wordsPerMinute = totalMinutesStudied > 0
            ? (totalWordsLearned / totalMinutesStudied).toFixed(2)
            : 0;

        // Calculate review efficiency (ratio of mastered words to total reviews)
        const masteredWords = userWords.filter(word => word.mastered).length;
        const reviewEfficiency = totalAttempts > 0
            ? Math.round((masteredWords / totalAttempts) * 100)
            : 0;

        // Calculate forecasts
        const averageWordsPerDay = differenceInDays(now, user.createdAt) > 0
            ? totalWordsLearned / differenceInDays(now, user.createdAt)
            : 0;

        const estimatedWordsIn30Days = Math.round(averageWordsPerDay * 30);

        // Estimate days to next level (based on current rate)
        const wordsToNextLevel = 500; // Arbitrary number, this would be based on your level system
        const daysToNextLevel = averageWordsPerDay > 0
            ? Math.ceil(wordsToNextLevel / averageWordsPerDay)
            : 999;

        // Predict vocabulary size in 6 months
        const vocabSizeIn6Months = totalWordsLearned + Math.round(averageWordsPerDay * 180);

        // Predict date of mastery goal (e.g., 2000 words)
        const masteryGoal = 2000;
        const daysToMastery = averageWordsPerDay > 0
            ? Math.ceil((masteryGoal - totalWordsLearned) / averageWordsPerDay)
            : 999;

        const predictedMasteryDate = daysToMastery < 999
            ? format(addDays(now, daysToMastery), 'MMM d, yyyy')
            : 'beyond 1 year';

        // Generate insights
        const bestTimeToStudy = Object.entries(timeSlots)
            .sort(([, a], [, b]) => b - a)[0][0];

        // Generate forgetting curve data (theoretical based on SRS principles)
        const forgettingCurve = {
            days: [0, 1, 2, 3, 5, 7, 14, 30],
            retention: [100, 80, 60, 50, 40, 35, 28, 20] // theoretical retention percentages
        };

        // Identify challenge words (difficult words with most errors)
        const challengeWords = userWords
            .filter(word => word.attempts > 3 && word.errors / word.attempts > 0.3)
            .sort((a, b) => (b.errors / b.attempts) - (a.errors / a.attempts))
            .slice(0, 5)
            .map(word => word.word.word);

        // Identify strengths (word categories or types with high success)
        // Note: This would ideally be based on word categories in a real implementation
        const strengths = ['Nouns', 'Concrete terms', 'Everyday vocabulary'];

        // Identify weaknesses (word categories with more errors)
        const weaknesses = ['Verb conjugations', 'Idioms', 'Abstract concepts'];

        // Recommended focus (based on identified weaknesses)
        const recommendedFocus = 'Verb conjugations and idiomatic expressions';

        // Prepare the response
        const response: GetLearningInsightsResponse = {
            data: {
                summary: {
                    wordsLearned: totalWordsLearned,
                    minutesStudied: Math.round(totalMinutesStudied),
                    sessionsCompleted: totalSessionsCompleted,
                    averageRecallAccuracy,
                    daysActive: activeDays,
                    timePerSession,
                    wordsPerMinute: parseFloat(wordsPerMinute.toString()),
                    reviewEfficiency
                },
                trends: {
                    wordsLearnedByMonth: last6Months,
                    accuracyByMonth: accuracyTrend,
                    studyTimeByDayOfWeek,
                    studyTimeDistribution
                },
                forecasts: {
                    daysToNextLevel,
                    estimatedWordsIn30Days,
                    predictedMasteryDate,
                    vocabSizeIn6Months
                },
                insights: {
                    bestTimeToStudy,
                    forgettingCurve,
                    challengeWords,
                    strengths,
                    weaknesses,
                    recommendedFocus
                }
            },
            msg: "Learning insights retrieved successfully"
        };

        // Cache the response
        await cacheClient.set(cacheKey, JSON.stringify(response), { EX: 1800 }); // Cache for 30 minutes

        return response;
    } catch (error) {
        console.error("Error generating learning insights:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to generate learning insights"
        };
    }
}
