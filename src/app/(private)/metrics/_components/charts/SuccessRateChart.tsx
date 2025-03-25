"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const SuccessRateChartComponent = ({ languages }: { languages: any[] }) => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isDark = theme === "dark";

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!languages || languages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    No language data available yet.
                </p>
            </div>
        );
    }

    // Prepare data for the chart
    const chartData = languages.map(lang => ({
        name: lang.name,
        value: Math.round(lang.successRate),
        color: getColorForLanguage(lang.code)
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: any) => [`${value}%`, 'Success Rate']}
                    contentStyle={{
                        backgroundColor: isDark ? "#1f2937" : "#ffffff",
                        borderColor: isDark ? "#374151" : "#e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        color: isDark ? "#f9fafb" : "#111827",
                    }}
                />
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

// Helper function to generate color for each language
function getColorForLanguage(code: string) {
    const colors = [
        "#10b981", // emerald-500
        "#6366f1", // indigo-500
        "#06b6d4", // cyan-500
        "#f59e0b", // amber-500
        "#f43f5e", // rose-500
        "#8b5cf6", // violet-500
        "#84cc16", // lime-500
    ];

    // Simple hash function to get a consistent color for each language
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
        hash = code.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
}

// Custom label renderer
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
}: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#ffffff"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontWeight="bold"
            fontSize="12"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// Use dynamic import to prevent SSR issues with Recharts
export default dynamic(() => Promise.resolve(SuccessRateChartComponent), {
    ssr: false
});
