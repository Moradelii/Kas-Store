import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Sparkles, CheckCircle2, Shield, Truck, MessageCircle } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { api, DEFAULT_HOME_CONFIG, HomeConfig } from '../services/api';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

interface HomePageProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onSelectProduct: (productId: string) => void;
  onOpenSizeGuide: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
  onOpenSizeGuide,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [productsList, setProductsList] = useState<Product[]>(MOCK_PRODUCTS);
  const [homeConfig, setHomeConfig] = useState<HomeConfig>(DEFAULT_HOME_CONFIG);

  useEffect(() => {
    let active = true;
    api.getConfig().then((cfg) => {
      if (active && cfg) {
        if (cfg.home) {
          setHomeConfig(cfg.home);
        }
        if (cfg.products && cfg.products.length > 0) {
          setProductsList(cfg.products);
        }
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const featuredProducts = productsList.filter((p) => p.isFeatured).slice(0, 4);
  const newReleases = productsList.filter((p) => p.isNew).slice(0, 4);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = homeConfig.faqs || DEFAULT_HOME_CONFIG.faqs;

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Editorial Hero Section */}
      <section className="relative bg-[#E8DEC9]/40 overflow-hidden border-b border-[#D9CCB8]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          {/* Logo Oficial KAS Store Destacado Centrado */}
          <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12">
            <div className="group relative p-4 sm:p-6 md:p-7 bg-[#FFFEFC] rounded-2xl border-2 border-[#D9CCB8] shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex flex-col items-center justify-center max-w-[300px] sm:max-w-[420px] md:max-w-[480px]">
              <img
                src="/images/logo/Logotipo_KAS_Store_9c74b5ef.png"
                alt="KAS Store - Logotipo Oficial"
                className="h-28 sm:h-36 md:h-44 w-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="mt-2 text-center">
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase text-[#8A622A]">
                  {homeConfig.hero.tagline}
                </span>
              </div>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#8A622A] bg-[#FFFEFC] px-4 py-1.5 rounded-full border border-[#D9CCB8] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B88B4A]" />
              {homeConfig.hero.badgeText}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2721] leading-[1.1] tracking-tight">
                {homeConfig.hero.titleLine1} <br />
                <span className="italic font-normal text-[#B88B4A]">{homeConfig.hero.titleLine2}</span>
              </h1>

              <p className="text-sm sm:text-base text-[#2E2721]/80 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
                {homeConfig.hero.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('catalog')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#B88B4A] hover:bg-[#8A622A] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {homeConfig.hero.ctaButtonText || 'Comprar colección'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('catalog', { isNewOnly: 'true' })}
                  className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[#2E2721] hover:bg-[#E8DEC9]/60 text-[#2E2721] text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                >
                  Descubrir novedades
                </button>
              </div>

              {/* Sub-trust markers */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#2E2721]/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B88B4A]" />
                  Envíos a todo Honduras
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B88B4A]" />
                  Mezclilla para toda la familia
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B88B4A]" />
                  Tallas Adulto & Infantil
                </span>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden border-2 border-[#D9CCB8] shadow-xl bg-[#FAF7F2]">
                <img
                  src={homeConfig.hero.heroImage}
                  alt="Pantalones de mezclilla KAS Store"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-[#FFFEFC] flex items-center justify-between text-xs">
                  <span className="bg-[#2E2721]/90 backdrop-blur-xs px-3.5 py-1.5 uppercase tracking-wider text-[11px] font-medium border border-[#D9CCB8]/30">
                    KAS Store · Nuevas Tonalidades & Estilos
                  </span>
                  <span className="text-[11px] tracking-wide text-[#E8DEC9] bg-[#2E2721]/80 px-2.5 py-1">
                    Mezclilla Genuina
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Main Categories Grid: Hombre, Mujer, Niño, Niña */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A622A]">
              {homeConfig.categories.sectionSubtitle}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2721] mt-1">
              {homeConfig.categories.sectionTitle}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-semibold text-[#B88B4A] hover:text-[#8A622A] uppercase tracking-wider inline-flex items-center gap-1 self-start md:self-auto"
          >
            Ver toda la mezclilla
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Hombre */}
          <div
            onClick={() => onNavigate('catalog', { gender: 'hombre' })}
            className="group relative cursor-pointer overflow-hidden border border-[#E8DEC9] bg-[#FFFEFC]"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={homeConfig.categories.menImage}
                alt={homeConfig.categories.menTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E2721]/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-[#FFFEFC]">
              <span className="text-[10px] uppercase tracking-widest text-[#E8DEC9]">Caballeros</span>
              <h3 className="font-serif text-lg font-bold mt-0.5">{homeConfig.categories.menTitle}</h3>
              <p className="text-xs text-[#E8DEC9]/80 mt-0.5">{homeConfig.categories.menSubtitle}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#FFFEFC] group-hover:text-[#E8DEC9]">
                Ver jeans hombre <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 2: Mujer */}
          <div
            onClick={() => onNavigate('catalog', { gender: 'mujer' })}
            className="group relative cursor-pointer overflow-hidden border border-[#E8DEC9] bg-[#FFFEFC]"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={homeConfig.categories.womenImage}
                alt={homeConfig.categories.womenTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E2721]/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-[#FFFEFC]">
              <span className="text-[10px] uppercase tracking-widest text-[#E8DEC9]">Damas</span>
              <h3 className="font-serif text-lg font-bold mt-0.5">{homeConfig.categories.womenTitle}</h3>
              <p className="text-xs text-[#E8DEC9]/80 mt-0.5">{homeConfig.categories.womenSubtitle}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#FFFEFC] group-hover:text-[#E8DEC9]">
                Ver jeans mujer <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 3: Niño */}
          <div
            onClick={() => onNavigate('catalog', { gender: 'nino' })}
            className="group relative cursor-pointer overflow-hidden border border-[#E8DEC9] bg-[#FFFEFC]"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={homeConfig.categories.kidsBoyImage}
                alt={homeConfig.categories.kidsBoyTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E2721]/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-[#FFFEFC]">
              <span className="text-[10px] uppercase tracking-widest text-[#E8DEC9]">Infantil</span>
              <h3 className="font-serif text-lg font-bold mt-0.5">{homeConfig.categories.kidsBoyTitle}</h3>
              <p className="text-xs text-[#E8DEC9]/80 mt-0.5">{homeConfig.categories.kidsBoySubtitle}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#FFFEFC] group-hover:text-[#E8DEC9]">
                Ver colección niño <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 4: Niña */}
          <div
            onClick={() => onNavigate('catalog', { gender: 'nina' })}
            className="group relative cursor-pointer overflow-hidden border border-[#E8DEC9] bg-[#FFFEFC]"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={homeConfig.categories.kidsGirlImage}
                alt={homeConfig.categories.kidsGirlTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E2721]/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-[#FFFEFC]">
              <span className="text-[10px] uppercase tracking-widest text-[#E8DEC9]">Infantil</span>
              <h3 className="font-serif text-lg font-bold mt-0.5">{homeConfig.categories.kidsGirlTitle}</h3>
              <p className="text-xs text-[#E8DEC9]/80 mt-0.5">{homeConfig.categories.kidsGirlSubtitle}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#FFFEFC] group-hover:text-[#E8DEC9]">
                Ver colección niña <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A622A]">
              Selección de Mezclilla
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2721] mt-1">
              Pantalones de Mezclilla Destacados
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-semibold text-[#B88B4A] hover:text-[#8A622A] uppercase tracking-wider inline-flex items-center gap-1 self-start md:self-auto"
          >
            Ver catálogo completo ({productsList.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Promotional Editorial Spotlight */}
      <section className="bg-[#2E2721] text-[#FAF7F2] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative aspect-[4/3] overflow-hidden border-2 border-[#8A622A]/60 shadow-2xl bg-black">
              <img
                src={homeConfig.editorial.image}
                alt={homeConfig.editorial.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs flex flex-wrap gap-1.5">
                <span className="bg-[#B88B4A] text-[#FFFEFC] px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                  5 Nuevas Tonalidades
                </span>
                <span className="bg-[#2E2721]/90 text-[#E8DEC9] px-2 py-0.5 text-[10px] tracking-wider border border-[#D9CCB8]/30">
                  Índigo · Stone · Celeste · Negro · Ecru
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 lg:pl-6">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E8DEC9]">
                {homeConfig.editorial.badge}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFFEFC] leading-snug">
                {homeConfig.editorial.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#E8DEC9]/80 leading-relaxed font-normal">
                {homeConfig.editorial.paragraph1}
              </p>
              <p className="text-xs sm:text-sm text-[#E8DEC9]/80 leading-relaxed font-normal">
                {homeConfig.editorial.paragraph2}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="border border-[#FAF7F2]/10 p-3 bg-[#FAF7F2]/5">
                  <span className="block font-serif text-lg font-bold text-[#FFFEFC]">4 Líneas</span>
                  <span className="text-[11px] text-[#E8DEC9]/70">Hombre, Mujer, Niño, Niña</span>
                </div>
                <div className="border border-[#FAF7F2]/10 p-3 bg-[#FAF7F2]/5">
                  <span className="block font-serif text-lg font-bold text-[#FFFEFC]">Garantía</span>
                  <span className="text-[11px] text-[#E8DEC9]/70">Cambio por Talla</span>
                </div>
                <div className="border border-[#FAF7F2]/10 p-3 bg-[#FAF7F2]/5 col-span-2 sm:col-span-1">
                  <span className="block font-serif text-lg font-bold text-[#FFFEFC]">18 Deptos.</span>
                  <span className="text-[11px] text-[#E8DEC9]/70">Cobertura en todo Honduras</span>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('catalog')}
                  className="px-6 py-3 bg-[#B88B4A] hover:bg-[#8A622A] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  Ver Modelos Disponibles
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenSizeGuide}
                  className="px-6 py-3 border border-[#E8DEC9] hover:bg-[#E8DEC9]/10 text-[#E8DEC9] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Consultar Guía de Tallas
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Releases Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A622A]">
              Llegadas Recientes
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2721] mt-1">
              Nuevos Lanzamientos en Mezclilla
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog', { isNewOnly: 'true' })}
            className="text-xs font-semibold text-[#B88B4A] hover:text-[#8A622A] uppercase tracking-wider inline-flex items-center gap-1 self-start md:self-auto"
          >
            Ver todas las novedades
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newReleases.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Shopping Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E8DEC9]/30 border border-[#D9CCB8]/70 p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A622A]">
              Garantía KAS Store · La Masica
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2721] mt-1">
              Beneficios de tu compra de mezclilla
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#B88B4A]/10 flex items-center justify-center text-[#B88B4A]">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm text-[#2E2721]">Envíos a Todo Honduras</h4>
              <p className="text-xs text-[#2E2721]/70 leading-relaxed">
                Despachamos desde Atlántida a todos los 18 departamentos con tarifas claras.
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#B88B4A]/10 flex items-center justify-center text-[#B88B4A]">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm text-[#2E2721]">Mezclilla Auténtica</h4>
              <p className="text-xs text-[#2E2721]/70 leading-relaxed">
                Telas revisadas prenda por prenda para asegurar la firmeza de costuras y teñido.
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#B88B4A]/10 flex items-center justify-center text-[#B88B4A]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm text-[#2E2721]">Asesoría WhatsApp</h4>
              <p className="text-xs text-[#2E2721]/70 leading-relaxed">
                Escríbenos al +504 3305-6175 para confirmar las medidas exactas antes del envío.
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#B88B4A]/10 flex items-center justify-center text-[#B88B4A]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm text-[#2E2721]">Prendas Seleccionadas</h4>
              <p className="text-xs text-[#2E2721]/70 leading-relaxed">
                Modelos de corte actual en tonalidades sobrias y lavados duraderos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A622A]">
            Preguntas Frecuentes
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2721] mt-1">
            Resolvemos tus dudas sobre KAS Store
          </h3>
        </div>

        <div className="divide-y divide-[#E8DEC9] border-t border-b border-[#E8DEC9]">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#2E2721] hover:text-[#B88B4A] transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#B88B4A] transition-transform duration-200 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === index && (
                <p className="mt-3 text-xs sm:text-sm text-[#2E2721]/75 leading-relaxed font-normal animate-fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
