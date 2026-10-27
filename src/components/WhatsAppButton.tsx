import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Helper balloon */}
      {showTooltip && (
        <div className="mb-3 p-3.5 max-w-xs bg-[#FFFEFC] text-[#2E2721] border border-[#D9CCB8] shadow-xl text-xs relative animate-fade-in">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-[#2E2721]/60 hover:text-[#2E2721]"
            aria-label="Cerrar mensaje"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="font-semibold text-[#8A622A] text-[13px] mb-1">
            ¿Dudas con tu talla o tonalidad de mezclilla?
          </p>
          <p className="text-[12px] text-[#2E2721]/80 leading-snug">
            Escríbenos directamente a nuestro WhatsApp oficial en La Masica, Atlántida: <strong>+504 3305-6175</strong>.
          </p>
          <a
            href="https://wa.me/50433056175?text=Hola%20KAS%20Store%2C%20quisiera%20consultar%20sobre%20un%20pantal%C3%B3n%20de%20mezclilla"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#FFFEFC] bg-[#B88B4A] hover:bg-[#8A622A] px-3 py-1.5 transition-colors"
          >
            Abrir chat de WhatsApp
          </a>
        </div>
      )}

      {/* Floating Button */}
      <a
        href="https://wa.me/50433056175?text=Hola%20KAS%20Store%2C%20quisiera%20informaci%C3%B3n%20sobre%20los%20pantalones%20de%20mezclilla"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
        aria-label="Contactar por WhatsApp al +504 3305-6175"
        title="WhatsApp: +504 3305-6175 (La Masica, Atlántida)"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
        <span className="sr-only">Contactar por WhatsApp al +504 3305-6175</span>
        
        {/* Subtle indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#B88B4A] text-[9px] text-white items-center justify-center font-bold">
            1
          </span>
        </span>
      </a>
    </div>
  );
};
