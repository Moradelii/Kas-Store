import React, { useState } from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';
import { StoreContent } from '../types/index.ts';

interface SizeGuideModalProps {
  content: StoreContent;
  onClose: () => void;
  defaultTab?: 'jeans' | 'camisetas';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  content,
  onClose,
  defaultTab = 'jeans'
}) => {
  const [activeTab, setActiveTab] = useState<'jeans' | 'camisetas'>(defaultTab);

  const guide = activeTab === 'jeans' ? content.sizeGuides.jeans : content.sizeGuides.camisetas;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-3 sm:p-6 flex justify-center items-start animate-fadeIn">
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-label="Cerrar guía de tallas" />

      <div className="relative bg-[#F9F8F5] max-w-3xl w-full border border-[#D4C4A8] shadow-2xl z-10 p-5 sm:p-8 my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#111111] hover:text-[#777] bg-[#F2EBDD] border border-[#D4C4A8]/40 transition-colors"
          aria-label="Cerrar guía de tallas"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2 text-[#9E8B6E]">
          <Ruler className="w-5 h-5" />
          <span className="text-xs uppercase tracking-[0.2em] font-semibold">
            Especificaciones Oficiales
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-heading tracking-tight">
          GUÍA DE MEDIDAS Y TALLAS
        </h2>
        <p className="text-xs sm:text-sm text-[#666] font-light mt-1">
          Compara tus medidas corporales en centímetros (cm) para elegir el ajuste óptimo en tus prendas KAS.
        </p>

        {/* Tabs */}
        <div className="mt-6 flex border-b border-[#D4C4A8]">
          <button
            onClick={() => setActiveTab('jeans')}
            className={`py-3 px-6 text-xs font-bold tracking-widest uppercase transition-colors border-b-2 ${
              activeTab === 'jeans'
                ? 'border-[#111111] text-[#111111] bg-[#F2EBDD]/60'
                : 'border-transparent text-[#777] hover:text-[#111111]'
            }`}
          >
            Pantalones & Jeans (28 al 48)
          </button>
          <button
            onClick={() => setActiveTab('camisetas')}
            className={`py-3 px-6 text-xs font-bold tracking-widest uppercase transition-colors border-b-2 ${
              activeTab === 'camisetas'
                ? 'border-[#111111] text-[#111111] bg-[#F2EBDD]/60'
                : 'border-transparent text-[#777] hover:text-[#111111]'
            }`}
          >
            Camisetas Premium (S a XXL)
          </button>
        </div>

        {/* Measurements Table */}
        <div className="mt-6 overflow-x-auto border border-[#D4C4A8]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#111111] text-[#F9F8F5]">
                {guide.columns.map((col) => (
                  <th key={col.key} className="py-3 px-4 font-bold uppercase tracking-wider text-center first:text-left">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D5B8]/60 bg-white">
              {guide.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F2EBDD]/40 transition-colors">
                  {guide.columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-2.5 px-4 tabular-nums ${
                        col.key === 'size' ? 'font-bold text-[#111111]' : 'text-center text-[#555]'
                      }`}
                    >
                      {row[col.key] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Tips */}
        {guide.tips && guide.tips.length > 0 && (
          <div className="mt-6 p-4 bg-[#F2EBDD]/50 border border-[#D4C4A8]/60 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111] uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-[#9E8B6E]" />
              <span>¿Cómo tomar tus medidas correctamente?</span>
            </div>
            <ul className="text-xs text-[#555] space-y-1 list-disc list-inside font-light">
              {guide.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#D4C4A8]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777]">
          <span>Medidas configurables desde el panel administrativo KAS.</span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#111111] text-[#F9F8F5] font-bold uppercase tracking-widest text-xs hover:bg-[#9E8B6E] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
