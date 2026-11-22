import React from 'react';
import { Award, UserCheck, MessageSquareText } from 'lucide-react';
import { StoreContent } from '../types/index.ts';

interface BenefitsProps {
  content: StoreContent;
}

export const Benefits: React.FC<BenefitsProps> = ({ content }) => {
  return (
    <section className="py-16 sm:py-20 bg-[#F9F8F5] border-t border-[#E6D5B8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Benefit 1 */}
          <div className="flex flex-col items-center text-center p-6 bg-[#F2EBDD]/40 border border-[#E6D5B8]/50">
            <div className="w-12 h-12 bg-[#111111] text-[#E6D5B8] flex items-center justify-center mb-4">
              <Award className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-[#111111] font-heading">
              {content.benefits.b1Title || 'Calidad Premium'}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#555] font-light leading-relaxed max-w-xs">
              {content.benefits.b1Desc ||
                'Selección rigurosa de algodones de alto gramaje y denim selvedge de primera clase.'}
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="flex flex-col items-center text-center p-6 bg-[#F2EBDD]/40 border border-[#E6D5B8]/50">
            <div className="w-12 h-12 bg-[#111111] text-[#E6D5B8] flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-[#111111] font-heading">
              {content.benefits.b2Title || 'Atención Personalizada'}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#555] font-light leading-relaxed max-w-xs">
              {content.benefits.b2Desc ||
                'Asesoría directa en tallas, medidas y estilo por WhatsApp antes de tu envío.'}
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="flex flex-col items-center text-center p-6 bg-[#F2EBDD]/40 border border-[#E6D5B8]/50">
            <div className="w-12 h-12 bg-[#111111] text-[#E6D5B8] flex items-center justify-center mb-4">
              <MessageSquareText className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-[#111111] font-heading">
              {content.benefits.b3Title || 'Compra Fácil por WhatsApp'}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#555] font-light leading-relaxed max-w-xs">
              {content.benefits.b3Desc ||
                'Sin registros engorrosos ni pasarelas complejas. Pedido directo y confirmación inmediata.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
