import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Truck,
  MessageCircle,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  MapPin,
  Clock,
  Phone,
  User,
  Copy,
  Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { HONDURAS_DEPARTMENTS } from '../data/hondurasLocations.ts';
import { CheckoutFormData, WhatsAppOrder } from '../types.ts';
import { api } from '../services/api.ts';
import { getShippingDetails, FREE_SHIPPING_THRESHOLD_HNL } from '../lib/shippingRates.ts';
import {
  createWhatsAppOrder,
  buildWhatsAppMessage,
  OFFICIAL_WHATSAPP_DISPLAY,
} from '../services/paymentService.ts';

interface CheckoutPageProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { items, subtotalHnl, totalItems, clearCart } = useCart();

  // Contact & shipping form state
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    email: '',
    departamento: 'Atlántida',
    municipio: 'La Masica (Sede KAS Store)',
    address: '',
    deliveryNotes: '',
    paymentMethod: 'whatsapp',
  });

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent?: number;
    discountAmountHnl?: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Completed order state
  const [createdOrder, setCreatedOrder] = useState<WhatsAppOrder | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [showRawMessage, setShowRawMessage] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available municipios based on selected department
  const selectedDeptData = useMemo(() => {
    return (
      HONDURAS_DEPARTMENTS.find((d) => d.name === formData.departamento) ||
      HONDURAS_DEPARTMENTS[0]
    );
  }, [formData.departamento]);

  // Handle department change to reset municipio
  const handleDepartmentChange = (deptName: string) => {
    const dept = HONDURAS_DEPARTMENTS.find((d) => d.name === deptName);
    setFormData((prev) => ({
      ...prev,
      departamento: deptName,
      municipio: dept && dept.municipios.length > 0 ? dept.municipios[0] : '',
    }));
  };

  // Shipping details calculation
  const shippingInfo = useMemo(() => {
    return getShippingDetails(formData.departamento, subtotalHnl);
  }, [formData.departamento, subtotalHnl]);

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountAmountHnl) return appliedCoupon.discountAmountHnl;
    if (appliedCoupon.discountPercent) {
      return Math.round((subtotalHnl * appliedCoupon.discountPercent) / 100);
    }
    return 0;
  }, [appliedCoupon, subtotalHnl]);

  const finalTotalHnl = Math.max(0, subtotalHnl - discountAmount + shippingInfo.shippingFeeHnl);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await api.validateCoupon(couponInput, subtotalHnl);
      if (res.valid) {
        setAppliedCoupon({
          code: res.code || couponInput.toUpperCase(),
          discountPercent: res.discountPercent,
          discountAmountHnl: res.discountAmountHnl,
        });
        setCouponInput('');
      } else {
        setCouponError(res.message || 'Cupón inválido');
      }
    } catch {
      setCouponError('Error al validar cupón');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Ingresa tu nombre completo.';
    if (!formData.phone.trim()) {
      errors.phone = 'Ingresa tu número de WhatsApp para coordinar el envío.';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      errors.phone = 'Ingresa un número telefónico hondureño válido (mínimo 8 dígitos).';
    }
    if (!formData.address.trim()) errors.address = 'Ingresa la dirección exacta de entrega.';
    if (!formData.departamento) errors.departamento = 'Selecciona un departamento.';
    if (!formData.municipio) errors.municipio = 'Selecciona un municipio.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCompleteOrderWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Crear orden de WhatsApp estructurada y guardarla en el CRM local
      const newOrder = createWhatsAppOrder(
        formData,
        items,
        subtotalHnl,
        discountAmount,
        appliedCoupon?.code
      );

      setCreatedOrder(newOrder);
      clearCart();

      // Abrir WhatsApp en una nueva pestaña
      window.open(newOrder.whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Error al generar la orden por WhatsApp:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // PANTALLA DE ÉXITO DE LA ORDEN
  if (createdOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#FFFEFC] border border-[#D9CCB8] p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#B88B4A] font-semibold">
              Orden Generada Exitosamente
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#2E2721]">
              ¡Gracias por tu pedido, {createdOrder.customerName}!
            </h1>
            <p className="text-sm text-[#2E2721]/70 max-w-lg mx-auto">
              Tu orden <strong className="text-[#2E2721]">#{createdOrder.orderNumber}</strong> ha sido registrada en KAS Store. Hemos abierto WhatsApp con el desglose listo para enviar.
            </p>
          </div>

          {/* Botones de acción WhatsApp y Copia */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={createdOrder.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg rounded-sm"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              Abrir WhatsApp ({OFFICIAL_WHATSAPP_DISPLAY})
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => {
                const msg = buildWhatsAppMessage(createdOrder);
                navigator.clipboard.writeText(msg);
                setCopiedReceipt(true);
                setTimeout(() => setCopiedReceipt(false), 3000);
              }}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 bg-[#FAF7F2] hover:bg-[#E8DEC9]/50 text-[#2E2721] border border-[#D9CCB8] text-xs font-semibold rounded-sm transition-colors cursor-pointer"
            >
              {copiedReceipt ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-bold">¡Mensaje Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#B88B4A]" />
                  <span>Copiar Recibo para WhatsApp</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-[#2E2721]/60 mt-1">
            Si la ventana no se abrió automáticamente, haz clic en el botón verde o copia el texto para enviarlo directamente.
          </p>

          {/* Vista Previa del Mensaje Estructurado */}
          <div className="text-left pt-1">
            <button
              type="button"
              onClick={() => setShowRawMessage(!showRawMessage)}
              className="text-xs text-[#B88B4A] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              {showRawMessage ? 'Ocultar formato exacto de WhatsApp' : 'Ver formato exacto del mensaje para WhatsApp'}
            </button>
            {showRawMessage && (
              <pre className="mt-2.5 p-4 bg-[#2E2721] text-[#FAF7F2] rounded-xs text-[11px] whitespace-pre-wrap font-mono leading-relaxed border border-[#44382F] select-all overflow-x-auto">
                {buildWhatsAppMessage(createdOrder)}
              </pre>
            )}
          </div>

          {/* Resumen del Pedido */}
          <div className="border-t border-b border-[#E8DEC9] py-5 text-left text-xs space-y-3 bg-[#FAF7F2] p-4">
            <div className="flex justify-between items-center font-semibold text-sm text-[#2E2721]">
              <span>Orden #{createdOrder.orderNumber}</span>
              <span className="text-[#B88B4A]">L {createdOrder.totalHnl.toFixed(2)} HNL</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#2E2721]/80">
              <div>
                <p><strong>Destino:</strong> {createdOrder.municipio}, {createdOrder.departamento}</p>
                <p><strong>Dirección:</strong> {createdOrder.address}</p>
              </div>
              <div>
                <p><strong>Transporte:</strong> {createdOrder.carrierName}</p>
                <p><strong>Entrega estimada:</strong> {createdOrder.estimatedDelivery}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E8DEC9]/60">
              <p className="font-medium text-[#2E2721] mb-1">Prendas ({createdOrder.items.length}):</p>
              {createdOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-[#2E2721]/80 py-0.5">
                  <span>{it.quantity}x {it.productName} (Talla {it.selectedSize}, {it.selectedColor})</span>
                  <span className="font-semibold">L {it.totalHnl.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('catalog')}
              className="px-6 py-2.5 bg-[#B88B4A] hover:bg-[#8A622A] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Seguir explorando mezclilla
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-2.5 border border-[#2E2721]/30 hover:bg-[#E8DEC9]/30 text-[#2E2721] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#E8DEC9]/40 flex items-center justify-center text-[#B88B4A]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#2E2721]">Tu bolsa está vacía</h1>
          <p className="text-sm text-[#2E2721]/70 max-w-md mx-auto">
            Para realizar un pedido por WhatsApp, primero agrega pantalones de mezclilla al carrito.
          </p>
        </div>
        <div>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-8 py-3.5 bg-[#B88B4A] hover:bg-[#8A622A] text-[#FFFEFC] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
          >
            Explorar Catálogo de Mezclilla
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
            onClick={() => onNavigate('cart')}
            className="text-xs text-[#2E2721]/70 hover:text-[#B88B4A] inline-flex items-center gap-1 font-medium mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a la bolsa
          </button>
          <h1 className="font-serif text-3xl font-bold text-[#2E2721]">
            Finalizar Pedido por WhatsApp
          </h1>
          <p className="text-xs text-[#2E2721]/60 mt-1">
            Completa tus datos de envío en Honduras para coordinar la entrega y el pago directamente por WhatsApp.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 px-3 py-1.5 text-xs text-[#25D366] font-semibold">
          <MessageCircle className="w-4 h-4 fill-[#25D366]" />
          Atención Directa: {OFFICIAL_WHATSAPP_DISPLAY}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulario de Envío (7 columnas) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleCompleteOrderWhatsApp} className="space-y-6">
            {/* Sección: Datos del Cliente */}
            <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E8DEC9]">
                <User className="w-4 h-4 text-[#B88B4A]" />
                <h2 className="font-serif text-lg font-bold text-[#2E2721]">
                  1. Datos de Contacto
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2E2721] mb-1">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej. Carlos Hernández"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721]"
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2E2721] mb-1">
                    Teléfono WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-[#2E2721]/60 font-medium">
                      +504
                    </span>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9999-9999"
                      className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721]"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#2E2721] mb-1">
                    Correo Electrónico (Opcional)
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Para enviarte una copia del comprobante"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721]"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Dirección de Entrega en Honduras */}
            <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E8DEC9]">
                <MapPin className="w-4 h-4 text-[#B88B4A]" />
                <h2 className="font-serif text-lg font-bold text-[#2E2721]">
                  2. Destino de Entrega (Honduras)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2E2721] mb-1">
                    Departamento <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.departamento}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721]"
                  >
                    {HONDURAS_DEPARTMENTS.map((dept) => (
                      <option key={dept.name} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2E2721] mb-1">
                    Municipio <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.municipio}
                    onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721]"
                  >
                    {selectedDeptData.municipios.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#2E2721] mb-1">
                    Dirección Exacta (Calle, Barrio/Colonia, Casa) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ej. Bo. El Centro, 2 cuadras arriba del parque central, casa verde #12"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721]"
                  />
                  {formErrors.address && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.address}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#2E2721] mb-1">
                    Referencias o Notas de Entrega (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.deliveryNotes || ''}
                    onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                    placeholder="Ej. Dejar con la recepcionista, portón negro, llamar antes de llegar"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721] resize-none"
                  />
                </div>
              </div>

              {/* Info de Envío en Honduras */}
              <div className="mt-2 p-3 bg-[#FAF7F2] border border-[#E8DEC9] text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B88B4A]" />
                  <div>
                    <span className="font-semibold text-[#2E2721]">{shippingInfo.carrierName}</span>
                    <span className="text-[#2E2721]/60 block text-[11px]">
                      Plazo: {shippingInfo.estimatedDeliveryHours}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {shippingInfo.shippingFeeHnl === 0 ? (
                    <span className="text-[#25D366] font-bold text-xs">¡Envío Gratis!</span>
                  ) : (
                    <span className="font-semibold text-[#2E2721]">L {shippingInfo.shippingFeeHnl.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* BOTÓN INTERACTIVO PRINCIPAL DE WHATSAPP */}
            <div className="bg-[#FFFEFC] border-2 border-[#25D366]/40 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#2E2721]">
                    Finalización Directa por WhatsApp
                  </h3>
                  <p className="text-xs text-[#2E2721]/70">
                    Al presionar el botón se generará el mensaje oficial con el desglose exacto de tus jeans.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-3 rounded-sm cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                {isSubmitting ? 'Generando Orden...' : 'Completar Pedido por WhatsApp'}
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#2E2721]/60 pt-2 border-t border-[#E8DEC9]">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B88B4A]" />
                  Atención personalizada en Honduras
                </span>
                <span>Sede: La Masica, Atlántida</span>
              </div>
            </div>
          </form>
        </div>

        {/* Resumen del Carrito y Cupones (5 columnas) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-6 space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#2E2721] pb-3 border-b border-[#E8DEC9] flex items-center justify-between">
              <span>Resumen de la Orden</span>
              <span className="text-xs font-sans font-normal text-[#2E2721]/60">
                {totalItems} {totalItems === 1 ? 'prenda' : 'prendas'}
              </span>
            </h2>

            {/* Lista de Prendas */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-16 object-cover bg-[#E8DEC9]/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2E2721] truncate">{item.product.name}</p>
                    <p className="text-[11px] text-[#2E2721]/60">
                      Talla: <span className="font-medium text-[#2E2721]">{item.selectedSize}</span> | {item.selectedColor}
                    </p>
                    <p className="text-[11px] text-[#2E2721]/60">
                      Cantidad: {item.quantity} x L {item.product.priceHnl.toFixed(2)}
                    </p>
                  </div>
                  <div className="font-bold text-[#2E2721] shrink-0">
                    L {(item.product.priceHnl * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Cupón Promocional */}
            <div className="pt-3 border-t border-[#E8DEC9] space-y-2">
              <label className="block text-xs font-semibold text-[#2E2721]">
                ¿Tienes un cupón de descuento?
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Ej. KAS10 o LAMASICA"
                  className="flex-1 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#D9CCB8] uppercase text-[#2E2721] focus:outline-none focus:border-[#B88B4A]"
                />
                <button
                  type="submit"
                  disabled={validatingCoupon || !couponInput.trim()}
                  className="px-4 py-2 bg-[#B88B4A] hover:bg-[#8A622A] text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {validatingCoupon ? '...' : 'Aplicar'}
                </button>
              </form>
              {couponError && (
                <p className="text-[11px] text-red-500">{couponError}</p>
              )}
              {appliedCoupon && (
                <div className="p-2.5 bg-[#E8DEC9]/30 border border-[#B88B4A]/30 text-xs text-[#8A622A] flex justify-between items-center">
                  <span className="font-semibold">Cupón {appliedCoupon.code} aplicado</span>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-[10px] underline hover:text-[#2E2721]"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>

            {/* Desglose de Precios */}
            <div className="pt-3 border-t border-[#E8DEC9] space-y-2 text-xs">
              <div className="flex justify-between text-[#2E2721]">
                <span>Subtotal prendas</span>
                <span className="font-semibold">L {subtotalHnl.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#25D366] font-semibold">
                  <span>Descuento aplicado</span>
                  <span>-L {discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#2E2721]">
                <span>Envío nacional ({formData.departamento})</span>
                <span>
                  {shippingInfo.shippingFeeHnl === 0 ? (
                    <span className="text-[#25D366] font-semibold">Gratis</span>
                  ) : (
                    `L ${shippingInfo.shippingFeeHnl.toFixed(2)}`
                  )}
                </span>
              </div>

              {subtotalHnl < FREE_SHIPPING_THRESHOLD_HNL && (
                <p className="text-[11px] text-[#8A622A] pt-1">
                  Agrega L {(FREE_SHIPPING_THRESHOLD_HNL - subtotalHnl).toFixed(2)} más para obtener envío gratis nacional.
                </p>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-[#E8DEC9] text-base font-bold text-[#2E2721]">
                <span>Total a Pagar</span>
                <span className="text-xl text-[#B88B4A] font-serif">
                  L {finalTotalHnl.toFixed(2)} <span className="text-xs font-sans font-normal text-[#2E2721]/60">HNL</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
