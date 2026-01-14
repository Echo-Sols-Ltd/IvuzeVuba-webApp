"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { STORAGE_KEYS } from '@/lib/api';

/**
 * SessionManager component that monitors API responses globally
 * and redirects to login when session expires
 */
export default function SessionManager() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Store original fetch
    const originalFetch = window.fetch;

    // Override fetch globally
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      // Check if session has expired (401 Unauthorized)
      // Skip this check for login/signup pages
      if (
        response.status === 401 &&
        !pathname?.includes('/auth/login') &&
        !pathname?.includes('/auth/signup') &&
        !pathname?.includes('/register')
      ) {
        // Clear all auth data
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
        localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
        localStorage.removeItem(STORAGE_KEYS.USER_ID);

        // Redirect to login page
        router.push('/auth/login');
      }

      return response;
    };

    // Cleanup: restore original fetch on unmount
    return () => {
      window.fetch = originalFetch;
    };
  }, [router, pathname]);

  return null;
}
