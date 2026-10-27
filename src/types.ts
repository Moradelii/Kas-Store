export type ProductCategory =
  | 'jeans-hombre'
  | 'jeans-mujer'
  | 'jeans-nino'
  | 'jeans-nina'
  | 'slim-fit'
  | 'rectos'
  | 'skinny'
  | 'wide-leg'
  | 'cargo-denim'
  | 'mom-fit'
  | 'flare-denim'
  | 'jogger-denim';

export type Gender = 'hombre' | 'mujer' | 'nino' | 'nina' | 'unisex';

export interface ProductColor {
  name: string;
  hex: string;
  washTone: string; // Tonalidad de mezclilla
}

export interface ProductVariantStock {
  size: string;
  colorName: string;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  priceHnl: number;
  originalPriceHnl?: number;
  category: ProductCategory;
  categoryLabel: string;
  gender: Gender;
  fitType: string;
  denimWash: string; // Tonalidad de mezclilla
  images: string[];
  availableSizes: string[];
  availableColors: ProductColor[];
  variantStock?: ProductVariantStock[];
  isNew?: boolean;
  isFeatured?: boolean;
  isSale?: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  fabricComposition: string;
  careInstructions: string;
}

export interface CartItem {
  id: string; // `${productId}-${selectedSize}-${selectedColor}`
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface HondurasDepartment {
  name: string;
  municipios: string[];
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email?: string;
  departamento: string;
  municipio: string;
  address: string;
  deliveryNotes?: string;
  paymentMethod?: 'whatsapp';
}

export type OrderStatus = 'pendiente' | 'en_proceso' | 'enviado' | 'entregado' | 'cancelado';

export interface WhatsAppOrderItem {
  productId: string;
  productName: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPriceHnl: number;
  totalHnl: number;
  image?: string;
}

export interface WhatsAppOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  departamento: string;
  municipio: string;
  address: string;
  deliveryNotes?: string;
  carrierName: string;
  estimatedDelivery: string;
  items: WhatsAppOrderItem[];
  subtotalHnl: number;
  shippingFeeHnl: number;
  discountHnl: number;
  totalHnl: number;
  couponCode?: string;
  status: OrderStatus;
  createdAt: string;
  whatsappUrl: string;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export interface FilterState {
  category: string;
  gender: string;
  fit: string;
  size: string;
  color: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: SortOption;
}
