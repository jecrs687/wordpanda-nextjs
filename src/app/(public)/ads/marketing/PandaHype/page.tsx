'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import CallToAction from './components/CallToAction';
import FeatureShowcase from './components/FeatureShowcase';
import GamePreview from './components/GamePreview';
import HeroSection from './components/HeroSection';
import LearningPathway from './components/LearningPathway';
import MascotInteraction from './components/MascotInteraction';
import MotionSubtitles from './components/MotionSubtitles';
import ProgressTracker from './components/ProgressTracker';
import StreamingIntegration from './components/StreamingIntegration';
import TestimonialSlider from './components/TestimonialSlider';

export default function PandaHypePage() {
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
                ? "bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white"
                : "bg-gradient-to-b from-white via-zinc-50 to-sky-50 text-gray-900"
        )}>
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute inset-0 opacity-30",
                    isDark
                        ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-transparent to-transparent"
                        : "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-transparent to-transparent"
                )}></div>
                <div className={cn(
                    "absolute inset-0 opacity-30",
                    isDark
                        ? "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-950 via-transparent to-transparent"
                        : "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-50 via-transparent to-transparent"
                )}></div>
            </div>

            <motion.div
                className="relative z-10 container mx-auto px-4 py-8 space-y-16 md:space-y-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <HeroSection />
                <MotionSubtitles />
                <FeatureShowcase />
                <MascotInteraction />
                <StreamingIntegration />
                <GamePreview />
                <ProgressTracker />
                <LearningPathway />
                <TestimonialSlider />
                <CallToAction />
            </motion.div>
        </main>
    );
}
