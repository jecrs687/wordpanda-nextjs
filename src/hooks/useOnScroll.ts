"use client";
import { useCallback, useEffect, useState } from 'react';

interface UseOnScrollOptions {
    threshold?: number;
    scrollUp?: boolean;
}

export function useOnScroll({ threshold = 10, scrollUp = false }: UseOnScrollOptions = {}) {
    const [scrolled, setScrolled] = useState(false);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    const handleScroll = useCallback(() => {
        const currentPosition = window.scrollY || document.documentElement.scrollTop;

        // Check if user has scrolled past threshold
        if (!scrolled && currentPosition > threshold) {
            setScrolled(true);
        } else if (scrolled && currentPosition <= threshold) {
            setScrolled(false);
        }

        // Determine scroll direction
        if (currentPosition > lastScrollPosition) {
            setScrollDirection('down');
        } else if (currentPosition < lastScrollPosition) {
            setScrollDirection('up');
        }

        // Update positions
        setScrollPosition(currentPosition);
        setLastScrollPosition(currentPosition);
    }, [threshold, lastScrollPosition, scrolled]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return {
        scrolled,
        scrollDirection,
        scrollPosition,
        isScrollingUp: scrollDirection === 'up',
        isScrollingDown: scrollDirection === 'down',
        // For hiding elements on scroll down and showing on scroll up
        shouldShow: scrollUp ? scrollDirection === 'up' || scrollPosition < threshold : true
    };
}

export default useOnScroll;
