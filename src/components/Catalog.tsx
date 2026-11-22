import React, { useState, useMemo } from 'react';
import {
  Product,
  GenderCategory,
  Brand,
  OFFICIAL_BRANDS,
  OFFICIAL_JEAN_STYLES,
  OFFICIAL_JEAN_COLORS
} from '../types/index.ts';
import { ProductCard } from './ProductCard.tsx';
import { RotateCcw, Filter, Check } from 'lucide-react';

interface CatalogProps {
  products: Product[];
  selectedCategory: 'all' | 'jeans' | 'camisetas';
  onSelectCategory: (cat: 'all' | 'jeans' | 'camisetas') => void;
  selectedGender: 'all' | GenderCategory;
  onSelectGender: (g: 'all' | GenderCategory) => void;
  selectedBrand: 'all' | Brand;
  onSelectBrand: (b: 'all' | Brand) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCartDirect: (product: Product, size: string) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  selectedGender,
  onSelectGender,
  selectedBrand,
  onSelectBrand,
  searchQuery,
  onSearchChange,
  onQuickView,
  onAddToCartDirect
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedJeanStyle, setSelectedJeanStyle] = useState<string>('all');
  const [selectedJeanColor, setSelectedJeanColor] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc'>('recent');

  // Available size tags based on filtered selection
  const availableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    (products || []).forEach((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchGen = selectedGender === 'all' || p.gender === selectedGender;
      const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      if (matchCat && matchGen && matchBrand) {
        (p.variants || []).forEach((v) => sizeSet.add(v.size));
      }
    });
    // Sort numeric sizes and letter sizes
    return Array.from(sizeSet).sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      return order.indexOf(a) - order.indexOf(b);
    });
  }, [products, selectedCategory, selectedGender, selectedBrand]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return (products || [])
      .filter((p) => {
        if (!p.active) return false;

        // Department / Gender filter
        if (selectedGender !== 'all' && p.gender && p.gender !== selectedGender) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }

        // Jeans Style filter
        if (selectedJeanStyle !== 'all') {
          if (p.category === 'jeans' && p.fitStyle !== selectedJeanStyle) {
            return false;
          }
        }

        // Jeans Color filter
        if (selectedJeanColor !== 'all') {
          const colorsList = p.colors || [];
          const hasColor = colorsList.some(
            (c) =>
              c.name.toLowerCase().includes(selectedJeanColor.toLowerCase()) ||
              selectedJeanColor.toLowerCase().includes(c.name.toLowerCase())
          );
          if (!hasColor) return false;
        }

        // Text Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = (p.name || '').toLowerCase().includes(q);
          const matchesDesc = (p.description || '').toLowerCase().includes(q);
          const matchesBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
          const matchesGender = p.gender ? p.gender.toLowerCase().includes(q) : false;
          const matchesCategory = (p.category || '').toLowerCase().includes(q);
          const matchesStyle = p.fitStyle ? p.fitStyle.toLowerCase().includes(q) : false;
          if (!matchesName && !matchesDesc && !matchesBrand && !matchesGender && !matchesCategory && !matchesStyle) {
            return false;
          }
        }

        // Stock check
        if (onlyInStock && p.totalStock <= 0) return false;

        // Size check
        if (selectedSize !== 'all') {
          const variantsList = p.variants || [];
          const hasSizeVariant = variantsList.some((v) => v.size === selectedSize && v.stock > 0);
          if (!hasSizeVariant) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      });
  }, [
    products,
    selectedCategory,
    selectedGender,
    selectedBrand,
    selectedJeanStyle,
    selectedJeanColor,
    searchQuery,
    onlyInStock,
    selectedSize,
    sortBy
  ]);

  const resetFilters = () => {
    onSelectCategory('all');
    onSelectGender('all');
    onSelectBrand('all');
    setSelectedSize('all');
    setSelectedJeanStyle('all');
    setSelectedJeanColor('all');
    setOnlyInStock(false);
    setSortBy('recent');
    onSearchChange('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedGender !== 'all' ||
    selectedBrand !== 'all' ||
    selectedSize !== 'all' ||
    selectedJeanStyle !== 'all' ||
    selectedJeanColor !== 'all' ||
    onlyInStock ||
    Boolean(searchQuery.trim());

  return (
    <section id="catalogo" className="py-20 sm:py-28 bg-[#F9F8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Title & Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 pb-4 border-b border-[#E6D5B8]/60 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#9E8B6E] font-semibold">
              Catálogo Oficial KAS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight font-heading mt-1">
              {selectedBrand !== 'all' ? `${selectedBrand} · ` : ''}
              {selectedGender === 'hombre'
                ? 'COLECCIÓN HOMBRE'
                : selectedGender === 'mujer'
                ? 'COLECCIÓN MUJER'
                : 'TODAS LAS PRENDAS'}
              {selectedCategory === 'jeans'
                ? ' (JEANS)'
                : selectedCategory === 'camisetas'
                ? ' (CAMISETAS)'
                : ''}
            </h2>
          </div>

          {/* Department / Gender Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#111111]/70 mr-1">
              Departamento:
            </span>
            <div className="inline-flex bg-[#F2EBDD] p-1 border border-[#D4C4A8]">
              <button
                onClick={() => {
                  onSelectGender('all');
                  setSelectedSize('all');
                }}
                className={`px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                  selectedGender === 'all'
                    ? 'bg-[#111111] text-[#F9F8F5]'
                    : 'text-[#111111]/70 hover:text-[#111111]'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => {
                  onSelectGender('hombre');
                  setSelectedSize('all');
                }}
                className={`px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                  selectedGender === 'hombre'
                    ? 'bg-[#111111] text-[#F9F8F5]'
                    : 'text-[#111111]/70 hover:text-[#111111]'
                }`}
              >
                Hombre
              </button>
              <button
                onClick={() => {
                  onSelectGender('mujer');
                  setSelectedSize('all');
                }}
                className={`px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                  selectedGender === 'mujer'
                    ? 'bg-[#111111] text-[#F9F8F5]'
                    : 'text-[#111111]/70 hover:text-[#111111]'
                }`}
              >
                Mujer
              </button>
            </div>
          </div>
        </div>

        {/* Brand Bar Filter */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#111111]/70 mr-2">
            Marca:
          </span>
          <button
            onClick={() => onSelectBrand('all')}
            className={`px-3 py-1 text-xs font-bold tracking-wider uppercase border transition-colors ${
              selectedBrand === 'all'
                ? 'bg-[#111111] text-[#F9F8F5] border-[#111111]'
                : 'bg-white text-[#111111] border-[#D4C4A8] hover:border-[#111111]'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => onSelectBrand("Levi's")}
            className={`px-3 py-1 text-xs font-bold tracking-wider uppercase border transition-colors ${
              selectedBrand === "Levi's"
                ? 'bg-[#111111] text-[#F9F8F5] border-[#111111]'
                : 'bg-white text-[#111111] border-[#D4C4A8] hover:border-[#111111]'
            }`}
          >
            Levi's
          </button>
          <button
            onClick={() => onSelectBrand('Pepe')}
            className={`px-3 py-1 text-xs font-bold tracking-wider uppercase border transition-colors ${
              selectedBrand === 'Pepe'
                ? 'bg-[#111111] text-[#F9F8F5] border-[#111111]'
                : 'bg-white text-[#111111] border-[#D4C4A8] hover:border-[#111111]'
            }`}
          >
            Pepe Jeans
          </button>
          <button
            onClick={() => onSelectBrand('Tommy')}
            className={`px-3 py-1 text-xs font-bold tracking-wider uppercase border transition-colors ${
              selectedBrand === 'Tommy'
                ? 'bg-[#111111] text-[#F9F8F5] border-[#111111]'
                : 'bg-white text-[#111111] border-[#D4C4A8] hover:border-[#111111]'
            }`}
          >
            Tommy Hilfiger
          </button>
        </div>

        {/* Category Segmented Tabs (Prendas: Todo / Jeans / Camisetas) */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#111111]/70 mr-2">
            Tipo de Prenda:
          </span>
          <div className="inline-flex bg-[#F2EBDD] p-1 border border-[#D4C4A8]">
            <button
              onClick={() => {
                onSelectCategory('all');
                setSelectedSize('all');
              }}
              className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#111111] text-[#F9F8F5]'
                  : 'text-[#111111]/70 hover:text-[#111111]'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => {
                onSelectCategory('jeans');
                setSelectedSize('all');
              }}
              className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                selectedCategory === 'jeans'
                  ? 'bg-[#111111] text-[#F9F8F5]'
                  : 'text-[#111111]/70 hover:text-[#111111]'
              }`}
            >
              Jeans
            </button>
            <button
              onClick={() => {
                onSelectCategory('camisetas');
                setSelectedSize('all');
              }}
              className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                selectedCategory === 'camisetas'
                  ? 'bg-[#111111] text-[#F9F8F5]'
                  : 'text-[#111111]/70 hover:text-[#111111]'
              }`}
            >
              Camisetas
            </button>
          </div>
        </div>

        {/* Filter Controls Strip (Talla, Estilos de Jeans, Colores de Jeans, Stock, Orden) */}
        <div className="bg-[#F2EBDD]/60 border border-[#E6D5B8]/80 p-4 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by Size */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]/70">
                Talla:
              </span>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-white border border-[#D4C4A8] text-xs font-medium text-[#111111] px-3 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="all">Todas las tallas</option>
                {availableSizes.map((size) => (
                  <option key={size} value={size}>
                    Talla {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Jeans Style (Skinny, Slim, Straight, Tapered, Relaxed) */}
            {selectedCategory !== 'camisetas' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]/70">
                  Estilo Jeans:
                </span>
                <select
                  value={selectedJeanStyle}
                  onChange={(e) => setSelectedJeanStyle(e.target.value)}
                  className="bg-white border border-[#D4C4A8] text-xs font-medium text-[#111111] px-3 py-1.5 focus:outline-none cursor-pointer max-w-[180px]"
                >
                  <option value="all">Todos los estilos</option>
                  {OFFICIAL_JEAN_STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filter by Jeans Color (9 official colors) */}
            {selectedCategory !== 'camisetas' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]/70">
                  Color:
                </span>
                <select
                  value={selectedJeanColor}
                  onChange={(e) => setSelectedJeanColor(e.target.value)}
                  className="bg-white border border-[#D4C4A8] text-xs font-medium text-[#111111] px-3 py-1.5 focus:outline-none cursor-pointer max-w-[180px]"
                >
                  <option value="all">Todos los colores</option>
                  {OFFICIAL_JEAN_COLORS.map((col) => (
                    <option key={col.name} value={col.name}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* In stock toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#111111] select-none pl-2 border-l border-[#D4C4A8]/60">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded-none border-[#D4C4A8] text-[#111111] focus:ring-0 cursor-pointer"
              />
              <span>Sólo en existencia</span>
            </label>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs text-[#9E8B6E] hover:text-[#111111] underline font-medium pl-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restablecer todo</span>
              </button>
            )}
          </div>

          {/* Right: Sort & Count */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#777] hidden sm:inline">
              Mostrando <strong className="text-[#111111]">{filteredProducts.length}</strong> prendas
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]/70">
                Ordenar:
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-white border border-[#D4C4A8] text-xs font-medium text-[#111111] px-3 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="recent">Más recientes</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCartDirect={onAddToCartDirect}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#F2EBDD]/30 border border-[#E6D5B8]/40 p-8">
            <p className="text-lg font-bold text-[#111111] font-heading">
              No se encontraron prendas con los filtros seleccionados
            </p>
            <p className="text-sm text-[#777] mt-1 max-w-md mx-auto font-light">
              Prueba cambiando la marca, el departamento o restableciendo los parámetros de búsqueda.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2.5 bg-[#111111] text-[#F9F8F5] text-xs font-bold tracking-widest uppercase hover:bg-[#9E8B6E] transition-colors"
            >
              Ver todas las prendas
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
