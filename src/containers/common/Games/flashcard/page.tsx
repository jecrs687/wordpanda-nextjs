'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FlashBody } from './_container/Body';

export default function FlashCardGame({
    words,
    lang,
    mediaId
}: {
    words: { word: string }[],
    lang: string,
    mediaId?: string
}) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!words.length && !lang) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`min-h-screen w-full py-8 px-4 md:py-12 md:px-6 lg:px-8
                ${isDark
                    ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white'
                    : 'bg-gradient-to-br from-white via-zinc-50 to-sky-50 text-gray-900'
                }`}
        >
            <DndProvider backend={HTML5Backend}>
                <FlashBody words={words} lang={lang} mediaId={mediaId} />
            </DndProvider>
        </motion.div>
    );
}

