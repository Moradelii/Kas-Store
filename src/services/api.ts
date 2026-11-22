import { Product, StoreContent, OrderRecord, CustomerOrderData } from '../types/index.ts';
import { INITIAL_PRODUCTS, INITIAL_CONTENT } from '../data/initialData.ts';

const ADMIN_TOKEN_KEY = 'kas_admin_session_token';
const memoryStorage: Record<string, string> = {};

export function getAdminToken(): string | null {
  try {
    return typeof window !== 'undefined' && window.localStorage
      ? window.localStorage.getItem(ADMIN_TOKEN_KEY)
      : memoryStorage[ADMIN_TOKEN_KEY] || null;
  } catch {
    return memoryStorage[ADMIN_TOKEN_KEY] || null;
  }
}

export function setAdminToken(token: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      memoryStorage[ADMIN_TOKEN_KEY] = token;
    }
  } catch {
    memoryStorage[ADMIN_TOKEN_KEY] = token;
  }
}

export function removeAdminToken(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch {}
  delete memoryStorage[ADMIN_TOKEN_KEY];
}

function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

function isJsonResponse(res: Response): boolean {
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json');
}

export async function fetchProducts(showAll = false): Promise<Product[]> {
  try {
    const res = await fetch(`/api/products?all=${showAll}`);
    if (!res.ok || !isJsonResponse(res)) throw new Error('Error al cargar productos del servidor');
    return await res.json();
  } catch (err) {
    console.warn('Usando productos locales por contingencia:', err);
    return showAll ? INITIAL_PRODUCTS : INITIAL_PRODUCTS.filter(p => p.active);
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok || !isJsonResponse(res)) return null;
    return await res.json();
  } catch (err) {
    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  }
}

export async function fetchStoreContent(): Promise<StoreContent> {
  try {
    const res = await fetch('/api/content');
    if (!res.ok || !isJsonResponse(res)) throw new Error('Error al cargar contenido');
    return await res.json();
  } catch (err) {
    console.warn('Usando contenido local por contingencia:', err);
    return INITIAL_CONTENT;
  }
}

export async function submitOrderToBackend(order: CustomerOrderData): Promise<{ success: boolean; orderId?: string }> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!res.ok || !isJsonResponse(res)) throw new Error('Error registrando orden');
    return await res.json();
  } catch (err) {
    console.warn('Registro local de orden:', err);
    return { success: true, orderId: `ORD-LOCAL-${Date.now().toString().slice(-4)}` };
  }
}

// Admin API
export async function adminLogin(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!isJsonResponse(res)) {
      return {
        success: false,
        error: 'El backend administrativo (/api) no está disponible en hosting estático.'
      };
    }
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Error al iniciar sesión' };
    }
    setAdminToken(data.token);
    return { success: true, token: data.token };
  } catch (err: any) {
    return { success: false, error: 'No se pudo conectar con el servidor administrativo' };
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/admin/verify', {
      headers: getAuthHeaders()
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: getAuthHeaders()
    });
  } finally {
    removeAdminToken();
  }
}

export async function fetchAdminDashboard(): Promise<any> {
  const res = await fetch('/api/admin/dashboard', {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('No autorizado');
  return await res.json();
}

export async function fetchAdminOrders(): Promise<OrderRecord[]> {
  const res = await fetch('/api/admin/orders', {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('No autorizado');
  return await res.json();
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  const res = await fetch(`/api/admin/orders/${orderId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  return res.ok;
}

export async function saveProduct(product: Partial<Product>, isEdit = false): Promise<Product> {
  const url = isEdit ? `/api/admin/products/${product.id}` : '/api/admin/products';
  const method = isEdit ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(product)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al guardar producto');
  }
  return await res.json();
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const res = await fetch(`/api/admin/products/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return res.ok;
}

export async function updateStoreContent(content: Partial<StoreContent>): Promise<boolean> {
  const res = await fetch('/api/admin/content', {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(content)
  });
  return res.ok;
}

export async function updateStoreSettings(payload: any): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Error al actualizar configuración' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function uploadImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            data: base64Data,
            filename: file.name
          })
        });
        const data = await res.json();
        if (data.url) {
          resolve(data.url);
        } else {
          // Fallback to data URI if server upload fails
          resolve(base64Data);
        }
      } catch (e) {
        resolve(reader.result as string);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function downloadDatabaseBackup(): void {
  const token = getAdminToken();
  const url = '/api/admin/backup';
  fetch(url, { headers: getAuthHeaders() })
    .then(res => res.blob())
    .then(blob => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `kas_store_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
}

export async function restoreDatabaseBackup(jsonData: any): Promise<boolean> {
  const res = await fetch('/api/admin/restore', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(jsonData)
  });
  return res.ok;
}
