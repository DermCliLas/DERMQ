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
    let msg = errorData.message || `API Error: ${response.status} ${response.statusText}`;
    if (errorData.errors && typeof errorData.errors === 'object') {
      const details = Object.entries(errorData.errors)
        .map(([field, errs]: [string, any]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
        .join(' | ');
      if (details) {
        msg = `${msg} (${details})`;
      }
    }
    throw new Error(msg);
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

export interface ProductsPaginatedParams {
  page?: number;
  limit?: number;
  sort?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'stock_asc';
  search?: string;
  category?: string;
  active?: boolean;
}

export interface ProductsPaginatedResponse {
  data: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Fetch products with server-side pagination, price sorting, and search
 */
export async function getProductsPaginated(
  params: ProductsPaginatedParams = {},
): Promise<ProductsPaginatedResponse> {
  const query = new URLSearchParams();
  if (params.active !== undefined) query.set('active', String(params.active));
  query.set('page', String(params.page || 1));
  query.set('limit', String(params.limit || 12));
  if (params.sort) query.set('sort', params.sort);
  if (params.search && params.search.trim()) query.set('search', params.search.trim());
  if (params.category) query.set('category', params.category);

  const res = await fetchFromApi<any>(`/products?${query.toString()}`);
  const payload = res?.data && res?.meta ? res : res?.data || res;
  const list = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];
  const meta = payload?.meta || {
    total: list.length,
    page: params.page || 1,
    limit: params.limit || 12,
    totalPages: Math.max(1, Math.ceil(list.length / (params.limit || 12))),
  };
  return { data: list, meta };
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
  customerDocType?: string;
  customerDocNumber?: string;
  customerLegalName?: string;
  customerAddress?: string;
}

export async function createOrder(orderData: OrderPayload): Promise<any> {
  return fetchFromApi('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export async function generateIzipayToken(
  orderId: string,
): Promise<{ formToken: string; orderId: string; amount: number; currency: string }> {
  return fetchFromApi('/payments/izipay/token', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
}

export async function confirmIzipayPayment(
  orderId: string,
  krAnswer: any,
  krHash: string,
): Promise<any> {
  return fetchFromApi('/payments/izipay/confirm', {
    method: 'POST',
    body: JSON.stringify({ orderId, krAnswer, krHash }),
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

export async function getAdminDashboardSummary(): Promise<any> {
  return fetchFromApi<any>('/orders/admin-summary');
}

/**
 * Compresses images in the browser to WebP (max 1200px, quality 0.82) before uploading
 * to protect Supabase Free Tier storage (1GB) and monthly egress (5GB) quotas.
 */
export async function compressImageFile(
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.82,
): Promise<File> {
  if (
    typeof window === 'undefined' ||
    !file.type.startsWith('image/') ||
    file.type === 'image/gif'
  ) {
    return file;
  }

  return new Promise<File>((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }
          const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
          const compressedFile = new File([blob], `${baseName}.webp`, {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        'image/webp',
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export async function uploadFile(file: File): Promise<{ url: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const optimizedFile = await compressImageFile(file);
  const formData = new FormData();
  formData.append('file', optimizedFile);

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

  const resJson = await response.json();
  const url = resJson?.data?.url || resJson?.url || (typeof resJson === 'string' ? resJson : '');
  return { url };
}

/**
 * Uploads confidential clinical photos/PDFs to the strictly private clinical bucket
 */
export async function uploadClinicalFile(
  file: File,
  patientId: string,
): Promise<{ path: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const optimizedFile = await compressImageFile(file, 1400, 0.85);
  const formData = new FormData();
  formData.append('file', optimizedFile);
  formData.append('patientId', patientId);

  const response = await fetch(`${API_BASE_URL}/storage/clinical-upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Clinical Upload Error: ${response.status}`);
  }

  const resJson = await response.json();
  const path = resJson?.data?.path || resJson?.path || '';
  return { path };
}

const signedUrlCache = new Map<string, { url: string; expiresAt: number }>();

/**
 * Resolves a private clinical path ('clinical/...') to a temporary signed URL,
 * or returns legacy public URLs ('https://...') directly.
 */
export async function resolveClinicalAttachmentUrl(pathOrUrl: string): Promise<string> {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  const cached = signedUrlCache.get(pathOrUrl);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  const res = await fetchFromApi<any>(
    `/storage/clinical-signed-url?path=${encodeURIComponent(pathOrUrl)}`,
  );
  const signedUrl = res?.signedUrl || res?.data?.signedUrl || '';
  if (signedUrl) {
    signedUrlCache.set(pathOrUrl, {
      url: signedUrl,
      expiresAt: Date.now() + 50 * 60 * 1000, // Cache for 50 mins (signed URL valid for 60 mins)
    });
  }
  return signedUrl;
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

