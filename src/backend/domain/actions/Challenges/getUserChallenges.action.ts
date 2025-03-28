"use server";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { addDays } from "date-fns";
import { cookies, headers } from "next/headers";

export type GetUserChallengesResponse = {
    data?: {
        active: any[];
        upcoming: any[];
        completed: any[];
        globalChallenges: any[];
    };
    err?: string | null;
    msg?: string;
}

export async function getUserChallenges(): Promise<GetUserChallengesResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Check cache
        const cacheKey = `userChallenges:${decoded.id}`;
        const cachedData = await cacheClient.get(cacheKey);

        if (cachedData) {
            return JSON.parse(cachedData);
        }

        // Simulate challenges since we don't have a formal challenge table in the schema
        // In a real implementation, you would query from a Challenges table
        const now = new Date();

        // Get user's language for language-specific challenges
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                languageId: true,
                streak: true,
                _count: {
                    select: {
                        UserWords: true
                    }
                }
            }
        });

        if (!user) {
            return { err: "User not found", msg: "User not found in database" };
        }

        // Get language for localized challenge names
        const language = await prisma.language.findUnique({
            where: { id: user.languageId },
            select: { language: true }
        });

        // Generate challenges based on user data
        const challengeTypes = [
            {
                type: 'DAILY',
                name: `Daily ${language?.language || 'Language'} Practice`,
                description: 'Practice at least 10 minutes every day for 7 days',
                goal: 7,
                reward: 'Premium 3 days'
            },
            {
                type: 'STREAK',
                name: 'Streak Master',
                description: 'Maintain a learning streak for 30 days',
                goal: 30,
                reward: '100 bonus points'
            },
            {
                type: 'WORDS',
                name: 'Vocabulary Builder',
                description: 'Learn 100 new words',
                goal: 100,
                reward: 'Advanced features unlock'
            },
            {
                type: 'MASTERY',
                name: 'Word Mastery',
                description: 'Master 50 words with perfect recall',
                goal: 50,
                reward: 'Special badge'
            }
        ];

        // Calculate today's learning minutes
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayLearningMinutes = await prisma.learningSession.aggregate({
            where: {
                userId: decoded.id,
                startTime: {
                    gte: todayStart
                }
            },
            _sum: {
                duration: true
            }
        });

        const minutesLearned = Math.floor((todayLearningMinutes._sum.duration || 0) / 60);

        // Get mastered words count
        const masteredWords = await prisma.userWords.count({
            where: {
                userId: decoded.id,
                mastered: true
            }
        });

        // Generate active challenges based on user's stats
        const active = challengeTypes.map(challenge => {
            let progress = 0;
            let expires = addDays(now, 7); // Default expiry

            switch (challenge.type) {
                case 'DAILY':
                    progress = minutesLearned >= 10 ? 1 : 0; // Today's progress (1/7 days)
                    break;
                case 'STREAK':
                    progress = user.streak || 0;
                    expires = addDays(now, 30);
                    break;
                case 'WORDS':
                    progress = user._count.UserWords;
                    expires = addDays(now, 30);
                    break;
                case 'MASTERY':
                    progress = masteredWords;
                    expires = addDays(now, 14);
                    break;
            }

            return {
                id: `${challenge.type}-${decoded.id}`,
                ...challenge,
                progress,
                progressPercent: Math.min(100, Math.round((progress / challenge.goal) * 100)),
                completed: progress >= challenge.goal,
                startDate: now,
                expiryDate: expires
            };
        });

        // Filter into proper categories
        const activeNow = active.filter(c => c.progress < c.goal);
        const completed = active.filter(c => c.progress >= c.goal);

        // Generate upcoming/scheduled challenges
        const upcoming = [
            {
                id: 'upcoming-challenge-1',
                type: 'SOCIAL',
                name: 'Social Learning',
                description: 'Invite 3 friends to join WordPanda',
                goal: 3,
                progress: 0,
                progressPercent: 0,
                completed: false,
                startDate: addDays(now, 7),
                expiryDate: addDays(now, 21),
                reward: 'Premium 7 days'
            },
            {
                id: 'upcoming-challenge-2',
                type: 'CONSISTENCY',
                name: 'Weekend Warrior',
                description: 'Study for at least 10 minutes on 4 consecutive weekends',
                goal: 4,
                progress: 0,
                progressPercent: 0,
                completed: false,
                startDate: addDays(now, 14),
                expiryDate: addDays(now, 45),
                reward: 'Exclusive content unlock'
            }
        ];

        // Generate global challenges (for all users)
        const globalChallenges = [
            {
                id: 'global-challenge-1',
                type: 'GLOBAL',
                name: 'Community Goal',
                description: 'Collective goal: 1 million words learned this month',
                goal: 1000000,
                progress: 750000, // Simulated progress
                progressPercent: 75,
                completed: false,
                startDate: new Date(now.getFullYear(), now.getMonth(), 1), // Start of month
                expiryDate: new Date(now.getFullYear(), now.getMonth() + 1, 0), // End of month
                reward: '25% off annual subscription'
            }
        ];

        const response: GetUserChallengesResponse = {
            data: {
                active: activeNow,
                upcoming,
                completed,
                globalChallenges
            },
            msg: "Challenges retrieved successfully"
        };

        // Cache the response for 5 minutes
        await cacheClient.set(cacheKey, JSON.stringify(response), { EX: 300 });

        return response;
    } catch (error) {
        console.error("Error fetching user challenges:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to fetch user challenges"
        };
    }
}
