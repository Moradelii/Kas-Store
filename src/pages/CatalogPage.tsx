import React, { useState, useMemo, useEffect } from 'react';
import { Filter, X, RotateCcw, ArrowUpDown, Search } from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES_LIST, SIZES_LIST, COLORS_LIST } from '../data/mockProducts';
import { ProductCard } from '../components/ProductCard';
import { SortOption, Product } from '../types';
import { api } from '../services/api';

interface CatalogPageProps {
  onSelectProduct: (productId: string) => void;
  initialGender?: string;
  initialCategory?: string;
  initialSearch?: string;
  initialSaleOnly?: boolean;
  initialNewOnly?: boolean;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  onSelectProduct,
  initialGender = '',
  initialCategory = '',
  initialSearch = '',
  initialSaleOnly = false,
  initialNewOnly = false,
}) => {
  const [category, setCategory] = useState<string>(initialCategory);
  const [gender, setGender] = useState<string>(initialGender);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(500);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [saleOnly, setSaleOnly] = useState<boolean>(initialSaleOnly);
  const [newOnly, setNewOnly] = useState<boolean>(initialNewOnly);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>(MOCK_PRODUCTS);

  useEffect(() => {
    let active = true;
    api.getProducts().then((data) => {
      if (active && data && data.length > 0) {
        setProductsList(data);
      }
    }).catch(() => {
      // Keep mock data as graceful fallback
    });
    return () => { active = false; };
  }, []);

  // Sync state if props change
  useEffect(() => {
    if (initialGender !== undefined) setGender(initialGender);
  }, [initialGender]);

  useEffect(() => {
    if (initialCategory !== undefined) setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined) setSearchQuery(initialSearch);
  }, [initialSearch]);

  const resetFilters = () => {
    setCategory('');
    setGender('');
    setSelectedSize('');
    setSelectedColor('');
    setMinPrice(500);
    setMaxPrice(1500);
    setInStockOnly(false);
    setSaleOnly(false);
    setNewOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    category !== '' ||
    gender !== '' ||
    selectedSize !== '' ||
    selectedColor !== '' ||
    minPrice > 500 ||
    maxPrice < 1500 ||
    inStockOnly ||
    saleOnly ||
    newOnly ||
    searchQuery.trim() !== '';

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.shortDescription.toLowerCase().includes(query);
        const matchesWash = product.denimWash.toLowerCase().includes(query);
        const matchesCategory = product.categoryLabel.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesWash && !matchesCategory) return false;
      }

      // Category
      if (category && category !== 'all' && product.category !== category) {
        return false;
      }

      // Gender (hombre, mujer, nino, nina, unisex)
      if (gender) {
        if (gender === 'hombre' && product.gender !== 'hombre' && product.gender !== 'unisex') return false;
        if (gender === 'mujer' && product.gender !== 'mujer' && product.gender !== 'unisex') return false;
        if (gender === 'nino' && product.gender !== 'nino') return false;
        if (gender === 'nina' && product.gender !== 'nina') return false;
      }

      // Size
      if (selectedSize && !product.availableSizes.includes(selectedSize)) {
        return false;
      }

      // Color
      if (
        selectedColor &&
        !product.availableColors.some((c) => c.name.toLowerCase() === selectedColor.toLowerCase())
      ) {
        return false;
      }

      // Price range
      if (product.priceHnl < minPrice || product.priceHnl > maxPrice) {
        return false;
      }

      // In stock
      if (inStockOnly && product.stockStatus === 'out_of_stock') {
        return false;
      }

      // Sale only
      if (saleOnly && !product.isSale) {
        return false;
      }

      // New only
      if (newOnly && !product.isNew) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceHnl - b.priceHnl;
      if (sortBy === 'price-desc') return b.priceHnl - a.priceHnl;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    category,
    gender,
    selectedSize,
    selectedColor,
    minPrice,
    maxPrice,
    inStockOnly,
    saleOnly,
    newOnly,
    searchQuery,
    sortBy,
    productsList,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Breadcrumb header */}
      <div className="border-b border-[#E8DEC9] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8A622A]">
            KAS Store · Catálogo de Mezclilla
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2721] mt-1">
            Colección de Jeans y Mezclilla
          </h1>
          <p className="text-xs sm:text-sm text-[#2E2721]/70 mt-1 max-w-xl">
            Tonalidades en índigo, celeste, stone y negro para Hombre, Mujer, Niño y Niña. Envíos garantizados a todo Honduras en HNL.
          </p>
        </div>

        {/* Results Counter & Sort */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#2E2721]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#B88B4A]" />
            <span className="hidden sm:inline font-medium">Ordenar por:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs bg-[#FFFEFC] border border-[#D9CCB8] px-3 py-2 text-[#2E2721] focus:outline-none focus:border-[#B88B4A] cursor-pointer"
          >
            <option value="featured">Destacados KAS</option>
            <option value="newest">Nuevos lanzamientos</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#2E2721] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider"
          >
            <Filter className="w-3.5 h-3.5" />
            Filtros
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-[#FFFEFC] border border-[#E8DEC9] p-6 h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC9]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#B88B4A]" />
              <h2 className="font-serif text-base font-bold text-[#2E2721]">Filtros de Mezclilla</h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#B88B4A] hover:text-[#8A622A] font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Limpiar
              </button>
            )}
          </div>

          {/* Search within catalog */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2E2721] block">Búsqueda rápida</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Tonalidad, corte, niño, niña..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-[#FAF7F2] border border-[#D9CCB8] pl-8 pr-3 py-2 text-[#2E2721] placeholder-[#2E2721]/50 focus:outline-none focus:border-[#B88B4A]"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#2E2721]/50" />
            </div>
          </div>

          {/* Gender Filter (Hombre, Mujer, Niño, Niña) */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#2E2721] block">Categoría / Género</span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: '', label: 'Todos' },
                { id: 'hombre', label: 'Hombre' },
                { id: 'mujer', label: 'Mujer' },
                { id: 'nino', label: 'Niño' },
                { id: 'nina', label: 'Niña' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGender(g.id)}
                  className={`py-1.5 px-2 text-xs font-medium border transition-colors text-center ${
                    gender === g.id
                      ? 'bg-[#2E2721] text-[#FFFEFC] border-[#2E2721]'
                      : 'bg-[#FFFEFC] text-[#2E2721] border-[#D9CCB8] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#2E2721] block">Corte y Silueta</span>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id === 'all' ? '' : cat.id)}
                  className={`w-full text-left px-2 py-1.5 text-xs flex items-center justify-between transition-colors ${
                    (category === cat.id || (cat.id === 'all' && !category))
                      ? 'bg-[#E8DEC9]/60 font-semibold text-[#2E2721]'
                      : 'text-[#2E2721]/80 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] text-[#2E2721]/50 tabular-nums">
                    {cat.id === 'all'
                      ? MOCK_PRODUCTS.length
                      : MOCK_PRODUCTS.filter((p) => p.category === cat.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#2E2721] block">Talla (Adulto & Niños)</span>
            <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {SIZES_LIST.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`py-1 text-xs font-medium border transition-colors text-center ${
                    selectedSize === sz
                      ? 'bg-[#B88B4A] text-[#FFFEFC] border-[#B88B4A]'
                      : 'bg-[#FFFEFC] text-[#2E2721] border-[#D9CCB8] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color / Wash Filter */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#2E2721] block">Tonalidad de Mezclilla</span>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {COLORS_LIST.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(selectedColor === col.name ? '' : col.name)}
                  className={`w-full text-left px-2 py-1 text-xs flex items-center gap-2 transition-colors ${
                    selectedColor === col.name
                      ? 'bg-[#E8DEC9]/60 font-semibold text-[#2E2721]'
                      : 'text-[#2E2721]/80 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/20"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="truncate">{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-2 border-t border-[#E8DEC9]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2E2721]">
              <span>Rango de precio (HNL)</span>
              <span className="text-[#B88B4A] tabular-nums">L {minPrice} - L {maxPrice}</span>
            </div>
            <input
              type="range"
              min="500"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#B88B4A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#2E2721]/60">
              <span>L 500</span>
              <span>L 1,500</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-[#E8DEC9] text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-[#2E2721]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#B88B4A]"
              />
              <span>Solo en existencia</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[#2E2721]">
              <input
                type="checkbox"
                checked={saleOnly}
                onChange={(e) => setSaleOnly(e.target.checked)}
                className="accent-[#B88B4A]"
              />
              <span>Solo ofertas y descuentos</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[#2E2721]">
              <input
                type="checkbox"
                checked={newOnly}
                onChange={(e) => setNewOnly(e.target.checked)}
                className="accent-[#B88B4A]"
              />
              <span>Nuevos lanzamientos</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active Filter Pills bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#2E2721]/70 font-medium">Filtros activos:</span>
              {category && (
                <button
                  onClick={() => setCategory('')}
                  className="inline-flex items-center gap-1 bg-[#E8DEC9] text-[#2E2721] px-2.5 py-1 text-xs"
                >
                  Corte: {category} <X className="w-3 h-3" />
                </button>
              )}
              {gender && (
                <button
                  onClick={() => setGender('')}
                  className="inline-flex items-center gap-1 bg-[#E8DEC9] text-[#2E2721] px-2.5 py-1 text-xs font-semibold"
                >
                  Categoría: {gender === 'nino' ? 'Niño' : gender === 'nina' ? 'Niña' : gender} <X className="w-3 h-3" />
                </button>
              )}
              {selectedSize && (
                <button
                  onClick={() => setSelectedSize('')}
                  className="inline-flex items-center gap-1 bg-[#E8DEC9] text-[#2E2721] px-2.5 py-1 text-xs"
                >
                  Talla: {selectedSize} <X className="w-3 h-3" />
                </button>
              )}
              {selectedColor && (
                <button
                  onClick={() => setSelectedColor('')}
                  className="inline-flex items-center gap-1 bg-[#E8DEC9] text-[#2E2721] px-2.5 py-1 text-xs"
                >
                  Tonalidad: {selectedColor} <X className="w-3 h-3" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1 bg-[#E8DEC9] text-[#2E2721] px-2.5 py-1 text-xs"
                >
                  Búsqueda: &quot;{searchQuery}&quot; <X className="w-3 h-3" />
                </button>
              )}
              {saleOnly && (
                <button
                  onClick={() => setSaleOnly(false)}
                  className="inline-flex items-center gap-1 bg-[#E8DEC9] text-[#2E2721] px-2.5 py-1 text-xs"
                >
                  Solo Ofertas <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={resetFilters}
                className="text-[#B88B4A] hover:underline text-xs ml-2 font-medium"
              >
                Limpiar todos
              </button>
            </div>
          )}

          {/* Results count indicator */}
          <div className="flex items-center justify-between text-xs text-[#2E2721]/70">
            <span>
              Mostrando <strong className="text-[#2E2721]">{filteredProducts.length}</strong> de{' '}
              {MOCK_PRODUCTS.length} pantalones de mezclilla en demostración
            </span>
          </div>

          {/* Products Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-12 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#E8DEC9]/50 flex items-center justify-center text-[#B88B4A]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2E2721]">
                No encontramos jeans con esos criterios
              </h3>
              <p className="text-xs text-[#2E2721]/70 max-w-md mx-auto">
                Prueba relajando los filtros de categoría (Hombre, Mujer, Niño, Niña), tonalidad o talla.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#B88B4A] hover:bg-[#8A622A] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restablecer todos los filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Slide-over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#FFFEFC] h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC9]">
              <h2 className="font-serif text-lg font-bold text-[#2E2721]">Filtros</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-[#2E2721]"
                aria-label="Cerrar filtros"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gender / Category */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#2E2721] block">Categoría</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '', label: 'Todos' },
                  { id: 'hombre', label: 'Hombre' },
                  { id: 'mujer', label: 'Mujer' },
                  { id: 'nino', label: 'Niño' },
                  { id: 'nina', label: 'Niña' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGender(g.id)}
                    className={`py-1.5 text-xs font-medium border text-center ${
                      gender === g.id
                        ? 'bg-[#2E2721] text-[#FFFEFC] border-[#2E2721]'
                        : 'bg-[#FFFEFC] text-[#2E2721] border-[#D9CCB8]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuts */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#2E2721] block">Silueta</span>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id === 'all' ? '' : cat.id)}
                    className={`w-full text-left px-2 py-1.5 text-xs flex items-center justify-between ${
                      (category === cat.id || (cat.id === 'all' && !category))
                        ? 'bg-[#E8DEC9]/60 font-semibold text-[#2E2721]'
                        : 'text-[#2E2721]/80'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2 pt-2 border-t border-[#E8DEC9]">
              <span className="text-xs font-semibold text-[#2E2721] block">
                Precio máx: L {maxPrice}
              </span>
              <input
                type="range"
                min="500"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#B88B4A]"
              />
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-[#B88B4A] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider"
              >
                Aplicar ({filteredProducts.length} jeans)
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2 border border-[#2E2721] text-[#2E2721] text-xs font-semibold uppercase tracking-wider"
              >
                Limpiar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
