"use server";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { addDays, startOfDay } from "date-fns";
import { cookies, headers } from "next/headers";

export type PreserveStreakRequest = {
    reason?: 'FREEZE' | 'BUSY' | 'TRAVEL' | 'HEALTH' | 'OTHER';
    days?: number; // Number of days to preserve (default 1)
    usePoints?: boolean; // Whether to use points or subscription benefits
}

export type PreserveStreakResponse = {
    data?: {
        newStreak: number;
        preservedDays: number;
        pointsUsed?: number;
        freezesRemaining?: number;
    };
    err?: string | null;
    msg?: string;
}

export async function preserveStreak(
    request: PreserveStreakRequest = {}
): Promise<PreserveStreakResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Get the user and subscription info
        const [user, subscription] = await Promise.all([
            prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    streak: true,
                    longestStreak: true,
                    lastLoginAt: true,
                    totalPoints: true
                }
            }),
            prisma.subscription.findUnique({
                where: { userId: decoded.id }
            })
        ]);

        if (!user) {
            return { err: "User not found", msg: "User not found in database" };
        }

        // Check if user has subscription benefits
        const hasPremium = subscription && subscription.status === 'ACTIVE';

        // Default to 1 day, max 3 days for free users, 7 for premium
        const maxDays = hasPremium ? 7 : 3;
        const requestedDays = Math.min(maxDays, request.days || 1);

        // Cost in points (free method)
        const pointCost = requestedDays * 100; // 100 points per day

        // Freezes granted per subscription period
        const freezesPerPeriod = hasPremium ? 5 : 2;

        // Check how many freezes were used in the current period
        const startDate = hasPremium && subscription ? new Date(subscription.period) : startOfDay(addDays(new Date(), -30));
        const freezesUsed = await prisma.userNote.count({
            where: {
                userId: decoded.id,
                type: 'STREAK_FREEZE',
                createdAt: {
                    gte: startDate
                }
            }
        });

        const freezesRemaining = freezesPerPeriod - freezesUsed;

        // Determine if user can afford to preserve streak
        let canPreserveStreak = false;
        let pointsToDeduct = 0;
        let freezesToUse = 0;

        if (request.usePoints) {
            // Using points method
            if (user.totalPoints >= pointCost) {
                canPreserveStreak = true;
                pointsToDeduct = pointCost;
            }
        } else {
            // Using subscription freezes
            if (freezesRemaining >= requestedDays) {
                canPreserveStreak = true;
                freezesToUse = requestedDays;
            }
        }

        if (!canPreserveStreak) {
            return {
                err: "Insufficient resources",
                msg: request.usePoints
                    ? `Insufficient points. You need ${pointCost} points but have ${user.totalPoints}.`
                    : `Insufficient freezes. You need ${requestedDays} but have ${freezesRemaining} remaining.`
            };
        }

        // Calculate new streak value
        const newStreak = (user.streak || 0) + requestedDays;
        const newLongestStreak = Math.max(newStreak, user.longestStreak || 0);

        // Generate a new "lastLoginAt" date to make the streak system work
        const today = startOfDay(new Date());
        const newLastLogin = today;

        // Update user record
        await prisma.user.update({
            where: { id: decoded.id },
            data: {
                streak: newStreak,
                longestStreak: newLongestStreak,
                lastLoginAt: newLastLogin,
                ...(pointsToDeduct > 0 && {
                    totalPoints: {
                        decrement: pointsToDeduct
                    }
                })
            }
        });

        // Record the streak preservation
        for (let i = 0; i < requestedDays; i++) {
            await prisma.userNote.create({
                data: {
                    userId: decoded.id,
                    type: 'STREAK_FREEZE',
                    content: JSON.stringify({
                        reason: request.reason || 'OTHER',
                        method: request.usePoints ? 'POINTS' : 'SUBSCRIPTION',
                        pointsUsed: request.usePoints ? (pointCost / requestedDays) : 0,
                        day: i + 1
                    })
                }
            });
        }

        // Track this for analytics
        await prisma.userFeedback.create({
            data: {
                userId: decoded.id,
                type: 'STREAK_PRESERVATION',
                status: 'ACTIVE',
                source: 'USER_ACTION',
                feature: 'STREAK',
                responsesJson: {
                    reason: request.reason || 'OTHER',
                    days: requestedDays,
                    method: request.usePoints ? 'POINTS' : 'SUBSCRIPTION',
                    pointsUsed: pointsToDeduct,
                    freezesUsed: freezesToUse
                }
            }
        });

        // Clear user progress cache
        await cacheClient.del(`userProgress:${decoded.id}`);

        return {
            data: {
                newStreak,
                preservedDays: requestedDays,
                ...(request.usePoints && { pointsUsed: pointsToDeduct }),
                ...(!request.usePoints && { freezesRemaining: freezesRemaining - freezesToUse })
            },
            msg: `Streak preserved for ${requestedDays} day${requestedDays > 1 ? 's' : ''}`
        };
    } catch (error) {
        console.error("Error preserving streak:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to preserve streak"
        };
    }
}
