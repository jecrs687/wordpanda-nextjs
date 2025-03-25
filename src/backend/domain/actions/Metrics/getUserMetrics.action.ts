import prisma from '@/src/backend/infra/config/database';
import { addDays, format, isSameDay, isToday, startOfDay, subDays } from 'date-fns';
import { getUser } from '../User/getUser.action';

export async function getUserMetrics() {
    try {
        const { user } = await getUser();

        if (!user) {
            return {
                error: 'User not found',
                metrics: null
            };
        }

        // Get user languages with word counts
        const userLanguages = await prisma.userLanguage.findMany({
            where: {
                userId: user.id
            },
            include: {
                language: true,
                _count: {
                    select: {
                        userWords: true
                    }
                },
                userWords: {
                    include: {
                        word: true
                    },
                }
            }
        });

        // Get activity data for the last 14 days
        const today = startOfDay(new Date());
        const twoWeeksAgo = subDays(today, 13);

        // Get user words activity for the past 14 days
        const userWordsActivity = await prisma.userWords.findMany({
            where: {
                userId: user.id,
                OR: [
                    { lastAttempt: { gte: twoWeeksAgo } },
                    { lastSuccess: { gte: twoWeeksAgo } },
                    { lastError: { gte: twoWeeksAgo } }
                ]
            },
            orderBy: {
                lastAttempt: 'asc'
            },
            include: {
                userLanguage: {
                    include: {
                        language: true
                    }
                }
            }
        });

        // Get learning sessions for the past 14 days
        const learningSessions = await prisma.learningSession.findMany({
            where: {
                userId: user.id,
                startTime: { gte: twoWeeksAgo }
            },
            include: {
                mediaLanguage: {
                    include: {
                        media: true
                    }
                },
                bookLanguage: true,
                gameSession: true
            },
            orderBy: {
                startTime: 'asc'
            }
        });

        // Get user achievements
        const achievements = await prisma.userAchievement.findMany({
            where: {
                userId: user.id
            },
            include: {
                achievement: true
            },
            orderBy: {
                earnedAt: 'desc'
            }
        });

        // Get game sessions and performance
        const gameSessions = await prisma.gameSession.findMany({
            where: {
                learningSession: {
                    some: {
                        userId: user.id
                    }
                }
            },
            include: {
                gameRounds: {
                    include: {
                        word: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        });

        // Get streak information from database or calculate if needed
        const streak = await calculateStreak(user.id, learningSessions, user.streak || 0, user.longestStreak || 0);

        // Process daily activity
        const dailyActivity = processDailyActivity(userWordsActivity, learningSessions, userLanguages, twoWeeksAgo);

        // Calculate success rate
        const { overallSuccessRate, languageSuccessRates } = calculateSuccessRates(userLanguages);

        // Get most used words
        const mostUsedWords = getMostUsedWords(userLanguages);

        // Get most difficult words
        const mostDifficultWords = getMostDifficultWords(userLanguages);

        // Calculate learning efficiency
        const learningEfficiency = calculateLearningEfficiency(userLanguages);

        // Calculate practice frequency
        const practiceFrequency = calculatePracticeFrequency(learningSessions);

        // Calculate daily goal progress
        const dailyGoalProgress = calculateDailyGoalProgress(user, userWordsActivity, learningSessions);

        // Process game performance metrics
        const gamePerformance = processGamePerformance(gameSessions);

        return {
            user: {
                id: user.id,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                email: user.email,
                joinedAt: user.createdAt,
                score: user.score || 0,
                level: user.level || 1,
                totalPoints: user.totalPoints || 0,
                dailyGoal: user.dailyGoal || 30,
                preferredLearningTime: user.preferredLearningTime || 'Any',
                learningStyle: user.learningStyle || 'Mixed'
            },
            streak,
            dailyActivity,
            languages: userLanguages.map(lang => ({
                id: lang.languageId,
                name: lang.language.language,
                code: lang.language.code,
                wordsCount: lang._count.userWords,
                successRate: languageSuccessRates[lang.languageId] || 0,
                efficiency: learningEfficiency[lang.languageId] || 0
            })),
            overallSuccessRate,
            mostUsedWords,
            mostDifficultWords,
            practiceFrequency,
            dailyGoalProgress,
            achievements: achievements.map(a => ({
                id: a.achievementId,
                name: a.achievement.name,
                description: a.achievement.description,
                type: a.achievement.type,
                icon: a.achievement.icon,
                earnedAt: a.earnedAt
            })),
            gamePerformance,
            sessionMetrics: processSessionMetrics(learningSessions)
        };
    } catch (error) {
        console.error('Error fetching user metrics:', error);
        return {
            error: 'Failed to fetch metrics',
            metrics: null
        };
    }
}

// Helper functions for metrics calculations
async function calculateStreak(userId: string, learningSessions: any[], currentStreak: number, longestStreak: number) {
    // Use database records to determine streak more accurately
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);

    // Check if user has activity today
    const hasActivityToday = learningSessions.some(
        session => isToday(new Date(session.startTime))
    );

    // Check if user had activity yesterday
    const hadActivityYesterday = learningSessions.some(
        session => isSameDay(new Date(session.startTime), yesterday)
    );

    // If user has activity today, current streak is maintained or incremented
    // If user had activity yesterday but not today, streak is intact but not incremented
    // If user had no activity yesterday or today, streak is broken (reset to 0 or 1 if active today)

    let updatedStreak = currentStreak;

    if (hasActivityToday) {
        // User is active today, streak continues or starts
        updatedStreak = hadActivityYesterday ? currentStreak + 1 : 1;
    } else if (!hadActivityYesterday) {
        // No activity for at least 2 days, streak is broken
        updatedStreak = 0;
    }

    // Update longest streak if current streak is longer
    const updatedLongestStreak = Math.max(longestStreak, updatedStreak);

    // Update user record if streak has changed
    if (updatedStreak !== currentStreak || updatedLongestStreak !== longestStreak) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                streak: updatedStreak,
                longestStreak: updatedLongestStreak
            }
        });
    }

    // Find the last active date
    const lastActiveSession = learningSessions.sort((a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )[0];

    const lastActive = lastActiveSession ? new Date(lastActiveSession.startTime) : null;

    return {
        current: updatedStreak,
        longest: updatedLongestStreak,
        lastActive: lastActive || new Date()
    };
}

function processDailyActivity(
    userWordsActivity: any[],
    learningSessions: any[],
    userLanguages: any[],
    startDate: Date
) {
    // Generate all dates in the range
    const dateRange = Array.from({ length: 14 }, (_, i) => {
        const date = addDays(startDate, i);
        return format(date, 'yyyy-MM-dd');
    });

    // Initialize activity data with zeros
    const languageMap = userLanguages.reduce((acc: Record<string, string>, lang) => {
        acc[lang.language.code] = lang.language.language;
        return acc;
    }, {});

    // Initialize base data structure with all dates
    const baseData = dateRange.map(date => {
        const entry: any = { date };
        Object.keys(languageMap).forEach(code => {
            entry[code] = 0;
        });
        return entry;
    });

    // Fill in activity data from userWords
    userWordsActivity.forEach(userWord => {
        const lastAttemptDate = userWord.lastAttempt ? format(userWord.lastAttempt, 'yyyy-MM-dd') : null;
        const lastErrorDate = userWord.lastError ? format(userWord.lastError, 'yyyy-MM-dd') : null;
        const lastSuccessDate = userWord.lastSuccess ? format(userWord.lastSuccess, 'yyyy-MM-dd') : null;

        const dates = [lastAttemptDate, lastErrorDate, lastSuccessDate].filter(Boolean);

        dates.forEach(date => {
            const dateIndex = baseData.findIndex(d => d.date === date);
            if (dateIndex !== -1) {
                const code = userWord.userLanguage.language.code;
                baseData[dateIndex][code] = (baseData[dateIndex][code] || 0) + 1;
            }
        });
    });

    // Add learning session data
    learningSessions.forEach(session => {
        const sessionDate = format(session.startTime, 'yyyy-MM-dd');
        const dateIndex = baseData.findIndex(d => d.date === sessionDate);

        if (dateIndex !== -1) {
            let languageCode;

            if (session.mediaLanguage) {
                // Get language code from media language
                const mediaLanguageId = session.mediaLanguage.id;
                const userLang = userLanguages.find(lang =>
                    lang.userWords.some((uw: any) => uw.userLanguageId === mediaLanguageId)
                );
                languageCode = userLang?.language.code;
            } else if (session.bookLanguage) {
                // Get language code from book language
                const bookLanguageId = session.bookLanguage.id;
                const userLang = userLanguages.find(lang =>
                    lang.languageId === session.bookLanguage.languageId
                );
                languageCode = userLang?.language.code;
            }

            if (languageCode && baseData[dateIndex][languageCode] !== undefined) {
                baseData[dateIndex][languageCode] += session.wordsLearned || 0;
            }
        }
    });

    return {
        data: baseData,
        languages: Object.entries(languageMap).map(([code, name]) => ({ code, name }))
    };
}

function calculateSuccessRates(userLanguages: any[]) {
    const languageSuccessRates: Record<string, number> = {};
    let totalAttempts = 0;
    let totalSuccesses = 0;

    userLanguages.forEach(lang => {
        let langAttempts = 0;
        let langSuccesses = 0;

        lang.userWords.forEach((userWord: any) => {
            langAttempts += userWord.attempts;
            langSuccesses += userWord.attempts - userWord.errors;

            totalAttempts += userWord.attempts;
            totalSuccesses += userWord.attempts - userWord.errors;
        });

        languageSuccessRates[lang.languageId] = langAttempts > 0
            ? (langSuccesses / langAttempts) * 100
            : 0;
    });

    const overallSuccessRate = totalAttempts > 0
        ? (totalSuccesses / totalAttempts) * 100
        : 0;

    return { overallSuccessRate, languageSuccessRates };
}

function getMostUsedWords(userLanguages: any[]) {
    const allWords = userLanguages.flatMap(lang =>
        lang.userWords.map((uw: any) => ({
            word: uw.word.word,
            translation: uw.word.translation,
            language: lang.language.language,
            code: lang.language.code,
            attempts: uw.attempts
        }))
    );

    return allWords
        .sort((a, b) => b.attempts - a.attempts)
        .slice(0, 10);
}

function getMostDifficultWords(userLanguages: any[]) {
    const allWords = userLanguages.flatMap(lang =>
        lang.userWords.map((uw: any) => ({
            word: uw.word.word,
            translation: uw.word.translation,
            language: lang.language.language,
            code: lang.language.code,
            errorRate: uw.attempts > 0 ? (uw.errors / uw.attempts) * 100 : 0,
            errors: uw.errors,
            attempts: uw.attempts
        }))
            .filter((word: any) => word.attempts > 2)
    );

    return allWords
        .sort((a, b) => b.errorRate - a.errorRate)
        .slice(0, 10);
}

function calculateLearningEfficiency(userLanguages: any[]) {
    const efficiency: Record<string, number> = {};

    userLanguages.forEach(lang => {
        // Simple efficiency calculation: words learned per attempt
        const totalWords = lang._count.userWords;
        const totalAttempts = lang.userWords.reduce((sum: number, uw: any) => sum + uw.attempts, 0);

        efficiency[lang.languageId] = totalAttempts > 0
            ? (totalWords / totalAttempts) * 100
            : 0;
    });

    return efficiency;
}

function calculatePracticeFrequency(learningSessions: any[]) {
    // Group sessions by day of week to see practice patterns
    const dayFrequency = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    const hourFrequency = Array(24).fill(0); // 0-23 hours

    learningSessions.forEach(session => {
        const sessionDate = new Date(session.startTime);
        const day = sessionDate.getDay();
        const hour = sessionDate.getHours();

        dayFrequency[day]++;
        hourFrequency[hour]++;
    });

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeBlocks = ['Early Morning (4-8)', 'Morning (8-12)', 'Afternoon (12-16)', 'Evening (16-20)', 'Night (20-0)', 'Late Night (0-4)'];

    // Convert hour frequency to time blocks
    const timeBlockFrequency = [
        hourFrequency.slice(4, 8).reduce((sum, val) => sum + val, 0),     // Early Morning
        hourFrequency.slice(8, 12).reduce((sum, val) => sum + val, 0),    // Morning
        hourFrequency.slice(12, 16).reduce((sum, val) => sum + val, 0),   // Afternoon
        hourFrequency.slice(16, 20).reduce((sum, val) => sum + val, 0),   // Evening
        hourFrequency.slice(20, 24).reduce((sum, val) => sum + val, 0),   // Night
        hourFrequency.slice(0, 4).reduce((sum, val) => sum + val, 0),     // Late Night
    ];

    return {
        byDay: dayNames.map((name, index) => ({
            day: name,
            count: dayFrequency[index]
        })),
        byTimeBlock: timeBlocks.map((name, index) => ({
            timeBlock: name,
            count: timeBlockFrequency[index]
        }))
    };
}

function calculateDailyGoalProgress(user: any, userWordsActivity: any[], learningSessions: any[]) {
    const today = startOfDay(new Date());

    // Count words learned today
    const wordsLearnedToday = userWordsActivity.filter(word =>
        word.lastSuccess && isToday(new Date(word.lastSuccess))
    ).length;

    // Count total session time today
    const sessionsTotalMinutes = learningSessions
        .filter(session => isToday(new Date(session.startTime)))
        .reduce((total, session) => {
            if (session.duration) {
                return total + (session.duration / 60); // Convert seconds to minutes
            }
            return total;
        }, 0);

    const dailyGoal = user.dailyGoal || 30;
    const goalProgress = Math.round((wordsLearnedToday / dailyGoal) * 100);

    return {
        goal: dailyGoal,
        progress: Math.min(goalProgress, 100),
        wordsLearnedToday,
        minutesStudiedToday: Math.round(sessionsTotalMinutes),
        remaining: Math.max(0, dailyGoal - wordsLearnedToday)
    };
}

function processGamePerformance(gameSessions: any[]) {
    if (!gameSessions.length) {
        return {
            accuracy: 0,
            averageScore: 0,
            recentGames: [],
            wordsMastered: 0,
            averageSpeed: 0
        };
    }

    // Calculate average accuracy across all game rounds
    let totalRounds = 0;
    let correctRounds = 0;
    let totalScore = 0;
    let totalSpeed = 0;
    let speedMeasurements = 0;

    const recentGames = gameSessions.map(session => {
        const gameRounds = session.gameRounds || [];
        const gameAccuracy = gameRounds.length > 0
            ? (gameRounds.filter(round => round.correct).length / gameRounds.length) * 100
            : 0;

        totalRounds += gameRounds.length;
        correctRounds += gameRounds.filter(round => round.correct).length;
        totalScore += session.score;

        // Calculate average speed for rounds with time measurements
        gameRounds.forEach(round => {
            if (round.timeTaken) {
                totalSpeed += round.timeTaken;
                speedMeasurements++;
            }
        });

        return {
            id: session.id,
            type: session.gameType,
            score: session.score,
            accuracy: Math.round(gameAccuracy),
            date: session.createdAt,
            rounds: gameRounds.length,
            completed: session.completed
        };
    });

    // Overall metrics
    const accuracy = totalRounds > 0 ? (correctRounds / totalRounds) * 100 : 0;
    const averageScore = gameSessions.length > 0 ? totalScore / gameSessions.length : 0;
    const averageSpeed = speedMeasurements > 0 ? totalSpeed / speedMeasurements : 0;

    return {
        accuracy: Math.round(accuracy),
        averageScore: Math.round(averageScore),
        recentGames,
        wordsMastered: correctRounds,
        averageSpeed: averageSpeed ? Math.round(averageSpeed) : 0 // in milliseconds
    };
}

function processSessionMetrics(learningSessions: any[]) {
    if (!learningSessions.length) {
        return {
            totalSessions: 0,
            totalTimeSpent: 0,
            averageSessionLength: 0,
            wordsPerSession: 0,
            sessionsByType: { media: 0, book: 0, game: 0 }
        };
    }

    const totalSessions = learningSessions.length;
    const totalTimeSpent = learningSessions.reduce((total, session) =>
        total + (session.duration || 0), 0);

    const totalWordsLearned = learningSessions.reduce((total, session) =>
        total + (session.wordsLearned || 0), 0);

    // Sessions by type
    const mediaCount = learningSessions.filter(s => s.mediaLanguageId).length;
    const bookCount = learningSessions.filter(s => s.bookLanguageId).length;
    const gameCount = learningSessions.filter(s => s.gameSessionId).length;

    return {
        totalSessions,
        totalTimeSpent: totalTimeSpent, // in seconds
        totalTimeSpentFormatted: formatTime(totalTimeSpent),
        averageSessionLength: totalSessions > 0 ? Math.round(totalTimeSpent / totalSessions) : 0,
        wordsPerSession: totalSessions > 0 ? Math.round(totalWordsLearned / totalSessions) : 0,
        totalWordsLearned,
        sessionsByType: {
            media: mediaCount,
            book: bookCount,
            game: gameCount
        }
    };
}

function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}
