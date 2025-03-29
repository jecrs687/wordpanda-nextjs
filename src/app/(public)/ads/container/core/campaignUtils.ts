"use server";
import fs from 'fs';
import path from 'path';

export type Campaign = {
    id: string;
    name: string;
    path: string;
    description: string;
    slug: string;
    thumbnail?: string;
};

const CAMPAIGNS_MAP: Record<string, Partial<Campaign>> = {
    "LinguaViral": {
        name: "Lingua Viral",
        description: "Viral approach to language learning with social challenges",
        thumbnail: "/images/campaigns/lingua-viral.jpg"
    },
    "PandaHype": {
        name: "Panda Hype",
        description: "Exciting gamified language learning experience",
        thumbnail: "/images/campaigns/panda-hype.jpg"
    },
    "GreatPanda": {
        name: "Great Panda",
        description: "Premier language learning platform for serious learners",
        thumbnail: "/images/campaigns/great-panda.jpg"
    }
};

export async function getCampaigns(): Promise<Campaign[]> {
    const marketingDir = path.join(process.cwd(), 'src/app/(public)/ads/marketing');

    try {
        const directories = fs.readdirSync(marketingDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        return directories.map(dir => {
            const defaultInfo = CAMPAIGNS_MAP[dir] || {};

            return {
                id: dir,
                name: defaultInfo.name || formatCampaignName(dir),
                path: `/ads/marketing/${dir}`,
                description: defaultInfo.description || `Marketing campaign for ${formatCampaignName(dir)}`,
                slug: dir.toLowerCase(),
                thumbnail: defaultInfo.thumbnail || `/images/campaigns/default.jpg`
            };
        });
    } catch (error) {
        console.error("Error reading marketing campaigns directory:", error);
        return [];
    }
}

function formatCampaignName(dirName: string): string {
    // Convert camelCase or PascalCase to space-separated words
    return dirName
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}
