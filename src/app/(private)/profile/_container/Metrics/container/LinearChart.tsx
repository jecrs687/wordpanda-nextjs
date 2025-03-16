"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function LinearChart({
    languages,
    data
}: {
    languages: string[];
    data: any[];
}) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [mounted, setMounted] = useState(false);

    // Required for server-side rendering with next-themes
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    // Define chart colors
    const chartColors = [
        '#10b981', // emerald-500
        '#6366f1', // indigo-500
        '#06b6d4', // cyan-500
        '#f59e0b', // amber-500
        '#f43f5e', // rose-500
        '#8b5cf6', // violet-500
        '#84cc16', // lime-500
    ];

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 5,
                    }}
                >
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
                        itemStyle={{
                            padding: "0.25rem 0",
                        }}
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
                        wrapperStyle={{
                            paddingBottom: "20px",
                        }}
                    />
                    {languages.map((language, index) => (
                        <Line
                            key={language}
                            type="monotone"
                            dataKey={language}
                            name={language}
                            stroke={chartColors[index % chartColors.length]}
                            strokeWidth={3}
                            dot={{
                                stroke: chartColors[index % chartColors.length],
                                strokeWidth: 2,
                                r: 4,
                                fill: isDark ? "#1f2937" : "#ffffff"
                            }}
                            activeDot={{
                                r: 6,
                                stroke: chartColors[index % chartColors.length],
                                strokeWidth: 2,
                                fill: isDark ? "#1f2937" : "#ffffff"
                            }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// Use dynamic import to prevent SSR issues with Recharts
export default dynamic(() => Promise.resolve(LinearChart), {
    ssr: false
});