import type { ServiceCategory, ServiceSubItem, Doctor, TimeSlot } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

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

  const result = await response.json();
  if (result && typeof result === 'object' && result.hasOwnProperty('success') && result.hasOwnProperty('data')) {
    return result.data;
  }
  return result;
}

/**
 * Fetch all available services, properly typings mapped to frontend expectation
 */
export async function getServices() {
  const res = await fetchFromApi<any>('/services?active=true&limit=250');
  if (res && res.success && res.data) {
    return Array.isArray(res.data.data) ? res.data.data : res.data;
  }
  if (res && Array.isArray(res.data)) {
    return res.data;
  }
  return res;
}

/**
 * Fetch all products
 */
export async function getProducts(): Promise<any[]> {
  const res = await fetchFromApi<any>('/products?active=true&limit=250');
  if (res && res.success && res.data) {
    return Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
  }
  if (res && res.data) {
    return Array.isArray(res.data) ? res.data : (Array.isArray(res.data.data) ? res.data.data : []);
  }
  return Array.isArray(res) ? res : [];
}

/**
 * Fetch all doctors
 */
export async function getDoctors(): Promise<Doctor[]> {
  const res = await fetchFromApi<any>('/users/doctors');
  if (res && res.success && res.data) {
    return Array.isArray(res.data) ? res.data : (res.data.data || []);
  }
  return Array.isArray(res) ? res : (res as any).data || [];
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
  krAnswer?: string;
  krHash?: string;
}

export async function createOrder(orderData: OrderPayload): Promise<any> {
  return fetchFromApi('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export async function generateIzipayToken(
  amount: number,
  email?: string,
  orderId?: string,
): Promise<{ formToken: string }> {
  return fetchFromApi('/payments/izipay/token', {
    method: 'POST',
    body: JSON.stringify({ amount, email, orderId }),
  });
}

export async function getMyOrders(): Promise<any[]> {
  const res = await fetchFromApi<any>('/orders/my-orders');
  if (res && res.success && res.data) {
    return Array.isArray(res.data) ? res.data : (res.data.data || []);
  }
  return Array.isArray(res) ? res : (res as any).data || [];
}

// ─── SERVICES & DASHBOARD ──────────────────────────────────────────────────

export async function getServicesCatalog(): Promise<any[]> {
  const res = await fetchFromApi<any>('/services/full-catalog');
  if (res && res.success && res.data) {
    return Array.isArray(res.data) ? res.data : (res.data.data || []);
  }
  return Array.isArray(res) ? res : (res as any).data || [];
}

export async function getPatientDashboard(): Promise<any> {
  const res = await fetchFromApi<any>('/users/patient-dashboard');
  if (res && res.success && res.data) {
    return res.data;
  }
  return res;
}

// ─── MEDICAL RECORDS ───────────────────────────────────────────────────────

export async function searchPatientByDni(dni: string): Promise<any> {
  const res = await fetchFromApi<any>(`/medical-records/search-patient/${dni}`);
  if (res && res.success && res.data) {
    return res.data;
  }
  return res;
}

export async function getMedicalHistory(patientId: string): Promise<any[]> {
  const res = await fetchFromApi<any>(`/medical-records/patient/${patientId}`);
  if (res && res.success && res.data) {
    return Array.isArray(res.data) ? res.data : (res.data.data || []);
  }
  return Array.isArray(res) ? res : (res as any).data || [];
}

export async function createMedicalRecord(data: any): Promise<any> {
  return fetchFromApi('/medical-records', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── RECEPTION / MASTER AGENDA ──────────────────────────────────────────────

export async function getBranches(): Promise<any[]> {
  const res = await fetchFromApi<any>('/branches');
  if (res && res.success && res.data) {
    return Array.isArray(res.data) ? res.data : (res.data.data || []);
  }
  return Array.isArray(res) ? res : (res as any).data || [];
}

export async function getAppointments(filters: any): Promise<any> {
  const query = new URLSearchParams(filters).toString();
  const res = await fetchFromApi<any>(`/appointments?${query}`);
  if (res && res.success && res.data) {
    return res.data;
  }
  return res;
}

export async function updateAppointmentStatus(id: string, status: string): Promise<any> {
  return fetchFromApi(`/appointments/${id}/status/${status}`, {
    method: 'PATCH',
  });
}

// ─── ADMIN PRODUCTS CRUD & ORDERS ──────────────────────────────────────────

export async function createProduct(productData: any): Promise<any> {
  return fetchFromApi('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

export async function updateProduct(id: string, productData: any): Promise<any> {
  return fetchFromApi(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(productData),
  });
}

export async function updateProductStock(id: string, quantity: number, operation: 'add' | 'subtract'): Promise<any> {
  return fetchFromApi(`/products/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity, operation }),
  });
}

export async function deleteProduct(id: string): Promise<any> {
  return fetchFromApi(`/products/${id}`, {
    method: 'DELETE',
  });
}

export async function getAllOrders(): Promise<any[]> {
  const res = await fetchFromApi<any>('/orders');
  if (res && res.success && res.data) {
    return Array.isArray(res.data) ? res.data : (res.data.data || []);
  }
  return Array.isArray(res) ? res : (res as any).data || [];
}

export async function uploadFile(file: File): Promise<{ url: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/storage/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Upload Error: ${response.status}`);
  }

  return response.json();
}

export async function getPatientProfile(patientId: string): Promise<any> {
  const res = await fetchFromApi<any>(`/users/${patientId}`);
  if (res && res.success && res.data) {
    return res.data;
  }
  return res;
}

export async function searchPatients(query: string): Promise<any[]> {
  const res = await fetchFromApi<any>(`/medical-records/search?query=${encodeURIComponent(query)}`);
  if (res && res.success && res.data) {
    return Array.isArray(res.data) ? res.data : [];
  }
  return Array.isArray(res) ? res : [];
}

export async function cancelOrder(orderId: string, reason: string): Promise<any> {
  return fetchFromApi(`/orders/${orderId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

// ─── CMS SITE CONTENT ──────────────────────────────────────────────────────

export async function getAllSiteContent(): Promise<any[]> {
  const res = await fetchFromApi<any>('/site-content');
  if (res && res.success && res.data) {
    return Array.isArray(res.data) ? res.data : [];
  }
  return Array.isArray(res) ? res : [];
}

export async function getSiteContent(section: string): Promise<any> {
  try {
    const res = await fetchFromApi<any>(`/site-content/${section}`);
    if (res && res.success && res.data) {
      return res.data;
    }
    return res;
  } catch {
    return null;
  }
}

export async function updateSiteContent(section: string, data: any): Promise<any> {
  return fetchFromApi(`/site-content/${section}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
}

