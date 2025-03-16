"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LinearChart from "./container/LinearChart";

export default function Metrics() {
    const [chartData, setChartData] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    useEffect(() => {
        // Mock data simulation - in real implementation, you would fetch this from your API
        const fetchData = async () => {
            try {
                // Simulating API fetch delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Sample data structure
                const mockData = {
                    languages: ['English', 'Spanish', 'French'],
                    data: [
                        { date: '01/01', English: 5, Spanish: 3, French: 0 },
                        { date: '01/02', English: 7, Spanish: 4, French: 2 },
                        { date: '01/03', English: 10, Spanish: 6, French: 3 },
                        { date: '01/04', English: 8, Spanish: 8, French: 5 },
                        { date: '01/05', English: 12, Spanish: 7, French: 7 },
                        { date: '01/06', English: 15, Spanish: 9, French: 8 },
                        { date: '01/07', English: 18, Spanish: 12, French: 10 },
                    ]
                };

                setChartData(mockData.data);
                setLanguages(mockData.languages);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching metrics data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <motion.div
                    className="w-10 h-10 border-4 border-indigo-400 dark:border-indigo-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div>
        );
    }

    if (!chartData || chartData.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-6 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Nenhum dado disponível</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Comece a estudar idiomas para visualizar suas estatísticas e progresso de aprendizagem
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <div className="flex flex-wrap gap-4 mb-4">
                    {languages.map((language, index) => (
                        <motion.div
                            key={language}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="flex items-center"
                        >
                            <div className={`h-3 w-3 rounded-full mr-2 bg-${getColorByIndex(index)}-500`}></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {language}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="flex-grow">
                <LinearChart
                    languages={languages}
                    data={chartData}
                />
            </div>

            <motion.div
                className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <StatCard
                    title="Total de palavras"
                    value="342"
                    trend="+28%"
                    trendUp={true}
                    color="emerald"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Acertos"
                    value="87%"
                    trend="+4.3%"
                    trendUp={true}
                    color="cyan"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Dias consecutivos"
                    value="14"
                    trend="+2"
                    trendUp={true}
                    color="amber"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Taxa de erro"
                    value="8.3%"
                    trend="-2.1%"
                    trendUp={false}
                    color="rose"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </motion.div>
        </div>
    );
}

// Helper function to get colors for the chart
function getColorByIndex(index) {
    const colors = ['emerald', 'indigo', 'cyan', 'amber', 'rose', 'violet', 'lime'];
    return colors[index % colors.length];
}

// Stat card component
function StatCard({ title, value, trend, trendUp, color, icon }) {
    return (
        <div className={`bg-${color}-50 dark:bg-${color}-900/20 rounded-xl p-4 border border-${color}-100 dark:border-${color}-800/20`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h4 className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400 mt-1`}>{value}</h4>
                </div>
                <div className={`rounded-lg bg-${color}-100 dark:bg-${color}-800/30 p-2 text-${color}-500 dark:text-${color}-400`}>
                    {icon}
                </div>
            </div>
            <div className="mt-3 flex items-center">
                <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {trend}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">vs. última semana</span>
            </div>
        </div>
    );
}