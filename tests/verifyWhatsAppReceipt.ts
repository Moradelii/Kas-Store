import {
  buildWhatsAppMessage,
  createWhatsAppOrder,
  encodeWhatsAppText,
  OFFICIAL_WHATSAPP_PHONE,
} from '../src/services/paymentService.ts';
import { WhatsAppOrder, CheckoutFormData, CartItem } from '../src/types.ts';

function runTests() {
  console.log('--- INICIANDO VERIFICACIÓN DE MENSAJE DE WHATSAPP ---');

  // Test 1: Pedido con 1 solo producto y campos completos
  const singleItemOrder: WhatsAppOrder = {
    id: 'test-order-1',
    orderNumber: 'KAS-2026-6770',
    customerName: 'Cesar Moradel',
    customerPhone: '9865-8519',
    customerEmail: 'moradelii@gmail.com',
    departamento: 'Atlántida',
    municipio: 'La Masica (Sede KAS Store)',
    address: 'Colonia Lazo',
    deliveryNotes: 'Atrás de la Estación de Bomberos',
    carrierName: 'Encomiendas Litoral / Entrega Local',
    estimatedDelivery: '24 horas hábiles',
    items: [
      {
        productId: 'kas-1',
        productName: 'Jeans Hombre Selvedge Heritage Orillo Rojo',
        selectedSize: '30',
        selectedColor: 'Índigo Selvedge',
        quantity: 1,
        unitPriceHnl: 1390,
        totalHnl: 1390,
      },
    ],
    subtotalHnl: 1390,
    shippingFeeHnl: 80,
    discountHnl: 0,
    totalHnl: 1470,
    status: 'pendiente',
    createdAt: '2026-10-25T23:00:00.000Z',
    whatsappUrl: '',
  };

  const message1 = buildWhatsAppMessage(singleItemOrder);

  console.log('\n[MENSAJE GENERADO - PEDIDO INDIVIDUAL]:\n');
  console.log(message1);
  console.log('\n----------------------------------------\n');

  // Verificación 1: Saltos de línea reales (\n)
  const lines1 = message1.split('\n');
  if (lines1.length < 20) {
    throw new Error(`FALLO: El mensaje no contiene suficientes saltos de línea reales. Líneas encontradas: ${lines1.length}`);
  }
  console.log(`✓ Verificación 1 pasada: El mensaje contiene ${lines1.length} líneas con saltos de línea reales.`);

  // Verificación 2: Contiene los encabezados obligatorios
  const requiredHeaders = [
    'RECIBO DE PEDIDO - KAS STORE HONDURAS',
    '*DATOS DEL CLIENTE*',
    '*DIRECCIÓN DE ENVÍO*',
    '*DETALLE DE PRENDAS*',
    '*DESGLOSE DE PAGO*',
    '*LOGÍSTICA Y ENTREGA*',
    '*Hola KAS Store, deseo confirmar este pedido para coordinar el despacho.*',
  ];

  for (const header of requiredHeaders) {
    if (!message1.includes(header)) {
      throw new Error(`FALLO: Falta el encabezado requerido: "${header}"`);
    }
  }
  console.log('✓ Verificación 2 pasada: Todos los encabezados y bloques clave están presentes.');

  // Verificación 3: Formato del detalle de prenda
  if (!message1.includes('*Jeans Hombre Selvedge Heritage Orillo Rojo*')) {
    throw new Error('FALLO: Falta el nombre del producto en negrita.');
  }
  if (!message1.includes('   • Cantidad: 1')) {
    throw new Error('FALLO: Falta la cantidad con sangría y viñeta.');
  }
  if (!message1.includes('   • Talla: 30')) {
    throw new Error('FALLO: Falta la talla seleccionada.');
  }
  if (!message1.includes('   • Precio: L 1,390.00')) {
    throw new Error('FALLO: Formato incorrecto de precio unitario.');
  }
  if (!message1.includes('*Total prenda:* L 1,390.00')) {
    throw new Error('FALLO: Falta el total de la prenda formateado.');
  }
  console.log('✓ Verificación 3 pasada: Formato de prendas coincide con las viñetas y espaciados obligatorios.');

  // Verificación 4: Desglose de pago y moneda
  if (!message1.includes('*Subtotal:* L 1,390.00')) {
    throw new Error('FALLO: Falta Subtotal formateado.');
  }
  if (!message1.includes('*Envío:* L 80.00')) {
    throw new Error('FALLO: Falta Envío formateado.');
  }
  if (!message1.includes('*TOTAL A PAGAR:* L 1,470.00 HNL')) {
    throw new Error('FALLO: Falta TOTAL A PAGAR formateado con sufijo HNL.');
  }
  console.log('✓ Verificación 4 pasada: Desglose financiero y moneda en Lempiras con prefijo "L" y sufijo "HNL" correctos.');

  // Test 2: Pedido con múltiples productos y campos opcionales vacíos
  const multiItemOrder: WhatsAppOrder = {
    id: 'test-order-2',
    orderNumber: '#KAS-2026-8899',
    customerName: 'María Santos',
    customerPhone: '9988-7766',
    departamento: 'Cortés',
    municipio: 'San Pedro Sula',
    address: 'Barrio Guamilito, 4ta calle',
    carrierName: 'Transporte Mirna / Expreso del Litoral',
    estimatedDelivery: '24 a 48 horas hábiles',
    items: [
      {
        productId: 'kas-1',
        productName: 'Jeans Mujer Wide Leg Celeste Vintage',
        selectedSize: '28',
        selectedColor: 'Celeste Vintage',
        quantity: 2,
        unitPriceHnl: 890,
        totalHnl: 1780,
      },
      {
        productId: 'kas-2',
        productName: 'Jeans Niño Reforzado Tiro Alto',
        selectedSize: '10',
        selectedColor: 'Azul Medio',
        quantity: 1,
        unitPriceHnl: 550,
        totalHnl: 550,
      },
    ],
    subtotalHnl: 2330,
    shippingFeeHnl: 0,
    discountHnl: 100,
    couponCode: 'KAS100',
    totalHnl: 2230,
    status: 'pendiente',
    createdAt: '2026-10-26T14:30:00.000Z',
    whatsappUrl: '',
  };

  const message2 = buildWhatsAppMessage(multiItemOrder);
  console.log('\n[MENSAJE GENERADO - MÚLTIPLES PRODUCTOS]:\n');
  console.log(message2);
  console.log('\n----------------------------------------\n');

  // Verificaciones auditadas requeridas por el usuario:
  // 1. Separadores multilínea obligatorios
  if (!message2.includes('\n\n*DATOS DEL CLIENTE*')) {
    throw new Error('FALLO DE AUDITORÍA: Falta el separador exacto \\n\\n*DATOS DEL CLIENTE*');
  }
  if (!message2.includes('\n\n*DIRECCIÓN DE ENVÍO*')) {
    throw new Error('FALLO DE AUDITORÍA: Falta el separador exacto \\n\\n*DIRECCIÓN DE ENVÍO*');
  }
  if (!message2.includes('\n\n*DETALLE DE PRENDAS*')) {
    throw new Error('FALLO DE AUDITORÍA: Falta el separador exacto \\n\\n*DETALLE DE PRENDAS*');
  }
  if (!message2.includes('\n\n*DESGLOSE DE PAGO*')) {
    throw new Error('FALLO DE AUDITORÍA: Falta el separador exacto \\n\\n*DESGLOSE DE PAGO*');
  }
  if (!message2.includes('\n\n*LOGÍSTICA Y ENTREGA*')) {
    throw new Error('FALLO DE AUDITORÍA: Falta el separador exacto \\n\\n*LOGÍSTICA Y ENTREGA*');
  }
  console.log('✓ Auditoría 1 pasada: Todos los separadores multilínea (\\n\\n*SECCIÓN*) están presentes.');

  // 2. Ausencia total de barras invertidas de escape
  if (message2.includes('\\*') || message2.includes('\\')) {
    throw new Error('FALLO DE AUDITORÍA: El mensaje contiene barras invertidas (\\* o \\).');
  }
  console.log('✓ Auditoría 2 pasada: El mensaje con 2 productos no contiene ninguna barra invertida (\\*).');

  // 3. Extracción de parámetro text vía new URL(whatsappUrl).searchParams.get('text')
  const multiProductUrl = `https://wa.me/${OFFICIAL_WHATSAPP_PHONE}?text=${encodeWhatsAppText(message2)}`;
  const extractedMultiText = new URL(multiProductUrl).searchParams.get('text');

  if (!extractedMultiText) {
    throw new Error('FALLO DE AUDITORÍA: No se pudo extraer el parámetro text mediante URLSearchParams.');
  }
  if (extractedMultiText !== message2) {
    throw new Error('FALLO DE AUDITORÍA: El texto extraído de la URL difiere del mensaje original generado.');
  }
  if (extractedMultiText.split('\n').length !== message2.split('\n').length) {
    throw new Error('FALLO DE AUDITORÍA: La cantidad de saltos de línea difiere tras la extracción de la URL.');
  }
  console.log(`✓ Auditoría 3 pasada: new URL(whatsappUrl).searchParams.get('text') extrae el 100% del texto idéntico (${extractedMultiText.split('\n').length} líneas intactas).`);

  // Verificar que ambos productos existen en el mensaje
  if (!message2.includes('*Jeans Mujer Wide Leg Celeste Vintage*') || !message2.includes('*Jeans Niño Reforzado Tiro Alto*')) {
    throw new Error('FALLO: No se incluyeron todos los productos en el pedido múltiple.');
  }
  // Verificar campos opcionales vacíos
  if (!message2.includes('*Correo:* No proporcionado')) {
    throw new Error('FALLO: Correo opcional no manejado correctamente.');
  }
  if (!message2.includes('*Referencia:* No proporcionada')) {
    throw new Error('FALLO: Referencia opcional no manejada correctamente.');
  }
  // Verificar logística dinámica para Cortés
  if (!message2.includes('• Empresa: Transporte Mirna / Expreso del Litoral')) {
    throw new Error('FALLO: No se utilizó la empresa de transporte real para Cortés.');
  }
  if (!message2.includes('• Plazo estimado: 24 a 48 horas hábiles')) {
    throw new Error('FALLO: No se utilizó el plazo real de entrega.');
  }
  console.log('✓ Verificación 5 pasada: Pedido múltiple con campos opcionales y reglas logísticas de Cortés verificado.');

  // Test 3: Caso de Prueba Real Reportado #KAS-2026-9249
  const realReportedOrder: WhatsAppOrder = {
    id: 'test-order-9249',
    orderNumber: '#KAS-2026-9249',
    customerName: 'Cesar Moradel',
    customerPhone: '9865-8519',
    customerEmail: 'moradelii@gmail.com',
    departamento: 'Atlántida',
    municipio: 'La Masica (Sede KAS Store)',
    address: 'Colonia Lazo',
    deliveryNotes: 'Atrás de la Estación de Bomberos',
    carrierName: 'Encomiendas Litoral / Entrega Local',
    estimatedDelivery: '24 horas hábiles',
    items: [
      {
        productId: 'kas-1',
        productName: 'Jeans Hombre Selvedge Heritage Orillo Rojo',
        selectedSize: '30',
        selectedColor: 'Índigo Selvedge',
        quantity: 1,
        unitPriceHnl: 1390,
        totalHnl: 1390,
      },
    ],
    subtotalHnl: 1390,
    shippingFeeHnl: 80,
    discountHnl: 0,
    totalHnl: 1470,
    status: 'pendiente',
    createdAt: '2026-10-25T23:00:00.000Z',
    whatsappUrl: '',
  };

  const message9249 = buildWhatsAppMessage(realReportedOrder);
  console.log('\n[MENSAJE GENERADO - PEDIDO REPORTADO #KAS-2026-9249]:\n');
  console.log(message9249);
  console.log('\n----------------------------------------\n');

  // Asegurar que NO existen barras invertidas escapando asteriscos
  if (message9249.includes('\\*') || message9249.includes('\\')) {
    throw new Error('FALLO: El mensaje contiene barras invertidas no deseadas (\\*).');
  }
  console.log('✓ Verificación 6 pasada: El mensaje NO contiene barras invertidas (\\*). Los asteriscos son limpios (*).');

  // Test 4: Codificación oficial encodeWhatsAppText y URL wa.me
  const encodedText = encodeWhatsAppText(message9249);
  const fullWhatsAppUrl = `https://wa.me/${OFFICIAL_WHATSAPP_PHONE}?text=${encodedText}`;

  // Verificar que la codificación URL convierte asteriscos a %2A para evitar escapes (\*)
  if (encodedText.includes('*')) {
    throw new Error('FALLO: La URL contiene asteriscos literales sin codificar a %2A.');
  }
  if (!encodedText.includes('%2AOrden%3A%2A')) {
    throw new Error('FALLO: *Orden:* no fue codificado correctamente como %2AOrden%3A%2A');
  }
  if (encodedText.includes('\n')) {
    throw new Error('FALLO: La URL contiene saltos de línea literales (deben ser %0A).');
  }
  if (!encodedText.includes('%0A%0A%2AOrden%3A%2A')) {
    throw new Error('FALLO: Los saltos de línea no fueron convertidos a %0A.');
  }
  console.log('✓ Verificación 7 pasada: La codificación convierte asteriscos a %2A y saltos de línea a %0A.');

  // Test 5: Roundtrip de decodificación exacta
  const urlParams = new URL(fullWhatsAppUrl).searchParams;
  const decodedText = urlParams.get('text');

  if (!decodedText) {
    throw new Error('FALLO: No se pudo obtener el parámetro text de la URL.');
  }
  if (decodedText !== message9249) {
    throw new Error('FALLO: El texto recuperado no coincide 100% con el mensaje original.');
  }
  const decodedLines = decodedText.split('\n');
  if (decodedLines.length !== message9249.split('\n').length) {
    throw new Error('FALLO: Se perdieron saltos de línea al decodificar.');
  }
  console.log(`✓ Verificación 8 pasada: Roundtrip 100% fiel. Decodifica exactamente ${decodedLines.length} líneas con negritas intactas.`);

  console.log('\n🎉 TODAS LAS 8 VERIFICACIONES DE MENSAJE DE WHATSAPP HAN PASADO EXITOSAMENTE.');
}

runTests();
