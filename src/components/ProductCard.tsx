import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { ProductImage } from './ProductImage';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  onQuickAdd?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFav = isInWishlist(product.id);

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
    <div className="group relative flex flex-col bg-[#FFFEFC] border border-[#E8DEC9] hover:border-[#D9CCB8] transition-all duration-300">
      {/* Product Image Frame */}
      <div
        className="relative cursor-pointer overflow-hidden aspect-[3/4]"
        onClick={() => onSelect(product.id)}
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Quiet editorial tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isSale && product.originalPriceHnl && (
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#FFFEFC] bg-[#B88B4A] px-2 py-0.5">
              Oferta Mezclilla
            </span>
          )}
          {product.isNew && !product.isSale && (
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#2E2721] bg-[#E8DEC9] px-2 py-0.5">
              Nuevo
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#FFFEFC]/90 hover:bg-[#FFFEFC] text-[#2E2721] hover:text-[#B88B4A] flex items-center justify-center transition-colors shadow-xs"
          aria-label={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFav ? 'fill-[#B88B4A] text-[#B88B4A]' : ''
            }`}
          />
        </button>

        {/* Subtle quick view overlay on desktop */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product.id);
            }}
            className="w-full py-2 bg-[#FFFEFC] text-[#2E2721] hover:bg-[#FAF7F2] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#B88B4A]" />
            Ver Tonalidad y Tallas
          </button>
        </div>
      </div>

      {/* Content Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#2E2721]/70 uppercase tracking-wider">
            <span>{product.categoryLabel}</span>
            <span>·</span>
            <span className="font-semibold text-[#B88B4A]">{genderLabel}</span>
          </div>

          <h3
            onClick={() => onSelect(product.id)}
            className="font-serif text-sm sm:text-base font-semibold text-[#2E2721] hover:text-[#B88B4A] transition-colors cursor-pointer mt-1 leading-snug line-clamp-1"
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#8A622A]">
            <span className="w-2 h-2 rounded-full bg-[#3B608C] inline-block" />
            <span className="truncate">{product.denimWash}</span>
          </div>

          <p className="text-xs text-[#2E2721]/70 line-clamp-1 mt-1 font-normal">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Sizes Preview */}
        <div className="pt-2 border-t border-[#E8DEC9]/60 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-[#B88B4A] tabular-nums">
              L {product.priceHnl.toFixed(2)}
            </span>
            {product.originalPriceHnl && (
              <span className="text-xs text-[#2E2721]/50 line-through tabular-nums">
                L {product.originalPriceHnl.toFixed(2)}
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#2E2721]/60 tracking-wider">
            {product.availableSizes.length} tallas
          </div>
        </div>
      </div>
    </div>
  );
};
