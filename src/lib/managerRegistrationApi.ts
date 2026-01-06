import { API_ENDPOINTS } from './api';

export interface ManagerRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  countryOfResidence: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  nationalId: string;
  dateOfBirth: string; // YYYY-MM-DD format
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  hospitalName: string;
}

export interface ManagerRegistrationResponse {
  success: boolean;
  message: string;
  managerId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  hospitalName?: string;
  error?: string;
}

export interface EmailCheckResponse {
  email: string;
  available: boolean;
  message: string;
}

export interface RegistrationRequirements {
  requirements: {
    [key: string]: {
      required: boolean;
      minLength?: number;
      maxLength?: number;
      format?: string;
      options?: string[];
      description: string;
    };
  };
  notes: string[];
}

// Register a new manager
export const registerManager = async (data: ManagerRegistrationData): Promise<ManagerRegistrationResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.MANAGER.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle specific HTTP status codes
      if (response.status === 401) {
        return {
          success: false,
          message: 'Authentication error - registration endpoint should be public. Please contact support.',
          error: 'Authentication required',
        };
      }
      
      if (response.status === 403) {
        return {
          success: false,
          message: 'Access denied - registration endpoint should be accessible. Please contact support.',
          error: 'Access denied',
        };
      }
      
      return {
        success: false,
        message: result.error || result.message || 'Registration failed',
        error: result.error || result.message,
      };
    }

    return result;
  } catch (error) {
    console.error('Manager registration error:', error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Unable to connect to registration service. Please check your internet connection and try again.',
        error: 'Network error',
      };
    }
    
    return {
      success: false,
      message: 'Network error occurred during registration',
      error: 'Network error',
    };
  }
};

// Check if email is available
export const checkEmailAvailability = async (email: string): Promise<EmailCheckResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.MANAGER.CHECK_EMAIL(email), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Handle specific HTTP status codes
      if (response.status === 401) {
        console.warn('Authentication error during email check - endpoint should be public');
        return {
          email,
          available: true,
          message: 'Email check temporarily unavailable - will validate during registration',
        };
      }
      
      // If it's a 404, the endpoint might not exist yet
      if (response.status === 404) {
        console.warn('Email check endpoint not found, assuming email is available');
        return {
          email,
          available: true,
          message: 'Email check unavailable - proceeding with registration',
        };
      }
      
      // For other errors, try to get the error message
      let errorMessage = 'Failed to check email availability';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If we can't parse the error, use the default message
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Email check error:', error);
    
    // If it's a network error, assume email is available and let backend handle validation
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Network error during email check, assuming email is available');
      return {
        email,
        available: true,
        message: 'Email check unavailable - will validate during registration',
      };
    }
    
    return {
      email,
      available: false,
      message: error instanceof Error ? error.message : 'Failed to check email availability',
    };
  }
};

// Get registration requirements
export const getRegistrationRequirements = async (): Promise<RegistrationRequirements> => {
  try {
    const response = await fetch(API_ENDPOINTS.MANAGER.REGISTRATION_REQUIREMENTS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch registration requirements');
    }

    return await response.json();
  } catch (error) {
    console.error('Requirements fetch error:', error);
    return {
      requirements: {},
      notes: ['Failed to load registration requirements'],
    };
  }
};

// Validate registration data
export const validateRegistrationData = (data: ManagerRegistrationData): string[] => {
  const errors: string[] = [];

  // Required field validation
  if (!data.firstName?.trim()) errors.push('First name is required');
  if (!data.lastName?.trim()) errors.push('Last name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  if (!data.countryOfResidence?.trim()) errors.push('Country of residence is required');
  if (!data.phoneNumber?.trim()) errors.push('Phone number is required');
  if (!data.password) errors.push('Password is required');
  if (!data.confirmPassword) errors.push('Password confirmation is required');
  if (!data.nationalId?.trim()) errors.push('National ID is required');
  if (!data.dateOfBirth) errors.push('Date of birth is required');
  if (!data.gender) errors.push('Gender is required');
  if (!data.hospitalName?.trim()) errors.push('Hospital name is required');

  // Length validation
  if (data.firstName && (data.firstName.length < 2 || data.firstName.length > 50)) {
    errors.push('First name must be between 2 and 50 characters');
  }
  if (data.lastName && (data.lastName.length < 2 || data.lastName.length > 50)) {
    errors.push('Last name must be between 2 and 50 characters');
  }

  // Email format validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email format is invalid');
  }

  // Password validation
  if (data.password && data.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Password confirmation validation
  if (data.password !== data.confirmPassword) {
    errors.push('Password confirmation does not match');
  }

  // Phone number validation (basic)
  if (data.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(data.phoneNumber.replace(/\s/g, ''))) {
    errors.push('Phone number format is invalid');
  }

  // Date of birth validation
  if (data.dateOfBirth) {
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    
    if (age < 18 || age > 100) {
      errors.push('Manager must be between 18 and 100 years old');
    }
  }

  // Gender validation
  if (data.gender && !['MALE', 'FEMALE', 'OTHER'].includes(data.gender)) {
    errors.push('Gender must be MALE, FEMALE, or OTHER');
  }

  return errors;
};