import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_KEYS } from '@/lib/api';

/**
 * Custom hook for making authenticated API calls with automatic session handling
 * Redirects to login page when session expires (401 response)
 */
export const useAuthenticatedFetch = () => {
  const router = useRouter();

  const handleSessionExpired = useCallback(() => {
    // Clear all auth data
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    
    // Redirect to login page
    router.push('/auth/login');
  }, [router]);

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      try {
        const response = await fetch(url, options);
        
        // Check if session has expired (401 Unauthorized)
        if (response.status === 401) {
          handleSessionExpired();
          throw new Error('Session expired. Please login again.');
        }
        
        return response;
      } catch (error) {
        // If it's a network error, just throw it
        if (error instanceof TypeError) {
          throw error;
        }
        // Re-throw our custom error
        throw error;
      }
    },
    [handleSessionExpired]
  );

  return { authenticatedFetch, handleSessionExpired };
};
