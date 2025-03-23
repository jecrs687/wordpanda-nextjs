'use client';

import { motion } from 'framer-motion';
import { Gauge, HelpCircle, Link2, PawPrint, Router, ScanText } from 'lucide-react';
import GameCard from './_components/GameCard';

export default function GamesPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-8"
        >
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                        <span className="p-2 mr-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                            <PawPrint className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </span>
                        Word Games
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 ml-14">
                        Learn and practice your vocabulary with these fun interactive games
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <GameCard
                        title="Word Pairs"
                        description="Match words with their definitions in this memory game. Find all pairs to advance levels."
                        icon={<PawPrint className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />}
                        href="/extension/games/wordpairs"
                    />

                    <GameCard
                        title="Flashcards"
                        description="Test your memory with interactive flashcards. Rate your knowledge and build up a learning stack."
                        icon={<Router className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />}
                        href="/extension/games/flashcards"
                    />

                    <GameCard
                        title="Word Association"
                        description="Connect related words to strengthen your vocabulary associations and context understanding."
                        icon={<Link2 className="h-6 w-6 text-blue-500 dark:text-blue-400" />}
                        href="/extension/games/association"
                        isNew
                    />

                    <GameCard
                        title="Word Scramble"
                        description="Unscramble letters to discover vocabulary words. Great for spelling practice."
                        icon={<ScanText className="h-6 w-6 text-amber-500 dark:text-amber-400" />}
                        href="/extension/games/wordscramble"
                    />

                    <GameCard
                        title="Word Race"
                        description="Type falling words before they reach the bottom. Test your speed and accuracy."
                        icon={<Gauge className="h-6 w-6 text-rose-500 dark:text-rose-400" />}
                        href="/extension/games/wordrace"
                        isNew
                    />

                    <GameCard
                        title="Vocabulary Quiz"
                        description="Test your vocabulary knowledge by selecting the correct definition for each word."
                        icon={<HelpCircle className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />}
                        href="/extension/games/quiz"
                        isNew
                    />
                </div>
            </div>
        </motion.div>
    );
}
