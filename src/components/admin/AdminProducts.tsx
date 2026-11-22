import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Star, Search, CheckCircle, XCircle, Copy } from 'lucide-react';
import { Product, GenderCategory, Brand, OFFICIAL_BRANDS } from '../../types/index.ts';
import { formatLempiras } from '../../utils/format.ts';
import { ProductFormModal } from './ProductFormModal.tsx';

interface AdminProductsProps {
  products: Product[];
  onSaveProduct: (productData: Partial<Product>, isEdit: boolean) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'jeans' | 'camisetas'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | GenderCategory>('all');
  const [brandFilter, setBrandFilter] = useState<'all' | Brand>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (genderFilter !== 'all' && p.gender && p.gender !== genderFilter) return false;
    if (brandFilter !== 'all' && p.brand && p.brand !== brandFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
      const matchStyle = p.fitStyle ? p.fitStyle.toLowerCase().includes(q) : false;
      return matchName || matchDesc || matchBrand || matchStyle;
    }
    return true;
  });

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeletingId(productToDelete.id);
    try {
      await onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (product: Product) => {
    await onSaveProduct({ id: product.id, active: !product.active }, true);
  };

  const handleToggleFeatured = async (product: Product) => {
    await onSaveProduct({ id: product.id, featured: !product.featured }, true);
  };

  const handleDuplicate = async (product: Product) => {
    const duplicated: Partial<Product> = {
      ...product,
      id: undefined,
      name: `${product.name} (Copia)`,
      createdAt: new Date().toISOString()
    };
    await onSaveProduct(duplicated, false);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 border border-[#D4C4A8] shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nombre o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-[#F9F8F5] border border-[#D4C4A8] text-xs text-[#111111] focus:outline-none w-44 sm:w-56"
            />
          </div>

          {/* Department Filter (Hombre / Mujer) */}
          <select
            value={genderFilter}
            onChange={(e: any) => setGenderFilter(e.target.value)}
            className="bg-[#F9F8F5] border border-[#D4C4A8] px-3 py-1.5 text-xs text-[#111111] focus:outline-none font-medium"
          >
            <option value="all">Departamento (Todos)</option>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
          </select>

          {/* Brand Filter (Pepe, Levi's, Tommy, KAS) */}
          <select
            value={brandFilter}
            onChange={(e: any) => setBrandFilter(e.target.value)}
            className="bg-[#F9F8F5] border border-[#D4C4A8] px-3 py-1.5 text-xs text-[#111111] focus:outline-none font-medium"
          >
            <option value="all">Marca (Todas)</option>
            <option value="Levi's">Levi's</option>
            <option value="Pepe">Pepe Jeans</option>
            <option value="Tommy">Tommy Hilfiger</option>
            <option value="KAS">KAS</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e: any) => setCategoryFilter(e.target.value)}
            className="bg-[#F9F8F5] border border-[#D4C4A8] px-3 py-1.5 text-xs text-[#111111] focus:outline-none font-medium"
          >
            <option value="all">Prendas (Todas)</option>
            <option value="jeans">Jeans</option>
            <option value="camisetas">Camisetas</option>
          </select>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-[#9E8B6E] text-[#F9F8F5] text-xs font-bold uppercase tracking-wider transition-colors shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Nueva Prenda</span>
        </button>
      </div>

      {/* Table view */}
      <div className="bg-white border border-[#D4C4A8] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#111111] text-[#F9F8F5] uppercase tracking-wider">
                <th className="py-3 px-4">Prenda & Marca</th>
                <th className="py-3 px-4">Depto.</th>
                <th className="py-3 px-4">Tipo & Estilo</th>
                <th className="py-3 px-4">Precio</th>
                <th className="py-3 px-4">Inventario por Tallas</th>
                <th className="py-3 px-4 text-center">Destacado</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D5B8]/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#777]">
                    No se encontraron prendas registradas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOut = p.totalStock === 0;
                  return (
                    <tr key={p.id} className="hover:bg-[#F9F8F5] transition-colors">
                      {/* Photo & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || '/assets/images/kas_category_jeans_1793516509180.jpg'}
                            alt=""
                            className="w-10 h-12 object-cover border border-[#D4C4A8] bg-[#F2EBDD] shrink-0"
                          />
                          <div>
                            <div className="font-bold text-[#111111] line-clamp-1">{p.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="bg-[#111111] text-[#E6D5B8] text-[9px] font-extrabold px-1.5 py-0.2 tracking-wider uppercase">
                                {p.brand || 'KAS'}
                              </span>
                              {p.tag && (
                                <span className="text-[10px] text-[#9E8B6E] font-semibold">
                                  {p.tag}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department (Hombre / Mujer) */}
                      <td className="py-3 px-4 font-bold text-[#111111] uppercase text-[11px]">
                        {p.gender ? (p.gender === 'hombre' ? 'Hombre' : 'Mujer') : 'Unisex'}
                      </td>

                      {/* Category & Fit Style */}
                      <td className="py-3 px-4 text-[#555]">
                        <div className="font-semibold text-[#111111] uppercase">
                          {p.category === 'jeans' ? 'Jeans' : 'Camisetas'}
                        </div>
                        {p.fitStyle && (
                          <div className="text-[11px] text-[#9E8B6E]">{p.fitStyle}</div>
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono font-bold text-[#111111]">
                        {formatLempiras(p.price)}
                        {p.compareAtPrice && (
                          <div className="text-[10px] text-[#888] line-through">
                            {formatLempiras(p.compareAtPrice)}
                          </div>
                        )}
                      </td>

                      {/* Variants Stock */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`font-bold ${
                              isOut ? 'text-red-600' : 'text-emerald-700'
                            }`}
                          >
                            {p.totalStock} unidades
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.variants.map((v) => (
                            <span
                              key={v.size}
                              className={`text-[9px] px-1 py-0.2 border ${
                                v.stock > 0
                                  ? 'border-[#D4C4A8] bg-white text-[#111111]'
                                  : 'border-transparent text-[#999] line-through bg-gray-100'
                              }`}
                              title={`${v.stock} unidades`}
                            >
                              {v.size}:{v.stock}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 transition-colors ${
                            p.featured ? 'text-amber-500 hover:text-amber-600' : 'text-gray-300 hover:text-gray-400'
                          }`}
                          title={p.featured ? 'Destacado activo' : 'Marcar como destacado'}
                        >
                          <Star className={`w-4 h-4 ${p.featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>

                      {/* Active Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase ${
                            p.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {p.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{p.active ? 'Visible' : 'Oculto'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="p-1.5 text-[#555] hover:text-[#111111] hover:bg-[#F2EBDD] transition-colors"
                            title="Duplicar prenda"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 text-[#555] hover:text-[#111111] hover:bg-[#F2EBDD] transition-colors"
                            title="Editar prenda"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                            title="Eliminar prenda"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal (Create / Edit) */}
      {(isCreating || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setIsCreating(false);
            setEditingProduct(null);
          }}
          onSave={onSaveProduct}
        />
      )}

      {/* Confirm Delete Dialog */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-4 flex justify-center items-center animate-fadeIn">
          <div className="bg-white border border-[#D4C4A8] max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#111111] font-heading">
              ¿Eliminar esta prenda?
            </h3>
            <p className="text-xs text-[#666]">
              Estás a punto de eliminar <strong>"{productToDelete.name}"</strong> del catálogo. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-[#D4C4A8] text-xs font-bold uppercase text-[#555] hover:bg-[#F9F8F5]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingId === productToDelete.id}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase"
              >
                {deletingId === productToDelete.id ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
