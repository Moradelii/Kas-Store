import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { StoreContent, GenderCategory, Brand } from '../types/index.ts';

interface CategoriesProps {
  content: StoreContent;
  onSelectCategory?: (category: 'jeans' | 'camisetas') => void;
  onApplyFilter: (filter: {
    category?: 'all' | 'jeans' | 'camisetas';
    gender?: 'all' | GenderCategory;
    brand?: 'all' | Brand;
  }) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ content, onApplyFilter }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#F9F8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Banner Bar */}
        <div className="mb-14 p-6 sm:p-8 bg-[#111111] text-[#F9F8F5] border border-[#2A2A2A] shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#E6D5B8] text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-[#E6D5B8]" />
              <span>Garantía de Autenticidad</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading tracking-wide">
              MARCAS INTERNACIONALES DISPONIBLES
            </h3>
            <p className="text-xs sm:text-sm text-[#AAA] mt-1 max-w-lg font-light">
              Explora las colecciones oficiales de Pepe Jeans London, Levi's Strauss y Tommy Hilfiger seleccionadas para Honduras.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onApplyFilter({ brand: "Levi's" })}
              className="px-5 py-3 bg-[#1F1F1F] hover:bg-[#E6D5B8] hover:text-[#111111] text-[#F9F8F5] border border-[#444] text-xs font-extrabold tracking-widest uppercase transition-all duration-300"
            >
              LEVI'S
            </button>
            <button
              onClick={() => onApplyFilter({ brand: 'Pepe' })}
              className="px-5 py-3 bg-[#1F1F1F] hover:bg-[#E6D5B8] hover:text-[#111111] text-[#F9F8F5] border border-[#444] text-xs font-extrabold tracking-widest uppercase transition-all duration-300"
            >
              PEPE JEANS
            </button>
            <button
              onClick={() => onApplyFilter({ brand: 'Tommy' })}
              className="px-5 py-3 bg-[#1F1F1F] hover:bg-[#E6D5B8] hover:text-[#111111] text-[#F9F8F5] border border-[#444] text-xs font-extrabold tracking-widest uppercase transition-all duration-300"
            >
              TOMMY HILFIGER
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E6D5B8]/60">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#9E8B6E] font-semibold">
              Departamentos & Prendas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight font-heading mt-1">
              CATEGORÍAS PRINCIPALES
            </h2>
          </div>
          <p className="text-sm text-[#555] max-w-md mt-2 md:mt-0 font-light">
            Esenciales para hombre y mujer diseñados para proyectar presencia y sofisticación en cada postura.
          </p>
        </div>

        {/* 4-Box Visual Grid: Jeans Hombre, Jeans Mujer, Camisetas Hombre, Camisetas Mujer */}
        {(() => {
          const cat = content.categories || ({} as any);
          const jeansHombre = cat.jeansHombre || {
            title: 'JEANS HOMBRE',
            subtitle: "Cortes Slim, Straight, Athletic y Relaxed en denim selvedge resistente para hombre.",
            image: cat.jeansImage || '/assets/images/kas_category_jeans_1793516509180.jpg',
            brands: 'Pepe, Levi´s, Tommy'
          };
          const jeansMujer = cat.jeansMujer || {
            title: 'JEANS MUJER',
            subtitle: 'Tiro alto Sculpt, Ribcage Wide Leg, Mom fit y calces estilizadores con máxima comodidad.',
            image: cat.jeansImage || '/assets/images/kas_category_jeans_1793516509180.jpg',
            brands: 'Pepe, Levi´s, Tommy'
          };
          const camisetasHombre = cat.camisetasHombre || {
            title: 'CAMISETAS HOMBRE',
            subtitle: 'Algodón peinado 240g, cuello redondo estructurado, siluetas Boxy y Regular de alto gramaje.',
            image: cat.camisetasImage || '/assets/images/kas_category_tees_1793516510873.jpg',
            brands: "Tommy Hilfiger, Levi's, Calvin Klein, Guess"
          };
          const camisetasMujer = cat.camisetasMujer || {
            title: 'CAMISETAS MUJER',
            subtitle: 'Escote en V suave, The Perfect Tee, cortes entallados y tejidos de algodón de tacto sedoso.',
            image: cat.camisetasImage || '/assets/images/kas_category_tees_1793516510873.jpg',
            brands: "Tommy Hilfiger, Levi's, Pepe Jeans, Guess"
          };

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 1. Jeans Hombre */}
              <div
                onClick={() => onApplyFilter({ category: 'jeans', gender: 'hombre' })}
                className="group relative h-[400px] overflow-hidden cursor-pointer bg-[#1A1A1A] flex flex-col justify-end p-6 border border-[#E6D5B8]/40 shadow-sm transition-all hover:border-[#E6D5B8] hover:shadow-xl"
              >
                <img
                  src={jeansHombre.image || '/assets/images/kas_category_jeans_1793516509180.jpg'}
                  alt={jeansHombre.title}
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/95 via-[#111111]/45 to-transparent" />
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#E6D5B8] text-[10px] font-bold tracking-widest uppercase">
                      Departamento Hombre
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#F9F8F5] font-heading leading-tight">
                    {jeansHombre.title}
                  </h3>
                  {jeansHombre.brands && (
                    <div className="inline-block px-2.5 py-0.5 bg-[#111111]/90 border border-[#E6D5B8]/40 text-[#E6D5B8] text-[10px] font-bold tracking-wider uppercase">
                      Marcas: {jeansHombre.brands}
                    </div>
                  )}
                  <p className="text-xs text-[#DDD] font-light line-clamp-2">
                    {jeansHombre.subtitle}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#E6D5B8] group-hover:text-white font-bold tracking-wider uppercase">
                      <span>Ver {jeansHombre.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Jeans Mujer */}
              <div
                onClick={() => onApplyFilter({ category: 'jeans', gender: 'mujer' })}
                className="group relative h-[400px] overflow-hidden cursor-pointer bg-[#1A1A1A] flex flex-col justify-end p-6 border border-[#E6D5B8]/40 shadow-sm transition-all hover:border-[#E6D5B8] hover:shadow-xl"
              >
                <img
                  src={jeansMujer.image || '/assets/images/kas_category_jeans_1793516509180.jpg'}
                  alt={jeansMujer.title}
                  className="absolute inset-0 w-full h-full object-cover object-[center_20%] filter brightness-90 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/95 via-[#111111]/45 to-transparent" />
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#E6D5B8] text-[10px] font-bold tracking-widest uppercase">
                      Departamento Mujer
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#F9F8F5] font-heading leading-tight">
                    {jeansMujer.title}
                  </h3>
                  {jeansMujer.brands && (
                    <div className="inline-block px-2.5 py-0.5 bg-[#111111]/90 border border-[#E6D5B8]/40 text-[#E6D5B8] text-[10px] font-bold tracking-wider uppercase">
                      Marcas: {jeansMujer.brands}
                    </div>
                  )}
                  <p className="text-xs text-[#DDD] font-light line-clamp-2">
                    {jeansMujer.subtitle}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#E6D5B8] group-hover:text-white font-bold tracking-wider uppercase">
                      <span>Ver {jeansMujer.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Camisetas Hombre */}
              <div
                onClick={() => onApplyFilter({ category: 'camisetas', gender: 'hombre' })}
                className="group relative h-[400px] overflow-hidden cursor-pointer bg-[#1A1A1A] flex flex-col justify-end p-6 border border-[#E6D5B8]/40 shadow-sm transition-all hover:border-[#E6D5B8] hover:shadow-xl"
              >
                <img
                  src={camisetasHombre.image || '/assets/images/kas_category_tees_1793516510873.jpg'}
                  alt={camisetasHombre.title}
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/95 via-[#111111]/45 to-transparent" />
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#E6D5B8] text-[10px] font-bold tracking-widest uppercase">
                      Departamento Hombre
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#F9F8F5] font-heading leading-tight">
                    {camisetasHombre.title}
                  </h3>
                  {camisetasHombre.brands && (
                    <div className="inline-block px-2.5 py-0.5 bg-[#111111]/90 border border-[#E6D5B8]/40 text-[#E6D5B8] text-[10px] font-bold tracking-wider uppercase">
                      Marcas: {camisetasHombre.brands}
                    </div>
                  )}
                  <p className="text-xs text-[#DDD] font-light line-clamp-2">
                    {camisetasHombre.subtitle}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#E6D5B8] group-hover:text-white font-bold tracking-wider uppercase">
                      <span>Ver {camisetasHombre.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Camisetas Mujer */}
              <div
                onClick={() => onApplyFilter({ category: 'camisetas', gender: 'mujer' })}
                className="group relative h-[400px] overflow-hidden cursor-pointer bg-[#1A1A1A] flex flex-col justify-end p-6 border border-[#E6D5B8]/40 shadow-sm transition-all hover:border-[#E6D5B8] hover:shadow-xl"
              >
                <img
                  src={camisetasMujer.image || '/assets/images/kas_category_tees_1793516510873.jpg'}
                  alt={camisetasMujer.title}
                  className="absolute inset-0 w-full h-full object-cover object-[center_30%] filter brightness-90 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/95 via-[#111111]/45 to-transparent" />
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#E6D5B8] text-[10px] font-bold tracking-widest uppercase">
                      Departamento Mujer
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#F9F8F5] font-heading leading-tight">
                    {camisetasMujer.title}
                  </h3>
                  {camisetasMujer.brands && (
                    <div className="inline-block px-2.5 py-0.5 bg-[#111111]/90 border border-[#E6D5B8]/40 text-[#E6D5B8] text-[10px] font-bold tracking-wider uppercase">
                      Marcas: {camisetasMujer.brands}
                    </div>
                  )}
                  <p className="text-xs text-[#DDD] font-light line-clamp-2">
                    {camisetasMujer.subtitle}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#E6D5B8] group-hover:text-white font-bold tracking-wider uppercase">
                      <span>Ver {camisetasMujer.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
};
