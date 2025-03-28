"use server";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

export type SrsSettingsRequest = {
    dailyNewWordsLimit?: number;
    dailyReviewsLimit?: number;
    learningSteps?: number[];
    graduatingInterval?: number;
    easyInterval?: number;
    startingEase?: number;
    difficultyPreference?: 1 | 2 | 3 | 4 | 5;
    showPronunciation?: boolean;
    showDifficultFirst?: boolean;
    showDefinitionFirst?: boolean;
    preferredLearningTime?: string;
    reminderEnabled?: boolean;
    reminderTime?: string;
}

export type SrsSettingsResponse = {
    data?: {
        settings: SrsSettingsRequest;
    };
    err?: string | null;
    msg?: string;
}

export async function getSrsSettings(): Promise<SrsSettingsResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Try to get from cache first
        const cacheKey = `srsSettings:${decoded.id}`;
        const cachedSettings = await cacheClient.get(cacheKey);

        if (cachedSettings) {
            return { data: { settings: JSON.parse(cachedSettings) }, msg: "Settings retrieved from cache" };
        }

        // Get user's note that contains SRS settings
        const settingsNote = await prisma.userNote.findFirst({
            where: {
                userId: decoded.id,
                type: 'SRS_SETTINGS'
            }
        });

        // Get user profile for additional settings
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                preferredLearningTime: true,
                difficultyPreference: true,
                dailyGoal: true
            }
        });

        // Default settings
        const defaultSettings: SrsSettingsRequest = {
            dailyNewWordsLimit: 20,
            dailyReviewsLimit: 100,
            learningSteps: [1, 10, 60, 360],
            graduatingInterval: 1,
            easyInterval: 4,
            startingEase: 2.5,
            difficultyPreference: 3,
            showPronunciation: true,
            showDifficultFirst: true,
            showDefinitionFirst: false,
            preferredLearningTime: 'Evening',
            reminderEnabled: false,
            reminderTime: '19:00'
        };

        // Merge with saved settings if any
        let settings = defaultSettings;

        if (settingsNote) {
            try {
                const savedSettings = JSON.parse(settingsNote.content);
                settings = { ...defaultSettings, ...savedSettings };
            } catch (e) {
                console.error("Error parsing SRS settings:", e);
            }
        }

        // Merge with user profile settings
        if (user) {
            settings.preferredLearningTime = user.preferredLearningTime || settings.preferredLearningTime;
            settings.difficultyPreference = user.difficultyPreference as 1 | 2 | 3 | 4 | 5 || settings.difficultyPreference;
            settings.dailyNewWordsLimit = user.dailyGoal || settings.dailyNewWordsLimit;
        }

        // Cache the settings
        await cacheClient.set(cacheKey, JSON.stringify(settings), { EX: 3600 });

        return { data: { settings }, msg: "SRS settings retrieved successfully" };
    } catch (error) {
        console.error("Error retrieving SRS settings:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to retrieve SRS settings"
        };
    }
}

export async function updateSrsSettings(
    request: SrsSettingsRequest
): Promise<SrsSettingsResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        // Update user profile settings
        const userUpdate: any = {};

        if (request.preferredLearningTime) {
            userUpdate.preferredLearningTime = request.preferredLearningTime;
        }

        if (request.difficultyPreference) {
            userUpdate.difficultyPreference = request.difficultyPreference;
        }

        if (request.dailyNewWordsLimit) {
            userUpdate.dailyGoal = request.dailyNewWordsLimit;
        }

        if (Object.keys(userUpdate).length > 0) {
            await prisma.user.update({
                where: { id: decoded.id },
                data: userUpdate
            });
        }

        // Save SRS specific settings to a user note
        const settingsNote = await prisma.userNote.findFirst({
            where: {
                userId: decoded.id,
                type: 'SRS_SETTINGS'
            }
        });

        const srsSpecificSettings = {
            ...request,
            // Exclude settings stored in user profile
            preferredLearningTime: undefined,
            difficultyPreference: undefined,
            dailyGoal: undefined
        };

        if (settingsNote) {
            await prisma.userNote.update({
                where: { id: settingsNote.id },
                data: {
                    content: JSON.stringify(srsSpecificSettings),
                    updatedAt: new Date()
                }
            });
        } else {
            await prisma.userNote.create({
                data: {
                    userId: decoded.id,
                    type: 'SRS_SETTINGS',
                    content: JSON.stringify(srsSpecificSettings)
                }
            });
        }

        // Clear cache to force refresh
        await cacheClient.del(`srsSettings:${decoded.id}`);

        // Get the updated settings
        return getSrsSettings();
    } catch (error) {
        console.error("Error updating SRS settings:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to update SRS settings"
        };
    }
}
