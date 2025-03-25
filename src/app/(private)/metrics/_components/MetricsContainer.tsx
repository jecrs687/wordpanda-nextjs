"use client";
import { motion } from "framer-motion";
import {
    BarChart3,
    BookOpen,
    Calendar,
    Globe,
    Menu,
    SlidersHorizontal,
    Trophy
} from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LanguageProgressCards from "./LanguageProgressCards";
import PandaHeader from "./PandaHeader";
import ProgressHeader from "./ProgressHeader";
import StatCards from "./StatCards";
import WordsTable from "./WordsTable";
import ActivityTimeline from "./charts/ActivityTimeline";
import PracticePatternChart from "./charts/PracticePatternChart";
import SuccessRateChart from "./charts/SuccessRateChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

function MetricsContainer({ data }: { data: any }) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Required for server-side rendering with next-themes
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const fadeInUpVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    if (data.error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-red-100 dark:border-red-800/30 shadow-lg text-center max-w-md"
                >
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Metrics Unavailable
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {data.error || "We couldn't load your metrics at this time."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow transition-colors"
                    >
                        Try Again
                    </button>
                </motion.div>
            </div>
        );
    }

    const tabItems = [
        { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
        { id: "activity", label: "Activity", icon: <Calendar className="h-4 w-4" /> },
        { id: "languages", label: "Languages", icon: <Globe className="h-4 w-4" /> },
        { id: "words", label: "Words", icon: <BookOpen className="h-4 w-4" /> },
        { id: "patterns", label: "Patterns", icon: <SlidersHorizontal className="h-4 w-4" /> }
    ];

    return (
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
            {/* Mobile header */}
            <div className="md:hidden flex justify-between items-center mb-6">
                <PandaHeader condensed={true} />
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                    <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
            </div>

            {/* Desktop header */}
            <div className="hidden md:block mb-8">
                <PandaHeader />
            </div>

            {/* Mobile navigation drawer */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="md:hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 mb-6"
                >
                    <div className="flex flex-col space-y-2">
                        {tabItems.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`flex items-center space-x-2 p-3 rounded-lg text-left ${activeTab === tab.id
                                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            <motion.div
                className="mb-6"
                initial="hidden"
                animate="visible"
                custom={0}
                variants={fadeInUpVariant}
            >
                <ProgressHeader
                    user={data.user}
                    streak={data.streak}
                    overallSuccessRate={data.overallSuccessRate}
                />
            </motion.div>

            <motion.div
                className="mb-8"
                initial="hidden"
                animate="visible"
                custom={1}
                variants={fadeInUpVariant}
            >
                <StatCards
                    streak={data.streak.current} // changed from data.streak to data.streak.current
                    languageCount={data.languages.length}
                    wordsCount={data.languages.reduce((acc: number, lang: any) => acc + lang.wordsCount, 0)}
                    successRate={data.overallSuccessRate}
                />
            </motion.div>

            {/* Desktop tabs - FIXED IMPLEMENTATION */}
            <div className="hidden md:block">
                <Tabs defaultValue="overview" className="w-full mb-8">
                    <TabsList className="mb-4 bg-white dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700 rounded-lg">
                        {tabItems.map(tab => (
                            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                                {tab.icon}
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <motion.div
                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"
                                initial="hidden"
                                animate="visible"
                                custom={2}
                                variants={fadeInUpVariant}
                            >
                                <div className="flex items-center mb-4">
                                    <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                                    <h2 className="text-lg font-semibold">Daily Learning Activity</h2>
                                </div>
                                <div className="h-72">
                                    <ActivityTimeline activityData={data.dailyActivity} />
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"
                                initial="hidden"
                                animate="visible"
                                custom={3}
                                variants={fadeInUpVariant}
                            >
                                <div className="flex items-center mb-4">
                                    <Globe className="h-5 w-5 text-blue-500 mr-2" />
                                    <h2 className="text-lg font-semibold">Success Rate by Language</h2>
                                </div>
                                <div className="h-72">
                                    <SuccessRateChart languages={data.languages} />
                                </div>
                            </motion.div>
                        </div>
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-6">
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"
                            initial="hidden"
                            animate="visible"
                            custom={2}
                            variants={fadeInUpVariant}
                        >
                            <h2 className="text-lg font-semibold mb-4">Daily Learning Activity</h2>
                            <div className="h-72 md:h-96">
                                <ActivityTimeline activityData={data.dailyActivity} />
                            </div>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="languages" className="space-y-6">
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                            initial="hidden"
                            animate="visible"
                            custom={2}
                            variants={fadeInUpVariant}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold mb-4">Success Rate by Language</h2>
                                <div className="h-72">
                                    <SuccessRateChart languages={data.languages} />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold mb-4">Learning Efficiency</h2>
                                <div className="h-72 overflow-auto pr-2">
                                    <LanguageProgressCards languages={data.languages} />
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="words" className="space-y-6">
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                            initial="hidden"
                            animate="visible"
                            custom={2}
                            variants={fadeInUpVariant}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="w-2 h-6 bg-emerald-400 rounded-full mr-2"></div>
                                    <h2 className="text-lg font-semibold">Most Practiced Words</h2>
                                </div>
                                <WordsTable words={data.mostUsedWords} type="practiced" />
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="w-2 h-6 bg-rose-400 rounded-full mr-2"></div>
                                    <h2 className="text-lg font-semibold">Most Challenging Words</h2>
                                </div>
                                <WordsTable words={data.mostDifficultWords} type="challenging" />
                            </div>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="patterns" className="space-y-6">
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"
                            initial="hidden"
                            animate="visible"
                            custom={2}
                            variants={fadeInUpVariant}
                        >
                            <h2 className="text-lg font-semibold mb-4">Weekly Practice Pattern</h2>
                            <div className="h-72 md:h-96">
                                <PracticePatternChart practiceData={data.practiceFrequency} />
                            </div>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Mobile content */}
            <div className="md:hidden">
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                            initial="hidden"
                            animate="visible"
                            custom={2}
                            variants={fadeInUpVariant}
                        >
                            <div className="flex items-center mb-4">
                                <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                                <h2 className="text-lg font-semibold">Daily Activity</h2>
                            </div>
                            <div className="h-60">
                                <ActivityTimeline activityData={data.dailyActivity} />
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                            initial="hidden"
                            animate="visible"
                            custom={3}
                            variants={fadeInUpVariant}
                        >
                            <div className="flex items-center mb-4">
                                <Globe className="h-5 w-5 text-blue-500 mr-2" />
                                <h2 className="text-lg font-semibold">Success Rates</h2>
                            </div>
                            <div className="h-60">
                                <SuccessRateChart languages={data.languages} />
                            </div>
                        </motion.div>
                    </div>
                )}

                {activeTab === "activity" && (
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        variants={fadeInUpVariant}
                    >
                        <h2 className="text-lg font-semibold mb-4">Daily Learning Activity</h2>
                        <div className="h-72">
                            <ActivityTimeline activityData={data.dailyActivity} />
                        </div>
                    </motion.div>
                )}

                {activeTab === "languages" && (
                    <div className="space-y-6">
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                            initial="hidden"
                            animate="visible"
                            custom={2}
                            variants={fadeInUpVariant}
                        >
                            <h2 className="text-lg font-semibold mb-4">Success Rate by Language</h2>
                            <div className="h-60">
                                <SuccessRateChart languages={data.languages} />
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                            initial="hidden"
                            animate="visible"
                            custom={3}
                            variants={fadeInUpVariant}
                        >
                            <h2 className="text-lg font-semibold mb-4">Learning Efficiency</h2>
                            <div className="h-72 overflow-auto pr-2">
                                <LanguageProgressCards languages={data.languages} />
                            </div>
                        </motion.div>
                    </div>
                )}

                {activeTab === "words" && (
                    <div className="space-y-6">
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                            initial="hidden"
                            animate="visible"
                            custom={2}
                            variants={fadeInUpVariant}
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-2 h-6 bg-emerald-400 rounded-full mr-2"></div>
                                <h2 className="text-lg font-semibold">Most Practiced</h2>
                            </div>
                            <WordsTable words={data.mostUsedWords} type="practiced" />
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                            initial="hidden"
                            animate="visible"
                            custom={3}
                            variants={fadeInUpVariant}
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-2 h-6 bg-rose-400 rounded-full mr-2"></div>
                                <h2 className="text-lg font-semibold">Most Challenging</h2>
                            </div>
                            <WordsTable words={data.mostDifficultWords} type="challenging" />
                        </motion.div>
                    </div>
                )}

                {activeTab === "patterns" && (
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        variants={fadeInUpVariant}
                    >
                        <h2 className="text-lg font-semibold mb-4">Weekly Practice Pattern</h2>
                        <div className="h-72">
                            <PracticePatternChart practiceData={data.practiceFrequency} />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}


export default dynamic(() => Promise.resolve(MetricsContainer), {
    ssr: false
});