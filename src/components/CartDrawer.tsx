import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { CartItem } from '../types/index.ts';
import { formatLempiras } from '../utils/format.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping
}) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F9F8F5] border-l border-[#D4C4A8] shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#E6D5B8]/80 flex items-center justify-between bg-[#F2EBDD]/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#111111]" />
              <h2 className="text-base font-extrabold uppercase tracking-wider text-[#111111] font-heading">
                Bolsa de Compras ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#111111] hover:text-[#777] border border-[#D4C4A8]/40 transition-colors"
              aria-label="Cerrar bolsa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#777]">
                <ShoppingBag className="w-12 h-12 stroke-[1.2] text-[#D4C4A8] mb-3" />
                <p className="text-base font-bold text-[#111111] font-heading">
                  Tu bolsa está vacía
                </p>
                <p className="text-xs text-[#777] mt-1 max-w-xs font-light">
                  Añade tus jeans o camisetas preferidas para realizar tu pedido por WhatsApp.
                </p>
                <button
                  onClick={onContinueShopping}
                  className="mt-6 px-6 py-3 bg-[#111111] text-[#F9F8F5] text-xs font-bold tracking-widest uppercase hover:bg-[#9E8B6E] transition-colors"
                >
                  Explorar Prendas
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#E6D5B8]/60">
                {items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-24 bg-[#EAE2D2] shrink-0 border border-[#D4C4A8]/40 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-[#111111] font-heading leading-tight">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#999] hover:text-red-700 transition-colors p-0.5"
                            title="Eliminar de la bolsa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-[#777] mt-1 space-x-2">
                          <span>Talla: <strong className="text-[#111111]">{item.size}</strong></span>
                          <span>·</span>
                          <span>Color: <strong className="text-[#111111]">{item.color}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E6D5B8]/30">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#D4C4A8] bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-0.5 text-xs text-[#111111] hover:bg-[#F2EBDD] disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-bold text-[#111111] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="px-2 py-0.5 text-xs text-[#111111] hover:bg-[#F2EBDD] disabled:opacity-30"
                            title={item.quantity >= item.maxStock ? 'Límite de existencia alcanzado' : ''}
                          >
                            +
                          </button>
                        </div>

                        {/* Line Price */}
                        <span className="text-xs font-bold text-[#111111] tabular-nums font-heading">
                          {formatLempiras(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-[#F2EBDD]/60 border-t border-[#D4C4A8] space-y-4">
              {/* Estimated Total Notice */}
              <div className="flex items-start gap-2 p-2.5 bg-[#E6D5B8]/40 border border-[#D4C4A8] text-[11px] text-[#444] leading-relaxed">
                <AlertCircle className="w-4 h-4 text-[#9E8B6E] shrink-0 mt-0.5" />
                <span>
                  El total es estimado. Las tarifas de envío e instrucciones de pago serán confirmadas directamente por KAS Store vía WhatsApp.
                </span>
              </div>

              {/* Subtotal & Total */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-[#777]">
                  <span>Subtotal prendas:</span>
                  <span className="tabular-nums font-medium text-[#111111]">{formatLempiras(total)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#111111] font-heading pt-2 border-t border-[#D4C4A8]">
                  <span>TOTAL ESTIMADO:</span>
                  <span className="tabular-nums text-lg text-[#111111]">{formatLempiras(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={onProceedToCheckout}
                  className="w-full py-4 bg-[#111111] hover:bg-[#9E8B6E] hover:text-[#111111] text-[#F9F8F5] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow"
                >
                  <span>FINALIZAR COMPRA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onContinueShopping}
                  className="w-full py-2.5 bg-transparent text-xs text-[#777] hover:text-[#111111] transition-colors uppercase tracking-wider font-semibold"
                >
                  Continuar comprando
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#888] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Atención directa desde La Masica, Atlántida</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
