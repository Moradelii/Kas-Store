import React, { useState, useEffect } from 'react';
import { X, Check, ShoppingBag, Ruler, MessageCircle, ShieldCheck } from 'lucide-react';
import { Product } from '../types/index.ts';
import { formatLempiras, buildWhatsAppUrl } from '../utils/format.ts';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onOpenSizeGuide: () => void;
  whatsappNumber: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenSizeGuide,
  whatsappNumber
}) => {
  // Hooks called unconditionally for React 19
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('Estándar');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      const available = product.variants?.find((v) => v.stock > 0) || product.variants?.[0];
      setSelectedSize(available?.size || '');
      setSelectedColor(product.colors?.[0]?.name || 'Estándar');
      setQuantity(1);
    }
  }, [product]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  // Find active variant info
  const currentVariant = product.variants.find((v) => v.size === selectedSize);
  const currentStock = currentVariant ? currentVariant.stock : 0;
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock || quantity <= 0) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const currentImage = product.images[selectedImageIndex] || product.images[0];
  const brandDisplay = product.brand === 'Pepe' ? 'Pepe Jeans' : product.brand === 'Tommy' ? 'Tommy Hilfiger' : product.brand || 'KAS';
  const genderDisplay = product.gender ? (product.gender === 'hombre' ? 'Hombre' : 'Mujer') : 'Unisex';

  const inquireMessage = `¡Hola KAS Store! Quisiera consultar disponibilidad y detalles sobre la prenda "${brandDisplay} - ${product.name}" (${genderDisplay}, Talla: ${selectedSize}, Color: ${selectedColor}). Gracias!`;
  const inquireUrl = buildWhatsAppUrl(whatsappNumber, inquireMessage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-2 sm:p-4 md:p-6 lg:p-8 flex justify-center items-start animate-fadeIn">
      {/* Click outside backdrop to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-label="Cerrar modal" />

      {/* Main Modal Card */}
      <div className="relative bg-[#F9F8F5] max-w-5xl w-full border border-[#D4C4A8] shadow-2xl z-10 my-auto flex flex-col md:flex-row md:max-h-[90vh] overflow-hidden">
        {/* Mobile Sticky Header Bar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-[#F9F8F5]/95 backdrop-blur-sm px-4 py-3 border-b border-[#D4C4A8]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9E8B6E] truncate pr-2">
            {brandDisplay} · {genderDisplay} · {product.fitStyle || (product.category === 'jeans' ? 'Colección Denim' : 'Colección Camisetas')}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#111111] hover:text-[#777] bg-[#F2EBDD] border border-[#D4C4A8] transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Close Button (Floating top right) */}
        <button
          onClick={onClose}
          className="hidden md:flex absolute top-4 right-4 z-30 p-2 text-[#111111] hover:text-[#777] bg-white/90 hover:bg-[#F2EBDD] border border-[#D4C4A8] transition-colors shadow-sm"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Gallery */}
        <div className="w-full md:w-1/2 bg-[#F2EBDD]/60 p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E6D5B8] md:max-h-[90vh] overflow-hidden shrink-0">
          <div className="relative aspect-[3/4] max-h-[50vh] md:max-h-[68vh] w-full overflow-hidden bg-[#ECE5D8] flex items-center justify-center border border-[#D4C4A8]/40 shadow-inner p-2">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-contain object-center drop-shadow-sm transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            {product.tag && (
              <div className="absolute top-3 left-3 bg-[#111111] text-[#E6D5B8] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 shadow">
                {product.tag}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-16 sm:w-16 sm:h-20 shrink-0 border-2 overflow-hidden transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#111111] shadow'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions (Scrollable) */}
        <div className="w-full md:w-1/2 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[90vh]">
          <div>
            {/* Category, Fit Style & Origin */}
            <div className="hidden md:flex items-center justify-between text-xs text-[#9E8B6E] uppercase font-semibold tracking-wider">
              <span className="flex items-center gap-2">
                <span className="bg-[#111111] text-[#F9F8F5] px-2 py-0.5 text-[10px] font-extrabold tracking-wider">
                  {brandDisplay}
                </span>
                <span className="text-[#111111] font-bold">
                  {genderDisplay}
                </span>
                <span>·</span>
                <span>
                  {product.fitStyle
                    ? `${product.fitStyle}`
                    : product.category === 'jeans'
                    ? 'Jeans'
                    : 'Camiseta'}
                </span>
              </span>
              <span className="text-[11px] text-[#888]">KAS Store · Honduras</span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111111] tracking-tight font-heading mt-1 md:mt-2">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mt-2.5 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#111111] tabular-nums font-heading">
                {formatLempiras(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-[#888] line-through tabular-nums">
                  {formatLempiras(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-xs sm:text-sm text-[#555] font-light leading-relaxed">
              {product.description}
            </p>

            {/* Details Bullet List */}
            {product.details && product.details.length > 0 && (
              <ul className="mt-3 space-y-1.5 text-xs text-[#666] bg-[#F2EBDD]/40 p-3 border border-[#E6D5B8]/60">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E8B6E] mt-1.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#111111] uppercase tracking-wider mb-2">
                  <span>Color: <strong className="text-[#9E8B6E]">{selectedColor}</strong></span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs transition-colors ${
                        selectedColor === c.name
                          ? 'border-[#111111] bg-white text-[#111111] font-semibold ring-1 ring-[#111111]'
                          : 'border-[#D4C4A8] bg-white/70 text-[#666] hover:border-[#111111]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes & Inventory Per Variant */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#111111] uppercase tracking-wider mb-2">
                <span>Seleccionar Talla</span>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="inline-flex items-center gap-1 text-[#9E8B6E] hover:text-[#111111] underline font-medium text-xs"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Ver guía de medidas</span>
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.variants.map((v) => {
                  const hasStock = v.stock > 0;
                  const isSelected = selectedSize === v.size;
                  return (
                    <button
                      key={v.size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(v.size);
                        setQuantity(1);
                      }}
                      className={`py-2 px-1 text-xs font-bold uppercase transition-all flex flex-col items-center justify-center border ${
                        isSelected
                          ? 'border-[#111111] bg-[#111111] text-[#F9F8F5] shadow'
                          : hasStock
                          ? 'border-[#D4C4A8] bg-white text-[#111111] hover:border-[#111111]'
                          : 'border-[#EAEAEA] bg-[#F5F5F5] text-[#AAA] cursor-not-allowed line-through'
                      }`}
                      title={hasStock ? `${v.stock} unidades en existencia` : 'Talla agotada'}
                    >
                      <span>{v.size}</span>
                    </button>
                  );
                })}
              </div>

              {/* Live Variant Stock Status */}
              <div className="mt-2 text-xs">
                {isOutOfStock ? (
                  <span className="text-red-700 font-semibold">
                    Talla {selectedSize} agotada en este momento.
                  </span>
                ) : (
                  <span className="text-[#555] font-medium">
                    Existencia en talla {selectedSize}: <strong className="text-[#111111] tabular-nums">{currentStock} unidades</strong> disponibles
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Cantidad:
              </span>
              <div className="flex items-center border border-[#D4C4A8] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3.5 py-1 text-sm font-bold text-[#111111] hover:bg-[#F2EBDD] disabled:opacity-30 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-bold text-[#111111] tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  disabled={quantity >= currentStock || isOutOfStock}
                  className="px-3.5 py-1 text-sm font-bold text-[#111111] hover:bg-[#F2EBDD] disabled:opacity-30 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-5 mt-6 border-t border-[#E6D5B8]">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-3.5 sm:py-4 bg-[#111111] hover:bg-[#E6D5B8] hover:text-[#111111] text-[#F9F8F5] text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-[#CCC] disabled:text-[#777] disabled:cursor-not-allowed shadow"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'TALLA AGOTADA' : 'AGREGAR AL CARRITO'}</span>
            </button>

            {addedToast && (
              <div className="p-2 bg-[#E6D5B8] text-[#111111] text-xs font-semibold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-800" />
                <span>Prenda agregada a tu bolsa con éxito</span>
              </div>
            )}

            {/* Direct WhatsApp Consultation */}
            <a
              href={inquireUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-transparent border border-[#D4C4A8] text-[#111111] hover:bg-[#F2EBDD] text-xs font-medium tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Consultar por WhatsApp (+504 3305-6175)</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#777] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9E8B6E]" />
              <span>Despacho directo y garantía de talla desde La Masica, Honduras</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
