import React, { useState } from 'react';
import { Save, Check, Upload } from 'lucide-react';
import { StoreContent } from '../../types/index.ts';
import { updateStoreContent, uploadImageFile } from '../../services/api.ts';

interface AdminContentProps {
  content: StoreContent;
  onContentUpdated: (updated: StoreContent) => void;
}

export const AdminContent: React.FC<AdminContentProps> = ({ content, onContentUpdated }) => {
  const [formData, setFormData] = useState<StoreContent>(() => {
    const cat = content.categories || ({} as any);
    return {
      ...content,
      categories: {
        ...cat,
        jeansHombre: cat.jeansHombre || {
          title: 'JEANS HOMBRE',
          subtitle: "Cortes Slim, Straight, Athletic y Relaxed en denim selvedge resistente para hombre.",
          image: cat.jeansImage || '/assets/images/kas_category_jeans_1793516509180.jpg',
          brands: 'Pepe, Levi´s, Tommy'
        },
        jeansMujer: cat.jeansMujer || {
          title: 'JEANS MUJER',
          subtitle: 'Tiro alto Sculpt, Ribcage Wide Leg, Mom fit y calces estilizadores con máxima comodidad.',
          image: cat.jeansImage || '/assets/images/kas_category_jeans_1793516509180.jpg',
          brands: 'Pepe, Levi´s, Tommy'
        },
        camisetasHombre: cat.camisetasHombre || {
          title: 'CAMISETAS HOMBRE',
          subtitle: 'Algodón peinado 240g, cuello redondo estructurado, siluetas Boxy y Regular de alto gramaje.',
          image: cat.camisetasImage || '/assets/images/kas_category_tees_1793516510873.jpg',
          brands: "Tommy Hilfiger, Levi's, Calvin Klein, Guess"
        },
        camisetasMujer: cat.camisetasMujer || {
          title: 'CAMISETAS MUJER',
          subtitle: 'Escote en V suave, The Perfect Tee, cortes entallados y tejidos de algodón de tacto sedoso.',
          image: cat.camisetasImage || '/assets/images/kas_category_tees_1793516510873.jpg',
          brands: "Tommy Hilfiger, Levi's, Pepe Jeans, Guess"
        }
      }
    };
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingTarget('hero');
    try {
      const url = await uploadImageFile(file);
      setFormData(prev => ({
        ...prev,
        hero: { ...prev.hero, imageUrl: url }
      }));
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleCategoryImageUpload = async (
    catKey: 'jeansHombre' | 'jeansMujer' | 'camisetasHombre' | 'camisetasMujer',
    file: File
  ) => {
    setUploadingTarget(catKey);
    try {
      const url = await uploadImageFile(file);
      setFormData(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [catKey]: {
            ...prev.categories[catKey],
            image: url
          }
        }
      }));
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateStoreContent(formData);
      onContentUpdated(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Banner Notice */}
      <div className="bg-white p-5 border border-[#D4C4A8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
            Gestión de Textos, Portadas y Banners
          </h3>
          <p className="text-xs text-[#666]">
            Modifica la identidad visual y los contenidos promocionales de la tienda online sin alterar el código.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#111111] hover:bg-[#9E8B6E] text-[#F9F8F5] text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Guardando...' : 'Guardar Todo'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Los cambios de contenido se guardaron correctamente en la base de datos.</span>
        </div>
      )}

      {/* 1. Announcement Bar */}
      <div className="bg-white p-6 border border-[#D4C4A8] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6D5B8]/60">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
            1. Barra Superior de Anuncios
          </h4>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
            <input
              type="checkbox"
              checked={formData.announcement.enabled}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  announcement: { ...formData.announcement, enabled: e.target.checked }
                })
              }
              className="w-4 h-4 text-[#111111] border-[#D4C4A8]"
            />
            <span>Mostrar barra superior</span>
          </label>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
            Texto del Anuncio
          </label>
          <input
            type="text"
            value={formData.announcement.text}
            onChange={(e) =>
              setFormData({
                ...formData,
                announcement: { ...formData.announcement, text: e.target.value }
              })
            }
            className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3.5 py-2 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Hero Section */}
      <div className="bg-white p-6 border border-[#D4C4A8] space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111] pb-3 border-b border-[#E6D5B8]/60">
          2. Portada Principal (Hero Section)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
              Lema Superior (Tagline)
            </label>
            <input
              type="text"
              value={formData.hero.tagline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, tagline: e.target.value }
                })
              }
              className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3.5 py-2 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
              Título Principal
            </label>
            <input
              type="text"
              value={formData.hero.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, title: e.target.value }
                })
              }
              className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3.5 py-2 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
            Subtítulo Descriptivo
          </label>
          <textarea
            rows={2}
            value={formData.hero.subtitle}
            onChange={(e) =>
              setFormData({
                ...formData,
                hero: { ...formData.hero, subtitle: e.target.value }
              })
            }
            className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3.5 py-2 text-xs focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
              Texto Botón Principal
            </label>
            <input
              type="text"
              value={formData.hero.primaryBtnText}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, primaryBtnText: e.target.value }
                })
              }
              className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3.5 py-2 text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
              Texto Botón Secundario
            </label>
            <input
              type="text"
              value={formData.hero.secondaryBtnText}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, secondaryBtnText: e.target.value }
                })
              }
              className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3.5 py-2 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Hero Image */}
        <div className="pt-2">
          <label className="block text-xs font-bold uppercase text-[#111111] mb-1">
            Fotografía Editorial de Portada
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <img
              src={formData.hero.imageUrl}
              alt="Portada actual"
              className="w-48 h-28 object-cover bg-[#F2EBDD] border border-[#D4C4A8]"
            />
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={formData.hero.imageUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, imageUrl: e.target.value }
                  })
                }
                className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
              />
              <label className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F2EBDD] hover:bg-[#E6D5B8] text-[#111111] border border-[#D4C4A8] text-xs font-bold uppercase cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingTarget === 'hero' ? 'Cargando...' : 'Reemplazar Fotografía'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Banners */}
      <div className="bg-white p-6 border border-[#D4C4A8] space-y-6">
        <div className="pb-3 border-b border-[#E6D5B8]/60">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
            3. Banners de Categorías Principales (Home)
          </h4>
          <p className="text-[11px] text-[#666] mt-0.5">
            Configura las 4 fichas destacadas en la sección "Departamentos & Prendas CATEGORÍAS PRINCIPALES" de la página de inicio.
          </p>
        </div>

        {/* 1. Ficha: JEANS HOMBRE */}
        <div className="p-5 bg-[#F9F8F5] border border-[#D4C4A8] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6D5B8]">
            <h5 className="text-xs font-extrabold uppercase text-[#111111] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#9E8B6E] inline-block"></span>
              <span>CATEGORÍA: JEANS HOMBRE</span>
            </h5>
            <span className="text-[10px] bg-[#E6D5B8] text-[#111111] px-2 py-0.5 font-bold uppercase">
              Pepe, Levi´s, Tommy
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1">
                Título del Banner
              </label>
              <input
                type="text"
                value={formData.categories.jeansHombre.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories: {
                      ...formData.categories,
                      jeansHombre: { ...formData.categories.jeansHombre, title: e.target.value }
                    }
                  })
                }
                className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#9E8B6E]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1">
                Marcas Destacadas
              </label>
              <input
                type="text"
                value={formData.categories.jeansHombre.brands}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories: {
                      ...formData.categories,
                      jeansHombre: { ...formData.categories.jeansHombre, brands: e.target.value }
                    }
                  })
                }
                placeholder="Pepe, Levi´s, Tommy"
                className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none focus:border-[#9E8B6E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1">
              Subtítulo / Descripción
            </label>
            <input
              type="text"
              value={formData.categories.jeansHombre.subtitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categories: {
                    ...formData.categories,
                    jeansHombre: { ...formData.categories.jeansHombre, subtitle: e.target.value }
                  }
                })
              }
              className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none focus:border-[#9E8B6E]"
            />
          </div>

          {/* Imagen y Botón para subir */}
          <div>
            <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1.5">
              Imagen de Portada (Banner)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={formData.categories.jeansHombre.image || '/assets/images/kas_category_jeans_1793516509180.jpg'}
                alt="Jeans Hombre"
                className="w-24 h-24 object-cover border border-[#D4C4A8] bg-[#111111] shadow-inner"
              />
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={formData.categories.jeansHombre.image}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categories: {
                        ...formData.categories,
                        jeansHombre: { ...formData.categories.jeansHombre, image: e.target.value }
                      }
                    })
                  }
                  placeholder="URL o ruta de imagen"
                  className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
                />
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E6D5B8] hover:bg-[#F2EBDD] text-[#111111] text-xs font-extrabold uppercase border border-[#D4C4A8] cursor-pointer transition-colors shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingTarget === 'jeansHombre' ? 'Subiendo imagen...' : 'Subir Imagen Jeans Hombre'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleCategoryImageUpload('jeansHombre', e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Ficha: JEANS MUJER */}
        <div className="p-5 bg-[#F9F8F5] border border-[#D4C4A8] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6D5B8]">
            <h5 className="text-xs font-extrabold uppercase text-[#111111] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#9E8B6E] inline-block"></span>
              <span>CATEGORÍA: JEANS MUJER</span>
            </h5>
            <span className="text-[10px] bg-[#E6D5B8] text-[#111111] px-2 py-0.5 font-bold uppercase">
              Pepe, Levi´s, Tommy
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1">
                Título del Banner
              </label>
              <input
                type="text"
                value={formData.categories.jeansMujer.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories: {
                      ...formData.categories,
                      jeansMujer: { ...formData.categories.jeansMujer, title: e.target.value }
                    }
                  })
                }
                className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#9E8B6E]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1">
                Marcas Destacadas
              </label>
              <input
                type="text"
                value={formData.categories.jeansMujer.brands}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories: {
                      ...formData.categories,
                      jeansMujer: { ...formData.categories.jeansMujer, brands: e.target.value }
                    }
                  })
                }
                placeholder="Pepe, Levi´s, Tommy"
                className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none focus:border-[#9E8B6E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1">
              Subtítulo / Descripción
            </label>
            <input
              type="text"
              value={formData.categories.jeansMujer.subtitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categories: {
                    ...formData.categories,
                    jeansMujer: { ...formData.categories.jeansMujer, subtitle: e.target.value }
                  }
                })
              }
              className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none focus:border-[#9E8B6E]"
            />
          </div>

          {/* Imagen y Botón para subir */}
          <div>
            <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1.5">
              Imagen de Portada (Banner)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={formData.categories.jeansMujer.image || '/assets/images/kas_category_jeans_1793516509180.jpg'}
                alt="Jeans Mujer"
                className="w-24 h-24 object-cover border border-[#D4C4A8] bg-[#111111] shadow-inner"
              />
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={formData.categories.jeansMujer.image}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categories: {
                        ...formData.categories,
                        jeansMujer: { ...formData.categories.jeansMujer, image: e.target.value }
                      }
                    })
                  }
                  placeholder="URL o ruta de imagen"
                  className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
                />
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E6D5B8] hover:bg-[#F2EBDD] text-[#111111] text-xs font-extrabold uppercase border border-[#D4C4A8] cursor-pointer transition-colors shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingTarget === 'jeansMujer' ? 'Subiendo imagen...' : 'Subir Imagen Jeans Mujer'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleCategoryImageUpload('jeansMujer', e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Ficha: CAMISETAS HOMBRE */}
        <div className="p-5 bg-[#F9F8F5] border border-[#D4C4A8] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6D5B8]">
            <h5 className="text-xs font-extrabold uppercase text-[#111111] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#9E8B6E] inline-block"></span>
              <span>CATEGORÍA: CAMISETAS HOMBRE</span>
            </h5>
            <span className="text-[10px] bg-[#E6D5B8] text-[#111111] px-2 py-0.5 font-bold uppercase">
              Marcas Provisionales
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1">
                Título del Banner
              </label>
              <input
                type="text"
                value={formData.categories.camisetasHombre.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories: {
                      ...formData.categories,
                      camisetasHombre: { ...formData.categories.camisetasHombre, title: e.target.value }
                    }
                  })
                }
                className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#9E8B6E]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1">
                Marcas Destacadas (Provisionales)
              </label>
              <input
                type="text"
                value={formData.categories.camisetasHombre.brands}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories: {
                      ...formData.categories,
                      camisetasHombre: { ...formData.categories.camisetasHombre, brands: e.target.value }
                    }
                  })
                }
                placeholder="Tommy Hilfiger, Levi's, Calvin Klein, Guess"
                className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none focus:border-[#9E8B6E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1">
              Subtítulo / Descripción
            </label>
            <input
              type="text"
              value={formData.categories.camisetasHombre.subtitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categories: {
                    ...formData.categories,
                    camisetasHombre: { ...formData.categories.camisetasHombre, subtitle: e.target.value }
                  }
                })
              }
              className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none focus:border-[#9E8B6E]"
            />
          </div>

          {/* Imagen y Botón para subir */}
          <div>
            <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1.5">
              Imagen de Portada (Banner)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={formData.categories.camisetasHombre.image || '/assets/images/kas_category_tees_1793516510873.jpg'}
                alt="Camisetas Hombre"
                className="w-24 h-24 object-cover border border-[#D4C4A8] bg-[#111111] shadow-inner"
              />
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={formData.categories.camisetasHombre.image}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categories: {
                        ...formData.categories,
                        camisetasHombre: { ...formData.categories.camisetasHombre, image: e.target.value }
                      }
                    })
                  }
                  placeholder="URL o ruta de imagen"
                  className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
                />
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E6D5B8] hover:bg-[#F2EBDD] text-[#111111] text-xs font-extrabold uppercase border border-[#D4C4A8] cursor-pointer transition-colors shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingTarget === 'camisetasHombre' ? 'Subiendo imagen...' : 'Subir Imagen Camisetas Hombre'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleCategoryImageUpload('camisetasHombre', e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Ficha: CAMISETAS MUJER */}
        <div className="p-5 bg-[#F9F8F5] border border-[#D4C4A8] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6D5B8]">
            <h5 className="text-xs font-extrabold uppercase text-[#111111] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#9E8B6E] inline-block"></span>
              <span>CATEGORÍA: CAMISETAS MUJER</span>
            </h5>
            <span className="text-[10px] bg-[#E6D5B8] text-[#111111] px-2 py-0.5 font-bold uppercase">
              Marcas Provisionales
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1">
                Título del Banner
              </label>
              <input
                type="text"
                value={formData.categories.camisetasMujer.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories: {
                      ...formData.categories,
                      camisetasMujer: { ...formData.categories.camisetasMujer, title: e.target.value }
                    }
                  })
                }
                className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#9E8B6E]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1">
                Marcas Destacadas (Provisionales)
              </label>
              <input
                type="text"
                value={formData.categories.camisetasMujer.brands}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories: {
                      ...formData.categories,
                      camisetasMujer: { ...formData.categories.camisetasMujer, brands: e.target.value }
                    }
                  })
                }
                placeholder="Tommy Hilfiger, Levi's, Pepe Jeans, Guess"
                className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none focus:border-[#9E8B6E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1">
              Subtítulo / Descripción
            </label>
            <input
              type="text"
              value={formData.categories.camisetasMujer.subtitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categories: {
                    ...formData.categories,
                    camisetasMujer: { ...formData.categories.camisetasMujer, subtitle: e.target.value }
                  }
                })
              }
              className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none focus:border-[#9E8B6E]"
            />
          </div>

          {/* Imagen y Botón para subir */}
          <div>
            <label className="block text-[11px] font-bold text-[#111111] uppercase mb-1.5">
              Imagen de Portada (Banner)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={formData.categories.camisetasMujer.image || '/assets/images/kas_category_tees_1793516510873.jpg'}
                alt="Camisetas Mujer"
                className="w-24 h-24 object-cover border border-[#D4C4A8] bg-[#111111] shadow-inner"
              />
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={formData.categories.camisetasMujer.image}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categories: {
                        ...formData.categories,
                        camisetasMujer: { ...formData.categories.camisetasMujer, image: e.target.value }
                      }
                    })
                  }
                  placeholder="URL o ruta de imagen"
                  className="w-full bg-white border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
                />
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E6D5B8] hover:bg-[#F2EBDD] text-[#111111] text-xs font-extrabold uppercase border border-[#D4C4A8] cursor-pointer transition-colors shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingTarget === 'camisetasMujer' ? 'Subiendo imagen...' : 'Subir Imagen Camisetas Mujer'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleCategoryImageUpload('camisetasMujer', e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-[#111111] hover:bg-[#9E8B6E] text-[#F9F8F5] text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Guardando...' : 'Guardar Todos los Cambios'}</span>
        </button>
      </div>
    </form>
  );
};
