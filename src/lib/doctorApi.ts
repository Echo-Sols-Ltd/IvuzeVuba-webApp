import { API_ENDPOINTS, getAuthHeaders, handleApiError } from './api';

// Overview Stats
export interface OverviewStats {
    waiting: number;
    inConsultation: number;
    referred: number;
    completed: number;
}

// Queue Types
export interface QueuePatient {
    id: string;
    patientName: string;
    patientId: string;
    appointmentTime: string;
    status: string;
    priority?: string;
    reason?: string;
}

// Consultation Types
export interface Consultation {
    id: string;
    patientName: string;
    patientId: string;
    date: string;
    diagnosis?: string;
    status: string;
    duration?: number;
}

// Referral Types
export interface Referral {
    id: string;
    patientName: string;
    patientId: string;
    referredTo?: string;
    referredFrom?: string;
    date: string;
    reason: string;
    status: string;
}

// Payment Types
export interface Payment {
    id: string;
    patientName: string;
    patientId: string;
    amount: number;
    date: string;
    status: string;
    method?: string;
}

export interface PaymentStats {
    today: number;
    lastWeek: number;
    lastMonth: number;
    overall: number;
}

// Doctor Queue API
export const getDoctorQueue = async (): Promise<QueuePatient[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.DOCTOR.QUEUE, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        // Handle 204 No Content
        if (response.status === 204) {
            return [];
        }

        if (!response.ok) {
            throw new Error('Failed to fetch queue');
        }

        const text = await response.text();
        if (!text) {
            return [];
        }

        return JSON.parse(text);
    } catch (error) {
        console.error('Error fetching doctor queue:', error);
        return []; // Return empty array instead of throwing
    }
};

export const getQueueCount = async (): Promise<number> => {
    try {
        const response = await fetch(API_ENDPOINTS.DOCTOR.QUEUE_COUNT, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) {
            return 0;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch queue count');
        }

        const text = await response.text();
        if (!text) {
            return 0;
        }

        const data = JSON.parse(text);
        return typeof data === 'number' ? data : 0;
    } catch (error) {
        console.error('Error fetching queue count:', error);
        return 0;
    }
};

// Consultations API
export const getConsultations = async (): Promise<Consultation[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.DOCTOR.CONSULTATIONS, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) {
            return [];
        }

        if (!response.ok) {
            throw new Error('Failed to fetch consultations');
        }

        const text = await response.text();
        if (!text) {
            return [];
        }

        return JSON.parse(text);
    } catch (error) {
        console.error('Error fetching consultations:', error);
        return [];
    }
};

export const getConsultationStats = async () => {
    try {
        const parseResponse = async (response: Response) => {
            if (response.status === 204) return 0;
            const text = await response.text();
            if (!text) return 0;
            const data = JSON.parse(text);
            return typeof data === 'number' ? data : 0;
        };

        const [total, byMonth, unique] = await Promise.all([
            fetch(API_ENDPOINTS.DOCTOR.CONSULTATIONS_TOTAL, {
                method: 'GET',
                headers: getAuthHeaders(),
            }).then(parseResponse),
            fetch(API_ENDPOINTS.DOCTOR.CONSULTATIONS_BY_MONTH, {
                method: 'GET',
                headers: getAuthHeaders(),
            }).then(parseResponse),
            fetch(API_ENDPOINTS.DOCTOR.CONSULTATIONS_UNIQUE, {
                method: 'GET',
                headers: getAuthHeaders(),
            }).then(parseResponse),
        ]);

        return { total, byMonth, unique };
    } catch (error) {
        console.error('Error fetching consultation stats:', error);
        return { total: 0, byMonth: 0, unique: 0 };
    }
};

// Referrals API
export const getOutgoingReferrals = async (): Promise<Referral[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.DOCTOR.REFERRALS_OUTGOING, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) {
            return [];
        }

        if (!response.ok) {
            throw new Error('Failed to fetch outgoing referrals');
        }

        const text = await response.text();
        if (!text) {
            return [];
        }

        return JSON.parse(text);
    } catch (error) {
        console.error('Error fetching outgoing referrals:', error);
        return [];
    }
};

export const getIncomingReferrals = async (): Promise<Referral[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.DOCTOR.REFERRALS_INCOMING, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) {
            return [];
        }

        if (!response.ok) {
            throw new Error('Failed to fetch incoming referrals');
        }

        const text = await response.text();
        if (!text) {
            return [];
        }

        return JSON.parse(text);
    } catch (error) {
        console.error('Error fetching incoming referrals:', error);
        return [];
    }
};

export const addReferral = async (appointmentId: string, referedDoctorId: string) => {
    try {
        const response = await fetch(
            API_ENDPOINTS.DOCTOR.ADD_REFERRAL_TO_DOCTOR(appointmentId, referedDoctorId),
            {
                method: 'PATCH',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to add referral');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding referral:', error);
        throw error;
    }
};

// Get available doctors for referral
export const getAvailableDoctors = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.QUEUE.AVAILABLE_DOCTORS, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) {
            return [];
        }

        if (!response.ok) {
            throw new Error('Failed to fetch available doctors');
        }

        const text = await response.text();
        if (!text) {
            return [];
        }

        return JSON.parse(text);
    } catch (error) {
        console.error('Error fetching available doctors:', error);
        return [];
    }
};

// Payments API
export const getPayments = async (): Promise<Payment[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.DOCTOR.PAYMENTS, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) {
            return [];
        }

        if (!response.ok) {
            throw new Error('Failed to fetch payments');
        }

        const text = await response.text();
        if (!text) {
            return [];
        }

        return JSON.parse(text);
    } catch (error) {
        console.error('Error fetching payments:', error);
        return [];
    }
};

export const getPaymentStats = async (): Promise<PaymentStats> => {
    try {
        const parseResponse = async (response: Response) => {
            if (response.status === 204) return 0;
            const text = await response.text();
            if (!text) return 0;
            const data = JSON.parse(text);
            return typeof data === 'number' ? data : 0;
        };

        const [today, lastWeek, lastMonth, overall] = await Promise.all([
            fetch(API_ENDPOINTS.DOCTOR.PAYMENTS_TODAY, {
                method: 'GET',
                headers: getAuthHeaders(),
            }).then(parseResponse),
            fetch(API_ENDPOINTS.DOCTOR.PAYMENTS_LAST_WEEK, {
                method: 'GET',
                headers: getAuthHeaders(),
            }).then(parseResponse),
            fetch(API_ENDPOINTS.DOCTOR.PAYMENTS_LAST_MONTH, {
                method: 'GET',
                headers: getAuthHeaders(),
            }).then(parseResponse),
            fetch(API_ENDPOINTS.DOCTOR.PAYMENTS_OVERALL, {
                method: 'GET',
                headers: getAuthHeaders(),
            }).then(parseResponse),
        ]);

        return { today, lastWeek, lastMonth, overall };
    } catch (error) {
        console.error('Error fetching payment stats:', error);
        return { today: 0, lastWeek: 0, lastMonth: 0, overall: 0 };
    }
};

export const getPaymentsPerMonth = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.DOCTOR.PAYMENTS_PER_MONTH, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) {
            return [];
        }

        if (!response.ok) {
            throw new Error('Failed to fetch payments per month');
        }

        const text = await response.text();
        if (!text) {
            return [];
        }

        return JSON.parse(text);
    } catch (error) {
        console.error('Error fetching payments per month:', error);
        return [];
    }
};

// Update appointment status
export const updateAppointmentToConsultation = async (appointmentId: string) => {
    try {
        const response = await fetch(
            API_ENDPOINTS.DOCTOR.ADD_CONSULTATION(appointmentId),
            {
                method: 'PATCH',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to start consultation:', response.status, errorText);
            throw new Error(`Failed to update appointment (${response.status}): ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
    }
};

export const updateAppointmentToReferral = async (appointmentId: string) => {
    try {
        const response = await fetch(
            API_ENDPOINTS.DOCTOR.ADD_REFERRAL(appointmentId),
            {
                method: 'PATCH',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to update appointment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
    }
};

// Dashboard Stats API
export const getDashboardStats = async (): Promise<OverviewStats> => {
    try {
        const response = await fetch(API_ENDPOINTS.DOCTOR.DASHBOARD_STATS, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204) {
            return {
                waiting: 0,
                inConsultation: 0,
                referred: 0,
                completed: 0,
            };
        }

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }

        const text = await response.text();
        if (!text) {
            return {
                waiting: 0,
                inConsultation: 0,
                referred: 0,
                completed: 0,
            };
        }

        const data = JSON.parse(text);
        return {
            waiting: data.totalInQueue || 0,
            inConsultation: data.inConsultation || 0,
            referred: data.referred || 0,
            completed: data.completed || 0,
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            waiting: 0,
            inConsultation: 0,
            referred: 0,
            completed: 0,
        };
    }
};

// Patient Chart API
export interface PatientChartData {
    appointmentId: string;
    patientId: string;
    patientName?: string;
    patientFirstName?: string;
    patientLastName?: string;
    patientEmail?: string;
    patientPhone?: string;
    patientAddress?: string;
    patientDateOfBirth?: string;
    appointmentDate: string;
    appointmentTime?: string;
    reason: string;
    status: string;
    departmentName?: string;
    vitalSigns?: any[];
    clinicalNotes?: any[];
    prescriptions?: any[];
    medicalOrders?: any[];
    clinicalAlerts?: any[];
}

export const getPatientChart = async (appointmentId: string): Promise<PatientChartData | null> => {
    try {
        const response = await fetch(API_ENDPOINTS.DOCTOR.CHART(appointmentId), {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.status === 204 || response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch patient chart');
        }

        const text = await response.text();
        if (!text) {
            return null;
        }

        const data = JSON.parse(text);
        console.log('Raw chart data from API:', data); // Debug log
        
        // Construct patient name from available fields
        let patientName = data.patientName;
        if (!patientName && (data.patientFirstName || data.patientLastName)) {
            patientName = `${data.patientFirstName || ''} ${data.patientLastName || ''}`.trim();
        }
        
        // If still no name, try to construct from nested patient object
        if (!patientName && data.patient) {
            if (data.patient.firstName || data.patient.lastName) {
                patientName = `${data.patient.firstName || ''} ${data.patient.lastName || ''}`.trim();
            } else if (data.patient.name) {
                patientName = data.patient.name;
            }
        }
        
        console.log('Constructed patient name:', patientName); // Debug log
        
        return {
            ...data,
            patientName: patientName || 'Unknown Patient',
        };
    } catch (error) {
        console.error('Error fetching patient chart:', error);
        return null;
    }
};

// Helper function to get patient ID from appointment
export const getPatientIdFromAppointment = async (appointmentId: string): Promise<string | null> => {
    try {
        // Try chart endpoint first
        const chartData = await getPatientChart(appointmentId);
        if (chartData?.patientId) {
            return chartData.patientId;
        }

        // Fallback: try to get from queue
        const queueResponse = await fetch(API_ENDPOINTS.DOCTOR.QUEUE, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (queueResponse.ok) {
            const queueData = await queueResponse.json();
            const appointment = queueData.find(
                (item: any) => item.id === appointmentId || item.appointmentId === appointmentId
            );
            
            if (appointment?.patientId) {
                return appointment.patientId;
            }
        }

        return null;
    } catch (error) {
        console.error('Error getting patient ID:', error);
        return null;
    }
};

// Add clinical note
export const addClinicalNote = async (appointmentId: string, noteData: any) => {
    try {
        const response = await fetch(API_ENDPOINTS.DOCTOR.ADD_NOTE(appointmentId), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(noteData),
        });

        if (!response.ok) {
            throw new Error('Failed to add clinical note');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding clinical note:', error);
        throw error;
    }
};

// Add prescription
export const addPrescription = async (prescriptionData: any) => {
    try {
        const response = await fetch(API_ENDPOINTS.DOCTOR.ADD_PRESCRIPTION, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(prescriptionData),
        });

        if (!response.ok) {
            throw new Error('Failed to add prescription');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding prescription:', error);
        throw error;
    }
};

