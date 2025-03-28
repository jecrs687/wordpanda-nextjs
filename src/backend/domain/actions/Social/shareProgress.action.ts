"use server";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import crypto from 'crypto';
import { cookies, headers } from "next/headers";

export type ShareProgressRequest = {
    shareType: 'STREAK' | 'ACHIEVEMENT' | 'MILESTONE' | 'LEVEL' | 'DAILY';
    achievementId?: string;
    languageId?: number;
    platform?: 'TWITTER' | 'FACEBOOK' | 'LINKEDIN' | 'WHATSAPP' | 'COPY';
}

export type ShareProgressResponse = {
    data?: {
        title: string;
        description: string;
        imageUrl: string;
        shareUrl: string;
        referralCode: string;
    };
    err?: string | null;
    msg?: string;
}

export async function shareProgress(
    request: ShareProgressRequest
): Promise<ShareProgressResponse> {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded } = validateToken(token);

        if (!decoded) {
            return { err: "Not authorized", msg: "Authentication failed" };
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                firstName: true,
                streak: true,
                level: true,
                languageId: true,
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

        // Generate or retrieve referral code
        let referral = await prisma.referral.findFirst({
            where: {
                referrerId: decoded.id,
                type: 'SOCIAL_SHARE'
            }
        });

        if (!referral) {
            const code = crypto.randomBytes(6).toString('hex');
            referral = await prisma.referral.create({
                data: {
                    referrerId: decoded.id,
                    code,
                    type: 'SOCIAL_SHARE',
                    status: 'PENDING',
                    sharedPlatform: request.platform || 'COPY',
                    referrerReward: 'Premium week',
                    referrerRewardAmount: 7,
                    refereeReward: 'Premium 3 days',
                    refereeRewardAmount: 3
                }
            });
        } else {
            // Update the referral with the new platform
            await prisma.referral.update({
                where: { id: referral.id },
                data: {
                    sharedPlatform: request.platform || 'COPY',
                    clicks: { increment: 1 }
                }
            });
        }

        const baseShareUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wordpanda.app';
        const shareUrl = `${baseShareUrl}/join?ref=${referral.code}`;

        let title = '';
        let description = '';
        let imageUrl = `${baseShareUrl}/api/social/image?type=${request.shareType}`;

        const languageName = request.languageId ?
            await getLanguageName(request.languageId) :
            await getLanguageName(user.languageId);

        // Generate content based on share type
        switch (request.shareType) {
            case 'STREAK':
                title = `${user.streak} day streak on WordPanda!`;
                description = `I've been learning ${languageName} for ${user.streak} days in a row on WordPanda. Join me and let's learn together!`;
                imageUrl += `&streak=${user.streak}`;
                break;

            case 'ACHIEVEMENT':
                if (request.achievementId) {
                    const achievement = await prisma.achievement.findUnique({
                        where: { id: request.achievementId }
                    });

                    if (achievement) {
                        title = `I earned the "${achievement.name}" achievement on WordPanda!`;
                        description = `${achievement.description} Join me in learning ${languageName} on WordPanda!`;
                        imageUrl += `&achievement=${encodeURIComponent(achievement.name)}`;
                    }
                }
                break;

            case 'MILESTONE':
                title = `I've learned ${user._count.UserWords} words in ${languageName}!`;
                description = `I've mastered ${user._count.UserWords} words in ${languageName} using WordPanda. Join me and start your language learning journey!`;
                imageUrl += `&words=${user._count.UserWords}&language=${encodeURIComponent(languageName)}`;
                break;

            case 'LEVEL':
                title = `I reached level ${user.level} in WordPanda!`;
                description = `I'm now at level ${user.level} learning ${languageName} on WordPanda. Challenge me by joining and learning a language!`;
                imageUrl += `&level=${user.level}`;
                break;

            case 'DAILY':
                // Get today's progress
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const todayWords = await prisma.userWords.count({
                    where: {
                        userId: decoded.id,
                        lastAttempt: {
                            gte: today
                        }
                    }
                });

                title = `I learned ${todayWords} new words today!`;
                description = `I'm making progress with ${languageName} on WordPanda! Today I reviewed ${todayWords} words. Join me!`;
                imageUrl += `&todayWords=${todayWords}&language=${encodeURIComponent(languageName)}`;
                break;
        }

        // Track this share in analytics
        await prisma.marketingContent.create({
            data: {
                title,
                description,
                contentType: 'SOCIAL',
                format: 'SHARE',
                imageUrl,
                targetUrl: shareUrl,
                status: 'PUBLISHED',
                tags: [request.shareType, languageName, request.platform || 'COPY']
            }
        });

        return {
            data: {
                title,
                description,
                imageUrl,
                shareUrl,
                referralCode: referral.code
            },
            msg: "Share content generated successfully"
        };
    } catch (error) {
        console.error("Error generating share content:", error);
        return {
            err: error instanceof Error ? error.message : "An unexpected error occurred",
            msg: "Failed to generate share content"
        };
    }
}

async function getLanguageName(languageId: number): Promise<string> {
    const language = await prisma.language.findUnique({
        where: { id: languageId }
    });

    return language?.language || 'a new language';
}
