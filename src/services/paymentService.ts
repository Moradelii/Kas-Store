/**
 * Servicio de Pedidos y Generación de Mensaje para WhatsApp
 * KAS Store — La Masica, Atlántida, Honduras
 *
 * Genera un recibo digital estructurado y ultra limpio, con emojis universales
 * y sin caracteres especiales corruptibles en dispositivos móviles.
 */

import { CartItem, CheckoutFormData, WhatsAppOrder, WhatsAppOrderItem } from '../types.ts';
import { getShippingDetails } from '../lib/shippingRates.ts';
import { cartStorage } from './cartStorage.ts';

export const OFFICIAL_WHATSAPP_PHONE = '50433056175';
export const OFFICIAL_WHATSAPP_DISPLAY = '+504 3305-6175';

/**
 * Genera el número de orden legible (#KAS-AÑO-RANDOM)
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `KAS-${year}-${randomSuffix}`;
}

/**
 * Formatea cantidades numéricas con separador de miles y 2 decimales (estándar HNL)
 */
export function formatHnl(amount: number): string {
  return Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formato de fecha estándar hondureño: "25 de oct de 2026, 11:00 p.m."
 */
export function formatOrderDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day} de ${month} de ${year}, ${hours}:${minutes} ${ampm}`;
  } catch {
    return new Date().toLocaleDateString('es-HN');
  }
}

/**
 * Construye el recibo digital estructurado y limpio para WhatsApp
 * Utiliza plantilla multilínea con backticks (template literal) que garantiza
 * saltos de línea reales (\n) sin concatenaciones defectuosas ni colapso de texto.
 */
export function buildWhatsAppMessage(order: WhatsAppOrder): string {
  const cleanOrderNumber = order.orderNumber.startsWith('#')
    ? order.orderNumber
    : `#${order.orderNumber}`;

  const formattedDate = formatOrderDate(order.createdAt);
  const cleanPhone = order.customerPhone.trim();
  const customerEmail = order.customerEmail?.trim() ? order.customerEmail.trim() : 'No proporcionado';
  const reference = order.deliveryNotes?.trim() ? order.deliveryNotes.trim() : 'No proporcionada';

  // Bloque repetible por cada producto del pedido sin omitir prendas ni variantes
  const itemsBlock = order.items
    .map((item) => {
      const unitPriceFormatted = formatHnl(item.unitPriceHnl);
      const subtotalPrendaFormatted = formatHnl(item.totalHnl);
      return `*${item.productName}*
   • Cantidad: ${item.quantity}
   • Talla: ${item.selectedSize}
   • Precio: L ${unitPriceFormatted}
*Total prenda:* L ${subtotalPrendaFormatted}`;
    })
    .join('\n\n');

  const subtotalFormatted = formatHnl(order.subtotalHnl);
  const envioFormatted = formatHnl(order.shippingFeeHnl);
  const totalFormatted = formatHnl(order.totalHnl);
  const carrier = order.carrierName || 'Encomiendas Litoral / Entrega Local';
  const plazo = order.estimatedDelivery || '24 horas hábiles';

  const discountBlock = order.discountHnl && order.discountHnl > 0
    ? `\n*Descuento (${order.couponCode || 'Cupón'}):* -L ${formatHnl(order.discountHnl)}`
    : '';

  const message = `RECIBO DE PEDIDO - KAS STORE HONDURAS

*Orden:* ${cleanOrderNumber}
*Fecha:* ${formattedDate}

*DATOS DEL CLIENTE*
*Nombre:* ${order.customerName}
*Teléfono:* ${cleanPhone}
*Correo:* ${customerEmail}

*DIRECCIÓN DE ENVÍO*
*Departamento:* ${order.departamento}
*Municipio:* ${order.municipio}
*Dirección:* ${order.address}
*Referencia:* ${reference}

*DETALLE DE PRENDAS*

${itemsBlock}

*DESGLOSE DE PAGO*

*Subtotal:* L ${subtotalFormatted}${discountBlock}
*Envío:* L ${envioFormatted}
*TOTAL A PAGAR:* L ${totalFormatted} HNL

*LOGÍSTICA Y ENTREGA*
• Empresa: ${carrier}
• Plazo estimado: ${plazo}
*Sede:* La Masica, Atlántida, Honduras.

*Hola KAS Store, deseo confirmar este pedido para coordinar el despacho.*`;

  return message;
}

/**
 * Codifica el mensaje de texto para URLs oficiales de WhatsApp (wa.me y api.whatsapp.com):
 * - Normaliza saltos de línea garantizando '\n' real -> %0A
 * - Convierte asteriscos (*) a %2A para que WhatsApp interprete negritas sin que
 *   el navegador, el protocolo de escritorio o el parser introduzca barras invertidas (\*)
 * - Convierte caracteres especiales reservados RFC 3986 (' -> %27, ( -> %28, ) -> %29)
 */
export function encodeWhatsAppText(message: string): string {
  const normalized = message.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return encodeURIComponent(normalized)
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

/**
 * Crea el objeto WhatsAppOrder completo y genera el enlace wa.me
 */
export function createWhatsAppOrder(
  formData: CheckoutFormData,
  items: CartItem[],
  subtotalHnl: number,
  discountHnl = 0,
  couponCode?: string
): WhatsAppOrder {
  const shipping = getShippingDetails(formData.departamento, subtotalHnl);
  const totalHnl = Math.max(0, subtotalHnl - discountHnl + shipping.shippingFeeHnl);
  const orderNumber = generateOrderNumber();
  const id = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const orderItems: WhatsAppOrderItem[] = items.map((item) => ({
    productId: item.productId,
    productName: item.product.name,
    selectedSize: item.selectedSize,
    selectedColor: item.selectedColor,
    quantity: item.quantity,
    unitPriceHnl: item.product.priceHnl,
    totalHnl: item.product.priceHnl * item.quantity,
    image: item.product.images[0],
  }));

  const partialOrder: Omit<WhatsAppOrder, 'whatsappUrl'> = {
    id,
    orderNumber,
    customerName: formData.fullName.trim(),
    customerPhone: formData.phone.trim(),
    customerEmail: formData.email?.trim() || undefined,
    departamento: formData.departamento,
    municipio: formData.municipio,
    address: formData.address.trim(),
    deliveryNotes: formData.deliveryNotes?.trim() || undefined,
    carrierName: shipping.carrierName,
    estimatedDelivery: shipping.estimatedDeliveryHours,
    items: orderItems,
    subtotalHnl,
    shippingFeeHnl: shipping.shippingFeeHnl,
    discountHnl,
    totalHnl,
    couponCode,
    status: 'pendiente',
    createdAt: new Date().toISOString(),
  };

  const messageText = buildWhatsAppMessage(partialOrder as WhatsAppOrder);
  const whatsappUrl = `https://wa.me/${OFFICIAL_WHATSAPP_PHONE}?text=${encodeWhatsAppText(messageText)}`;

  const finalOrder: WhatsAppOrder = {
    ...partialOrder,
    whatsappUrl,
  };

  // Persistir en CRM local
  cartStorage.saveOrder(finalOrder);

  return finalOrder;
}
