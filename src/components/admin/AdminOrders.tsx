import React from 'react';
import { MessageCircle, MapPin, Phone, Calendar, Clock } from 'lucide-react';
import { OrderRecord } from '../../types/index.ts';
import { formatLempiras, buildWhatsAppUrl } from '../../utils/format.ts';
import { updateOrderStatus } from '../../services/api.ts';

interface AdminOrdersProps {
  orders: OrderRecord[];
  onOrdersUpdated: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onOrdersUpdated }) => {
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
    onOrdersUpdated();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 border border-[#D4C4A8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
            Historial de Pedidos Realizados vía WhatsApp
          </h3>
          <p className="text-xs text-[#666]">
            Registro de clientes y órdenes enviadas desde el carrito de compras de la tienda.
          </p>
        </div>
        <span className="text-xs font-semibold text-[#111111] bg-[#F2EBDD] px-3 py-1 border border-[#D4C4A8]">
          Total Órdenes: {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center border border-[#D4C4A8] text-[#777]">
          <p className="font-bold text-[#111111]">No se han registrado pedidos aún.</p>
          <p className="text-xs mt-1">Los pedidos aparecerán aquí cuando los clientes finalicen su compra hacia WhatsApp.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('es-HN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={order.id}
                className="bg-white border border-[#D4C4A8] p-5 shadow-sm space-y-4 hover:border-[#111111] transition-colors"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E6D5B8]/60">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-[#111111] font-heading">
                      {order.id}
                    </span>
                    <span className="text-xs text-[#777] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#666] font-medium">Estado:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-bold uppercase px-3 py-1 border focus:outline-none cursor-pointer ${
                        order.status === 'nuevo'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : order.status === 'contactado'
                          ? 'bg-blue-50 text-blue-900 border-blue-300'
                          : order.status === 'enviado'
                          ? 'bg-purple-50 text-purple-900 border-purple-300'
                          : order.status === 'completado'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : 'bg-red-50 text-red-900 border-red-300'
                      }`}
                    >
                      <option value="nuevo">NUEVO</option>
                      <option value="contactado">CONTACTADO</option>
                      <option value="enviado">ENVIADO</option>
                      <option value="completado">COMPLETADO</option>
                      <option value="cancelado">CANCELADO</option>
                    </select>
                  </div>
                </div>

                {/* Customer Details & Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Customer Information */}
                  <div className="space-y-2 bg-[#F9F8F5] p-3 border border-[#E6D5B8]/60">
                    <p className="font-bold text-[#111111] uppercase tracking-wider text-[11px] text-[#9E8B6E]">
                      Datos del Comprador
                    </p>
                    <p className="font-bold text-sm text-[#111111]">{order.customerName}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#555]">
                        <Phone className="w-3.5 h-3.5 text-[#9E8B6E]" />
                        <span>{order.phone}</span>
                      </span>
                      <a
                        href={buildWhatsAppUrl(
                          order.phone,
                          `¡Hola ${order.customerName}! Te escribimos de KAS Store respecto a tu pedido ${order.id}. ¿Deseas coordinar el pago y la entrega de tus prendas?`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Chatear con Cliente</span>
                      </a>
                    </div>
                    <p className="flex items-start gap-1.5 text-[#555]">
                      <MapPin className="w-3.5 h-3.5 text-[#9E8B6E] shrink-0 mt-0.5" />
                      <span>{order.address}</span>
                    </p>
                    {order.notes && (
                      <p className="text-[11px] text-[#777] italic bg-white p-2 border border-[#EAEAEA]">
                        "Notas: {order.notes}"
                      </p>
                    )}
                  </div>

                  {/* Items list & total */}
                  <div className="space-y-2 bg-[#F9F8F5] p-3 border border-[#E6D5B8]/60 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-[#111111] uppercase tracking-wider text-[11px] text-[#9E8B6E] mb-2">
                        Prendas Solicitadas ({order.items.length})
                      </p>
                      <ul className="space-y-1.5">
                        {order.items.map((it, idx) => (
                          <li key={idx} className="flex justify-between items-center text-xs pb-1 border-b border-[#EAEAEA] last:border-0">
                            <div>
                              <span className="font-semibold text-[#111111]">{it.name}</span>
                              <div className="text-[10px] text-[#777] space-x-1">
                                <span>Talla: <strong>{it.size}</strong></span>
                                <span>· Color: {it.color}</span>
                                <span>· Cant: {it.quantity}</span>
                              </div>
                            </div>
                            <span className="font-bold tabular-nums text-[#111111]">
                              {formatLempiras(it.price * it.quantity)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-[#D4C4A8] flex justify-between items-center text-sm font-extrabold text-[#111111] font-heading">
                      <span>TOTAL ESTIMADO:</span>
                      <span className="text-base text-emerald-800 tabular-nums">
                        {formatLempiras(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
