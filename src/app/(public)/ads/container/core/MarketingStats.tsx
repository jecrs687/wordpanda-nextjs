"use client";

import { motion } from "framer-motion";

export default function MarketingStats() {
    // Mock data - in a real app, this would come from an API
    const stats = [
        { label: "Active Campaigns", value: "3", icon: "📊", color: "from-blue-500 to-violet-500" },
        { label: "Total Clicks", value: "1,284", icon: "👆", color: "from-emerald-500 to-green-500" },
        { label: "Conversions", value: "243", icon: "🎯", color: "from-amber-500 to-orange-500" },
        { label: "Avg. Conversion Rate", value: "18.9%", icon: "📈", color: "from-pink-500 to-rose-500" }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <div className="flex items-center mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${stat.color} text-white`}>
                            <span>{stat.icon}</span>
                        </div>
                        <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                            {stat.label}
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
