import { MapPin, Phone, Mail, Truck, ShieldCheck, RefreshCw, Instagram, Facebook, MessageCircle, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onOpenSizeGuide?: () => void;
  onOpenCMS?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSizeGuide, onOpenCMS }) => {
  return (
    <footer className="bg-[#030100] text-[#FAF7F2] pt-16 pb-12 border-t border-[#B88B4A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value props strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[#FAF7F2]/10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#B88B4A]/20 flex items-center justify-center shrink-0 text-[#E8DEC9]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-base text-[#FFFEFC]">Envíos a todo Honduras</h4>
              <p className="text-xs text-[#E8DEC9]/80 mt-1">
                Desde La Masica, Atlántida a Tegucigalpa, San Pedro Sula y los 18 departamentos en HNL.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#B88B4A]/20 flex items-center justify-center shrink-0 text-[#E8DEC9]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-base text-[#FFFEFC]">Mezclilla Premium Seleccionada</h4>
              <p className="text-xs text-[#E8DEC9]/80 mt-1">
                Tonalidades de denim resistentes al lavado, hilados de alta densidad y costuras reforzadas.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#B88B4A]/20 flex items-center justify-center shrink-0 text-[#E8DEC9]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-base text-[#FFFEFC]">Asesoría Directa por WhatsApp</h4>
              <p className="text-xs text-[#E8DEC9]/80 mt-1">
                Te asistimos con las medidas exactas de cintura y tiro antes de despachar.
              </p>
            </div>
          </div>
        </div>

        {/* Main 4-column footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="bg-[#FFFEFC] inline-block p-2.5 rounded-sm shadow-md">
                <img
                  src="/images/logo/Logotipo_KAS_Store_9c74b5ef.png"
                  alt="KAS Store"
                  className="h-11 sm:h-12 w-auto object-contain"
                />
              </div>
              <p className="text-xs tracking-widest uppercase text-[#D9CCB8] mt-1">
                Especialistas en Mezclilla & Denim
              </p>
            </div>
            <p className="text-xs text-[#E8DEC9]/80 leading-relaxed">
              Tienda online especializada en pantalones de mezclilla para hombre, mujer, niño y niña en diferentes tonalidades. Sede en La Masica, Atlántida, Honduras.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#E8DEC9]">
              <a
                href="https://wa.me/50433056175"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#FAF7F2]/10 hover:bg-[#B88B4A] hover:text-[#FFFEFC] flex items-center justify-center transition-colors"
                aria-label="WhatsApp KAS Store"
                title="WhatsApp +504 3305-6175"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#instagram"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://instagram.com', '_blank');
                }}
                className="w-9 h-9 rounded-full bg-[#FAF7F2]/10 hover:bg-[#B88B4A] hover:text-[#FFFEFC] flex items-center justify-center transition-colors"
                aria-label="Instagram KAS Store"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://facebook.com', '_blank');
                }}
                className="w-9 h-9 rounded-full bg-[#FAF7F2]/10 hover:bg-[#B88B4A] hover:text-[#FFFEFC] flex items-center justify-center transition-colors"
                aria-label="Facebook KAS Store"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h5 className="font-serif text-base font-semibold text-[#FFFEFC] mb-4">Categorías de Mezclilla</h5>
            <ul className="space-y-2.5 text-xs text-[#E8DEC9]/80">
              <li>
                <button
                  onClick={() => onNavigate('catalog', { gender: 'hombre' })}
                  className="hover:text-[#FFFEFC] transition-colors"
                >
                  Jeans para Hombre
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog', { gender: 'mujer' })}
                  className="hover:text-[#FFFEFC] transition-colors"
                >
                  Jeans para Mujer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog', { gender: 'nino' })}
                  className="hover:text-[#FFFEFC] font-medium text-[#E8DEC9] transition-colors"
                >
                  Jeans para Niño (Reforzados)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog', { gender: 'nina' })}
                  className="hover:text-[#FFFEFC] font-medium text-[#E8DEC9] transition-colors"
                >
                  Jeans para Niña (Wide & Stretch)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog', { saleOnly: 'true' })}
                  className="text-[#B88B4A] font-medium hover:underline"
                >
                  Sección de Ofertas en Mezclilla (HNL)
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Sizing */}
          <div>
            <h5 className="font-serif text-base font-semibold text-[#FFFEFC] mb-4">Servicio y Políticas</h5>
            <ul className="space-y-2.5 text-xs text-[#E8DEC9]/80">
              <li>
                <button
                  onClick={() => onNavigate('policies', { tab: 'envios' })}
                  className="hover:text-[#FFFEFC] transition-colors"
                >
                  Política de Envíos y Tarifas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policies', { tab: 'devoluciones' })}
                  className="hover:text-[#FFFEFC] transition-colors"
                >
                  Cambios de Talla y Garantía
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policies', { tab: 'terminos' })}
                  className="hover:text-[#FFFEFC] transition-colors"
                >
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policies', { tab: 'privacidad' })}
                  className="hover:text-[#FFFEFC] transition-colors"
                >
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policies', { tab: 'faq' })}
                  className="hover:text-[#FFFEFC] transition-colors"
                >
                  Preguntas Frecuentes (FAQ)
                </button>
              </li>
              <li>
                {onOpenSizeGuide && (
                  <button
                    onClick={onOpenSizeGuide}
                    className="hover:text-[#FFFEFC] text-left underline underline-offset-2 transition-colors text-[#D9CCB8]"
                  >
                    Guía de Tallas (Medidas cm)
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Contact Data Column */}
          <div className="space-y-3">
            <h5 className="font-serif text-base font-semibold text-[#FFFEFC] mb-4">Contacto Oficial</h5>
            <div className="space-y-3 text-xs text-[#E8DEC9]/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B88B4A] shrink-0 mt-0.5" />
                <span>La Masica, Atlántida, Honduras</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B88B4A] shrink-0" />
                <a
                  href="tel:+50433056175"
                  className="hover:text-white transition-colors"
                >
                  +504 3305-6175
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B88B4A] shrink-0" />
                <a
                  href="mailto:k-andradesantos@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  k-andradesantos@gmail.com
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/50433056175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#B88B4A] hover:bg-[#8A622A] text-[#FFFEFC] font-medium text-xs rounded-none transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Escribir a WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom exact requested copyright line */}
        <div className="pt-8 mt-4 border-t border-[#FAF7F2]/10 flex flex-col md:flex-row items-center justify-between text-xs text-[#E8DEC9]/80 gap-4 text-center md:text-left">
          <div className="space-y-1.5">
            <p>
              © 2026 KAS Store. Todos los derechos reservados. La Masica, Atlántida, Honduras. | By:{' '}
              <a
                href="https://mora-grafics-studio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E8DEC9] hover:text-white underline underline-offset-2 font-medium"
              >
                Mora-Grafic&apos;s Studio
              </a>
            </p>
            {onOpenCMS && (
              <div className="pt-1">
                <button
                  onClick={onOpenCMS}
                  className="text-xs text-[#E8DEC9]/70 hover:text-[#B88B4A] underline underline-offset-4 transition-colors cursor-pointer inline-flex items-center gap-1.5 font-medium"
                  title="Acceso administrativo KAS Store"
                >
                  <Lock className="w-3 h-3 text-[#B88B4A]" />
                  <span>Admin</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#E8DEC9]/60 pr-16 md:pr-0">
            <span>Envíos Nacionales</span>
            <span>·</span>
            <span>Precios en Lempiras (HNL)</span>
            <span>·</span>
            <span>Colección de Mezclilla</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
