import React, { useState } from 'react';
import { X, MessageCircle, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { CartItem, CustomerOrderData } from '../types/index.ts';
import { formatLempiras, generateWhatsAppMessage, buildWhatsAppUrl } from '../utils/format.ts';
import { submitOrderToBackend } from '../services/api.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  whatsappNumber: string;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  whatsappNumber,
  onOrderSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    customerName: string;
    phone: string;
    total: number;
    units: number;
  } | null>(null);

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const totalUnits = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  const handleModalClose = () => {
    if (orderConfirmed) {
      onOrderSuccess();
      setOrderConfirmed(false);
      setConfirmedOrder(null);
      setConfirmedOrderId('');
      setGeneratedWhatsAppUrl('');
      setCustomerName('');
      setPhone('');
      setAddress('');
      setNotes('');
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!customerName.trim()) {
      setErrorMsg('Por favor ingrese su nombre completo.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      setErrorMsg('Por favor ingrese un número de teléfono válido (mínimo 8 dígitos).');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Por favor ingrese su dirección de entrega (ciudad, barrio/colonia y punto de referencia).');
      return;
    }

    setIsSubmitting(true);

    const calculatedTotal = Number(total) || items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    const calculatedUnits = Number(totalUnits) || items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const fallbackOrderId = `ORD-${Date.now().toString().slice(-6)}`;

    const orderData: CustomerOrderData = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim(),
      items,
      total: calculatedTotal
    };

    try {
      // 1. Submit order to backend for persistence & inventory deduction
      const backendRes = await submitOrderToBackend(orderData);
      const generatedOrderId = backendRes.orderId || fallbackOrderId;
      setConfirmedOrderId(generatedOrderId);

      // Snapshot receipt values
      setConfirmedOrder({
        orderId: generatedOrderId,
        customerName: customerName.trim(),
        phone: phone.trim(),
        total: calculatedTotal,
        units: calculatedUnits
      });

      // 2. Generate WhatsApp message strictly matching the template
      const message = generateWhatsAppMessage(orderData);
      const whatsappUrl = buildWhatsAppUrl(whatsappNumber, message);
      setGeneratedWhatsAppUrl(whatsappUrl);

      // 3. Attempt opening WhatsApp in new window (graceful in iframe)
      try {
        window.open(whatsappUrl, '_blank');
      } catch (e) {
        console.warn('Popup intercepted by browser sandbox; providing direct button', e);
      }

      // 4. Mark success for receipt screen
      setOrderConfirmed(true);
    } catch (err: any) {
      setErrorMsg('Hubo un inconveniente al procesar el pedido. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-3 sm:p-6 flex justify-center items-start animate-fadeIn">
      <div className="fixed inset-0 -z-10" onClick={handleModalClose} aria-label="Cerrar modal de compra" />

      <div className="relative bg-[#F9F8F5] max-w-lg w-full border border-[#D4C4A8] shadow-2xl z-10 p-5 sm:p-8 my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 p-2 text-[#111111] hover:text-[#777] bg-[#F2EBDD] border border-[#D4C4A8]/40 transition-colors"
          aria-label="Cerrar modal de compra"
        >
          <X className="w-5 h-5" />
        </button>

        {!orderConfirmed ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 text-emerald-700">
              <MessageCircle className="w-5 h-5 stroke-[2]" />
              <span className="text-xs uppercase tracking-[0.2em] font-bold">
                Confirmación de Pedido por WhatsApp
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#111111] font-heading tracking-tight">
              DATOS DE ENTREGA
            </h2>
            <p className="text-xs text-[#666] font-light mt-1">
              Ingresa tus datos para generar automáticamente tu pedido en WhatsApp y coordinar tu entrega con KAS Store.
            </p>

            {/* Order Summary Pill */}
            <div className="mt-4 p-3 bg-[#F2EBDD]/60 border border-[#D4C4A8] text-xs flex justify-between items-center">
              <div>
                <span className="font-semibold text-[#111111]">{totalUnits} prendas</span>
                <span className="text-[#666]"> en tu bolsa</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#777] uppercase block">Total Estimado</span>
                <span className="text-sm font-extrabold text-[#111111] tabular-nums font-heading">
                  {formatLempiras(total)}
                </span>
              </div>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Nombre Completo <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej: David Eduardo Mendoza"
                  className="w-full bg-white border border-[#D4C4A8] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Número de Teléfono / WhatsApp <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: +504 9876-5432"
                  className="w-full bg-white border border-[#D4C4A8] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Dirección de Entrega <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Municipio, Barrio / Colonia, Calle, Casa o Punto de referencia (Honduras)"
                  className="w-full bg-white border border-[#D4C4A8] px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Notas Adicionales (Opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Entregar por la tarde / Empaque para regalo"
                  className="w-full bg-white border border-[#D4C4A8] px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="p-3 bg-[#E6D5B8]/30 border border-[#D4C4A8] text-[11px] text-[#555] leading-relaxed">
                Al confirmar, se abrirá WhatsApp con el mensaje estructurado de tu pedido hacia nuestra línea oficial (+504 3305-6175) para acordar el pago y despacho.
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#111111] hover:bg-emerald-800 text-[#F9F8F5] text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{isSubmitting ? 'GENERANDO PEDIDO...' : 'CONFIRMAR Y ABRIR WHATSAPP'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Receipt State */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#111111] font-heading">
              ¡Pedido Generado con Éxito!
            </h3>
            <p className="text-xs text-[#666] max-w-sm mx-auto font-light leading-relaxed">
              Hemos preparado tu pedido <strong className="text-[#111111]">{confirmedOrderId}</strong> y transferido el detalle a WhatsApp.
            </p>
            <div className="p-4 bg-[#F2EBDD] border border-[#D4C4A8] text-xs text-left space-y-1.5">
              <p><strong>Cliente:</strong> {confirmedOrder?.customerName || customerName}</p>
              <p><strong>Teléfono:</strong> {confirmedOrder?.phone || phone}</p>
              <p><strong>Total Estimado:</strong> <span className="font-extrabold text-[#111111]">{formatLempiras(confirmedOrder?.total ?? total)}</span></p>
              {(confirmedOrder?.units ?? totalUnits) > 0 && (
                <p><strong>Prendas:</strong> {confirmedOrder?.units ?? totalUnits} {(confirmedOrder?.units ?? totalUnits) === 1 ? 'unidad' : 'unidades'}</p>
              )}
              <p className="text-[11px] text-[#777] pt-1">
                KAS Store te responderá a la brevedad con las opciones de pago y confirmación de envío.
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-2.5">
              {generatedWhatsAppUrl && (
                <a
                  href={generatedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>Abrir Conversación en WhatsApp</span>
                </a>
              )}
              <button
                onClick={handleModalClose}
                className="w-full py-3 bg-[#111111] text-[#F9F8F5] text-xs font-bold tracking-widest uppercase hover:bg-[#9E8B6E] transition-colors"
              >
                Volver a la Tienda
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
