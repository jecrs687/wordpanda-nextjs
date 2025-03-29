"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useState } from "react";
import { Campaign } from "./campaignUtils";

type UtmParams = {
    source: string;
    medium: string;
    campaign: string;
    content: string;
    term: string;
};

type TooltipProps = {
    content: string;
};

const Tooltip = ({ content }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block ml-1">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="cursor-help"
            >
                <Info size={16} className="text-gray-400 inline" />
            </div>

            {isVisible && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-md bg-gray-800 text-white text-xs shadow-lg">
                    {content}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-800"></div>
                </div>
            )}
        </div>
    );
};

export default function CampaignLinkGenerator({
    baseUrl,
    campaigns
}: {
    baseUrl: string;
    campaigns: Campaign[];
}) {
    const [selectedCampaign, setSelectedCampaign] = useState("");
    const [utmParams, setUtmParams] = useState<UtmParams>({
        source: "social",
        medium: "organic",
        campaign: "",
        content: "",
        term: ""
    });
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);

    const sources = ["social", "ads", "google", "email", "cpc", "display", "referral", "organic", "direct"];
    const mediums = ["organic", "cpc", "email", "social", "display", "affiliate", "referral"];

    const handleCampaignSelect = (id: string) => {
        setSelectedCampaign(id);
        const campaign = campaigns.find(c => c.id === id);
        if (campaign) {
            setUtmParams(prev => ({
                ...prev,
                campaign: campaign.slug
            }));
        }
    };

    const handleParamChange = (param: keyof UtmParams, value: string) => {
        setUtmParams(prev => ({
            ...prev,
            [param]: value
        }));
    };

    const generateLink = () => {
        const campaign = campaigns.find(c => c.id === selectedCampaign);
        if (!campaign) return;

        const params = new URLSearchParams();
        if (utmParams.source) params.append("utm_source", utmParams.source);
        if (utmParams.medium) params.append("utm_medium", utmParams.medium);
        if (utmParams.campaign) params.append("utm_campaign", utmParams.campaign);
        if (utmParams.content) params.append("utm_content", utmParams.content);
        if (utmParams.term) params.append("utm_term", utmParams.term);

        const link = `${baseUrl}${campaign.path}?${params.toString()}`;
        setGeneratedLink(link);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <span>Select Campaign</span>
                    <Tooltip content="Choose the marketing campaign for which you want to generate a tracking link." />
                </label>
                <select
                    value={selectedCampaign}
                    onChange={(e) => handleCampaignSelect(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                    <option value="">Select a campaign</option>
                    {campaigns.map(campaign => (
                        <option key={campaign.id} value={campaign.id}>
                            {campaign.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <span>Source</span>
                        <Tooltip content="Identifies which site sent the traffic (e.g., Facebook, Google, Newsletter). This answers: Where is the traffic coming from?" />
                    </label>
                    <select
                        value={utmParams.source}
                        onChange={(e) => handleParamChange("source", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">None</option>
                        {sources.map(source => (
                            <option key={source} value={source}>
                                {source}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <span>Medium</span>
                        <Tooltip content="Identifies what type of link was used (e.g., cpc, banner, email). This answers: How is the traffic getting to you?" />
                    </label>
                    <select
                        value={utmParams.medium}
                        onChange={(e) => handleParamChange("medium", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">None</option>
                        {mediums.map(medium => (
                            <option key={medium} value={medium}>
                                {medium}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <span>Campaign Name</span>
                    <Tooltip content="Used for identifying a specific product promotion or strategic campaign. This answers: Why is this traffic coming to you?" />
                </label>
                <input
                    type="text"
                    value={utmParams.campaign}
                    onChange={(e) => handleParamChange("campaign", e.target.value)}
                    placeholder="e.g., summer_sale"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <span>Content</span>
                    <Tooltip content="Used to differentiate similar content or links within the same ad or page. This is useful for A/B testing and identifying which specific link was clicked." />
                </label>
                <input
                    type="text"
                    value={utmParams.content}
                    onChange={(e) => handleParamChange("content", e.target.value)}
                    placeholder="e.g., hero_button"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <span>Search Term</span>
                    <Tooltip content="Used to identify paid search keywords. If you're manually tagging paid keyword campaigns, this helps track which keywords people used to discover your content." />
                </label>
                <input
                    type="text"
                    value={utmParams.term}
                    onChange={(e) => handleParamChange("term", e.target.value)}
                    placeholder="e.g., language_app"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateLink}
                disabled={!selectedCampaign}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
                Generate Tracking Link
            </motion.button>

            {generatedLink && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Generated Link:
                        </label>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyToClipboard}
                            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </motion.button>
                    </div>
                    <div className="text-sm break-all bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                        {generatedLink}
                    </div>
                </div>
            )}
        </div>
    );
}
