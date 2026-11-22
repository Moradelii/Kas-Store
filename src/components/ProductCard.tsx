import React from 'react';
import { Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../types/index.ts';
import { formatLempiras } from '../utils/format.ts';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCartDirect: (product: Product, size: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCartDirect
}) => {
  const variantsList = product.variants || [];
  const isOutOfStock = (product.totalStock ?? variantsList.reduce((sum, v) => sum + v.stock, 0)) === 0;
  const primaryImage = (product.images && product.images[0]) || '/assets/images/kas_category_jeans_1793516509180.jpg';
  const availableVariants = variantsList.filter((v) => v.stock > 0);

  return (
    <div className="group flex flex-col bg-[#F9F8F5] border border-[#E6D5B8]/50 hover:border-[#111111] transition-all duration-300">
      {/* Product Image Frame */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EBDD] cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Commercial Tag */}
        {product.tag && (
          <div className="absolute top-3 left-3 bg-[#111111] text-[#E6D5B8] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 z-10">
            {product.tag}
          </div>
        )}

        {/* Brand Tag Top Right */}
        {product.brand && (
          <div className="absolute top-3 right-3 bg-white/95 text-[#111111] border border-[#111111]/20 text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 shadow-sm z-10">
            {product.brand === 'Pepe' ? 'Pepe Jeans' : product.brand === 'Tommy' ? 'Tommy Hilfiger' : product.brand}
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-[#111111] text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5">
              AGOTADO
            </span>
          </div>
        )}

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2.5 bg-[#111111] hover:bg-[#E6D5B8] hover:text-[#111111] text-[#F9F8F5] text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Rápida</span>
          </button>
        </div>
      </div>

      {/* Card Info Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand, Department & Stock Metadata */}
          <div className="flex items-center justify-between text-[11px] text-[#9E8B6E] uppercase tracking-wider font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <span className="text-[#111111] font-bold">
                {product.gender ? (product.gender === 'hombre' ? 'Hombre' : 'Mujer') : 'Unisex'}
              </span>
              <span>·</span>
              <span>
                {product.fitStyle || (product.category === 'jeans' ? 'Jeans' : 'Camiseta')}
              </span>
            </span>
            <span className={isOutOfStock ? 'text-red-700' : 'text-[#555]'}>
              {isOutOfStock ? 'Agotado' : `${product.totalStock} en stock`}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-sm sm:text-base font-bold text-[#111111] hover:text-[#777] transition-colors cursor-pointer line-clamp-1 font-heading"
          >
            {product.name}
          </h3>

          {/* Available Sizes preview list */}
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <span className="text-[10px] text-[#777] uppercase mr-1">Tallas:</span>
            {variantsList.map((v) => (
              <span
                key={v.size}
                className={`text-[10px] font-medium px-1.5 py-0.5 border ${
                  v.stock > 0
                    ? 'border-[#D4C4A8] text-[#111111] bg-white'
                    : 'border-transparent text-[#999] line-through'
                }`}
                title={v.stock > 0 ? `${v.stock} disponibles en talla ${v.size}` : 'Agotada'}
              >
                {v.size}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#E6D5B8]/40 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#111111] tabular-nums font-heading">
              {formatLempiras(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-[#888] line-through tabular-nums">
                {formatLempiras(product.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              if (availableVariants.length > 0) {
                onQuickView(product);
              }
            }}
            disabled={isOutOfStock}
            className="p-2 text-[#111111] hover:text-[#E6D5B8] hover:bg-[#111111] border border-[#111111] transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Seleccionar y comprar"
            aria-label="Ver y comprar"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
          </button>
        </div>
      </div>
    </div>
  );
};
