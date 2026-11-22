import React, { useState } from 'react';
import { X, Plus, Trash2, Upload, Check, Sparkles } from 'lucide-react';
import {
  Product,
  ProductVariant,
  ProductColor,
  GenderCategory,
  Brand,
  OFFICIAL_BRANDS,
  OFFICIAL_JEAN_STYLES,
  OFFICIAL_JEAN_COLORS
} from '../../types/index.ts';
import { uploadImageFile } from '../../services/api.ts';

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (productData: Partial<Product>, isEdit: boolean) => Promise<void>;
}

const DEFAULT_MEN_JEAN_SIZES = ['28', '30', '32', '34', '36', '38', '40', '42'];
const DEFAULT_WOMEN_JEAN_SIZES = ['24', '26', '28', '30', '32', '34', '36'];
const DEFAULT_TEE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  onClose,
  onSave
}) => {
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name || '');
  const [gender, setGender] = useState<GenderCategory>(product?.gender || 'hombre');
  const [brand, setBrand] = useState<Brand>(product?.brand || "Levi's");
  const [customBrand, setCustomBrand] = useState(
    product?.brand && !OFFICIAL_BRANDS.includes(product.brand) ? product.brand : ''
  );
  const [category, setCategory] = useState<'jeans' | 'camisetas'>(product?.category || 'jeans');
  const [fitStyle, setFitStyle] = useState<string>(
    product?.fitStyle || (product?.category === 'jeans' ? 'Jean Slim' : 'Jean Slim')
  );
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '950');
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice?.toString() || '');
  const [tag, setTag] = useState<'NUEVO' | 'DESTACADO' | 'MÁS VENDIDO' | ''>(product?.tag || '');
  const [featured, setFeatured] = useState<boolean>(product?.featured ?? true);
  const [active, setActive] = useState<boolean>(product?.active ?? true);

  // Images
  const [images, setImages] = useState<string[]>(
    product?.images && product.images.length > 0
      ? product.images
      : ['/assets/images/kas_category_jeans_1793516509180.jpg']
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Bullet details
  const [details, setDetails] = useState<string[]>(
    product?.details || [
      'Algodón 100% de alto gramaje',
      'Corte ergonómico estructurado',
      'Costuras reforzadas de alta durabilidad'
    ]
  );
  const [newDetail, setNewDetail] = useState('');

  // Colors
  const [colors, setColors] = useState<ProductColor[]>(
    product?.colors || [
      { name: 'Azul Índigo o Raw Denim', hex: '#1B263B' },
      { name: 'Negro Absoluto', hex: '#111111' }
    ]
  );
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#111111');

  // Variants & Inventory per size
  const [variants, setVariants] = useState<ProductVariant[]>(() => {
    if (product?.variants && product.variants.length > 0) return product.variants;
    if (category === 'jeans') {
      const template = gender === 'mujer' ? DEFAULT_WOMEN_JEAN_SIZES : DEFAULT_MEN_JEAN_SIZES;
      return template.map((sz) => ({ size: sz, stock: 5 }));
    }
    return DEFAULT_TEE_SIZES.map((sz) => ({ size: sz, stock: 10 }));
  });
  const [newCustomSize, setNewCustomSize] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-apply size templates
  const applySizeTemplate = (cat: 'jeans' | 'camisetas', gen: GenderCategory) => {
    if (cat === 'jeans') {
      const template = gen === 'mujer' ? DEFAULT_WOMEN_JEAN_SIZES : DEFAULT_MEN_JEAN_SIZES;
      setVariants(template.map((sz) => ({ size: sz, stock: 5 })));
    } else {
      setVariants(DEFAULT_TEE_SIZES.map((sz) => ({ size: sz, stock: 8 })));
    }
  };

  const handleGenderChange = (newGen: GenderCategory) => {
    setGender(newGen);
    if (!isEdit) {
      applySizeTemplate(category, newGen);
    }
  };

  const handleCategoryChange = (newCat: 'jeans' | 'camisetas') => {
    setCategory(newCat);
    if (!isEdit) {
      applySizeTemplate(newCat, gender);
    }
  };

  const handleVariantStockChange = (size: string, stock: number) => {
    setVariants((prev) =>
      prev.map((v) => (v.size === size ? { ...v, stock: Math.max(0, stock) } : v))
    );
  };

  const handleAddCustomSize = () => {
    if (!newCustomSize.trim()) return;
    const sizeClean = newCustomSize.trim().toUpperCase();
    if (variants.some((v) => v.size === sizeClean)) return;
    setVariants([...variants, { size: sizeClean, stock: 5 }]);
    setNewCustomSize('');
  };

  const handleRemoveSize = (size: string) => {
    setVariants(variants.filter((v) => v.size !== size));
  };

  // Image Upload File Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadImageFile(file);
      setImages([...images, uploadedUrl]);
    } catch (err: any) {
      setErrorMsg('Error al subir imagen. Verifique formato (PNG/JPG).');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      setErrorMsg('El producto debe tener al menos una imagen.');
      return;
    }
    setImages(images.filter((_, idx) => idx !== index));
  };

  // Details
  const handleAddDetail = () => {
    if (!newDetail.trim()) return;
    setDetails([...details, newDetail.trim()]);
    setNewDetail('');
  };

  const handleRemoveDetail = (index: number) => {
    setDetails(details.filter((_, idx) => idx !== index));
  };

  // Colors
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const handleAddOfficialColor = (colorObj: { name: string; hex: string }) => {
    if (colors.some((c) => c.name === colorObj.name)) return;
    setColors([...colors, colorObj]);
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, idx) => idx !== index));
  };

  const totalStockCalc = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('El nombre de la prenda es requerido.');
      return;
    }
    if (!price || isNaN(Number(price))) {
      setErrorMsg('El precio debe ser un número válido en Lempiras.');
      return;
    }
    if (variants.length === 0) {
      setErrorMsg('Debe agregar al menos una talla con inventario.');
      return;
    }

    const effectiveBrand = brand === 'other' ? customBrand.trim() || 'KAS' : brand;

    setSaving(true);
    setErrorMsg('');

    try {
      const payload: Partial<Product> = {
        ...(product ? { id: product.id } : {}),
        name: name.trim(),
        gender,
        brand: effectiveBrand,
        category,
        fitStyle: category === 'jeans' ? fitStyle : undefined,
        description: description.trim(),
        details,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        tag: tag || null,
        featured,
        active,
        images,
        colors,
        variants,
        totalStock: totalStockCalc
      };

      await onSave(payload, isEdit);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar la prenda en el sistema');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-3 sm:p-6 flex justify-center items-start animate-fadeIn">
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-label="Cerrar modal" />

      <div className="relative bg-[#F9F8F5] max-w-4xl w-full border border-[#D4C4A8] shadow-2xl z-10 p-5 sm:p-8 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#111111] hover:text-[#777] bg-[#F2EBDD] border border-[#D4C4A8] transition-colors"
          aria-label="Cerrar formulario"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pb-4 border-b border-[#D4C4A8]">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9E8B6E]">
            Gestión de Inventario y Catálogo KAS
          </span>
          <h2 className="text-2xl font-extrabold text-[#111111] font-heading mt-1">
            {isEdit ? `Editar Prenda: ${product?.name}` : 'Añadir Nueva Prenda al Catálogo'}
          </h2>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Brand & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 border border-[#D4C4A8]">
            {/* Department (Hombre / Mujer) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Departamento (Categoría Género) *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleGenderChange('hombre')}
                  className={`py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                    gender === 'hombre'
                      ? 'bg-[#111111] text-[#F9F8F5] border-[#111111]'
                      : 'bg-[#F9F8F5] text-[#555] border-[#D4C4A8]'
                  }`}
                >
                  Hombre
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('mujer')}
                  className={`py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                    gender === 'mujer'
                      ? 'bg-[#111111] text-[#F9F8F5] border-[#111111]'
                      : 'bg-[#F9F8F5] text-[#555] border-[#D4C4A8]'
                  }`}
                >
                  Mujer
                </button>
              </div>
            </div>

            {/* Brand (Pepe, Levi's, Tommy, KAS) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Marca de la Prenda *
              </label>
              <select
                value={brand}
                onChange={(e: any) => setBrand(e.target.value)}
                className="w-full bg-[#F9F8F5] border border-[#D4C4A8] text-xs font-bold text-[#111111] px-3 py-2 focus:outline-none"
              >
                <option value="Levi's">Levi's Strauss & Co.</option>
                <option value="Pepe">Pepe Jeans London</option>
                <option value="Tommy">Tommy Hilfiger</option>
                <option value="KAS">KAS Brand (Propia)</option>
                <option value="other">Otra Marca...</option>
              </select>
              {brand === 'other' && (
                <input
                  type="text"
                  placeholder="Nombre de la marca..."
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="mt-2 w-full bg-[#F9F8F5] border border-[#D4C4A8] text-xs text-[#111111] px-3 py-1.5 focus:outline-none"
                />
              )}
            </div>

            {/* Clothing Category (Jeans / Camisetas) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Tipo de Prenda *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('jeans')}
                  className={`py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                    category === 'jeans'
                      ? 'bg-[#111111] text-[#F9F8F5] border-[#111111]'
                      : 'bg-[#F9F8F5] text-[#555] border-[#D4C4A8]'
                  }`}
                >
                  Jeans
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryChange('camisetas')}
                  className={`py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                    category === 'camisetas'
                      ? 'bg-[#111111] text-[#F9F8F5] border-[#111111]'
                      : 'bg-[#F9F8F5] text-[#555] border-[#D4C4A8]'
                  }`}
                >
                  Camisetas
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Name & Jeans Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={category === 'jeans' ? 'md:col-span-2' : 'md:col-span-3'}>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                Nombre de la Prenda *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Levi's 511 Slim Fit Raw Denim"
                className="w-full bg-white border border-[#D4C4A8] text-xs text-[#111111] px-3 py-2.5 focus:outline-none focus:border-[#111111]"
              />
            </div>

            {category === 'jeans' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Estilo de Jean Oficial *
                </label>
                <select
                  value={fitStyle}
                  onChange={(e) => setFitStyle(e.target.value)}
                  className="w-full bg-white border border-[#D4C4A8] text-xs font-medium text-[#111111] px-3 py-2.5 focus:outline-none focus:border-[#111111]"
                >
                  {OFFICIAL_JEAN_STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Row 3: Pricing & Commercial Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F2EBDD]/40 p-4 border border-[#D4C4A8]/60">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                Precio (Lempiras L.) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1250"
                className="w-full bg-white border border-[#D4C4A8] text-xs text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                Precio Tachado / Anterior (L.)
              </label>
              <input
                type="number"
                step="0.01"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="Opcional (Ej. 1450)"
                className="w-full bg-white border border-[#D4C4A8] text-xs text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                Distintivo Comercial
              </label>
              <select
                value={tag}
                onChange={(e: any) => setTag(e.target.value)}
                className="w-full bg-white border border-[#D4C4A8] text-xs text-[#111111] px-3 py-2 focus:outline-none"
              >
                <option value="">Sin distintivo</option>
                <option value="NUEVO">NUEVO</option>
                <option value="DESTACADO">DESTACADO</option>
                <option value="MÁS VENDIDO">MÁS VENDIDO</option>
              </select>
            </div>
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
              Descripción de la Prenda
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalla corte, tela, sensaciones y recomendaciones de estilo..."
              className="w-full bg-white border border-[#D4C4A8] text-xs text-[#111111] p-3 focus:outline-none focus:border-[#111111]"
            />
          </div>

          {/* Row 5: Bullet Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
              Detalles y Especificaciones (Puntos clave)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDetail();
                  }
                }}
                placeholder="Ej. Denim con orillo selvedge visible en dobladillo"
                className="flex-1 bg-white border border-[#D4C4A8] text-xs text-[#111111] px-3 py-1.5 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddDetail}
                className="px-3 py-1.5 bg-[#111111] text-[#F9F8F5] text-xs font-bold uppercase"
              >
                Agregar Detalle
              </button>
            </div>
            <div className="space-y-1">
              {details.map((det, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white border border-[#D4C4A8]/60 px-3 py-1 text-xs"
                >
                  <span>• {det}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDetail(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Row 6: Colors with Official Denim Quick-Add */}
          <div className="bg-white p-4 border border-[#D4C4A8]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Colores Disponibles
              </label>
              <span className="text-[10px] text-[#888] font-semibold">
                Haz clic en los colores oficiales para agregarlos rápidamente
              </span>
            </div>

            {/* Official Denim Colors Palette Presets */}
            <div className="mb-3 p-2 bg-[#F9F8F5] border border-[#E6D5B8] flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-[#9E8B6E] mr-1">
                Colores Oficiales:
              </span>
              {OFFICIAL_JEAN_COLORS.map((col) => (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => handleAddOfficialColor(col)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-[#D4C4A8] hover:border-[#111111] text-[10px] text-[#111111] font-medium"
                  title={`Agregar ${col.name}`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/30"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              ))}
            </div>

            {/* Current Selected Colors List */}
            <div className="flex flex-wrap gap-2 mb-3">
              {colors.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-[#F2EBDD] border border-[#D4C4A8] px-2.5 py-1 text-xs font-medium"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    className="text-red-600 hover:text-red-800 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Manual Color Add */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nombre color personalizado..."
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="bg-[#F9F8F5] border border-[#D4C4A8] text-xs text-[#111111] px-3 py-1.5 focus:outline-none flex-1"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-8 h-8 p-0 border border-[#D4C4A8] cursor-pointer"
                title="Seleccionar tono hex"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 bg-[#111111] text-[#F9F8F5] text-xs font-bold uppercase"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Row 7: Sizes and Inventory Control */}
          <div className="bg-white p-4 border border-[#D4C4A8]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Tallas e Inventario en Existencia *
                </label>
                <p className="text-[10px] text-[#777]">
                  Stock total calculado: <strong className="text-[#111111]">{totalStockCalc} unidades</strong>
                </p>
              </div>

              {/* Template Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => applySizeTemplate('jeans', 'hombre')}
                  className="px-2 py-1 bg-[#F2EBDD] hover:bg-[#E6D5B8] text-[10px] font-bold uppercase border border-[#D4C4A8]"
                >
                  Tallas Jeans H (28-42)
                </button>
                <button
                  type="button"
                  onClick={() => applySizeTemplate('jeans', 'mujer')}
                  className="px-2 py-1 bg-[#F2EBDD] hover:bg-[#E6D5B8] text-[10px] font-bold uppercase border border-[#D4C4A8]"
                >
                  Tallas Jeans M (24-36)
                </button>
                <button
                  type="button"
                  onClick={() => applySizeTemplate('camisetas', 'hombre')}
                  className="px-2 py-1 bg-[#F2EBDD] hover:bg-[#E6D5B8] text-[10px] font-bold uppercase border border-[#D4C4A8]"
                >
                  Tallas Camisetas (XS-XXL)
                </button>
              </div>
            </div>

            {/* Grid of Sizes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-3">
              {variants.map((v) => (
                <div
                  key={v.size}
                  className="p-2 border border-[#D4C4A8] bg-[#F9F8F5] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#111111]">Talla {v.size}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(v.size)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar talla"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-[#777]">Stock:</span>
                    <input
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) => handleVariantStockChange(v.size, parseInt(e.target.value, 10) || 0)}
                      className="w-16 bg-white border border-[#D4C4A8] text-xs font-mono font-bold text-center py-0.5 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Size */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nueva talla (Ej. 44, 3XL)..."
                value={newCustomSize}
                onChange={(e) => setNewCustomSize(e.target.value)}
                className="bg-[#F9F8F5] border border-[#D4C4A8] text-xs text-[#111111] px-3 py-1.5 focus:outline-none w-48"
              />
              <button
                type="button"
                onClick={handleAddCustomSize}
                className="px-3 py-1.5 bg-[#111111] text-[#F9F8F5] text-xs font-bold uppercase"
              >
                Agregar Talla
              </button>
            </div>
          </div>

          {/* Row 8: Images */}
          <div className="bg-white p-4 border border-[#D4C4A8]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
              Galería de Imágenes *
            </label>

            {/* Upload or URL */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#E6D5B8] hover:bg-[#F2EBDD] text-[#111111] text-xs font-bold uppercase tracking-wider transition-colors border border-[#D4C4A8]">
                <Upload className="w-4 h-4" />
                <span>{uploadingImage ? 'Subiendo...' : 'Subir Imagen Local'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="O pegar URL de imagen..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 bg-[#F9F8F5] border border-[#D4C4A8] text-xs text-[#111111] px-3 py-1.5 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 bg-[#111111] text-[#F9F8F5] text-xs font-bold uppercase"
                >
                  Agregar URL
                </button>
              </div>
            </div>

            {/* Thumbnails list */}
            <div className="flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-24 border border-[#D4C4A8] bg-[#F2EBDD] group overflow-hidden"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                    title="Eliminar imagen"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[9px] text-center font-bold uppercase py-0.5">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Row 9: Toggles */}
          <div className="flex flex-wrap items-center gap-6 p-4 bg-[#F2EBDD]/40 border border-[#D4C4A8]/60">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-[#111111]">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded-none text-[#111111] focus:ring-0"
              />
              <span>Destacar en Portada / Selección Premium</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-[#111111]">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded-none text-[#111111] focus:ring-0"
              />
              <span>Activo en Tienda (Visible para clientes)</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4C4A8]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 bg-white border border-[#D4C4A8] text-[#111111] hover:bg-[#F2EBDD] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-2.5 bg-[#111111] hover:bg-[#9E8B6E] text-[#F9F8F5] text-xs font-bold uppercase tracking-wider transition-colors shadow flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Crear Prenda'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
