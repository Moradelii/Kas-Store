import React from 'react';
import { buildWhatsAppUrl } from '../utils/format.ts';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber }) => {
  const defaultMsg = '¡Hola KAS Store! Me comunico desde la tienda online para solicitar información sobre sus prendas premium.';
  const whatsappHref = buildWhatsAppUrl(whatsappNumber, defaultMsg);

  return (
    <div className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 animate-fade-in-up">
      {/* Tooltip Label */}
      <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#111111] text-[#E6D5B8] text-xs font-semibold py-1.5 px-3 border border-[#E6D5B8]/30 shadow-lg pointer-events-none whitespace-nowrap">
        <span>¿Dudas o pedidos? Escríbenos</span>
      </div>

      {/* Floating Button with vector WhatsApp icon */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#111111] hover:bg-[#1A1A1A] text-[#E6D5B8] hover:text-white border-2 border-[#E6D5B8] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 focus:outline-none"
        aria-label="Contactar por WhatsApp"
        title="WhatsApp KAS Store"
      >
        <svg
          className="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.476-.15-.677.15-.201.3-.777.98-.953 1.18-.175.201-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.5-1.786-1.677-2.087-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.201-.301.301-.502.1-.201.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.235-.244-.588-.492-.508-.677-.518l-.577-.01c-.201 0-.527.075-.802.376-.276.301-1.053 1.029-1.053 2.509s1.079 2.909 1.229 3.11c.15.201 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.229 1.378.197 1.898.119.579-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.175-1.431-.075-.125-.276-.2-.577-.35zM12 2C6.477 2 2 6.477 2 12c0 1.956.564 3.784 1.543 5.328L2 22l4.823-1.503A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.17a8.125 8.125 0 01-4.148-1.134l-.297-.177-2.868.894.908-2.795-.194-.308A8.138 8.138 0 1112 20.17z" />
        </svg>
      </a>
    </div>
  );
};
