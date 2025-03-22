"use client";
import { TOKEN_KEY } from '@constants/CONFIGS';
import { ROUTES } from '@constants/ROUTES';
import useQueryParams from '@hooks/useQueryParams';
import { getCookie } from '@utils/cookie';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { StoryBackground } from './_components/landing/StoryBackground';
import { StoryContainer } from './_components/landing/StoryContainer';
import { StoryContent } from './_components/landing/StoryContent';
import { StoryHeader } from './_components/landing/StoryHeader';
import { StoryNavigation } from './_components/landing/StoryNavigation';
import { StoryProgress } from './_components/landing/StoryProgress';
import Loading from './loading';

// Step components
import AIAssistanceStep from './_container/AIAssistanceStep';
import LanguageLearningStep from './_container/LanguageLearningStep';
import LoginRegisterStep from './_container/LoginRegisterStep';
import NewAmazingStep from './_container/NewAmazingStep';
import PandaEatingStep from './_container/PandaEatingStep';
import WelcomeStep from './_container/WelcomeStep';

export default function Page() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const router = useRouter();
  const { queryParams } = useQueryParams();
  const { theme, setTheme } = useTheme();
  const totalSteps = 6;
  const [progressStatus, setProgressStatus] = useState(Array(totalSteps).fill(0));
  const isDarkMode = theme === 'dark';
  const statusBarHeight = +queryParams?.statusBarHeight || 0;

  const steps = [
    { id: 'welcome', Component: WelcomeStep },
    { id: 'panda-eating', Component: PandaEatingStep },
    { id: 'language-learning', Component: LanguageLearningStep },
    { id: 'ai-assistance', Component: AIAssistanceStep },
    { id: 'new-amazing', Component: NewAmazingStep },
    { id: 'login-register', Component: LoginRegisterStep },
  ];

  useEffect(() => {
    if (theme == "system") setTheme('dark');
  }, [setTheme, theme]);

  // Check authentication
  useEffect(() => {
    const token = getCookie(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (token) router.push(ROUTES.DASHBOARD());
    else setIsLoading(false);
  }, [router]);

  // Handle auto progression
  useEffect(() => {
    if (isLoading || step === totalSteps - 1) return;

    let startTime = Date.now();
    let animationFrame;
    const storyDuration = 8000; // 8 seconds per step

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / storyDuration, 1);

      setProgressStatus((prev) => {
        const newStatus = [...prev];
        newStatus[step] = progress;
        return newStatus;
      });

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else if (step < totalSteps - 1) {
        goToStep(step + 1);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [step, isLoading]);

  // Navigation
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

  // Touch/swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && step < totalSteps - 1) {
        goToStep(step + 1);
      } else if (diff < 0 && step > 0) {
        goToStep(step - 1);
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Click navigation
  const handleTapNavigation = (e) => {
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const position = (clientX - left) / width;

    if (position < 0.3 && step > 0) {
      goToStep(step - 1);
    } else if (position > 0.7 && step < totalSteps - 1) {
      goToStep(step + 1);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <StoryContainer
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleTapNavigation}
    >
      <StoryBackground isDarkMode={isDarkMode} />

      <StoryProgress
        totalSteps={totalSteps}
        currentStep={step}
        progressStatus={progressStatus}
        goToStep={goToStep}
        statusBarHeight={statusBarHeight}
      />

      <StoryHeader
        statusBarHeight={statusBarHeight}
        isDarkMode={isDarkMode}
      />

      <StoryNavigation
        handleNext={() => step < totalSteps - 1 && goToStep(step + 1)}
        handlePrev={() => step > 0 && goToStep(step - 1)}
      />

      <AnimatePresence mode="wait">
        <StoryContent
          key={step}
          step={step}
          Component={steps[step].Component}
          goToStep={goToStep}
          router={router}
          totalSteps={totalSteps}
        />
      </AnimatePresence>
    </StoryContainer>
  );
}