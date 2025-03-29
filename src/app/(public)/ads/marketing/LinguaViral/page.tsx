'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import DownloadApp from './components/DownloadApp';
import GameShowcase from './components/GameShowcase';
import HeroSection from './components/HeroSection';
import LearningMethod from './components/LearningMethod';
import PandaMascot from './components/PandaMascot';
import TrendingWords from './components/TrendingWords';
import UserSuccessStories from './components/UserSuccessStories';
import ViralChallenges from './components/ViralChallenges';
import ViralFeatures from './components/ViralFeatures';

export default function LinguaViralPage() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    return (
        <main className={cn(
            "min-h-screen w-full overflow-x-hidden pb-20",
            isDark
                ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-white"
                : "bg-gradient-to-b from-white via-zinc-50 to-blue-50 text-gray-900"
        )}>
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute inset-0 opacity-30",
                    isDark ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-transparent to-transparent"
                        : "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent"
                )} />
                <div className={cn(
                    "absolute inset-0 opacity-20",
                    isDark ? "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-950 via-transparent to-transparent"
                        : "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-50 via-transparent to-transparent"
                )} />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 relative z-10 overflow-hidden"
            >
                <HeroSection />
                <ViralFeatures />
                <PandaMascot />
                <LearningMethod />
                <GameShowcase />
                <TrendingWords />
                <ViralChallenges />
                <UserSuccessStories />
                <DownloadApp />
            </motion.div>
        </main>
    );
}
