import { CartItem, CustomerOrderData } from '../types/index.ts';

/**
 * Format price in Honduran Lempiras with the mandatory format: L. 850.00
 */
export function formatLempiras(amount: number): string {
  if (isNaN(amount)) return 'L. 0.00';
  const parts = Number(amount).toFixed(2).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `L. ${intPart}.${parts[1]}`;
}

/**
 * Generate the exact WhatsApp order message required by KAS Store:
 * 
 * ¡Hola KAS Store! 👋 Me interesa realizar el siguiente pedido:
 * 
 * DETALLE DEL PEDIDO:
 * • [Nombre del Producto 1] - Talla: [X] - Color: [X] - Cantidad: [X] - L. [Precio]
 * • [Nombre del Producto 2] - Talla: [X] - Color: [X] - Cantidad: [X] - L. [Precio]
 * 
 * TOTAL ESTIMADO: L. [Suma Total]
 * 
 * DATOS DEL CLIENTE:
 * • Nombre: [Nombre del cliente]
 * • Teléfono: [Teléfono del cliente]
 * • Dirección: [Dirección de entrega]
 * • Notas: [Notas adicionales]
 * 
 * Quedo atento a las instrucciones de pago y envío. ¡Gracias!
 */
export function generateWhatsAppMessage(order: CustomerOrderData): string {
  const itemLines = order.items
    .map(
      (item) =>
        `• ${item.name} - Talla: ${item.size} - Color: ${item.color} - Cantidad: ${item.quantity} - ${formatLempiras(item.price * item.quantity)}`
    )
    .join('\n');

  const notesText = order.notes && order.notes.trim().length > 0 ? order.notes.trim() : 'Ninguna';

  const message = `¡Hola KAS Store! 👋 Me interesa realizar el siguiente pedido:

DETALLE DEL PEDIDO:
${itemLines}

TOTAL ESTIMADO: ${formatLempiras(order.total)}

DATOS DEL CLIENTE:
• Nombre: ${order.customerName.trim()}
• Teléfono: ${order.phone.trim()}
• Dirección: ${order.address.trim()}
• Notas: ${notesText}

Quedo atento a las instrucciones de pago y envío. ¡Gracias!`;

  return message;
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  // Clean phone number: remove spaces, dashes, plus sign
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
