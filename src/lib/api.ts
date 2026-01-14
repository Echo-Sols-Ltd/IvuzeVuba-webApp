// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

/**
 * Session Management:
 * - The SessionManager component (in layout.tsx) automatically intercepts all fetch requests
 * - When a 401 (Unauthorized) response is detected, it clears auth data and redirects to login
 * - No additional code needed in components - just use fetch() normally
 * - For custom handling, use the useAuthenticatedFetch hook or authenticatedFetch helper
 */

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
        REFRESH: `${API_BASE_URL}/api/auth/refresh`,
        PATIENT_SIGNUP: `${API_BASE_URL}/api/auth/patient/signup`,
        DOCTOR_SIGNUP: `${API_BASE_URL}/api/auth/doctor/signup`,
        MANAGER_SIGNUP: `${API_BASE_URL}/api/auth/manager/signup`,
        CHANGE_PASSWORD: `${API_BASE_URL}/api/auth/change-password`,
        ENABLE_2FA: `${API_BASE_URL}/api/auth/2fa/enable`,
        DISABLE_2FA: `${API_BASE_URL}/api/auth/2fa/disable`,
        SEND_2FA_CODE: `${API_BASE_URL}/api/auth/2fa/send-code`,
        VERIFY_2FA: `${API_BASE_URL}/api/auth/2fa/verify`,
    },
    PATIENT: {
        DASHBOARD: `${API_BASE_URL}/api/patient/dashboard/me`,
        OVERVIEW: `${API_BASE_URL}/api/patient/overview/me`,
        PROFILE: `${API_BASE_URL}/api/patient/profile/me`,
        APPOINTMENTS: `${API_BASE_URL}/api/patient/appointments/me`,
        CREATE_APPOINTMENT: `${API_BASE_URL}/api/patient/appointments/me`,
        PRESCRIPTIONS: `${API_BASE_URL}/api/patient/prescriptions/me`,
        VITAL_SIGNS: `${API_BASE_URL}/api/patient/vital-signs/me`,
        CLINICAL_NOTES: `${API_BASE_URL}/api/patient/clinical-notes/me`,
        MEDICAL_ORDERS: `${API_BASE_URL}/api/patient/medical-orders/me`,
        CLINICAL_ALERTS: `${API_BASE_URL}/api/patient/clinical-alerts/me`,
        WALLET: `${API_BASE_URL}/api/patient/wallet/me`,
        TOPUP_WALLET: `${API_BASE_URL}/api/patient/wallet/topup/me`,
        PAYMENTS: `${API_BASE_URL}/api/patient/payments/me`,
        TRANSACTIONS: `${API_BASE_URL}/api/patient/transactions/me`,
        DEPARTMENTS: `${API_BASE_URL}/api/patient/departments`,
    },
    DOCTOR: {
        BASE: `${API_BASE_URL}/api/doctor`,
        OVERVIEW: `${API_BASE_URL}/api/doctor/overview`,
        QUEUE: `${API_BASE_URL}/api/doctor/queue`,
        QUEUE_COUNT: `${API_BASE_URL}/api/doctor/queue/count`,
        DASHBOARD_STATS: `${API_BASE_URL}/api/doctor/dashboard/stats`,
        AVAILABLE_DOCTORS: `${API_BASE_URL}/api/doctor/available-doctors`,
        ADD_CONSULTATION: (appointmentId: string) => `${API_BASE_URL}/api/doctor/queue/add-consultation/${appointmentId}`,
        ADD_REFERRAL: (appointmentId: string) => `${API_BASE_URL}/api/doctor/queue/add-referral/${appointmentId}`,
        CHART: (appointmentId: string) => `${API_BASE_URL}/api/doctor/chart/${appointmentId}`,
        ADD_NOTE: (appointmentId: string) => `${API_BASE_URL}/api/doctor/chart/add-note/${appointmentId}`,
        ADD_PRESCRIPTION: `${API_BASE_URL}/api/doctor/chart/add-prescription`,
        VITAL_SIGNS: `${API_BASE_URL}/api/doctor/chart/vital-signs`,
        CLINICAL_NOTES: `${API_BASE_URL}/api/doctor/chart/clinical-notes`,
        MEDICAL_ORDERS: `${API_BASE_URL}/api/doctor/chart/medical-orders`,
        CLINICAL_ALERTS: (patientId: string) => `${API_BASE_URL}/api/doctor/chart/clinical-alerts/${patientId}`,
        PAYMENTS: `${API_BASE_URL}/api/doctor/payments`,
        PAYMENTS_TODAY: `${API_BASE_URL}/api/doctor/payments/todays`,
        PAYMENTS_LAST_WEEK: `${API_BASE_URL}/api/doctor/payments/last-week`,
        PAYMENTS_LAST_MONTH: `${API_BASE_URL}/api/doctor/payments/last-month`,
        PAYMENTS_OVERALL: `${API_BASE_URL}/api/doctor/payment/over-all`,
        PAYMENTS_PER_MONTH: `${API_BASE_URL}/api/doctor/payments/all-perMonth`,
        CONSULTATIONS: `${API_BASE_URL}/api/doctor/consultations`,
        CONSULTATIONS_TOTAL: `${API_BASE_URL}/api/doctor/consultations/get-total`,
        CONSULTATIONS_BY_MONTH: `${API_BASE_URL}/api/doctor/consultations/get_byMonth`,
        CONSULTATIONS_UNIQUE: `${API_BASE_URL}/api/doctor/consultations/get-unique`,
        REFERRALS_OUTGOING: `${API_BASE_URL}/api/doctor/referrals/out-going`,
        REFERRALS_INCOMING: `${API_BASE_URL}/api/doctor/referrals/in-coming`,
        ADD_REFERRAL_TO_DOCTOR: (appointmentId: string, referedDoctorId: string) =>
            `${API_BASE_URL}/api/doctor/referrals/add-referral/${appointmentId}/${referedDoctorId}`,
        NOTIFICATIONS: (userId: string) => `${API_BASE_URL}/api/notifications/user/${userId}`,
        NOTIFICATIONS_UNREAD: (userId: string) => `${API_BASE_URL}/api/notifications/user/${userId}/unread`,
        MARK_NOTIFICATION_READ: (notificationId: string) => `${API_BASE_URL}/api/notifications/${notificationId}/mark-read`,
    },
    MANAGER: {
        DASHBOARD: `${API_BASE_URL}/api/manager`,
        OVERVIEW: `${API_BASE_URL}/api/manager/overview`,
        QUEUE_STATS: `${API_BASE_URL}/api/manager/queue-stats`,
        PHARMACY_STATS: `${API_BASE_URL}/api/manager/pharmacy-stats`,
        NOTIFICATIONS: `${API_BASE_URL}/api/manager/notifications`,
        REGISTER: `${API_BASE_URL}/manager/api/healthlink/v1/register`,
        CHECK_EMAIL: (email: string) => `${API_BASE_URL}/manager/api/healthlink/v1/check-email/${email}`,
        REGISTRATION_REQUIREMENTS: `${API_BASE_URL}/manager/api/healthlink/v1/requirements`,
    },
    STAFF: {
        LIST: `${API_BASE_URL}/api/staff`,
        CREATE: `${API_BASE_URL}/api/staff`,
        GET: (id: string) => `${API_BASE_URL}/api/staff/${id}`,
        UPDATE: (id: string) => `${API_BASE_URL}/api/staff/${id}`,
        DEACTIVATE: (id: string) => `${API_BASE_URL}/api/staff/${id}/deactivate`,
    },
    DEPARTMENTS: {
        LIST: `${API_BASE_URL}/api/departments`,
        CREATE: `${API_BASE_URL}/api/departments`,
        UPDATE: (id: string) => `${API_BASE_URL}/api/departments/${id}`,
        DELETE: (id: string) => `${API_BASE_URL}/api/departments/${id}`,
    },
    HOSPITALS: {
        LIST: `${API_BASE_URL}/api/hospitals`,
        MY_HOSPITAL: `${API_BASE_URL}/api/hospitals/my-hospital`,
        CREATE_OR_UPDATE: `${API_BASE_URL}/api/hospitals/my-hospital`,
        UPDATE: (id: string) => `${API_BASE_URL}/api/hospitals/${id}`,
        DELETE: (id: string) => `${API_BASE_URL}/api/hospitals/${id}`,
    },
    INVENTORY: {
        LIST: `${API_BASE_URL}/api/inventory`,
        CREATE: `${API_BASE_URL}/api/inventory`,
        UPDATE: (id: string) => `${API_BASE_URL}/api/inventory/${id}`,
        DELETE: (id: string) => `${API_BASE_URL}/api/inventory/${id}`,
        REORDER: (id: string) => `${API_BASE_URL}/api/inventory/${id}/reorder`,
        LOW_STOCK: `${API_BASE_URL}/api/inventory/low-stock`,
        BY_STATUS: (status: string) => `${API_BASE_URL}/api/inventory/by-status/${status}`,
    },
    QUEUE: {
        UNASSIGNED: `${API_BASE_URL}/api/queue/unassigned`,
        ALL: `${API_BASE_URL}/api/queue/all`,
        DELAYED: `${API_BASE_URL}/api/queue/delayed`,
        ASSIGN_DOCTOR: `${API_BASE_URL}/api/queue/assign-doctor`,
        UNASSIGN_DOCTOR: `${API_BASE_URL}/api/queue/unassign-doctor`,
        AVAILABLE_DOCTORS: `${API_BASE_URL}/api/queue/available-doctors`,
    },
    USER: {
        PROFILE: `${API_BASE_URL}/api/user/profile`,
        UPDATE_PROFILE: `${API_BASE_URL}/api/user/profile`,
    },
};

// Role-based routing configuration
export const ROLE_ROUTES: Record<string, string> = {
    PATIENT: '/patient/dashboard',
    DOCTOR: '/doctor/overview',
    MANAGER: '/manager',
};

// Storage keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_ROLE: 'userRole',
    USER_EMAIL: 'userEmail',
    USER_ID: 'userId',
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

// Helper function to handle session expiration
const handleSessionExpired = () => {
    // Clear all auth data
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    
    // Redirect to login page
    window.location.href = '/auth/login';
};

// Enhanced fetch wrapper that handles session expiration
export const authenticatedFetch = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    const response = await fetch(url, options);
    
    // Check if session has expired (401 Unauthorized)
    if (response.status === 401) {
        handleSessionExpired();
        throw new Error('Session expired. Please login again.');
    }
    
    return response;
};
