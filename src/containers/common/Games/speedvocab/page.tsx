'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Body } from './_container/Body';

export default function SpeedVocabGame({ words, lang, mediaId }: {
    words: { word: string }[],
    lang: string,
    mediaId?: string
}) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch with theme
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!words.length && !lang) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-8 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md border border-zinc-200/30 dark:border-zinc-800/30"
                >
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">
                        No words available
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-300">
                        Please select a language and add some words to your collection.
                    </p>
                </motion.div>
            </div>
        );
    }

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`w-full min-h-[70vh] ${theme === 'dark'
                ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950/30'
                : 'bg-gradient-to-br from-white via-zinc-50 to-sky-50/50'
                } rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-zinc-200/30 dark:border-zinc-800/30`}
        >
            <Body words={words} lang={lang} mediaId={mediaId} />
        </motion.div>
    );
}
