import React from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductImage } from '../components/ProductImage';

interface CartPageProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onSelectProduct: (productId: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate, onSelectProduct }) => {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    subtotalHnl,
    shippingHnl,
    totalHnl,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#E8DEC9]/40 flex items-center justify-center text-[#B88B4A]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#2E2721]">Tu bolsa está vacía</h1>
          <p className="text-sm text-[#2E2721]/70 max-w-md mx-auto">
            Aún no has agregado jeans de mezclilla a tu bolsa. Explora nuestra colección para hombre, mujer, niño y niña y encuentra el talle ideal.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('catalog')}
            className="px-8 py-3.5 bg-[#B88B4A] hover:bg-[#8A622A] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
          >
            Explorar Mezclilla KAS Store
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E8DEC9] pb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs text-[#2E2721]/70 hover:text-[#B88B4A] inline-flex items-center gap-1 font-medium mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Continuar comprando
          </button>
          <h1 className="font-serif text-3xl font-bold text-[#2E2721]">
            Bolsa de Compras ({totalItems} prendas)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#8A622A] hover:underline"
        >
          Vaciar bolsa
        </button>
      </div>

      {/* Grid: Item Table / Cards + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Line Items List */}
        <div className="lg:col-span-8 bg-[#FFFEFC] border border-[#E8DEC9] divide-y divide-[#E8DEC9]">
          {items.map((item) => (
            <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-5">
              {/* Product Thumbnail */}
              <div
                onClick={() => onSelectProduct(item.productId)}
                className="w-24 sm:w-28 aspect-[3/4] shrink-0 overflow-hidden border border-[#D9CCB8]/60 cursor-pointer"
              >
                <ProductImage
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Meta */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#2E2721]/60 font-semibold">
                        {item.product.categoryLabel} · {item.product.gender}
                      </span>
                      <h3
                        onClick={() => onSelectProduct(item.productId)}
                        className="font-serif text-base sm:text-lg font-semibold text-[#2E2721] hover:text-[#B88B4A] cursor-pointer mt-0.5"
                      >
                        {item.product.name}
                      </h3>
                      <div className="text-[11px] text-[#8A622A] mt-0.5">
                        Tonalidad: {item.product.denimWash}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#2E2721]/40 hover:text-[#8A622A] transition-colors p-1"
                      title="Eliminar artículo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#2E2721]/80 mt-2">
                    <div>
                      Talla: <strong className="text-[#2E2721]">{item.selectedSize}</strong>
                    </div>
                    <div>
                      Color/Acabado: <strong className="text-[#2E2721]">{item.selectedColor}</strong>
                    </div>
                    <div>
                      Precio unitario:{' '}
                      <strong className="text-[#B88B4A] tabular-nums">
                        L {item.product.priceHnl.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Stepper & Line Total */}
                <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#E8DEC9]/50">
                  <div className="flex items-center border border-[#D9CCB8] bg-[#FAF7F2]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-[#E8DEC9]/60 text-[#2E2721]"
                      aria-label="Restar uno"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3.5 text-xs font-bold tabular-nums text-[#2E2721]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-[#E8DEC9]/60 text-[#2E2721]"
                      aria-label="Sumar uno"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#2E2721]/60 block">Total prenda</span>
                    <span className="font-serif text-base sm:text-lg font-bold text-[#2E2721] tabular-nums">
                      L {(item.product.priceHnl * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Right Card */}
        <div className="lg:col-span-4 bg-[#FFFEFC] border border-[#E8DEC9] p-6 space-y-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-xl font-bold text-[#2E2721] pb-3 border-b border-[#E8DEC9]">
            Resumen del Pedido
          </h2>

          <div className="space-y-3 text-xs text-[#2E2721]">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} prendas)</span>
              <span className="font-semibold tabular-nums">L {subtotalHnl.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-[#2E2721]/80">
              <div>
                <span>Envío nacional (Honduras)</span>
                <p className="text-[10px] text-[#2E2721]/60">Cobertura a los 18 departamentos</p>
              </div>
              <span className="tabular-nums font-semibold">
                {shippingHnl === 0 ? (
                  <span className="text-[#25D366]">Gratis</span>
                ) : (
                  `L ${shippingHnl.toFixed(2)}`
                )}
              </span>
            </div>

            {subtotalHnl < 1500 ? (
              <div className="p-3 bg-[#E8DEC9]/30 border border-[#D9CCB8]/60 text-[11px] text-[#8A622A]">
                Te faltan <strong>L {(1500 - subtotalHnl).toFixed(2)}</strong> para calificar a envío gratis nacional.
              </div>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 text-[11px] text-green-800 font-medium">
                ¡Tu pedido califica para Envío Gratis a toda Honduras!
              </div>
            )}

            <div className="pt-3 border-t border-[#E8DEC9] flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#2E2721]">Total Estimado</span>
              <span className="font-serif text-2xl font-bold text-[#B88B4A] tabular-nums">
                L {totalHnl.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 rounded-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            Completar Pedido por WhatsApp
          </button>

          <div className="pt-2 border-t border-[#E8DEC9] space-y-2 text-[11px] text-[#2E2721]/70">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#B88B4A]" />
              <span>Despacho directo desde La Masica, Atlántida</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B88B4A]" />
              <span>Garantía de cambio si requieres otra talla</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
