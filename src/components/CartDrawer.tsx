import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductImage } from './ProductImage';

interface CartDrawerProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    subtotalHnl,
    shippingHnl,
    totalHnl,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    onNavigate('checkout');
  };

  const handleViewFullCart = () => {
    closeCart();
    onNavigate('cart');
  };

  const handleExplore = () => {
    closeCart();
    onNavigate('catalog');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFEFC] border-l border-[#D9CCB8] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#E8DEC9] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B88B4A]" />
              <h2 className="font-serif text-lg font-bold text-[#2E2721]">
                Bolsa de Compras ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-[#2E2721]/60 hover:text-[#2E2721] hover:bg-[#E8DEC9]/40 transition-colors"
              aria-label="Cerrar bolsa de compras"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items Content */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E8DEC9]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8DEC9]/50 flex items-center justify-center text-[#B88B4A]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-semibold text-[#2E2721]">
                    Tu bolsa está vacía
                  </h3>
                  <p className="text-xs text-[#2E2721]/70 max-w-xs">
                    Descubre nuestra colección de jeans de mezclilla para hombre, mujer, niño y niña en La Masica.
                  </p>
                </div>
                <button
                  onClick={handleExplore}
                  className="mt-2 px-6 py-2.5 bg-[#B88B4A] hover:bg-[#8A622A] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  Explorar Mezclilla
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    {/* Item Thumbnail */}
                    <div className="w-20 h-24 shrink-0 overflow-hidden border border-[#D9CCB8]/60">
                      <ProductImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-[#2E2721] leading-snug line-clamp-2">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#2E2721]/40 hover:text-[#8A622A] transition-colors p-1"
                            title="Eliminar artículo"
                            aria-label={`Eliminar ${item.product.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-[11px] text-[#2E2721]/70">
                          <span>Talla: <strong className="text-[#2E2721]">{item.selectedSize}</strong></span>
                          <span>·</span>
                          <span>Color: <strong className="text-[#2E2721]">{item.selectedColor}</strong></span>
                        </div>

                        <div className="mt-1 text-xs font-semibold text-[#B88B4A] tabular-nums">
                          L {item.product.priceHnl.toFixed(2)}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8DEC9]/50">
                        <div className="flex items-center border border-[#D9CCB8]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#E8DEC9]/40 text-[#2E2721] transition-colors"
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-semibold tabular-nums text-[#2E2721]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-[#E8DEC9]/40 text-[#2E2721] transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-xs font-bold text-[#2E2721] tabular-nums">
                          L {(item.product.priceHnl * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Summary & Action Buttons */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E8DEC9] bg-[#FAF7F2] space-y-3">
              <div className="space-y-1.5 text-xs text-[#2E2721]">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} prendas)</span>
                  <span className="font-semibold tabular-nums">L {subtotalHnl.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2E2721]/80">
                  <span>Envío nacional (Honduras)</span>
                  <span className="tabular-nums">
                    {shippingHnl === 0 ? (
                      <span className="text-[#25D366] font-semibold">Gratis</span>
                    ) : (
                      `L ${shippingHnl.toFixed(2)}`
                    )}
                  </span>
                </div>
                {subtotalHnl < 1500 && (
                  <p className="text-[11px] text-[#8A622A]">
                    Agrega L {(1500 - subtotalHnl).toFixed(2)} más para obtener envío gratis nacional.
                  </p>
                )}
                <div className="flex justify-between text-sm font-bold text-[#2E2721] pt-2 border-t border-[#E8DEC9]">
                  <span>Total Estimado</span>
                  <span className="text-base text-[#B88B4A] tabular-nums">L {totalHnl.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm rounded-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Completar Pedido por WhatsApp
                </button>
                <button
                  onClick={handleViewFullCart}
                  className="w-full py-2.5 px-4 bg-transparent border border-[#2E2721]/40 hover:bg-[#E8DEC9]/40 text-[#2E2721] text-xs font-semibold uppercase tracking-wider transition-colors text-center"
                >
                  Ver Bolsa Completa
                </button>
              </div>

              <p className="text-[10px] text-center text-[#2E2721]/60 pt-1">
                KAS Store · Despachos a toda Honduras desde La Masica, Atlántida (+504 3305-6175)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
