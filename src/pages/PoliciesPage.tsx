import React, { useState } from 'react';
import {
  Truck,
  RefreshCw,
  FileText,
  ShieldCheck,
  Mail,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  Phone,
  MapPin,
  CheckCircle,
} from 'lucide-react';

export type PolicyTab = 'envios' | 'devoluciones' | 'terminos' | 'privacidad' | 'contacto' | 'faq';

interface PoliciesPageProps {
  initialTab?: PolicyTab;
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ initialTab = 'envios', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  const tabs: Array<{ id: PolicyTab; label: string; icon: React.ReactNode }> = [
    { id: 'envios', label: 'Política de Envíos', icon: <Truck className="w-4 h-4" /> },
    { id: 'devoluciones', label: 'Cambios y Devoluciones', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'terminos', label: 'Términos y Condiciones', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacidad', label: 'Política de Privacidad', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'contacto', label: 'Contacto y Soporte', icon: <Mail className="w-4 h-4" /> },
    { id: 'faq', label: 'Preguntas Frecuentes', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-[#FAF7F2] py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A622A]">
            Transparencia & Cumplimiento Legal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2E2721]">
            Políticas y Centro de Información
          </h1>
          <p className="text-xs sm:text-sm text-[#2E2721]/75 leading-relaxed">
            Conoce los lineamientos de compra, tarifas de despacho hacia los 18 departamentos de Honduras y garantías en pantalones de mezclilla de KAS Store (La Masica, Atlántida).
          </p>
        </div>

        {/* Legal Disclaimer Box for Honduras */}
        <div className="bg-[#FFFDF9] border-l-4 border-[#B88B4A] p-4 sm:p-5 shadow-xs text-xs space-y-1.5 text-[#2E2721]">
          <div className="flex items-center gap-2 font-bold text-[#8A622A]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Nota de Cumplimiento Normativo — República de Honduras</span>
          </div>
          <p className="text-[#2E2721]/80 leading-relaxed">
            Las políticas descritas han sido estructuradas siguiendo los principios de la{' '}
            <strong>Ley de Comercio Electrónico de Honduras (Decreto No. 149-2014)</strong> y la{' '}
            <strong>Ley de Protección al Consumidor (Decreto No. 24-2008)</strong>. Los precios están expresados en{' '}
            <strong>Lempiras (HNL)</strong> con impuestos aplicables. Los textos marcados están sujetos a validación
            final con el apoderado legal de KAS Store antes del inicio de cobros bancarios reales.
          </p>
        </div>

        {/* Tab Navigation & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 bg-[#FFFEFC] border border-[#E8DEC9] p-3 shadow-xs space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8A622A] px-3 py-2">
              Secciones
            </h2>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-[#2E2721] text-[#FAF7F2] font-semibold shadow-xs'
                      : 'text-[#2E2721] hover:bg-[#FAF7F2] hover:text-[#B88B4A]'
                  }`}
                >
                  <span className={isActive ? 'text-[#B88B4A]' : 'text-[#8A622A]'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-[#E8DEC9] px-3 space-y-2">
              <p className="text-[11px] text-[#2E2721]/70">¿Tienes una consulta específica sobre tu pedido?</p>
              <a
                href="https://wa.me/50433056175"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2 bg-[#B88B4A] hover:bg-[#8A622A] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Asesoría WhatsApp
              </a>
            </div>
          </div>

          {/* Main Policy Content Pane */}
          <div className="lg:col-span-8 bg-[#FFFEFC] border border-[#E8DEC9] p-6 sm:p-8 shadow-xs">
            {/* TAB 1: ENVÍOS */}
            {activeTab === 'envios' && (
              <div className="space-y-6 text-xs text-[#2E2721]/90 leading-relaxed">
                <div className="border-b border-[#E8DEC9] pb-4">
                  <h2 className="font-serif text-2xl font-bold text-[#2E2721]">
                    Política de Envíos y Despachos Nacionales
                  </h2>
                  <p className="text-[#8A622A] font-medium text-xs mt-1">
                    Origen: La Masica, Atlántida, Honduras · Cobertura: 18 Departamentos
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">1. Tiempos de Preparación y Despacho</h3>
                  <p>
                    Todos los pedidos de pantalones de mezclilla pasan por una inspección rigurosa de costuras,
                    remaches, teñido y empaque individual. El despacho se efectúa en un plazo de{' '}
                    <strong>24 a 48 horas hábiles</strong> tras la confirmación bancaria del pago.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">2. Tarifario Oficial por Zonas (HNL)</h3>
                  <div className="overflow-x-auto border border-[#E8DEC9]">
                    <table className="w-full text-left text-xs divide-y divide-[#E8DEC9]">
                      <thead className="bg-[#FAF7F2] font-semibold text-[#2E2721]">
                        <tr>
                          <th className="p-2.5">Zona</th>
                          <th className="p-2.5">Departamentos</th>
                          <th className="p-2.5">Transportista</th>
                          <th className="p-2.5">Tiempo Est.</th>
                          <th className="p-2.5">Tarifa Base</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8DEC9] bg-white">
                        <tr>
                          <td className="p-2.5 font-bold text-[#8A622A]">Atlántida (Local)</td>
                          <td className="p-2.5">La Masica, La Ceiba, Tela, etc.</td>
                          <td className="p-2.5">Mensajería Local / Express</td>
                          <td className="p-2.5">24 - 48 hrs</td>
                          <td className="p-2.5 font-mono font-bold">L 80.00</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-[#8A622A]">Zona Norte</td>
                          <td className="p-2.5">Cortés (SPS), Yoro, Colón</td>
                          <td className="p-2.5">Cargo Expreso / Rápidos HN</td>
                          <td className="p-2.5">24 - 48 hrs</td>
                          <td className="p-2.5 font-mono font-bold">L 120.00</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-[#8A622A]">Centro - Sur</td>
                          <td className="p-2.5">Francisco Morazán (TGU), Comayagua, Choluteca, Valle, La Paz, El Paraíso</td>
                          <td className="p-2.5">Cargo Expreso Honduras</td>
                          <td className="p-2.5">48 - 72 hrs</td>
                          <td className="p-2.5 font-mono font-bold">L 140.00</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-[#8A622A]">Occidente & Foránea</td>
                          <td className="p-2.5">Copán, Ocotepeque, Lempira, Intibucá, Olancho, Santa Bárbara, Islas de la Bahía, Gracias a Dios</td>
                          <td className="p-2.5">Transporte Aéreo / Terrestre Enlace</td>
                          <td className="p-2.5">48 - 96 hrs</td>
                          <td className="p-2.5 font-mono font-bold">L 170.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-4 border border-[#E8DEC9] space-y-2">
                  <h4 className="font-semibold text-xs text-[#2E2721] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Beneficio de Envío Gratuito
                  </h4>
                  <p className="text-[11px] text-[#2E2721]/80">
                    Aplica automáticamente <strong>ENVÍO GRATIS</strong> en cualquier compra cuyo subtotal sea igual o
                    mayor a <strong>L 1,500.00 HNL</strong> hacia cualquiera de los 18 departamentos de Honduras.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-[#2E2721]">3. Notificación de Guía y Seguimiento</h3>
                  <p>
                    Una vez entregado el paquete a la empresa transportista (Cargo Expreso u operadora local), el cliente
                    recibirá su número de guía por WhatsApp y/o correo electrónico para monitorear el paquete hasta la
                    puerta de su domicilio o sucursal seleccionada.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: DEVOLUCIONES */}
            {activeTab === 'devoluciones' && (
              <div className="space-y-6 text-xs text-[#2E2721]/90 leading-relaxed">
                <div className="border-b border-[#E8DEC9] pb-4">
                  <h2 className="font-serif text-2xl font-bold text-[#2E2721]">
                    Política de Cambios de Talla y Garantía
                  </h2>
                  <p className="text-[#8A622A] font-medium text-xs mt-1">
                    Garantía KAS Store · Satisfacción y Calidad de Mezclilla
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">1. Plazo para Solicitar Cambio</h3>
                  <p>
                    Dispones de hasta <strong>10 días calendario</strong> posteriores a la fecha de entrega para
                    notificar si el pantalón requiere un cambio de talla (para adulto o niño) o cambio por otra tonalidad.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">2. Condiciones de la Prenda</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-[#2E2721]/80">
                    <li>La prenda debe encontrarse en estado nuevo, sin uso y sin lavar.</li>
                    <li>Debe conservar todas sus etiquetas originales, marquillas y botones de repuesto si aplica.</li>
                    <li>No debe presentar manchas, olores a perfume, desgaste por uso ni modificaciones en basta o tiro.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">3. Procedimiento de Cambio</h3>
                  <p>
                    1. Comunícate vía WhatsApp al <strong>+504 3305-6175</strong> indicando tu número de pedido (ej.{' '}
                    <em>KAS-2026-XXXX</em>) y la nueva talla que necesitas.
                    <br />
                    2. Nuestro equipo confirmará la disponibilidad en inventario.
                    <br />
                    3. Envías la prenda a nuestra sede en La Masica, Atlántida. Tras la inspección física, despachamos la
                    nueva unidad sin demora.
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-4 border border-[#E8DEC9]">
                  <p className="text-[11px] text-[#2E2721]/80">
                    <em>* Revisión Legal para Honduras:</em> En caso de defecto de fabricación comprobado en el hilado o
                    cierre, KAS Store asume el 100% de los costos de flete conforme a la Ley de Protección al Consumidor.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: TÉRMINOS Y CONDICIONES */}
            {activeTab === 'terminos' && (
              <div className="space-y-6 text-xs text-[#2E2721]/90 leading-relaxed">
                <div className="border-b border-[#E8DEC9] pb-4">
                  <h2 className="font-serif text-2xl font-bold text-[#2E2721]">
                    Términos y Condiciones de Uso y Venta
                  </h2>
                  <p className="text-[#8A622A] font-medium text-xs mt-1">
                    KAS Store · Ley de Comercio Electrónico de Honduras (Decreto No. 149-2014)
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">1. Identificación del Comercio</h3>
                  <p>
                    El presente sitio web es operado por <strong>KAS Store</strong>, negocio radicado en el municipio de{' '}
                    <strong>La Masica, departamento de Atlántida, República de Honduras</strong>, dedicado al comercio al
                    por menor de prendas de mezclilla y pantalones vaqueros. Correo oficial:{' '}
                    <strong>k-andradesantos@gmail.com</strong>.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">2. Moneda, Precios y Facturación</h3>
                  <p>
                    Todos los precios publicados en la tienda están fijados en moneda de curso legal:{' '}
                    <strong>Lempiras Hondureños (HNL)</strong>. Los pagos efectuados mediante PayPal se convierten a su
                    equivalente en <strong>Dólares Estadounidenses (USD)</strong> según la tasa de referencia bancaria
                    indicada en el checkout antes de autorizar el cobro.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">3. Medios de Pago Autorizados</h3>
                  <p>
                    KAS Store procesa tarjetas de crédito y débito Visa y Mastercard a través de la pasarela autorizada
                    por la Comisión Nacional de Bancos y Seguros (CNBS) de Honduras (PixelPay) y PayPal REST API v2. KAS
                    Store <strong>nunca almacena números completos de tarjeta ni códigos CVV</strong> en sus bases de
                    datos.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">4. Disponibilidad y Reserva de Inventario</h3>
                  <p>
                    La colocación de un pedido reserva temporalmente el inventario de la talla seleccionada. Si el pago
                    no se completa dentro de la ventana de sesión o es declinado por la entidad emisora, el stock es
                    liberado automáticamente para otros compradores.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                  <strong>[Texto Sujeto a Revisión Legal]:</strong> La validez contractual de las compras por medios
                  electrónicos en este sitio se rige exclusivamente por las leyes de la República de Honduras. Cualquier
                  disputa se someterá a los juzgados de la jurisdicción de Atlántida o Francisco Morazán.
                </div>
              </div>
            )}

            {/* TAB 4: PRIVACIDAD */}
            {activeTab === 'privacidad' && (
              <div className="space-y-6 text-xs text-[#2E2721]/90 leading-relaxed">
                <div className="border-b border-[#E8DEC9] pb-4">
                  <h2 className="font-serif text-2xl font-bold text-[#2E2721]">
                    Política de Privacidad y Tratamiento de Datos
                  </h2>
                  <p className="text-[#8A622A] font-medium text-xs mt-1">
                    Protección de datos personales de nuestros clientes
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">1. Información que Recopilamos</h3>
                  <p>
                    Recopilamos únicamente los datos indispensables para procesar tu orden y coordinar la entrega:{' '}
                    <strong>Nombre completo, teléfono de contacto en Honduras, correo electrónico y dirección física de entrega (Departamento, Municipio y puntos de referencia)</strong>.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">2. Finalidad del Tratamiento</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-[#2E2721]/80">
                    <li>Generar la orden y coordinar el flete con Cargo Expreso o mensajería en Honduras.</li>
                    <li>Enviar notificaciones sobre el estado de tu pedido y confirmación de pago.</li>
                    <li>Brindar soporte y asesoría personalizada de tallas mediante WhatsApp.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">3. Confidencialidad y Terceros</h3>
                  <p>
                    KAS Store <strong>no vende, arrienda ni comparte</strong> tus datos con agencias de marketing ni
                    terceros ajenos a la operación. Los únicos proveedores que reciben información son el procesador
                    bancario (para validar el cobro) y la empresa transportista (para entregar el paquete).
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#2E2721]">4. Derechos del Titular (ARCO)</h3>
                  <p>
                    Puedes solicitar en cualquier momento la corrección, actualización o supresión de tus datos
                    personales escribiendo directamente a <strong>k-andradesantos@gmail.com</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: CONTACTO */}
            {activeTab === 'contacto' && (
              <div className="space-y-6 text-xs text-[#2E2721]/90 leading-relaxed">
                <div className="border-b border-[#E8DEC9] pb-4">
                  <h2 className="font-serif text-2xl font-bold text-[#2E2721]">
                    Canales Oficiales de Contacto y Atención
                  </h2>
                  <p className="text-[#8A622A] font-medium text-xs mt-1">
                    Atención personalizada directa desde La Masica, Atlántida
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#FAF7F2] p-4 border border-[#E8DEC9] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#2E2721]">
                      <MapPin className="w-4 h-4 text-[#B88B4A]" />
                      <span>Ubicación de Sede</span>
                    </div>
                    <p className="text-xs text-[#2E2721]/80">
                      Barrio El Centro, La Masica, departamento de Atlántida, Honduras.
                    </p>
                  </div>

                  <div className="bg-[#FAF7F2] p-4 border border-[#E8DEC9] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#2E2721]">
                      <Phone className="w-4 h-4 text-[#B88B4A]" />
                      <span>WhatsApp y Llamadas</span>
                    </div>
                    <p className="text-xs text-[#2E2721]/80 font-mono font-bold">+504 3305-6175</p>
                    <p className="text-[11px] text-[#2E2721]/60">Lunes a Sábado: 8:00 AM – 6:00 PM</p>
                  </div>

                  <div className="bg-[#FAF7F2] p-4 border border-[#E8DEC9] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#2E2721]">
                      <Mail className="w-4 h-4 text-[#B88B4A]" />
                      <span>Correo Electrónico</span>
                    </div>
                    <p className="text-xs text-[#2E2721]/80">k-andradesantos@gmail.com</p>
                    <p className="text-[11px] text-[#2E2721]/60">Respuesta promedio en menos de 2 horas</p>
                  </div>

                  <div className="bg-[#FAF7F2] p-4 border border-[#E8DEC9] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#2E2721]">
                      <ShieldCheck className="w-4 h-4 text-[#B88B4A]" />
                      <span>Desarrollo y Diseño Web</span>
                    </div>
                    <p className="text-xs text-[#2E2721]/80">Mora-Grafic's Studio</p>
                    <a
                      href="https://mora-grafics-studio.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#B88B4A] hover:underline"
                    >
                      mora-grafics-studio.com
                    </a>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <a
                    href="https://wa.me/50433056175?text=Hola%20KAS%20Store%2C%20quisiera%20hacer%20una%20consulta%20sobre%20un%20pedido%20de%20jeans"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#B88B4A] hover:bg-[#8A622A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Iniciar Chat de WhatsApp (+504 3305-6175)
                  </a>
                </div>
              </div>
            )}

            {/* TAB 6: PREGUNTAS FRECUENTES (FAQ) */}
            {activeTab === 'faq' && (
              <div className="space-y-6 text-xs text-[#2E2721]/90 leading-relaxed">
                <div className="border-b border-[#E8DEC9] pb-4">
                  <h2 className="font-serif text-2xl font-bold text-[#2E2721]">
                    Preguntas Frecuentes de Clientes
                  </h2>
                  <p className="text-[#8A622A] font-medium text-xs mt-1">
                    Respuestas rápidas sobre compras de jeans, pagos y entregas
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border-b border-[#E8DEC9] pb-3">
                    <h4 className="font-semibold text-xs text-[#2E2721]">¿Cuáles métodos de pago aceptan?</h4>
                    <p className="mt-1 text-[#2E2721]/80">
                      Aceptamos tarjetas de crédito y débito Visa y Mastercard mediante la pasarela segura hondureña
                      PixelPay (con liquidación en HNL), transferencias bancarias locales y pagos con saldo o tarjeta a
                      través de PayPal (USD).
                    </p>
                  </div>

                  <div className="border-b border-[#E8DEC9] pb-3">
                    <h4 className="font-semibold text-xs text-[#2E2721]">¿Llegan a mi municipio o aldea en Honduras?</h4>
                    <p className="mt-1 text-[#2E2721]/80">
                      Sí, cubrimos los 18 departamentos mediante Cargo Expreso o empresas de encomienda con cobertura en
                      cabeceras departamentales, municipios principales y sucursales receptoras.
                    </p>
                  </div>

                  <div className="border-b border-[#E8DEC9] pb-3">
                    <h4 className="font-semibold text-xs text-[#2E2721]">¿Los pantalones son nuevos y de mezclilla real?</h4>
                    <p className="mt-1 text-[#2E2721]/80">
                      Totalmente. Todos nuestros pantalones son 100% nuevos, confeccionados con mezclilla de alta densidad
                      y lavados de calidad (índigo oscuro, stone wash, celeste vintage, stay-black y ecru).
                    </p>
                  </div>

                  <div className="border-b border-[#E8DEC9] pb-3">
                    <h4 className="font-semibold text-xs text-[#2E2721]">¿Cómo elijo la talla si compro por primera vez?</h4>
                    <p className="mt-1 text-[#2E2721]/80">
                      Puedes consultar nuestra <strong>Guía de Tallas</strong> interactiva o enviarnos un WhatsApp al{' '}
                      <strong>+504 3305-6175</strong> con tu peso y estatura para que un asesor te recomiende la talla
                      óptima de cintura y tiro.
                    </p>
                  </div>

                  <div className="pb-3">
                    <h4 className="font-semibold text-xs text-[#2E2721]">¿Qué pasa si el pago con tarjeta es declinado?</h4>
                    <p className="mt-1 text-[#2E2721]/80">
                      Si el banco rechaza la transacción (por falta de fondos, tarjeta vencida o bloqueo de seguridad 3DS),
                      el pedido permanece en estado pendiente y las unidades en inventario no se pierden de inmediato.
                      Puedes reintentar con otra tarjeta o coordinar por WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action strip to return to store */}
        <div className="pt-6 border-t border-[#E8DEC9] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-[#8A622A] hover:underline font-semibold"
          >
            ← Volver a la página de inicio
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-6 py-2.5 bg-[#2E2721] hover:bg-[#8A622A] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
          >
            Explorar Colección de Mezclilla
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
