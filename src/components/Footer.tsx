import React, { useState, useRef } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { StoreContent } from '../types/index.ts';
const kasLogoWhite = '/assets/logo/logo_white.png';
const kasLogo = '/assets/logo/logo.png';

interface FooterProps {
  content: StoreContent;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ content, onOpenLegal, onOpenAdmin }) => {
  const { storeInfo } = content;
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<any>(null);

  const handleSecretFooterClick = () => {
    if (!onOpenAdmin) return;
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        onOpenAdmin();
        return 0;
      }
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1500);
      return next;
    });
  };

  return (
    <footer className="bg-[#111111] text-[#F9F8F5] pt-16 pb-12 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2A2A2A]">
          {/* Col 1: Brand & Origin */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center">
              <img
                src={kasLogoWhite || kasLogo}
                alt="KAS Store"
                className="h-10 sm:h-12 w-auto object-contain brightness-100"
                loading="lazy"
              />
            </div>
            <p className="text-xs text-[#AAA] font-light leading-relaxed">
              Marca hondureña de moda masculina premium. Especialistas en jeans y camisetas diseñadas con altos estándares de gramaje y corte contemporáneo.
            </p>
            <p className="text-xs text-[#E6D5B8] font-medium tracking-wide">
              Tu estilo, nuestra prioridad.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E6D5B8]">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs text-[#BBB]">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">
                  Colección Jeans
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">
                  Colección Camisetas
                </a>
              </li>
              <li>
                <a href="#destacados" className="hover:text-white transition-colors">
                  Selección Premium
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E6D5B8]">
              Ubicación & Contacto
            </h4>
            <ul className="space-y-2.5 text-xs text-[#BBB]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E6D5B8] shrink-0 mt-0.5" />
                <span>{storeInfo.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E6D5B8] shrink-0" />
                <a
                  href={`https://wa.me/${storeInfo.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {storeInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E6D5B8] shrink-0" />
                <a
                  href={`mailto:${storeInfo.email}`}
                  className="hover:text-white transition-colors"
                >
                  {storeInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Social Networks & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E6D5B8]">
              Redes Sociales
            </h4>
            <div className="flex items-center gap-3">
              {/* Facebook Vector */}
              <a
                href={storeInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#E6D5B8] hover:text-[#111111] text-[#E6D5B8] flex items-center justify-center transition-colors border border-[#333]"
                aria-label="Facebook KAS Store"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Instagram Vector */}
              <a
                href={storeInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#E6D5B8] hover:text-[#111111] text-[#E6D5B8] flex items-center justify-center transition-colors border border-[#333]"
                aria-label="Instagram KAS Store"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* TikTok Vector */}
              <a
                href={storeInfo.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#E6D5B8] hover:text-[#111111] text-[#E6D5B8] flex items-center justify-center transition-colors border border-[#333]"
                aria-label="TikTok KAS Store"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.34 6.34 0 0 0 1.87-4.49V8.69a8.18 8.18 0 0 0 4.9 1.61v-3.61z" />
                </svg>
              </a>
            </div>

            <div className="pt-2 flex flex-col space-y-1 text-xs text-[#AAA]">
              <button
                onClick={() => onOpenLegal('privacy')}
                className="text-left hover:text-white transition-colors"
              >
                Políticas de Privacidad
              </button>
              <button
                onClick={() => onOpenLegal('terms')}
                className="text-left hover:text-white transition-colors"
              >
                Términos de Uso
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#888]">
          <p className="text-center sm:text-left leading-relaxed">
            <span
              onClick={handleSecretFooterClick}
              className="cursor-default select-none transition-colors hover:text-[#999]"
              title=""
            >
              © 2026 KAS Store.
            </span> Todos los derechos reservados. La Masica, Atlántida, Honduras. | By:{' '}
            <a
              href="https://mora-grafics-studio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E6D5B8] hover:underline"
            >
              Mora-Grafic's Studio
            </a>
          </p>

          <p className="text-center sm:text-right text-[10px] text-[#666] tracking-wider uppercase font-light">
            Moda Masculina y Femenina Premium · Honduras
          </p>
        </div>
      </div>
    </footer>
  );
};
