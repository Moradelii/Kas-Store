import React from 'react';
import { ArrowLeft, Home, Search, MessageCircle, ShoppingBag } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF7F2] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-8 bg-[#FFFEFC] border border-[#E8DEC9] p-8 sm:p-12 shadow-sm">
        {/* Brand Accent */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8A622A]">
            KAS Store · La Masica, Atlántida
          </span>
          <h1 className="font-serif text-6xl sm:text-7xl font-bold text-[#2E2721] tracking-tight">
            404
          </h1>
          <h2 className="font-serif text-2xl font-bold text-[#2E2721]">
            Página No Encontrada
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-[#2E2721]/75 max-w-md mx-auto leading-relaxed">
          La prenda, corte de mezclilla o enlace que intentas abrir no existe o ha sido reubicado en nuestro catálogo.
        </p>

        {/* Action Shortcuts */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-6 py-3 bg-[#B88B4A] hover:bg-[#8A622A] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Volver al Inicio
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className="w-full sm:w-auto px-6 py-3 border border-[#2E2721] hover:bg-[#FAF7F2] text-[#2E2721] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Ver Colección Completa
          </button>
        </div>

        {/* Quick Category Links */}
        <div className="pt-6 border-t border-[#E8DEC9] text-xs space-y-2">
          <p className="font-semibold text-[#2E2721]/90">Explora directamente por categoría:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => onNavigate('catalog', { gender: 'hombre' })}
              className="px-3 py-1 bg-[#FAF7F2] hover:bg-[#E8DEC9] text-[#2E2721] text-xs transition-colors"
            >
              Jeans Hombre
            </button>
            <button
              onClick={() => onNavigate('catalog', { gender: 'mujer' })}
              className="px-3 py-1 bg-[#FAF7F2] hover:bg-[#E8DEC9] text-[#2E2721] text-xs transition-colors"
            >
              Jeans Mujer
            </button>
            <button
              onClick={() => onNavigate('catalog', { gender: 'nino' })}
              className="px-3 py-1 bg-[#FAF7F2] hover:bg-[#E8DEC9] text-[#2E2721] text-xs transition-colors"
            >
              Jeans Niño
            </button>
            <button
              onClick={() => onNavigate('catalog', { gender: 'nina' })}
              className="px-3 py-1 bg-[#FAF7F2] hover:bg-[#E8DEC9] text-[#2E2721] text-xs transition-colors"
            >
              Jeans Niña
            </button>
            <button
              onClick={() => onNavigate('policies')}
              className="px-3 py-1 bg-[#FAF7F2] hover:bg-[#E8DEC9] text-[#8A622A] text-xs transition-colors font-medium"
            >
              Envíos & Políticas
            </button>
          </div>
        </div>

        {/* WhatsApp Assistance */}
        <div className="pt-4 text-xs text-[#2E2721]/60">
          ¿Buscabas una prenda específica? Escríbenos al{' '}
          <a
            href="https://wa.me/50433056175"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8A622A] hover:underline font-semibold"
          >
            WhatsApp +504 3305-6175
          </a>
        </div>
      </div>
    </div>
  );
};
