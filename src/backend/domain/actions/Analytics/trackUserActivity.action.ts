"use server";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

export type TrackUserActivityRequest = {
    activityType: 'LEARNING' | 'GAME' | 'MEDIA' | 'BOOK' | 'REVIEW' | 'SEARCH' | 'PROFILE';
    resourceId?: string;
    languageId?: number;
    details?: Record<string, any>;
    duration?: number;
}

export type TrackUserActivityResponse = {
    success: boolean;
    err?: string | null;
    msg?: string;
}

export async function trackUserActivity(
    request: TrackUserActivityRequest
): Promise<TrackUserActivityResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { success: false, err: "Not authorized", msg: "Authentication failed" };
        }

        // Store activity data in UserFeedback table (repurposing it for analytics)
        await prisma.userFeedback.create({
            data: {
                status: 'ACTIVE', // Adding required status field
                type: request.activityType,
                feature: request.resourceId,
                source: 'ANALYTICS',
                responsesJson: request.details || {},
                content: request.duration?.toString(),
                user: {
                    connect: { id: decoded.id }
                }
            }
        });

        // Update user's last active timestamp
        await prisma.user.update({
            where: { id: decoded.id },
            data: { lastLoginAt: new Date() }
        });

        // Update marketing metrics for this activity
        await updateMarketingMetrics(request.activityType);

        return {
            success: true,
            msg: "Activity tracked successfully"
        };
    } catch (error) {
        console.error("Error tracking user activity:", error);
        return {
            success: false,
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to track user activity"
        };
    }
}

async function updateMarketingMetrics(activityType: string) {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Get or create today's benchmark record
    let benchmark = await prisma.marketingBenchmark.findFirst({
        where: {
            name: `daily-${todayString}`
        }
    });

    if (!benchmark) {
        benchmark = await prisma.marketingBenchmark.create({
            data: {
                name: `daily-${todayString}`,
                timestamp: today
            }
        });
    }

    // Update appropriate metric based on activity type
    const updateData: any = {
        dailyActiveUsers: { increment: 1 }
    };

    // Add activity-specific metrics
    switch (activityType) {
        case 'LEARNING':
        case 'REVIEW':
            updateData.avgSessionDuration = { increment: 1 };
            break;
        case 'GAME':
            updateData.retention_rate = { increment: 0.01 };
            break;
        case 'MEDIA':
        case 'BOOK':
            updateData.active = { increment: 1 };
            break;
    }

    // Update the benchmark record
    await prisma.marketingBenchmark.update({
        where: { id: benchmark.id },
        data: updateData
    });
}
