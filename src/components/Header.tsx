import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Ruler, ChevronDown } from 'lucide-react';
import { StoreContent, GenderCategory, Brand } from '../types/index.ts';
const kasLogo = '/assets/logo/logo.png';

interface HeaderProps {
  content: StoreContent;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSizeGuide: () => void;
  onSelectCategory?: (cat: 'all' | 'jeans' | 'camisetas') => void;
  onApplyFilter: (filter: {
    category?: 'all' | 'jeans' | 'camisetas';
    gender?: 'all' | GenderCategory;
    brand?: 'all' | Brand;
  }) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  content,
  cartCount,
  onOpenCart,
  onOpenSizeGuide,
  onApplyFilter,
  searchQuery,
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'hombre' | 'mujer' | 'marcas' | null>(null);

  const handleNavClick = (
    filter: {
      category?: 'all' | 'jeans' | 'camisetas';
      gender?: 'all' | GenderCategory;
      brand?: 'all' | Brand;
    },
    anchorId: string = 'catalogo'
  ) => {
    onApplyFilter(filter);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    if (anchorId) {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Discreet Announcement Bar */}
      {content.announcement.enabled && (
        <div className="bg-[#111111] text-[#E6D5B8] py-2 px-4 text-center text-xs tracking-wider uppercase font-medium border-b border-[#2A2A2A]">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span>{content.announcement.text}</span>
          </div>
        </div>
      )}

      {/* Main Sticky Navigation */}
      <header
        className="sticky top-0 z-40 bg-[#F9F8F5]/95 backdrop-blur-md border-b border-[#E6D5B8]/40 transition-colors"
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111111] hover:text-[#555] transition-colors focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Zone 1: Brand Official Logo */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick({ category: 'all', gender: 'all', brand: 'all' }, 'hero');
              }}
              className="flex items-center group py-1"
              title="KAS Store Inicio"
            >
              <img
                src={kasLogo}
                alt="KAS Store"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                loading="eager"
              />
            </a>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold uppercase tracking-wider text-[#111111]/85">
            {/* Dropdown: HOMBRE */}
            <div
              className="relative py-4"
              onMouseEnter={() => setActiveDropdown('hombre')}
            >
              <button
                onClick={() => handleNavClick({ gender: 'hombre', category: 'all' })}
                className="flex items-center gap-1 hover:text-[#111111] transition-colors py-1 border-b-2 border-transparent hover:border-[#111111]"
              >
                <span>Hombre</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {activeDropdown === 'hombre' && (
                <div className="absolute left-0 top-full w-52 bg-[#F9F8F5] border border-[#D4C4A8] shadow-xl py-3 px-2 flex flex-col space-y-1 animate-fadeIn">
                  <button
                    onClick={() => handleNavClick({ gender: 'hombre', category: 'all' })}
                    className="text-left px-3 py-2 text-xs hover:bg-[#E6D5B8]/40 text-[#111111] font-bold"
                  >
                    Todo Hombre
                  </button>
                  <button
                    onClick={() => handleNavClick({ gender: 'hombre', category: 'jeans' })}
                    className="text-left px-3 py-2 text-xs hover:bg-[#E6D5B8]/40 text-[#555] hover:text-[#111111]"
                  >
                    Jeans Hombre
                  </button>
                  <button
                    onClick={() => handleNavClick({ gender: 'hombre', category: 'camisetas' })}
                    className="text-left px-3 py-2 text-xs hover:bg-[#E6D5B8]/40 text-[#555] hover:text-[#111111]"
                  >
                    Camisetas Hombre
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown: MUJER */}
            <div
              className="relative py-4"
              onMouseEnter={() => setActiveDropdown('mujer')}
            >
              <button
                onClick={() => handleNavClick({ gender: 'mujer', category: 'all' })}
                className="flex items-center gap-1 hover:text-[#111111] transition-colors py-1 border-b-2 border-transparent hover:border-[#111111]"
              >
                <span>Mujer</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {activeDropdown === 'mujer' && (
                <div className="absolute left-0 top-full w-52 bg-[#F9F8F5] border border-[#D4C4A8] shadow-xl py-3 px-2 flex flex-col space-y-1 animate-fadeIn">
                  <button
                    onClick={() => handleNavClick({ gender: 'mujer', category: 'all' })}
                    className="text-left px-3 py-2 text-xs hover:bg-[#E6D5B8]/40 text-[#111111] font-bold"
                  >
                    Todo Mujer
                  </button>
                  <button
                    onClick={() => handleNavClick({ gender: 'mujer', category: 'jeans' })}
                    className="text-left px-3 py-2 text-xs hover:bg-[#E6D5B8]/40 text-[#555] hover:text-[#111111]"
                  >
                    Jeans Mujer
                  </button>
                  <button
                    onClick={() => handleNavClick({ gender: 'mujer', category: 'camisetas' })}
                    className="text-left px-3 py-2 text-xs hover:bg-[#E6D5B8]/40 text-[#555] hover:text-[#111111]"
                  >
                    Camisetas Mujer
                  </button>
                </div>
              )}
            </div>

            {/* JEANS GENERAL */}
            <button
              onClick={() => handleNavClick({ category: 'jeans', gender: 'all' })}
              className="hover:text-[#111111] transition-colors py-1 border-b-2 border-transparent hover:border-[#111111]"
            >
              Jeans
            </button>

            {/* CAMISETAS GENERAL */}
            <button
              onClick={() => handleNavClick({ category: 'camisetas', gender: 'all' })}
              className="hover:text-[#111111] transition-colors py-1 border-b-2 border-transparent hover:border-[#111111]"
            >
              Camisetas
            </button>

            {/* Dropdown: MARCAS */}
            <div
              className="relative py-4"
              onMouseEnter={() => setActiveDropdown('marcas')}
            >
              <button
                className="flex items-center gap-1 hover:text-[#111111] transition-colors py-1 border-b-2 border-transparent hover:border-[#111111]"
              >
                <span>Marcas</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {activeDropdown === 'marcas' && (
                <div className="absolute left-0 top-full w-52 bg-[#F9F8F5] border border-[#D4C4A8] shadow-xl py-3 px-2 flex flex-col space-y-1 animate-fadeIn">
                  <button
                    onClick={() => handleNavClick({ brand: 'Levi\'s' })}
                    className="text-left px-3 py-2 text-xs hover:bg-[#E6D5B8]/40 text-[#111111] font-bold"
                  >
                    Levi's
                  </button>
                  <button
                    onClick={() => handleNavClick({ brand: 'Pepe' })}
                    className="text-left px-3 py-2 text-xs hover:bg-[#E6D5B8]/40 text-[#111111] font-bold"
                  >
                    Pepe Jeans
                  </button>
                  <button
                    onClick={() => handleNavClick({ brand: 'Tommy' })}
                    className="text-left px-3 py-2 text-xs hover:bg-[#E6D5B8]/40 text-[#111111] font-bold"
                  >
                    Tommy Hilfiger
                  </button>
                  <button
                    onClick={() => handleNavClick({ brand: 'all' })}
                    className="text-left px-3 py-2 text-xs hover:bg-[#E6D5B8]/40 text-[#777] border-t border-[#E6D5B8]/60 mt-1"
                  >
                    Todas las marcas
                  </button>
                </div>
              )}
            </div>

            {/* Size Guide Trigger */}
            <button
              onClick={onOpenSizeGuide}
              className="flex items-center gap-1.5 text-[#111111]/70 hover:text-[#111111] transition-colors py-1"
            >
              <Ruler className="w-3.5 h-3.5 text-[#9E8B6E]" />
              <span>Guía de Tallas</span>
            </button>
          </nav>

          {/* Zone 3: Search & Shopping Bag */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-[#F2EBDD] border border-[#D4C4A8] rounded-none px-3 py-1.5 animate-fadeIn">
                  <Search className="w-4 h-4 text-[#111111]/60 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Buscar Pepe, Levi's, Tommy..."
                    autoFocus
                    className="bg-transparent text-xs text-[#111111] placeholder-[#888] focus:outline-none w-36 sm:w-56"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="ml-1 text-[#111111]/50 hover:text-[#111111]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-[#111111] hover:text-[#888] transition-colors"
                  aria-label="Buscar productos"
                  title="Buscar"
                >
                  <Search className="w-5 h-5 stroke-[1.75]" />
                </button>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#111111] hover:text-[#888] transition-colors focus:outline-none flex items-center gap-2"
              aria-label="Ver bolsa de compras"
              title="Bolsa de compras"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#111111] text-[#F9F8F5] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#F9F8F5] tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F9F8F5] border-b border-[#E6D5B8] px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3 text-sm font-semibold uppercase tracking-wider text-[#111111]">
              <div className="text-[11px] text-[#9E8B6E] font-bold tracking-widest pt-1 border-b border-[#E6D5B8]/60 pb-1">
                DEPARTAMENTOS
              </div>
              <div className="grid grid-cols-2 gap-2 pb-2">
                <button
                  onClick={() => handleNavClick({ gender: 'hombre', category: 'all' })}
                  className="p-2 text-left bg-white border border-[#D4C4A8] text-xs font-bold"
                >
                  Hombre
                </button>
                <button
                  onClick={() => handleNavClick({ gender: 'mujer', category: 'all' })}
                  className="p-2 text-left bg-white border border-[#D4C4A8] text-xs font-bold"
                >
                  Mujer
                </button>
              </div>

              <div className="text-[11px] text-[#9E8B6E] font-bold tracking-widest pt-1 border-b border-[#E6D5B8]/60 pb-1">
                PRENDAS
              </div>
              <button
                onClick={() => handleNavClick({ category: 'jeans', gender: 'all' })}
                className="text-left py-1 text-xs"
              >
                Colección Jeans (Hombre & Mujer)
              </button>
              <button
                onClick={() => handleNavClick({ category: 'camisetas', gender: 'all' })}
                className="text-left py-1 text-xs"
              >
                Colección Camisetas (Hombre & Mujer)
              </button>

              <div className="text-[11px] text-[#9E8B6E] font-bold tracking-widest pt-2 border-b border-[#E6D5B8]/60 pb-1">
                MARCAS DESTACADAS
              </div>
              <div className="flex flex-wrap gap-2 pb-2">
                <button
                  onClick={() => handleNavClick({ brand: "Levi's" })}
                  className="px-3 py-1.5 bg-[#111111] text-[#F9F8F5] text-xs font-bold"
                >
                  Levi's
                </button>
                <button
                  onClick={() => handleNavClick({ brand: 'Pepe' })}
                  className="px-3 py-1.5 bg-[#111111] text-[#F9F8F5] text-xs font-bold"
                >
                  Pepe Jeans
                </button>
                <button
                  onClick={() => handleNavClick({ brand: 'Tommy' })}
                  className="px-3 py-1.5 bg-[#111111] text-[#F9F8F5] text-xs font-bold"
                >
                  Tommy Hilfiger
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSizeGuide();
                }}
                className="flex items-center gap-2 text-left py-2 text-[#111111]/80 border-t border-[#E6D5B8]/60"
              >
                <Ruler className="w-4 h-4 text-[#9E8B6E]" />
                <span>Guía de Tallas</span>
              </button>
            </div>
            <div className="pt-2 text-xs text-[#111111]/60">
              <p>Atención directa: +504 3305-6175</p>
              <p>La Masica, Atlántida, Honduras</p>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
