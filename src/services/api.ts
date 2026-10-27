import { Product, WhatsAppOrder, OrderStatus } from '../types.ts';
import {
  MOCK_PRODUCTS,
  HERO_IMAGE,
  MEN_DENIM_IMAGE,
  WOMEN_DENIM_IMAGE,
  KIDS_DENIM_IMAGE,
  STACK_DENIM_IMAGE,
} from '../data/mockProducts.ts';
import { cartStorage } from './cartStorage.ts';

export interface StoreConfig {
  name: string;
  tagline?: string;
  location: string;
  phone: string;
  whatsapp: string;
  email: string;
  announcement: string;
  freeShippingThresholdHnl: number;
}

export interface HomeHeroConfig {
  tagline: string;
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  heroImage: string;
  ctaButtonText: string;
}

export interface HomeCategoriesConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  menTitle: string;
  menSubtitle: string;
  menImage: string;
  womenTitle: string;
  womenSubtitle: string;
  womenImage: string;
  kidsBoyTitle: string;
  kidsBoySubtitle: string;
  kidsBoyImage: string;
  kidsGirlTitle: string;
  kidsGirlSubtitle: string;
  kidsGirlImage: string;
}

export interface HomeEditorialConfig {
  badge: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  image: string;
}

export interface HomeFaqItem {
  q: string;
  a: string;
}

export interface HomeConfig {
  hero: HomeHeroConfig;
  categories: HomeCategoriesConfig;
  editorial: HomeEditorialConfig;
  faqs: HomeFaqItem[];
}

export interface AppConfig {
  store: StoreConfig;
  home: HomeConfig;
  products: Product[];
}

export interface CouponValidationResult {
  valid: boolean;
  code?: string;
  discountPercent?: number;
  discountAmountHnl?: number;
  message?: string;
}

export const DEFAULT_HOME_CONFIG: HomeConfig = {
  hero: {
    tagline: 'Tienda de Mezclilla · La Masica, Atlántida',
    badgeText: 'Especialistas en Mezclilla · La Masica',
    titleLine1: 'Tu estilo,',
    titleLine2: 'tu esencia.',
    description:
      'Encuentra el pantalón de mezclilla ideal para cada ocasión. Jeans nuevos seleccionados en múltiples tonalidades (índigo profundo, celeste vintage, azul medio, negro permanente y crudo) y cortes precisos para hombre, mujer, niño y niña.',
    heroImage: HERO_IMAGE,
    ctaButtonText: 'Comprar colección',
  },
  categories: {
    sectionTitle: 'Explora por Categoría',
    sectionSubtitle: 'Mezclilla para Toda la Familia',
    menTitle: 'Jeans Hombre',
    menSubtitle: 'Rectos, Slim Fit, Cargo & Selvedge',
    menImage: MEN_DENIM_IMAGE,
    womenTitle: 'Jeans Mujer',
    womenSubtitle: 'Wide-Leg, Mom Fit, Flare & Skinny',
    womenImage: WOMEN_DENIM_IMAGE,
    kidsBoyTitle: 'Jeans Niño',
    kidsBoySubtitle: 'Rodillas reforzadas & cintura elástica',
    kidsBoyImage: KIDS_DENIM_IMAGE,
    kidsGirlTitle: 'Jeans Niña',
    kidsGirlSubtitle: 'Wide leg suave, bordados & stretch',
    kidsGirlImage: '/images/catalogo/niñas/model_kids_jeans_1792801035749.jpg',
  },
  editorial: {
    badge: 'Herencia y Confección KAS Store',
    title: 'Auténtica mezclilla seleccionada para durar',
    paragraph1:
      'Cada pieza en KAS Store pasa por una rigurosa curaduría de mezclilla. Priorizamos telas de hilado continuo y pesos equilibrados que resisten el uso rudo y mantienen la intensidad de sus tintes lavada tras lavada.',
    paragraph2:
      'Desde nuestro centro de operaciones en La Masica, Atlántida, enviamos a todo el territorio nacional con asesoría personalizada de medidas en centímetros para que recibas tu talla exacta sin complicaciones.',
    image: STACK_DENIM_IMAGE,
  },
  faqs: [
    {
      q: '¿Qué tonalidades de mezclilla manejan en KAS Store?',
      a: 'Trabajamos una amplia variedad de tonalidades de denim: desde índigo profundo clásico y raw selvedge, hasta azul medio stone-wash, celeste hielo vintage, negro permanente stay-black y denim crudo arena ecru.',
    },
    {
      q: '¿Tienen pantalones de mezclilla para niños y niñas?',
      a: 'Sí, contamos con una línea completa de jeans para niño y niña con costuras reforzadas, rodilleras de alta resistencia y pretina elástica con botones ajustables que acompañan su crecimiento.',
    },
    {
      q: '¿Cómo realizan los envíos a los departamentos de Honduras?',
      a: 'Despachamos desde La Masica, Atlántida a través de transporte y paquetería confiable a los 18 departamentos de Honduras (Cortés, Francisco Morazán, Yoro, Colón, Copán, etc.). Con entrega estimada de 24 a 48 horas hábiles.',
    },
    {
      q: '¿Cómo sé cuál es mi talla exacta de jeans?',
      a: 'Disponemos de una guía interactiva de tallas con medidas en centímetros para hombre, mujer, niño y niña. Además puedes escribirnos a nuestro WhatsApp (+504 3305-6175) y te asesoramos personalmente antes de despachar.',
    },
    {
      q: '¿Cuáles métodos de pago aceptan?',
      a: 'Coordinamos pagos directos y transparentes por WhatsApp: transferencias bancarias locales en Honduras (BAC, Atlántida, Ficohsa, Banpaís, Banhcafé) o pago contra entrega según la cobertura de paquetería en tu municipio.',
    },
  ],
};

const DEFAULT_CONFIG: AppConfig = {
  store: {
    name: 'KAS Store',
    tagline: 'Especialistas en Mezclilla & Denim',
    location: 'La Masica, Atlántida, Honduras',
    phone: '+504 3305-6175',
    whatsapp: '50433056175',
    email: 'k-andradesantos@gmail.com',
    announcement: 'Envíos a toda Honduras · Envío gratis en compras mayores a L 1,500',
    freeShippingThresholdHnl: 1500,
  },
  home: DEFAULT_HOME_CONFIG,
  products: MOCK_PRODUCTS,
};

let cachedConfig: AppConfig | null = null;

export const api = {
  /**
   * Obtiene la configuración global, textos/imágenes de la home y catálogo desde public/config.json
   */
  getConfig: async (): Promise<AppConfig> => {
    if (cachedConfig) return cachedConfig;

    try {
      // 1. Intentar cargar del localStorage (si el admin aplicó cambios locales)
      const localCustom = localStorage.getItem('kas_store_config_json_v1');
      if (localCustom) {
        const parsed = JSON.parse(localCustom);
        if (parsed && Array.isArray(parsed.products)) {
          // Fusionar con defaults si falta alguna clave
          const merged: AppConfig = {
            store: { ...DEFAULT_CONFIG.store, ...(parsed.store || {}) },
            home: {
              hero: { ...DEFAULT_HOME_CONFIG.hero, ...(parsed.home?.hero || {}) },
              categories: { ...DEFAULT_HOME_CONFIG.categories, ...(parsed.home?.categories || {}) },
              editorial: { ...DEFAULT_HOME_CONFIG.editorial, ...(parsed.home?.editorial || {}) },
              faqs: parsed.home?.faqs || DEFAULT_HOME_CONFIG.faqs,
            },
            products: parsed.products,
          };
          cachedConfig = merged;
          return merged;
        }
      }

      // 2. Intentar cargar desde public/config.json
      const res = await fetch('/config.json', { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.products)) {
          const merged: AppConfig = {
            store: { ...DEFAULT_CONFIG.store, ...(data.store || {}) },
            home: {
              hero: { ...DEFAULT_HOME_CONFIG.hero, ...(data.home?.hero || {}) },
              categories: { ...DEFAULT_HOME_CONFIG.categories, ...(data.home?.categories || {}) },
              editorial: { ...DEFAULT_HOME_CONFIG.editorial, ...(data.home?.editorial || {}) },
              faqs: data.home?.faqs || DEFAULT_HOME_CONFIG.faqs,
            },
            products: data.products,
          };
          cachedConfig = merged;
          return merged;
        }
      }
    } catch (e) {
      console.warn('Cargando configuración predeterminada de KAS Store:', e);
    }

    cachedConfig = DEFAULT_CONFIG;
    return DEFAULT_CONFIG;
  },

  /**
   * Guarda la configuración y productos en el almacenamiento local para previsualización inmediata
   */
  saveConfigLocally: (config: AppConfig): void => {
    cachedConfig = config;
    try {
      localStorage.setItem('kas_store_config_json_v1', JSON.stringify(config));
    } catch (e) {
      console.warn('Error guardando config localmente:', e);
    }
  },

  /**
   * Obtiene todos los productos del catálogo
   */
  getProducts: async (): Promise<Product[]> => {
    try {
      const config = await api.getConfig();
      const customProducts = cartStorage.loadCustomProducts();
      const customIds = new Set(customProducts.map((p) => p.id));
      const baseFiltered = config.products.filter((p) => !customIds.has(p.id));
      return [...customProducts, ...baseFiltered];
    } catch {
      return MOCK_PRODUCTS;
    }
  },

  /**
   * Obtiene un producto individual por ID
   */
  getProduct: async (id: string): Promise<Product | undefined> => {
    const all = await api.getProducts();
    return all.find((p) => p.id === id);
  },

  /**
   * Validador de cupones promocionales de KAS Store
   */
  validateCoupon: async (code: string, subtotalHnl: number): Promise<CouponValidationResult> => {
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      return { valid: false, message: 'Ingresa un código de cupón.' };
    }

    if (cleanCode === 'KAS10' || cleanCode === 'KASMEZCLILLA10') {
      const discount = Math.round(subtotalHnl * 0.10);
      return {
        valid: true,
        code: cleanCode,
        discountPercent: 10,
        discountAmountHnl: discount,
        message: '¡Cupón KAS10 aplicado! 10% de descuento en tu mezclilla.',
      };
    }

    if (cleanCode === 'LAMASICA') {
      return {
        valid: true,
        code: cleanCode,
        discountAmountHnl: 80,
        message: '¡Cupón La Masica aplicado! L 80 de descuento en tu orden.',
      };
    }

    if (cleanCode === 'HONDURASDENIM') {
      const discount = Math.round(subtotalHnl * 0.15);
      return {
        valid: true,
        code: cleanCode,
        discountPercent: 15,
        discountAmountHnl: discount,
        message: '¡Cupón especial HONDURASDENIM! 15% de descuento.',
      };
    }

    return {
      valid: false,
      message: 'Código de cupón inválido o expirado.',
    };
  },

  /**
   * CRM: Carga pedidos guardados para el usuario actual o panel administrativo
   */
  getUserOrders: async (): Promise<WhatsAppOrder[]> => {
    return cartStorage.loadOrders();
  },

  getAdminOrders: async (): Promise<WhatsAppOrder[]> => {
    return cartStorage.loadOrders();
  },

  updateOrderStatus: async (
    orderId: string,
    status: OrderStatus
  ): Promise<boolean> => {
    cartStorage.updateOrderStatus(orderId, status);
    return true;
  },

  /**
   * CMS: Guardar producto
   */
  saveProduct: async (product: Product): Promise<Product> => {
    cartStorage.saveCustomProduct(product);
    return product;
  },

  deleteProduct: async (productId: string): Promise<boolean> => {
    cartStorage.deleteCustomProduct(productId);
    return true;
  },

  uploadImage: async (base64Data: string): Promise<string> => {
    return base64Data;
  },
};
