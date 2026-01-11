// Application constants

// App branding
export const APP_NAME = 'HealthLink';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  PATIENT_REGISTER: '/patient/auth/register',
  PATIENT_VERIFY_EMAIL: '/patient/auth/verify-email',
  PATIENT_DASHBOARD: '/patient/dashboard',
  DOCTOR_OVERVIEW: '/doctor/overview',
  MANAGER_DASHBOARD: '/manager',
};

// API Endpoints
export const API_ENDPOINTS = {
  PATIENT_SIGNUP: '/api/auth/patient/signup',
  PATIENT_VERIFY_EMAIL: '/api/auth/patient/verify-email',
  LOGIN: '/api/auth/login',
};

// UI Messages
export const MESSAGES = {
  LOGIN: {
    TITLE: 'Login to Your Portal',
    SUBTITLE: 'Enter your credentials to sign in',
    WELCOME_TITLE: 'Welcome to HealthLink Portal',
    WELCOME_SUBTITLE: 'Access your personalized healthcare dashboard securely.',
    BUTTON_TEXT: 'LOGIN',
    LOADING_TEXT: 'Logging in...',
    NO_ACCOUNT: "Don't have an account?",
    SIGNUP_LINK: 'Sign Up as Patient',
    FORGOT_PASSWORD: 'Forgot password?',
    REMEMBER_ME: 'Remember me',
  },
  ERRORS: {
    LOGIN_FAILED: 'Login failed. Please try again.',
    INVALID_ROLE: 'Invalid role received from server',
  },
};

// Form placeholders
export const PLACEHOLDERS = {
  EMAIL: 'example@hospital.com',
  PASSWORD: '••••••••',
};

// Image alt texts
export const ALT_TEXTS = {
  LOGO: 'HealthLink Logo',
  FIRST_AID_KIT: 'First Aid Kit',
  DOCTOR: 'Doctor',
  STETHOSCOPE: 'Stethoscope',
};
