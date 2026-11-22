import React from 'react';
import { X, FileText } from 'lucide-react';
import { StoreContent } from '../types/index.ts';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  content: StoreContent;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, content, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'POLÍTICAS DE PRIVACIDAD' : 'TÉRMINOS Y CONDICIONES DE USO';
  const text = isPrivacy ? content.legal.privacyPolicy : content.legal.termsOfService;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#F9F8F5] max-w-2xl w-full border border-[#D4C4A8] shadow-2xl z-10 p-6 sm:p-8 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#111111] hover:text-[#777] bg-[#F2EBDD] border border-[#D4C4A8]/40 transition-colors"
          aria-label="Cerrar modal legal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#9E8B6E]">
          <FileText className="w-5 h-5" />
          <span className="text-xs uppercase tracking-[0.2em] font-semibold">Marco Legal KAS</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#111111] font-heading tracking-tight">
          {title}
        </h2>

        <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2 text-xs sm:text-sm text-[#444] font-light leading-relaxed whitespace-pre-line border-t border-b border-[#D4C4A8]/50 py-4">
          {text}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#111111] text-[#F9F8F5] text-xs font-bold tracking-widest uppercase hover:bg-[#9E8B6E] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
