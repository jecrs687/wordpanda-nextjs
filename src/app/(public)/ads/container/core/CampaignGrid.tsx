"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Campaign } from "./campaignUtils";

export default function CampaignGrid({ campaigns }: { campaigns: Campaign[] }) {
    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {campaigns.map((campaign, index) => (
                <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <Link href={campaign.path}>
                        <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                            <div className="relative h-48 w-full bg-blue-50 dark:bg-blue-900">
                                {campaign.thumbnail ? (
                                    <Image
                                        src={campaign.thumbnail}
                                        alt={campaign.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <span className="text-4xl">🐼</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                    Active
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {campaign.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">
                                    {campaign.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Campaign ID: {campaign.id}
                                    </span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                                        View Campaign <span className="ml-1">→</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
