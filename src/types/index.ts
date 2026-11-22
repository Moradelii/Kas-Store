export interface ProductVariant {
  size: string;
  stock: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export type JeanStyle =
  | 'Jean Skinny'
  | 'Jean Slim'
  | 'Jean Straight (Recto)'
  | 'Jean Tapered / Athletic'
  | 'Jean Relaxed / Loose';

export const OFFICIAL_JEAN_STYLES: JeanStyle[] = [
  'Jean Skinny',
  'Jean Slim',
  'Jean Straight (Recto)',
  'Jean Tapered / Athletic',
  'Jean Relaxed / Loose'
];

export const OFFICIAL_JEAN_COLORS: { name: string; hex: string }[] = [
  { name: 'Azul Índigo o Raw Denim', hex: '#1B263B' },
  { name: 'Azul Medio', hex: '#2B4C6F' },
  { name: 'Azul Claro', hex: '#6A8CA8' },
  { name: 'Negro Absoluto', hex: '#111111' },
  { name: 'Gris Oscuro / Antracita', hex: '#2C2D30' },
  { name: 'Gris Claro', hex: '#A8ACB0' },
  { name: 'Blanco / Off-White', hex: '#EDECE8' },
  { name: 'Beige / Khaki', hex: '#C2B29A' },
  { name: 'Verde Oliva / Militar', hex: '#4B533E' }
];

export type GenderCategory = 'hombre' | 'mujer' | 'unisex';
export type ClothingCategory = 'jeans' | 'camisetas';
export type Brand = 'Pepe' | "Levi's" | 'Tommy' | 'KAS' | string;

export const OFFICIAL_BRANDS: Brand[] = ['Pepe', "Levi's", 'Tommy', 'KAS'];
export const OFFICIAL_GENDERS: { id: GenderCategory; label: string }[] = [
  { id: 'hombre', label: 'Hombre' },
  { id: 'mujer', label: 'Mujer' }
];

export interface Product {
  id: string;
  name: string;
  category: 'jeans' | 'camisetas';
  gender?: GenderCategory;
  brand?: Brand;
  fitStyle?: JeanStyle | string;
  description: string;
  details: string[];
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  colors: ProductColor[];
  tag?: 'NUEVO' | 'DESTACADO' | 'MÁS VENDIDO' | null;
  featured: boolean;
  active: boolean;
  variants: ProductVariant[];
  totalStock: number;
  createdAt: string;
}

export interface SizeGuideRow {
  size: string;
  [key: string]: string;
}

export interface SizeGuideTable {
  title: string;
  columns: { key: string; label: string }[];
  rows: SizeGuideRow[];
  tips?: string[];
}

export interface CategoryBannerItem {
  title: string;
  subtitle: string;
  image: string;
  brands: string;
}

export interface StoreContent {
  announcement: {
    enabled: boolean;
    text: string;
  };
  hero: {
    tagline: string;
    title: string;
    subtitle: string;
    primaryBtnText: string;
    secondaryBtnText: string;
    imageUrl: string;
  };
  categories: {
    jeansTitle?: string;
    jeansSubtitle?: string;
    jeansImage?: string;
    camisetasTitle?: string;
    camisetasSubtitle?: string;
    camisetasImage?: string;
    jeansHombre: CategoryBannerItem;
    jeansMujer: CategoryBannerItem;
    camisetasHombre: CategoryBannerItem;
    camisetasMujer: CategoryBannerItem;
  };
  featuredSection: {
    badge: string;
    title: string;
    subtitle: string;
  };
  benefits: {
    b1Title: string;
    b1Desc: string;
    b2Title: string;
    b2Desc: string;
    b3Title: string;
    b3Desc: string;
  };
  storeInfo: {
    name: string;
    legalName: string;
    category: string;
    location: string;
    address: string;
    phone: string;
    whatsapp: string;
    whatsappRaw: string;
    email: string;
    currencySymbol: string;
    currencyCode: string;
    social: {
      facebook: string;
      instagram: string;
      tiktok: string;
    };
  };
  sizeGuides: {
    jeans: SizeGuideTable;
    camisetas: SizeGuideTable;
  };
  legal: {
    privacyPolicy: string;
    termsOfService: string;
  };
}

export interface CartItem {
  id: string; // product id + size + color
  productId: string;
  name: string;
  category: 'jeans' | 'camisetas';
  gender?: GenderCategory;
  brand?: Brand;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
  maxStock: number;
}

export interface CustomerOrderData {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: CartItem[];
  total: number;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: {
    productId: string;
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'nuevo' | 'contactado' | 'enviado' | 'completado' | 'cancelado';
}
