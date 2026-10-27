import { CartItem, WhatsAppOrder, OrderStatus, Product } from '../types.ts';

const STORAGE_KEY = 'kas_store_cart_v1';
const WISHLIST_KEY = 'kas_store_wishlist_v1';
const ORDERS_KEY = 'kas_store_orders_crm_v1';
const CUSTOM_PRODUCTS_KEY = 'kas_store_custom_products_cms_v1';

export interface CartStorageService {
  loadCart: () => CartItem[];
  saveCart: (items: CartItem[]) => void;
  clearCart: () => void;
  loadWishlist: () => string[];
  saveWishlist: (productIds: string[]) => void;
  // CRM / WhatsApp Orders
  loadOrders: () => WhatsAppOrder[];
  saveOrder: (order: WhatsAppOrder) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  clearOrders: () => void;
  // CMS Custom Products
  loadCustomProducts: () => Product[];
  saveCustomProduct: (product: Product) => void;
  deleteCustomProduct: (productId: string) => void;
}

export const cartStorage: CartStorageService = {
  loadCart: (): CartItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('No se pudo cargar el carrito de localStorage:', e);
      return [];
    }
  },

  saveCart: (items: CartItem[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('No se pudo guardar el carrito en localStorage:', e);
    }
  },

  clearCart: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('No se pudo limpiar el carrito en localStorage:', e);
    }
  },

  loadWishlist: (): string[] => {
    try {
      const data = localStorage.getItem(WISHLIST_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveWishlist: (productIds: string[]): void => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(productIds));
    } catch {
      // ignore
    }
  },

  // ==========================================
  // CRM: PEDIDOS WHATSAPP EN LOCALSTORAGE
  // ==========================================
  loadOrders: (): WhatsAppOrder[] => {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Error al cargar pedidos del CRM:', e);
      return [];
    }
  },

  saveOrder: (order: WhatsAppOrder): void => {
    try {
      const current = cartStorage.loadOrders();
      // Prepend newest order
      const updated = [order, ...current.filter((o) => o.id !== order.id)];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error al guardar pedido en CRM:', e);
    }
  },

  updateOrderStatus: (orderId: string, status: OrderStatus): void => {
    try {
      const current = cartStorage.loadOrders();
      const updated = current.map((order) =>
        order.id === orderId ? { ...order, status } : order
      );
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error al actualizar estado del pedido:', e);
    }
  },

  clearOrders: (): void => {
    try {
      localStorage.removeItem(ORDERS_KEY);
    } catch (e) {
      console.warn('Error al limpiar pedidos:', e);
    }
  },

  // ==========================================
  // CMS: PRODUCTOS EDITADOS/AGREGADOS
  // ==========================================
  loadCustomProducts: (): Product[] => {
    try {
      const data = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Error al cargar productos personalizados CMS:', e);
      return [];
    }
  },

  saveCustomProduct: (product: Product): void => {
    try {
      const current = cartStorage.loadCustomProducts();
      const existingIdx = current.findIndex((p) => p.id === product.id);
      let updated: Product[];
      if (existingIdx >= 0) {
        updated = [...current];
        updated[existingIdx] = product;
      } else {
        updated = [product, ...current];
      }
      localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error al guardar producto CMS:', e);
    }
  },

  deleteCustomProduct: (productId: string): void => {
    try {
      const current = cartStorage.loadCustomProducts();
      const updated = current.filter((p) => p.id !== productId);
      localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error al eliminar producto CMS:', e);
    }
  },
};
