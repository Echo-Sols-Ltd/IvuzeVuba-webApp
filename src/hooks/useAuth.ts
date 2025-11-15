import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_KEYS } from '@/lib/api';
import { ROUTES } from '@/lib/constants';

/**
 * Custom hook to check authentication status
 * Redirects to login if no token found
 */
export function useAuth(requiredRole?: string) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
                const userRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);

                // No token found - redirect to login
                if (!token) {
                    console.log('No token found, redirecting to login...');
                    router.push(ROUTES.LOGIN);
                    return;
                }

                // Check role if required
                if (requiredRole && userRole !== requiredRole) {
                    console.log(`Wrong role. Required: ${requiredRole}, Got: ${userRole}`);
                    router.push(ROUTES.LOGIN);
                    return;
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth check error:', error);
                router.push(ROUTES.LOGIN);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, requiredRole]);

    return { isAuthenticated, isLoading };
}

/**
 * Hook specifically for manager pages
 */
export function useManagerAuth() {
    return useAuth('MANAGER');
}

/**
 * Hook specifically for doctor pages
 */
export function useDoctorAuth() {
    return useAuth('DOCTOR');
}

/**
 * Hook specifically for patient pages
 */
export function usePatientAuth() {
    return useAuth('PATIENT');
}
