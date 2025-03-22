import { useEffect, useState } from 'react';

/**
 * Custom hook for responsive design that detects if the current viewport matches a media query
 * @param query The media query to check against (e.g., '(max-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
    // Default to false for SSR
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Create the media query list
        const media = window.matchMedia(query);

        // Set the initial value
        setMatches(media.matches);

        // Define listener function
        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Add the listener
        media.addEventListener('change', listener);

        // Clean up
        return () => {
            media.removeEventListener('change', listener);
        };
    }, [query]);

    return matches;
}
