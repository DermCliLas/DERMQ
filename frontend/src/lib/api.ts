import type { ServiceCategory, ServiceSubItem, Doctor, TimeSlot } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Attach token if running in the browser
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all available services, properly typings mapped to frontend expectation
 */
export async function getServices() {
  return fetchFromApi<{ data: any[], meta: any }>('/services?active=true&limit=100');
}

/**
 * Fetch all products
 */
export async function getProducts(): Promise<any[]> {
  const res = await fetchFromApi<{ data: any[], meta: any }>('/products?active=true&limit=100');
  // Return the data array
  return Array.isArray(res) ? res : res.data || [];
}

/**
 * Fetch all doctors
 */
export async function getDoctors(): Promise<Doctor[]> {
  return fetchFromApi<Doctor[]>('/users/doctors');
}

/**
 * Fetch available time slots for a specific doctor on a specific date
 */
export async function getAvailableSlots(doctorId: string, date: string): Promise<{ slots: any[] }> {
  return fetchFromApi<{ slots: any[] }>(`/appointments/available-slots/${doctorId}?date=${date}`);
}

/**
 * Create a new appointment
 */
export async function createAppointment(appointmentData: any): Promise<any> {
  return fetchFromApi<any>('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
}

export async function createGuestAppointment(appointmentData: any): Promise<any> {
  return fetchFromApi<any>('/appointments/guest', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
}

// ─── AUTHENTICATION ENDPOINTS ───────────────────────────────────────────────

export async function loginUser(credentials: any): Promise<{ access_token: string, user: any }> {
  return fetchFromApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function registerUser(userData: any): Promise<{ access_token: string, user: any }> {
  return fetchFromApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...userData, role: 'PATIENT' }),
  });
}

export async function getAuthProfile(): Promise<any> {
  return fetchFromApi('/auth/profile');
}

// ─── ORDERS / CHECKOUT ───────────────────────────────────────────────────────

export interface OrderPayload {
  items: { productId: string; quantity: number }[];
  paymentMethod: 'CREDIT_CARD' | 'YAPE' | 'PLIN' | 'CASH' | 'TRANSFER';
  documentType?: 'BOLETA' | 'FACTURA';
  source?: 'WEB' | 'POS';
}

export async function createOrder(orderData: OrderPayload): Promise<any> {
  return fetchFromApi('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export async function getMyOrders(): Promise<any[]> {
  return fetchFromApi('/orders/my-orders');
}

// ─── SERVICES & DASHBOARD ──────────────────────────────────────────────────

export async function getServicesCatalog(): Promise<any[]> {
  return fetchFromApi('/services/full-catalog');
}

export async function getPatientDashboard(): Promise<any> {
  return fetchFromApi('/users/patient-dashboard');
}

// ─── MEDICAL RECORDS ───────────────────────────────────────────────────────

export async function searchPatientByDni(dni: string): Promise<any> {
  return fetchFromApi(`/medical-records/search-patient/${dni}`);
}

export async function getMedicalHistory(patientId: string): Promise<any[]> {
  return fetchFromApi(`/medical-records/patient/${patientId}`);
}

export async function createMedicalRecord(data: any): Promise<any> {
  return fetchFromApi('/medical-records', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── RECEPTION / MASTER AGENDA ──────────────────────────────────────────────

export async function getBranches(): Promise<any[]> {
  return fetchFromApi('/branches');
}

export async function getAppointments(filters: any): Promise<any> {
  const query = new URLSearchParams(filters).toString();
  return fetchFromApi(`/appointments?${query}`);
}

export async function updateAppointmentStatus(id: string, status: string): Promise<any> {
  return fetchFromApi(`/appointments/${id}/status/${status}`, {
    method: 'PATCH',
  });
}
