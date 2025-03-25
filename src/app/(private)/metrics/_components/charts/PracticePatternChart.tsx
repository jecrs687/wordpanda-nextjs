"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const PracticePatternChartComponent = ({ practiceData }: { practiceData: any[] }) => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isDark = theme === "dark";

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Ensure practiceData is an array before mapping
    const chartData = Array.isArray(practiceData) ? practiceData : [];

    if (!chartData || chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    No practice pattern data available yet.
                </p>
            </div>
        );
    }

    // Generate color for each day based on practice frequency
    const getBarColor = (count: number) => {
        const maxCount = Math.max(...chartData.map(item => item.count));

        if (count === 0) return isDark ? "#374151" : "#e5e7eb";
        if (count === maxCount) return "#10b981"; // emerald-500

        const intensity = Math.max(0.3, count / maxCount);
        return `rgba(16, 185, 129, ${intensity})`; // emerald with varying opacity
    };

    // Add custom color property to data
    const enhancedData = chartData.map(item => ({
        ...item,
        color: getBarColor(item.count)
    }));

    // Format day names to first 3 letters
    const formattedData = enhancedData.map(item => ({
        ...item,
        day: item.day.substring(0, 3)
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                    vertical={false}
                />
                <XAxis
                    dataKey="day"
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
                />
                <Tooltip
                    cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
                    contentStyle={{
                        backgroundColor: isDark ? "#1f2937" : "#ffffff",
                        borderColor: isDark ? "#374151" : "#e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        color: isDark ? "#f9fafb" : "#111827",
                    }}
                    labelFormatter={(value) => `${value} Practice Sessions`}
                />
                <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                >
                    {formattedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

// Use dynamic import to prevent SSR issues with Recharts
export default dynamic(() => Promise.resolve(PracticePatternChartComponent), {
    ssr: false
});
