import { API_ENDPOINTS, API_BASE_URL, getAuthHeaders } from './api';

// Patient Dashboard Types
export interface PatientDashboard {
    upcomingAppointments: number;
    activePrescriptions: number;
    walletBalance: number;
    recentVisits: number | any[]; // Allow both number and array to handle API inconsistencies
}

// Appointment Types
export interface Appointment {
    id: string;
    departmentName: string;
    reason: string;
    preferredDate: string;
    status: string;
    queuePosition?: number;
    doctorName?: string;
    assignedDoctorName?: string;
    scheduledTime?: string;
}

// Prescription Types
export interface Prescription {
    id: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    prescribedBy: string;
    prescribedDate: string;
    status: string;
    instructions?: string;
}

// Wallet Types
export interface Wallet {
    balance: number;
    currency: string;
}

// Payment Types
export interface Payment {
    id: string;
    amount: number;
    date: string;
    status: string;
    description: string;
    method?: string;
}

// Transaction Types
export interface Transaction {
    id: string;
    type: string;
    amount: number;
    date: string;
    description: string;
    status: string;
}

// Department Types
export interface Department {
    id: string;
    name: string;
    description?: string;
}

// Helper function to parse response
const parseResponse = async (response: Response) => {
    if (response.status === 204) return null;
    const text = await response.text();
    if (!text) return null;
    
    try {
        return JSON.parse(text);
    } catch (error) {
        console.error('Failed to parse JSON response:', text);
        return null;
    }
};

// Dashboard API
export const getPatientDashboard = async (): Promise<PatientDashboard> => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.DASHBOARD, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) {
            return {
                upcomingAppointments: 0,
                activePrescriptions: 0,
                walletBalance: 0,
                recentVisits: 0,
            };
        }

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard');
        }

        const data = await parseResponse(response);
        
        if (!data) {
            return {
                upcomingAppointments: 0,
                activePrescriptions: 0,
                walletBalance: 0,
                recentVisits: 0,
            };
        }

        // Normalize the recentVisits field
        let recentVisitsCount = 0;
        if (typeof data.recentVisits === 'number') {
            recentVisitsCount = data.recentVisits;
        } else if (Array.isArray(data.recentVisits)) {
            recentVisitsCount = data.recentVisits.length;
        } else if (data.recentVisits && typeof data.recentVisits === 'object') {
            recentVisitsCount = data.recentVisits.count || 0;
        }

        return {
            upcomingAppointments: Number(data.upcomingAppointments) || 0,
            activePrescriptions: Number(data.activePrescriptions) || 0,
            walletBalance: Number(data.walletBalance) || 0,
            recentVisits: recentVisitsCount,
        };
    } catch (error) {
        console.error('Error fetching patient dashboard:', error);
        return {
            upcomingAppointments: 0,
            activePrescriptions: 0,
            walletBalance: 0,
            recentVisits: 0,
        };
    }
};

// Appointments API
export const getAppointments = async (): Promise<Appointment[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.APPOINTMENTS, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) return [];

        if (!response.ok) {
            throw new Error('Failed to fetch appointments');
        }

        const data = await parseResponse(response);
        return data || [];
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
};

export const createAppointment = async (appointmentData: {
    departmentName: string;
    reason: string;
    preferredDate: string;
}) => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.CREATE_APPOINTMENT, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(appointmentData),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to create appointment');
        }

        // Backend returns plain text success message, not JSON
        const text = await response.text();
        return { success: true, message: text };
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
};

// Prescriptions API
export const getPrescriptions = async (): Promise<Prescription[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.PRESCRIPTIONS, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) return [];

        if (!response.ok) {
            throw new Error('Failed to fetch prescriptions');
        }

        const data = await parseResponse(response);
        return data || [];
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        return [];
    }
};

// Wallet API
export const getWallet = async (): Promise<Wallet> => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.WALLET, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204 || response.status === 404) {
            // 404 means patient doesn't have a wallet yet - this is normal
            return { balance: 0, currency: 'RWF' };
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Wallet fetch failed:', response.status, errorText);
            return { balance: 0, currency: 'RWF' };
        }

        const data = await parseResponse(response);
        
        // Handle different response formats
        if (data && typeof data === 'object') {
            return {
                balance: Number(data.balance || 0),
                currency: String(data.currency || 'RWF'),
            };
        }
        
        return { balance: 0, currency: 'RWF' };
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return { balance: 0, currency: 'RWF' };
    }
};

export const topUpWallet = async (amount: number, paymentMethod: string) => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.TOPUP_WALLET, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ amount, paymentMethod }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to top up wallet');
        }

        // Backend might return plain text or JSON
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { success: true, message: text };
        }
    } catch (error) {
        console.error('Error topping up wallet:', error);
        throw error;
    }
};

export const withdrawFromWallet = async (amount: number, paymentMethod: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/patient/wallet/withdraw/me`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ amount, paymentMethod }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to withdraw from wallet');
        }

        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { success: true, message: text };
        }
    } catch (error) {
        console.error('Error withdrawing from wallet:', error);
        throw error;
    }
};

// Payments API
export const getPayments = async (): Promise<Payment[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.PAYMENTS, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) return [];

        if (!response.ok) {
            throw new Error('Failed to fetch payments');
        }

        const data = await parseResponse(response);
        return data || [];
    } catch (error) {
        console.error('Error fetching payments:', error);
        return [];
    }
};

// Transactions API
export const getTransactions = async (): Promise<Transaction[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.TRANSACTIONS, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204 || response.status === 404) return [];

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Transactions fetch failed:', response.status, errorText);
            return [];
        }

        const text = await response.text();
        
        // Check if response is just a success message (not JSON array)
        if (text && !text.trim().startsWith('[') && !text.trim().startsWith('{')) {
            console.log('Transactions response is a message, not data:', text);
            return [];
        }

        // Parse the text as JSON
        try {
            const data = JSON.parse(text);
            return Array.isArray(data) ? data : [];
        } catch (parseError) {
            console.error('Failed to parse transactions JSON:', text);
            return [];
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
};

// Departments API
export const getDepartments = async (): Promise<Department[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.DEPARTMENTS, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) return [];

        if (!response.ok) {
            throw new Error('Failed to fetch departments');
        }

        const data = await parseResponse(response);
        return data || [];
    } catch (error) {
        console.error('Error fetching departments:', error);
        return [];
    }
};

// Profile API
export const getProfile = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.PROFILE, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) return null;

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        return await parseResponse(response);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};

// Payment Methods API
export interface PaymentMethod {
    id: string;
    provider: string;
    phoneNumber: string;
    isDefault: boolean;
}

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/patient/wallet/payment-methods/me`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204 || response.status === 404) return [];

        if (!response.ok) {
            console.log('Payment methods endpoint not implemented yet, returning empty array');
            return [];
        }

        const data = await parseResponse(response);
        return data || [];
    } catch (error) {
        console.log('Payment methods feature not available yet, returning empty array');
        return [];
    }
};

export const addPaymentMethod = async (phoneNumber: string, provider: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/patient/wallet/payment-methods/me`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ phoneNumber, provider }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Payment methods feature not implemented yet');
        }

        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { success: true, message: text };
        }
    } catch (error) {
        console.error('Error adding payment method:', error);
        throw error;
    }
};

export const updatePaymentMethod = async (id: string, data: Partial<PaymentMethod>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/patient/wallet/payment-methods/${id}/me`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Payment methods feature not implemented yet');
        }

        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { success: true, message: text };
        }
    } catch (error) {
        console.error('Error updating payment method:', error);
        throw error;
    }
};

export const deletePaymentMethod = async (id: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/patient/wallet/payment-methods/${id}/me`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Payment methods feature not implemented yet');
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting payment method:', error);
        throw error;
    }
};

// Medical Records API
export interface VitalSigns {
    id: string;
    systolicBp?: number;
    diastolicBp?: number;
    heartRate?: number;
    temperature?: number;
    temperatureUnit?: string;
    oxygenSaturation?: number;
    weight?: number;
    weightUnit?: string;
    height?: number;
    heightUnit?: string;
    respiratoryRate?: number;
    notes?: string;
    createdAt: string;
}

export interface ClinicalNote {
    id: string;
    noteType: string;
    title?: string;
    content: string;
    isPrivate: boolean;
    createdAt: string;
}

export interface MedicalOrder {
    id: string;
    orderType: string;
    orderName: string;
    description?: string;
    instructions?: string;
    status: string;
    priority: string;
    scheduledDate?: string;
    completedDate?: string;
    results?: string;
    createdAt: string;
}

export interface ClinicalAlert {
    id: string;
    alertType: string;
    severity: string;
    title: string;
    message: string;
    isActive: boolean;
    acknowledged: boolean;
    createdAt: string;
}

export const getVitalSigns = async (): Promise<VitalSigns[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.VITAL_SIGNS, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) return [];

        if (!response.ok) {
            throw new Error('Failed to fetch vital signs');
        }

        const data = await parseResponse(response);
        return data || [];
    } catch (error) {
        console.error('Error fetching vital signs:', error);
        return [];
    }
};

export const getClinicalNotes = async (): Promise<ClinicalNote[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.CLINICAL_NOTES, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) return [];

        if (!response.ok) {
            throw new Error('Failed to fetch clinical notes');
        }

        const data = await parseResponse(response);
        return data || [];
    } catch (error) {
        console.error('Error fetching clinical notes:', error);
        return [];
    }
};

export const getMedicalOrders = async (): Promise<MedicalOrder[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.MEDICAL_ORDERS, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) return [];

        if (!response.ok) {
            throw new Error('Failed to fetch medical orders');
        }

        const data = await parseResponse(response);
        return data || [];
    } catch (error) {
        console.error('Error fetching medical orders:', error);
        return [];
    }
};

export const getClinicalAlerts = async (): Promise<ClinicalAlert[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.PATIENT.CLINICAL_ALERTS, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) return [];

        if (!response.ok) {
            throw new Error('Failed to fetch clinical alerts');
        }

        const data = await parseResponse(response);
        return data || [];
    } catch (error) {
        console.error('Error fetching clinical alerts:', error);
        return [];
    }
};
