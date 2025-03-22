"use client";

import { User } from '@prisma/client';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
    user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full mb-8"
        >
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-sm">
                <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-3xl md:text-5xl font-bold">
                    {user.firstName?.charAt(0) || ""}
                    {user.lastName?.charAt(0) || ""}
                </div>

                <div className="flex-grow text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{user.email}</p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-3 py-1 text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded-full">
                            Language Learner
                        </span>
                        {user.score && (
                            <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
                                Score: {user.score}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
