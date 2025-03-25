"use client";

import { motion } from "framer-motion";
import { Flame, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface ProgressHeaderProps {
    user: any;
    streak: { current: number; longest: number; lastActive: string };
    overallSuccessRate: number;
}

export default function ProgressHeader({ user, streak, overallSuccessRate }: ProgressHeaderProps) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const formatDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="relative"
                        >
                            {user.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt={`${user.firstName}'s profile`}
                                    className="w-14 h-14 rounded-full border-2 border-emerald-400"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-300 text-xl font-bold border-2 border-emerald-400">
                                    {user.firstName?.charAt(0) || "U"}
                                </div>
                            )}

                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.3, type: "spring" }}
                                className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 border border-gray-200 dark:border-gray-700"
                            >
                                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                            </motion.div>
                        </motion.div>

                        <div className="ml-4">
                            <motion.h2
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="text-xl font-bold text-gray-900 dark:text-white"
                            >
                                {user.firstName} {user.lastName}
                            </motion.h2>
                            <motion.p
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className="text-sm text-gray-600 dark:text-gray-400"
                            >
                                {formatDate()}
                            </motion.p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                        className="bg-amber-50 dark:bg-amber-900/20 rounded-lg px-4 py-3 flex items-center"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800/30 mr-3">
                            <Flame className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm text-amber-700 dark:text-amber-300">Current Streak</p>
                            <p className="text-xl font-bold text-amber-800 dark:text-amber-200">
                                {streak.current} {streak.current === 1 ? 'day' : 'days'}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-4 py-3 flex items-center"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800/30 mr-3">
                            <div className="w-5 h-5 relative">
                                <div className={`absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700`}></div>
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: animate ? 360 : 0 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        borderWidth: '4px',
                                        borderColor: 'transparent',
                                        borderTopColor: '#10b981',
                                        position: 'absolute'
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">Success Rate</p>
                            <p className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                                {Math.round(overallSuccessRate)}%
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
