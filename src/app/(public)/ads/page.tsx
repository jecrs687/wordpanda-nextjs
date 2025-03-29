import DashboardHeader from "./container/common/DashboardHeader";
import CampaignGrid from "./container/core/CampaignGrid";
import CampaignLinkGenerator from "./container/core/CampaignLinkGenerator";
import { getCampaigns } from "./container/core/campaignUtils";
import MarketingStats from "./container/core/MarketingStats";

export default async function CampaignLinks() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wordpanda.app";
    const campaigns = await getCampaigns();

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-blue-50 dark:from-zinc-900 dark:to-blue-950">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <DashboardHeader
                    title="Marketing Campaign Dashboard"
                    description="Manage and track all marketing initiatives from a single dashboard. Generate properly tagged links and monitor campaign performance."
                />

                <div className="grid gap-8 md:grid-cols-12 mt-8">
                    <div className="md:col-span-8">
                        <MarketingStats />

                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Active Campaigns
                            </h2>
                            <CampaignGrid campaigns={campaigns} />
                        </div>
                    </div>

                    <div className="md:col-span-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Campaign Link Generator
                            </h2>
                            <CampaignLinkGenerator
                                baseUrl={baseUrl}
                                campaigns={campaigns}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
