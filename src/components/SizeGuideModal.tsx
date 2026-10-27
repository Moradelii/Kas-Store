import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGender?: 'hombre' | 'mujer' | 'nino' | 'nina';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  defaultGender = 'hombre',
}) => {
  const [activeTab, setActiveTab] = useState<'hombre' | 'mujer' | 'nino' | 'nina'>(defaultGender);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FFFEFC] border border-[#D9CCB8] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC9]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#B88B4A]" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2E2721]">
              Guía de Tallas de Mezclilla · KAS Store
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#2E2721]/60 hover:text-[#2E2721] hover:bg-[#FAF7F2] transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Tab switcher: Hombre, Mujer, Niño, Niña */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mt-6 p-1 bg-[#FAF7F2] border border-[#E8DEC9]">
          <button
            onClick={() => setActiveTab('hombre')}
            className={`py-2 text-xs font-semibold uppercase tracking-wider transition-colors text-center ${
              activeTab === 'hombre'
                ? 'bg-[#2E2721] text-[#FFFEFC]'
                : 'text-[#2E2721]/70 hover:text-[#2E2721]'
            }`}
          >
            Jeans Hombre
          </button>
          <button
            onClick={() => setActiveTab('mujer')}
            className={`py-2 text-xs font-semibold uppercase tracking-wider transition-colors text-center ${
              activeTab === 'mujer'
                ? 'bg-[#2E2721] text-[#FFFEFC]'
                : 'text-[#2E2721]/70 hover:text-[#2E2721]'
            }`}
          >
            Jeans Mujer
          </button>
          <button
            onClick={() => setActiveTab('nino')}
            className={`py-2 text-xs font-semibold uppercase tracking-wider transition-colors text-center ${
              activeTab === 'nino'
                ? 'bg-[#2E2721] text-[#FFFEFC]'
                : 'text-[#2E2721]/70 hover:text-[#2E2721]'
            }`}
          >
            Jeans Niño
          </button>
          <button
            onClick={() => setActiveTab('nina')}
            className={`py-2 text-xs font-semibold uppercase tracking-wider transition-colors text-center ${
              activeTab === 'nina'
                ? 'bg-[#2E2721] text-[#FFFEFC]'
                : 'text-[#2E2721]/70 hover:text-[#2E2721]'
            }`}
          >
            Jeans Niña
          </button>
        </div>

        {/* Measurement Tables */}
        <div className="mt-6">
          {activeTab === 'hombre' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E8DEC9]/50 text-[#2E2721] font-semibold">
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Talla KAS</th>
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Cintura (cm)</th>
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Cadera (cm)</th>
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Largo Tiro (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DEC9]">
                  <tr>
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">28</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">71 - 74 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">88 - 91 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">78 cm</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]/50">
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">30</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">76 - 79 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">92 - 96 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">80 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">32</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">81 - 84 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">97 - 101 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">81 cm</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]/50">
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">34</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">86 - 89 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">102 - 106 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">82 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">36</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">91 - 95 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">107 - 111 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">83 cm</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]/50">
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">38</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">96 - 100 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">112 - 116 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">83 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'mujer' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E8DEC9]/50 text-[#2E2721] font-semibold">
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Talla KAS</th>
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Cintura (cm)</th>
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Cadera (cm)</th>
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Largo Total (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DEC9]">
                  <tr>
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">2 (XS)</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">62 - 65 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">86 - 89 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">98 cm</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]/50">
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">4 (S)</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">66 - 69 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">90 - 93 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">99 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">6 (M)</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">70 - 73 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">94 - 97 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">100 cm</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]/50">
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">8 (M/L)</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">74 - 77 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">98 - 101 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">101 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">10 (L)</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">78 - 82 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">102 - 106 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">102 cm</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]/50">
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">12 (XL)</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">83 - 87 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">107 - 111 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">103 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'nino' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E8DEC9]/50 text-[#2E2721] font-semibold">
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Talla Niño</th>
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Edad Aprox.</th>
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Estatura (cm)</th>
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Cintura Ajustable (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DEC9]">
                  <tr>
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">Talla 4</td>
                    <td className="py-2 px-3 border border-[#E8DEC9]">3 - 4 años</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">98 - 104 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">52 - 54 cm</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]/50">
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">Talla 6</td>
                    <td className="py-2 px-3 border border-[#E8DEC9]">5 - 6 años</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">110 - 116 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">55 - 57 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">Talla 8</td>
                    <td className="py-2 px-3 border border-[#E8DEC9]">7 - 8 años</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">122 - 128 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">58 - 60 cm</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]/50">
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">Talla 10</td>
                    <td className="py-2 px-3 border border-[#E8DEC9]">9 - 10 años</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">134 - 140 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">61 - 63 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">Talla 12</td>
                    <td className="py-2 px-3 border border-[#E8DEC9]">11 - 12 años</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">146 - 152 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">64 - 66 cm</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]/50">
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">Talla 14 - 16</td>
                    <td className="py-2 px-3 border border-[#E8DEC9]">13 - 15 años</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">158 - 164 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">67 - 70 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'nina' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E8DEC9]/50 text-[#2E2721] font-semibold">
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Talla Niña</th>
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Edad Aprox.</th>
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Estatura (cm)</th>
                    <th className="py-2.5 px-3 border border-[#D9CCB8]">Cintura Ajustable (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DEC9]">
                  <tr>
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">Talla 4</td>
                    <td className="py-2 px-3 border border-[#E8DEC9]">3 - 4 años</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">98 - 104 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">51 - 53 cm</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]/50">
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">Talla 6</td>
                    <td className="py-2 px-3 border border-[#E8DEC9]">5 - 6 años</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">110 - 116 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">54 - 56 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">Talla 8</td>
                    <td className="py-2 px-3 border border-[#E8DEC9]">7 - 8 años</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">122 - 128 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">57 - 59 cm</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]/50">
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">Talla 10</td>
                    <td className="py-2 px-3 border border-[#E8DEC9]">9 - 10 años</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">134 - 140 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">60 - 62 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-[#E8DEC9] font-medium">Talla 12 - 14</td>
                    <td className="py-2 px-3 border border-[#E8DEC9]">11 - 14 años</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">146 - 158 cm</td>
                    <td className="py-2 px-3 border border-[#E8DEC9] tabular-nums">63 - 67 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tips section */}
        <div className="mt-6 p-4 bg-[#FAF7F2] border border-[#E8DEC9] text-xs text-[#2E2721]/80 space-y-2">
          <p className="font-semibold text-[#2E2721]">Recomendación especial KAS Store:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Jeans para Niños y Niñas:</strong> Cuentan con elástico interior con ojales y botones ajustables para que la prenda acompañe su crecimiento sin apretar.</li>
            <li><strong>Tonalidades oscuras (Raw e Índigo):</strong> Tienen una caída más firme en la primera puesta y se ablandan tras el primer uso.</li>
            <li><strong>Asistencia directa:</strong> Si tienes dudas entre dos tallas, escríbenos a nuestro WhatsApp al <strong>+504 3305-6175</strong>.</li>
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#B88B4A] hover:bg-[#8A622A] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Entendido, volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};
