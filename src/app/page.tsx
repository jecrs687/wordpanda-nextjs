"use client";
import { TOKEN_KEY } from '@constants/CONFIGS';
import { ROUTES } from '@constants/ROUTES';
import useQueryParams from '@hooks/useQueryParams';
import useWindowSize from '@hooks/useWindowSize';
import { getCookie } from '@utils/cookie';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AIAssistanceStep from './_container/AIAssistanceStep';
import LanguageLearningStep from './_container/LanguageLearningStep';
import LoginRegisterStep from './_container/LoginRegisterStep';
import NewAmazingStep from './_container/NewAmazingStep';
import PandaEatingStep from './_container/PandaEatingStep';
import WelcomeStep from './_container/WelcomeStep';
import Loading from './loading';

export default function Page() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { queryParams } = useQueryParams();
  const { windowWidth, windowHeight } = useWindowSize();
  const totalSteps = 6;
  const [progressStatus, setProgressStatus] = useState(Array(totalSteps).fill(0));

  const storyDuration = 8000; // 8 seconds per step
  const autoAdvance = step !== totalSteps - 1;

  useEffect(() => {
    const token = getCookie(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (token) router.push(ROUTES.DASHBOARD());
    else setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (isLoading || !autoAdvance) return;
    let startTime = Date.now();
    let animationFrame;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / storyDuration, 1);
      setProgressStatus((prev) => {
        const newStatus = [...prev];
        newStatus[step] = progress;
        return newStatus;
      });
      if (progress < 1) animationFrame = requestAnimationFrame(updateProgress);
      else if (step < totalSteps - 1) goToStep(step + 1);
    };

    animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [step, isLoading, autoAdvance]);

  const goToStep = (newStep) => {
    if (newStep >= 0 && newStep < totalSteps) {
      setStep(newStep);
      setProgressStatus((prev) => {
        const newStatus = [...prev];
        for (let i = 0; i < newStep; i++) newStatus[i] = 1;
        newStatus[newStep] = 0;
        for (let i = newStep + 1; i < totalSteps; i++) newStatus[i] = 0;
        return newStatus;
      });
    }
  };

  const handleTap = (direction) => {
    if (direction === 'left' && step > 0) goToStep(step - 1);
    else if (direction === 'right' && step < totalSteps - 1) goToStep(step + 1);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 animate-gradient-bg">
      {/* Progress Bar */}
      <div
        className="absolute top-0 left-0 right-0 z-50 flex gap-2 p-4"
        style={{ paddingTop: `${Math.max(4 + (+queryParams?.statusBarHeight || 0) * 2, 16)}px` }}
      >
        {Array(totalSteps).fill(0).map((_, i) => (
          <motion.div
            key={i}
            className="h-1 flex-1 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
            onClick={() => goToStep(i)}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressStatus[i] * 100}%` }}
              transition={{ ease: 'linear' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Logo Header */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex justify-center pt-8 z-40"
        style={{ paddingTop: `${Math.max(8 + (+queryParams?.statusBarHeight || 0) * 2, 32)}px` }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Image src="/assets/logo.png" alt="WordPanda" width={200} height={56} className="h-14 w-auto" />
      </motion.div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 z-30 flex justify-between items-center px-4 py-20">
        {step > 0 && (
          <motion.div
            className="p-2 rounded-full bg-white/50 cursor-pointer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTap('left')}
          >
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.div>
        )}
        {step < totalSteps - 1 && (
          <motion.div
            className="p-2 rounded-full bg-white/50 cursor-pointer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTap('right')}
          >
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 0 && <WelcomeStep key="welcome" goToStep={goToStep} windowWidth={windowWidth} windowHeight={windowHeight} />}
        {step === 1 && <PandaEatingStep key="panda-eating" goToStep={goToStep} windowWidth={windowWidth} windowHeight={windowHeight} />}
        {step === 2 && <LanguageLearningStep key="language-learning" goToStep={goToStep} windowWidth={windowWidth} windowHeight={windowHeight} />}
        {step === 3 && <AIAssistanceStep key="ai-assistance" goToStep={goToStep} windowWidth={windowWidth} windowHeight={windowHeight} />}
        {step === 4 && <NewAmazingStep key="new-amazing" goToStep={goToStep} windowWidth={windowWidth} windowHeight={windowHeight} />}
        {step === 5 && <LoginRegisterStep key="login-register" router={router} windowWidth={windowWidth} windowHeight={windowHeight} />}
      </AnimatePresence>
    </div>
  );
}