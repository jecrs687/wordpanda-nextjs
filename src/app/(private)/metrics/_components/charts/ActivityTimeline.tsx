"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ActivityTimelineComponent = ({ activityData }: { activityData: any }) => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isDark = theme === "dark";

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!activityData || !activityData.data || !activityData.languages) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    No activity data available yet.
                </p>
            </div>
        );
    }

    // Format the dates for better display
    const formattedData = activityData.data.map((item: any) => {
        const [year, month, day] = item.date.split('-');
        return {
            ...item,
            date: `${month}/${day}`
        };
    });

    // Generate colors for each language
    const colors = [
        "#10b981", // emerald-500
        "#6366f1", // indigo-500
        "#06b6d4", // cyan-500
        "#f59e0b", // amber-500
        "#f43f5e", // rose-500
        "#8b5cf6", // violet-500
        "#84cc16", // lime-500
    ];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                    vertical={false}
                />
                <XAxis
                    dataKey="date"
                    stroke={isDark ? "#9ca3af" : "#4b5563"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
                />
                <YAxis
                    stroke={isDark ? "#9ca3af" : "#4b5563"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: isDark ? "#1f2937" : "#ffffff",
                        borderColor: isDark ? "#374151" : "#e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        color: isDark ? "#f9fafb" : "#111827",
                    }}
                    itemStyle={{ padding: "0.25rem 0" }}
                    labelStyle={{
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                        color: isDark ? "#f9fafb" : "#111827",
                    }}
                />
                <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "20px" }}
                />
                {activityData.languages.map((lang: any, index: number) => (
                    <Bar
                        key={lang.code}
                        dataKey={lang.code}
                        name={lang.name}
                        fill={colors[index % colors.length]}
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

// Use dynamic import to prevent SSR issues with Recharts
export default dynamic(() => Promise.resolve(ActivityTimelineComponent), {
    ssr: false
});
