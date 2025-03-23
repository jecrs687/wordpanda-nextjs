'use client';

import { AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import EmptyState from '../_components/EmptyState';
import GameContainer from '../_components/GameContainer';
import GameHeader from '../_components/GameHeader';
import LoadingSpinner from '../_components/LoadingSpinner';
import { Body } from './_container/Body';

export default function VocabularyQuizGame({ words, lang, mediaId }: {
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

    if (!mounted) {
        return <LoadingSpinner />;
    }

    if (!words.length && !lang) {
        return (
            <EmptyState
                title="No Words Available"
                message="We need words to create quiz questions. Please select a language or add more words to your collection."
            />
        );
    }

    return (
        <AnimatePresence mode="wait">
            <GameContainer>
                <GameHeader
                    title="Vocabulary Quiz"
                    description="Test your knowledge by selecting the correct definitions"
                    icon={<HelpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                />
                <div className="p-4 lg:p-6">
                    <Body words={words} lang={lang} mediaId={mediaId} />
                </div>
            </GameContainer>
        </AnimatePresence>
    );
}
