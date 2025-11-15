// Authentication utility functions

import { API_ENDPOINTS, STORAGE_KEYS, getAuthHeaders } from './api';
import { ROUTES } from './constants';

/**
 * Logout user by calling backend API and clearing local storage
 */
export const logout = async (): Promise<void> => {
    try {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        if (token) {
            // Call backend logout endpoint
            await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
        }
    } catch (error) {
        console.error('Logout API call failed:', error);
        // Continue with local cleanup even if API call fails
    } finally {
        // Clear all auth data from localStorage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
        localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
        localStorage.removeItem(STORAGE_KEYS.USER_ID);
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Get current user role
 */
export const getUserRole = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
};

/**
 * Get current user email
 */
export const getUserEmail = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USER_EMAIL);
};

/**
 * Get current user ID
 */
export const getUserId = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USER_ID);
};
