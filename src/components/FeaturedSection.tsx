import React from 'react';
import { Product, StoreContent } from '../types/index.ts';
import { ProductCard } from './ProductCard.tsx';
import { ArrowRight } from 'lucide-react';

interface FeaturedSectionProps {
  products: Product[];
  content: StoreContent;
  onQuickView: (product: Product) => void;
  onAddToCartDirect: (product: Product, size: string) => void;
  onGoToCatalog: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  products,
  content,
  onQuickView,
  onAddToCartDirect,
  onGoToCatalog
}) => {
  const featuredProducts = products.filter((p) => p.featured && p.active).slice(0, 6);

  return (
    <section id="destacados" className="py-20 sm:py-28 bg-[#F2EBDD]/40 border-y border-[#E6D5B8]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#E6D5B8]/60">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#9E8B6E] font-semibold">
              {content.featuredSection.badge || 'COLECCIÓN PERMANENTE'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight font-heading mt-1">
              {content.featuredSection.title || 'SELECCIÓN PREMIUM'}
            </h2>
          </div>
          <div className="mt-3 md:mt-0 flex items-center justify-between gap-4">
            <p className="text-sm text-[#555] font-light max-w-sm hidden sm:block">
              {content.featuredSection.subtitle ||
                'Prendas de alta categoría confeccionadas con denim pesado y algodones selectos.'}
            </p>
            <button
              onClick={onGoToCatalog}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#111111] hover:text-[#9E8B6E] transition-colors shrink-0"
            >
              <span>Ver Todo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCartDirect={onAddToCartDirect}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
