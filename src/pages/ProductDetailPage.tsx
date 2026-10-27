import React, { useState, useEffect } from 'react';
import {
  Heart,
  Truck,
  ShieldCheck,
  Ruler,
  Plus,
  Minus,
  Check,
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { ProductImage } from '../components/ProductImage';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onSelectProduct: (productId: string) => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onNavigate,
  onSelectProduct,
  onOpenSizeGuide,
}) => {
  const initialProduct = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
  const [product, setProduct] = useState<Product>(initialProduct);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    let active = true;
    const local = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (local) setProduct(local);

    api.getProduct(productId).then((fetched) => {
      if (active && fetched) {
        setProduct(fetched);
      }
    });

    return () => { active = false; };
  }, [productId]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isFav = isInWishlist(product.id);

  const isVariantOutOfStock = (size: string, colorName: string) => {
    if (!product.variantStock) return false;
    const match = product.variantStock.find(
      (v) => v.size === size && v.colorName.toLowerCase() === colorName.toLowerCase()
    );
    return match ? !match.available : false;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setValidationError('Por favor selecciona una talla antes de agregar.');
      return;
    }
    if (!selectedColor) {
      setValidationError('Por favor selecciona una tonalidad/color antes de agregar.');
      return;
    }
    if (isVariantOutOfStock(selectedSize, selectedColor)) {
      setValidationError('La combinación de talla y tonalidad seleccionada se encuentra agotada temporalmente.');
      return;
    }

    setValidationError(null);
    addItem(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setValidationError('Por favor selecciona una talla para continuar.');
      return;
    }
    if (!selectedColor) {
      setValidationError('Por favor selecciona una tonalidad para continuar.');
      return;
    }
    if (isVariantOutOfStock(selectedSize, selectedColor)) {
      setValidationError('La variante seleccionada está agotada en los datos de demostración.');
      return;
    }

    setValidationError(null);
    addItem(product, selectedSize, selectedColor, quantity);
    onNavigate('checkout');
  };

  // Related products
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender)
  ).slice(0, 4);

  const genderLabel =
    product.gender === 'hombre'
      ? 'Hombre'
      : product.gender === 'mujer'
      ? 'Mujer'
      : product.gender === 'nino'
      ? 'Niño'
      : product.gender === 'nina'
      ? 'Niña'
      : 'Unisex';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb & back button */}
      <nav className="flex items-center gap-2 text-xs text-[#2E2721]/70">
        <button
          onClick={() => onNavigate('catalog')}
          className="hover:text-[#B88B4A] inline-flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al Catálogo
        </button>
        <span>/</span>
        <button
          onClick={() => onNavigate('catalog', { category: product.category })}
          className="hover:text-[#B88B4A]"
        >
          {product.categoryLabel}
        </button>
        <span>/</span>
        <span className="text-[#2E2721] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid: Gallery Left, Sticky Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-[#FFFEFC] border border-[#E8DEC9] overflow-hidden">
            <ProductImage
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isSale && (
              <span className="absolute top-4 left-4 bg-[#B88B4A] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider px-3 py-1">
                Oferta Especial
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#FFFEFC]/90 hover:bg-[#FFFEFC] text-[#2E2721] hover:text-[#B88B4A] flex items-center justify-center transition-colors shadow-sm"
              aria-label="Favorito"
            >
              <Heart
                className={`w-5 h-5 ${isFav ? 'fill-[#B88B4A] text-[#B88B4A]' : ''}`}
              />
            </button>
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 shrink-0 border-2 overflow-hidden transition-all ${
                    activeImageIndex === idx ? 'border-[#B88B4A]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#8A622A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{product.categoryLabel} · {genderLabel} · {product.fitType}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2721] mt-1.5 leading-snug">
              {product.name}
            </h1>

            {/* Wash Tone Callout */}
            <div className="mt-2 inline-flex items-center gap-2 text-xs px-3 py-1 bg-[#E8DEC9]/50 border border-[#D9CCB8] text-[#2E2721]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B608C]" />
              <span>Tonalidad: <strong>{product.denimWash}</strong></span>
            </div>

            {/* Price Box */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B88B4A] tabular-nums">
                L {product.priceHnl.toFixed(2)}
              </span>
              {product.originalPriceHnl && (
                <span className="text-sm sm:text-base text-[#2E2721]/50 line-through tabular-nums">
                  L {product.originalPriceHnl.toFixed(2)}
                </span>
              )}
              {product.originalPriceHnl && (
                <span className="text-xs font-semibold text-[#8A622A] uppercase">
                  Ahorras L {(product.originalPriceHnl - product.priceHnl).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-xs text-[#2E2721]/70 mt-1">
              Impuestos incluidos · Moneda nacional (HNL)
            </p>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[#2E2721]/80 leading-relaxed border-t border-b border-[#E8DEC9] py-4">
            {product.fullDescription}
          </p>

          {/* Color & Wash Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#2E2721]">
                Tonalidad / Color:{' '}
                <span className="font-normal text-[#2E2721]/80">
                  {selectedColor || 'Selecciona un acabado'}
                </span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.availableColors.map((color) => {
                const isSelected = selectedColor === color.name;
                const isUnavailable =
                  selectedSize !== '' && isVariantOutOfStock(selectedSize, color.name);

                return (
                  <button
                    key={color.name}
                    disabled={isUnavailable}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setValidationError(null);
                    }}
                    className={`group relative flex items-center gap-2 px-3 py-1.5 border text-xs transition-all ${
                      isSelected
                        ? 'border-[#2E2721] bg-[#E8DEC9]/50 font-semibold text-[#2E2721]'
                        : isUnavailable
                        ? 'border-gray-200 opacity-40 cursor-not-allowed line-through'
                        : 'border-[#D9CCB8] bg-[#FFFEFC] hover:border-[#2E2721] text-[#2E2721]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                    {isUnavailable && <span className="text-[10px] text-[#8A622A]">(Agotado)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector + Size Guide Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#2E2721]">
                Talla:{' '}
                <span className="font-normal text-[#2E2721]/80">
                  {selectedSize || 'Selecciona una talla'}
                </span>
              </span>
              <button
                onClick={onOpenSizeGuide}
                className="text-xs text-[#B88B4A] hover:text-[#8A622A] underline underline-offset-2 flex items-center gap-1 font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                Guía de tallas
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.availableSizes.map((size) => {
                const isSelected = selectedSize === size;
                const isUnavailable =
                  selectedColor !== '' && isVariantOutOfStock(size, selectedColor);

                return (
                  <button
                    key={size}
                    disabled={isUnavailable}
                    onClick={() => {
                      setSelectedSize(size);
                      setValidationError(null);
                    }}
                    className={`py-2 text-xs font-semibold uppercase border transition-all text-center ${
                      isSelected
                        ? 'bg-[#B88B4A] text-[#FFFEFC] border-[#B88B4A]'
                        : isUnavailable
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                        : 'bg-[#FFFEFC] text-[#2E2721] border-[#D9CCB8] hover:border-[#B88B4A]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs font-semibold text-[#2E2721]">Cantidad:</span>
            <div className="flex items-center border border-[#D9CCB8] bg-[#FFFEFC]">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 hover:bg-[#FAF7F2] text-[#2E2721]"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 text-xs font-bold tabular-nums text-[#2E2721]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 hover:bg-[#FAF7F2] text-[#2E2721]"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Validation Feedback */}
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {addedSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>¡Pantalón de mezclilla agregado con éxito a tu bolsa!</span>
            </div>
          )}

          {/* Purchase CTA Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 px-6 bg-[#B88B4A] hover:bg-[#8A622A] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Agregar a la bolsa
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-3 px-6 bg-[#2E2721] hover:bg-[#1E1915] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Comprar ahora (Checkout Demo)
            </button>
          </div>

          {/* Delivery & Security Badges */}
          <div className="bg-[#FAF7F2] border border-[#E8DEC9] p-4 space-y-3 text-xs text-[#2E2721]/80">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#B88B4A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2E2721] block">Envíos a todo Honduras</strong>
                <span>Despacho directo desde La Masica, Atlántida. Entrega en 24 a 48 horas hábiles.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#B88B4A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2E2721] block">Garantía KAS Store</strong>
                <span>Cambio de talla rápido para toda la familia si necesitas ajuste.</span>
              </div>
            </div>
          </div>

          {/* Fabric & Care Specs */}
          <div className="pt-2 border-t border-[#E8DEC9] text-xs space-y-2 text-[#2E2721]/80">
            <div>
              <strong className="text-[#2E2721]">Composición:</strong> {product.fabricComposition}
            </div>
            <div>
              <strong className="text-[#2E2721]">Cuidados:</strong> {product.careInstructions}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-[#E8DEC9]">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8A622A]">
              Otras tonalidades y cortes
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2E2721] mt-1">
              Más Jeans Relacionados
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
