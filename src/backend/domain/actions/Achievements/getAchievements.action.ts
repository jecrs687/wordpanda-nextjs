"use server";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

export type GetAchievementsResponse = {
    data?: {
        earned: any[];
        available: any[];
        nextMilestones: any[];
    };
    err?: string | null;
    msg?: string;
}

export async function getAchievements(): Promise<GetAchievementsResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Check cache
        const cacheKey = `achievements:${decoded.id}`;
        const cachedData = await cacheClient.get(cacheKey);

        if (cachedData) {
            return JSON.parse(cachedData);
        }

        // Get user's earned achievements
        const userAchievements = await prisma.userAchievement.findMany({
            where: {
                userId: decoded.id
            },
            include: {
                achievement: true
            },
            orderBy: {
                earnedAt: 'desc'
            }
        });

        // Get all achievements
        const allAchievements = await prisma.achievement.findMany();

        // Get earned achievement IDs
        const earnedIds = new Set(userAchievements.map(ua => ua.achievementId));

        // Filter available achievements (not yet earned)
        const availableAchievements = allAchievements.filter(
            achievement => !earnedIds.has(achievement.id)
        );

        // Get user stats to find next milestones
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                streak: true,
                level: true,
                _count: {
                    select: {
                        UserWords: true,
                        learningSession: true
                    }
                }
            }
        });

        if (!user) {
            return { err: "User not found", msg: "User not found in database" };
        }

        // Find next milestone achievements
        const nextMilestones = [];

        // Group available achievements by type
        const achievementsByType: Record<string, any[]> = {};

        availableAchievements.forEach(achievement => {
            if (!achievementsByType[achievement.type]) {
                achievementsByType[achievement.type] = [];
            }
            achievementsByType[achievement.type].push(achievement);
        });

        // For each type, find the next milestone
        Object.keys(achievementsByType).forEach(type => {
            const achievements = achievementsByType[type]
                .sort((a, b) => a.requirement - b.requirement);

            let currentValue = 0;

            switch (type) {
                case 'STREAK':
                    currentValue = user.streak || 0;
                    break;
                case 'WORDS':
                    currentValue = user._count.UserWords;
                    break;
                case 'SESSION':
                    currentValue = user._count.learningSession;
                    break;
                case 'LEVEL':
                    currentValue = user.level || 1;
                    break;
            }

            // Find the next achievement to earn
            const nextAchievement = achievements.find(a => a.requirement > currentValue);

            if (nextAchievement) {
                nextMilestones.push({
                    ...nextAchievement,
                    currentValue,
                    progress: Math.min(100, Math.round((currentValue / nextAchievement.requirement) * 100))
                });
            }
        });

        // Prepare response
        const response: GetAchievementsResponse = {
            data: {
                earned: userAchievements.map(ua => ({
                    id: ua.achievement.id,
                    name: ua.achievement.name,
                    description: ua.achievement.description,
                    type: ua.achievement.type,
                    requirement: ua.achievement.requirement,
                    icon: ua.achievement.icon,
                    earnedAt: ua.earnedAt
                })),
                available: availableAchievements,
                nextMilestones
            },
            msg: "Achievements retrieved successfully"
        };

        // Cache the response for 5 minutes
        await cacheClient.set(cacheKey, JSON.stringify(response), { EX: 300 });

        return response;
    } catch (error) {
        console.error("Error fetching achievements:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to fetch achievements"
        };
    }
}
