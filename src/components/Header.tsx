import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onOpenSearch?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  setSearchQuery,
}) => {
  const { totalItems, openCart } = useCart();
  const { totalWishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleNavClick = (view: string, params?: Record<string, string>) => {
    onNavigate(view, params);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('catalog', { search: searchQuery });
      setIsSearchVisible(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFEFC]/95 backdrop-blur-md border-b border-[#E8DEC9]">
      {/* Top Bar Announcement */}
      <div className="bg-[#2E2721] text-[#FAF7F2] text-xs py-2 px-4 text-center tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-3">
          <span className="font-medium">
            Envíos a toda Honduras · Envío gratis en compras mayores a L 1,500
          </span>
          <a
            href="https://wa.me/50433056175"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 text-[#E8DEC9] hover:text-white underline underline-offset-2 transition-colors ml-3"
          >
            Pedidos al WhatsApp +504 3305-6175
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2E2721] hover:text-[#B88B4A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88B4A]"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <button
              onClick={() => handleNavClick('home')}
              className="group inline-flex items-center gap-2 focus-visible:outline-none"
              aria-label="KAS Store Inicio"
            >
              <img
                src="/images/logo/Logotipo_KAS_Store_9c74b5ef.png"
                alt="KAS Store"
                className="h-11 sm:h-13 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
              />
            </button>
          </div>

          {/* Desktop Navigation Links (with Nino and Nina) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#2E2721]">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors hover:text-[#B88B4A] pb-1 border-b-2 ${
                currentView === 'home'
                  ? 'border-[#B88B4A] text-[#B88B4A] font-semibold'
                  : 'border-transparent'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick('catalog', { gender: 'hombre' })}
              className="transition-colors hover:text-[#B88B4A] pb-1 border-b-2 border-transparent"
            >
              Hombre
            </button>
            <button
              onClick={() => handleNavClick('catalog', { gender: 'mujer' })}
              className="transition-colors hover:text-[#B88B4A] pb-1 border-b-2 border-transparent"
            >
              Mujer
            </button>
            <button
              onClick={() => handleNavClick('catalog', { gender: 'nino' })}
              className="transition-colors hover:text-[#B88B4A] pb-1 border-b-2 border-transparent"
            >
              Niño
            </button>
            <button
              onClick={() => handleNavClick('catalog', { gender: 'nina' })}
              className="transition-colors hover:text-[#B88B4A] pb-1 border-b-2 border-transparent"
            >
              Niña
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className={`transition-colors hover:text-[#B88B4A] pb-1 border-b-2 ${
                currentView === 'catalog'
                  ? 'border-[#B88B4A] text-[#B88B4A] font-semibold'
                  : 'border-transparent'
              }`}
            >
              Colecciones
            </button>
            <button
              onClick={() => handleNavClick('catalog', { saleOnly: 'true' })}
              className="transition-colors text-[#B88B4A] hover:text-[#8A622A] font-semibold pb-1 border-b-2 border-transparent"
            >
              Ofertas
            </button>
          </nav>

          {/* Right Functional Actions: Search, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Search Input on Desktop */}
            <div className="relative hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Buscar tonalidades, jeans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 lg:w-56 pl-9 pr-4 py-1.5 text-xs bg-[#FAF7F2] border border-[#D9CCB8] rounded-none text-[#2E2721] placeholder-[#2E2721]/50 focus:outline-none focus:border-[#B88B4A] transition-all"
                />
                <button
                  type="submit"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#2E2721]/60 hover:text-[#B88B4A]"
                  aria-label="Buscar"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="md:hidden p-2 text-[#2E2721] hover:text-[#B88B4A]"
              aria-label="Abrir buscador móvil"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => handleNavClick('favorites')}
              className="relative p-2 text-[#2E2721] hover:text-[#B88B4A] transition-colors focus-visible:outline-none"
              aria-label="Ver productos favoritos"
              title="Favoritos"
            >
              <Heart className={`w-5 h-5 ${totalWishlist > 0 ? 'fill-[#B88B4A] text-[#B88B4A]' : ''}`} />
              {totalWishlist > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#B88B4A] text-[#FFFEFC] text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {totalWishlist}
                </span>
              )}
            </button>

            {/* Cart Icon & Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#2E2721] hover:text-[#B88B4A] transition-colors focus-visible:outline-none flex items-center gap-1.5"
              aria-label="Abrir carrito de compras"
              title="Bolsa de compras"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#B88B4A] text-[#FFFEFC] text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center tabular-nums">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-xs font-semibold uppercase tracking-wider text-[#2E2721]">
                Bolsa
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Drawer */}
        {isSearchVisible && (
          <div className="md:hidden py-3 border-t border-[#E8DEC9]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Buscar mezclilla, índigo, cortes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-10 py-2 text-sm bg-[#FAF7F2] border border-[#D9CCB8] text-[#2E2721] placeholder-[#2E2721]/50 focus:outline-none focus:border-[#B88B4A]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E2721]/60" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-[#FFFEFC] bg-[#B88B4A]"
              >
                Buscar
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8DEC9] bg-[#FFFEFC] px-4 pt-4 pb-6 space-y-4">
          <div className="pb-3 border-b border-[#E8DEC9]/60 flex items-center justify-between">
            <img
              src="/assets/aistudio/Logotipo_KAS_Store_9c74b5ef.png"
              alt="KAS Store"
              className="h-10 w-auto object-contain"
            />
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8A622A]">
              La Masica, Atlántida
            </span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3 py-2 text-base font-medium flex items-center justify-between ${
                currentView === 'home' ? 'text-[#B88B4A] bg-[#FAF7F2]' : 'text-[#2E2721]'
              }`}
            >
              <span>Inicio</span>
              <ArrowRight className="w-4 h-4 text-[#B88B4A]" />
            </button>
            <button
              onClick={() => handleNavClick('catalog', { gender: 'hombre' })}
              className="w-full text-left px-3 py-2 text-base font-medium text-[#2E2721] hover:bg-[#FAF7F2] flex items-center justify-between"
            >
              <span>Jeans Hombre</span>
              <ArrowRight className="w-4 h-4 text-[#B88B4A]" />
            </button>
            <button
              onClick={() => handleNavClick('catalog', { gender: 'mujer' })}
              className="w-full text-left px-3 py-2 text-base font-medium text-[#2E2721] hover:bg-[#FAF7F2] flex items-center justify-between"
            >
              <span>Jeans Mujer</span>
              <ArrowRight className="w-4 h-4 text-[#B88B4A]" />
            </button>
            <button
              onClick={() => handleNavClick('catalog', { gender: 'nino' })}
              className="w-full text-left px-3 py-2 text-base font-medium text-[#2E2721] hover:bg-[#FAF7F2] flex items-center justify-between"
            >
              <span>Jeans Niño</span>
              <ArrowRight className="w-4 h-4 text-[#B88B4A]" />
            </button>
            <button
              onClick={() => handleNavClick('catalog', { gender: 'nina' })}
              className="w-full text-left px-3 py-2 text-base font-medium text-[#2E2721] hover:bg-[#FAF7F2] flex items-center justify-between"
            >
              <span>Jeans Niña</span>
              <ArrowRight className="w-4 h-4 text-[#B88B4A]" />
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className={`w-full text-left px-3 py-2 text-base font-medium flex items-center justify-between ${
                currentView === 'catalog' ? 'text-[#B88B4A] bg-[#FAF7F2]' : 'text-[#2E2721]'
              }`}
            >
              <span>Toda la Mezclilla</span>
              <ArrowRight className="w-4 h-4 text-[#B88B4A]" />
            </button>
            <button
              onClick={() => handleNavClick('catalog', { saleOnly: 'true' })}
              className="w-full text-left px-3 py-2 text-base font-medium text-[#B88B4A] hover:bg-[#FAF7F2] flex items-center justify-between"
            >
              <span>Ofertas y Descuentos</span>
              <ArrowRight className="w-4 h-4 text-[#B88B4A]" />
            </button>
            <button
              onClick={() => handleNavClick('favorites')}
              className="w-full text-left px-3 py-2 text-base font-medium text-[#2E2721] hover:bg-[#FAF7F2] flex items-center justify-between"
            >
              <span>Favoritos ({totalWishlist})</span>
              <Heart className="w-4 h-4 text-[#B88B4A]" />
            </button>
          </div>

          <div className="pt-4 border-t border-[#E8DEC9] text-xs text-[#2E2721]/80 space-y-1.5">
            <p className="font-semibold text-[#2E2721]">KAS Store · La Masica, Atlántida</p>
            <p>WhatsApp: +504 3305-6175</p>
            <p>Correo: k-andradesantos@gmail.com</p>
          </div>
        </div>
      )}
    </header>
  );
};
