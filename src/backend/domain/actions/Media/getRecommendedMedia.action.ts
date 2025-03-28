"use server";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

export type GetRecommendedMediaRequest = {
    languageId?: number;
    limit?: number;
    excludeWatched?: boolean;
    mediaType?: string;
    difficultyLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    categories?: string[];
}

export type GetRecommendedMediaResponse = {
    data?: {
        recommendations: any[];
    };
    err?: string | null;
    msg?: string;
}

export async function getRecommendedMedia(
    request: GetRecommendedMediaRequest = {}
): Promise<GetRecommendedMediaResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        const limit = request.limit || 10;

        // Get user's language preference if not specified
        let languageId = request.languageId;
        if (!languageId) {
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { languageId: true }
            });
            languageId = user?.languageId;
        }

        if (!languageId) {
            return { err: "No language specified", msg: "Please specify a language or set a default language preference" };
        }

        // Check cache first
        const cacheKey = `recommendedMedia:${decoded.id}:${languageId}:${limit}:${request.excludeWatched}:${request.mediaType}:${request.difficultyLevel}:${request.categories?.join(',')}`;
        const cachedData = await cacheClient.get(cacheKey);

        if (cachedData) {
            return { data: { recommendations: JSON.parse(cachedData) }, msg: "Recommendations retrieved from cache" };
        }

        // Get user's knowledge level based on word count and performance
        const userWords = await prisma.userWords.count({
            where: {
                userId: decoded.id,
                userLanguage: {
                    languageId
                }
            }
        });

        // Define difficulty tiers based on user's vocabulary size
        const difficultyTier =
            request.difficultyLevel ? request.difficultyLevel :
                userWords < 100 ? 'BEGINNER' :
                    userWords < 500 ? 'INTERMEDIATE' : 'ADVANCED';

        // Get media watched by user if exclusion is requested
        let watchedMediaIds: string[] = [];
        if (request.excludeWatched) {
            const watchedMedia = await prisma.mediaUser.findMany({
                where: {
                    userId: decoded.id,
                    mediaLanguage: {
                        languageId
                    }
                },
                select: {
                    mediaLanguage: {
                        select: {
                            mediaId: true
                        }
                    }
                }
            });

            watchedMediaIds = watchedMedia.map(item => item.mediaLanguage.mediaId);
        }

        // Build query to find suitable media
        const whereClause: any = {
            language: {
                id: languageId
            }
        };

        // Apply media type filter if specified
        if (request.mediaType) {
            whereClause.media = {
                ...(whereClause.media || {}),
                type: request.mediaType
            };
        }

        // Apply category filter if specified
        if (request.categories && request.categories.length > 0) {
            whereClause.categories = {
                hasSome: request.categories
            };
        }

        // Exclude watched media if requested
        if (request.excludeWatched && watchedMediaIds.length > 0) {
            whereClause.media = {
                ...(whereClause.media || {}),
                id: {
                    notIn: watchedMediaIds
                }
            };
        }

        // Query for recommendations
        const mediaLanguages = await prisma.mediaLanguages.findMany({
            where: whereClause,
            include: {
                media: {
                    include: {
                        platform: true,
                        images: true
                    }
                },
                language: true,
                mediaWords: {
                    take: 1, // Just to get count, not actual words
                    select: {
                        id: true
                    }
                },
                _count: {
                    select: {
                        mediaWords: true
                    }
                }
            },
            take: limit * 2 // Fetch more to filter by difficulty
        });

        // Apply difficulty filtering based on word count and user's level
        let recommendedMedia = mediaLanguages.filter(media => {
            const wordCount = media._count.mediaWords;

            switch (difficultyTier) {
                case 'BEGINNER':
                    return wordCount < 100;
                case 'INTERMEDIATE':
                    return wordCount >= 100 && wordCount < 300;
                case 'ADVANCED':
                    return wordCount >= 300;
                default:
                    return true;
            }
        });

        // Sort by relevance (more matching categories first, then by word count)
        recommendedMedia.sort((a, b) => {
            // If categories are specified, prioritize media with more matching categories
            if (request.categories && request.categories.length > 0) {
                const aMatches = a.categories.filter(cat => request.categories?.includes(cat)).length;
                const bMatches = b.categories.filter(cat => request.categories?.includes(cat)).length;

                if (aMatches !== bMatches) {
                    return bMatches - aMatches; // More matches first
                }
            }

            // Then sort by word count based on difficulty preference
            return b._count.mediaWords - a._count.mediaWords;
        });

        // Take the requested number of recommendations
        recommendedMedia = recommendedMedia.slice(0, limit);

        // Process and format the recommendations
        const recommendations = recommendedMedia.map(media => ({
            id: media.media.id,
            mediaLanguageId: media.id,
            title: media.title || media.media.name,
            description: media.description || '',
            type: media.media.type,
            platform: media.media.platform.name,
            logoUrl: media.media.logoUrl,
            images: media.media.images.map(img => ({
                type: img.type,
                url: img.url
            })),
            language: media.language.language,
            languageCode: media.language.code,
            categories: media.categories,
            wordCount: media._count.mediaWords,
            difficultyLevel:
                media._count.mediaWords < 100 ? 'BEGINNER' :
                    media._count.mediaWords < 300 ? 'INTERMEDIATE' : 'ADVANCED'
        }));

        // Cache the results
        await cacheClient.set(cacheKey, JSON.stringify(recommendations), { EX: 3600 }); // Cache for 1 hour

        return {
            data: { recommendations },
            msg: "Media recommendations retrieved successfully"
        };
    } catch (error) {
        console.error("Error getting media recommendations:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to get media recommendations"
        };
    }
}
