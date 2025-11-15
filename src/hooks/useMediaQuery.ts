import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive media queries
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        
        // Set initial value
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        // Create listener
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        
        // Add listener
        media.addEventListener('change', listener);

        // Cleanup
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
}

/**
 * Hook to check if viewport is mobile (< 768px)
 */
export function useIsMobile(): boolean {
    return useMediaQuery('(max-width: 767px)');
}

/**
 * Hook to check if viewport is tablet (768px - 1023px)
 */
export function useIsTablet(): boolean {
    return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

/**
 * Hook to check if viewport is desktop (>= 1024px)
 */
export function useIsDesktop(): boolean {
    return useMediaQuery('(min-width: 1024px)');
}
