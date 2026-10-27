import React from 'react';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { ProductCard } from '../components/ProductCard';

interface FavoritesPageProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onSelectProduct: (productId: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onNavigate,
  onSelectProduct,
}) => {
  const { wishlist } = useWishlist();

  const favoriteProducts = MOCK_PRODUCTS.filter((product) =>
    wishlist.includes(product.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E8DEC9] pb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs text-[#2E2721]/70 hover:text-[#B88B4A] inline-flex items-center gap-1 font-medium mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Explorar catálogo completo
          </button>
          <h1 className="font-serif text-3xl font-bold text-[#2E2721]">
            Mis Jeans Favoritos ({favoriteProducts.length})
          </h1>
          <p className="text-xs text-[#2E2721]/70 mt-1">
            Prendas de mezclilla que has guardado para revisar más tarde.
          </p>
        </div>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-12 text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#E8DEC9]/40 flex items-center justify-center text-[#B88B4A]">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2E2721]">
            No tienes jeans favoritos guardados aún
          </h2>
          <p className="text-xs text-[#2E2721]/70 max-w-sm mx-auto">
            Haz clic en el icono de corazón en cualquier pantalón de mezclilla para guardarlo en tu lista personal.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('catalog')}
              className="px-6 py-3 bg-[#B88B4A] hover:bg-[#8A622A] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
            >
              Ver Catálogo KAS Store
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
