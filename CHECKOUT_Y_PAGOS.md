# KAS STORE — BITÁCORA DE CHECKOUT Y PEDIDOS POR WHATSAPP (JAMSTACK ESTÁTICO)

> **Sede:** La Masica, Atlántida, Honduras.  
> **Especialidad:** Pantalones y jeans de mezclilla denim para hombre, mujer, niño y niña.  
> **Canal Exclusivo de Checkout:** WhatsApp Oficial (`+504 3305-6175`).  
> **Moneda:** Lempiras (HNL).  
> **Despliegue:** Cloudflare Pages (JAMstack).

---

## 1. Simplificación del Flujo de Negocio en Honduras

Para maximizar la conversión y adaptarse a los hábitos de compra reales en el mercado hondureño, se eliminaron las pasarelas bancarias complejas que requerían contracargos, credenciales de adquirentes o cuentas PayPal internacionales.

### Ventajas del Modelo Directo por WhatsApp:
1. **Confianza local:** El 95%+ del comercio electrónico informal y formal en Honduras se coordina por WhatsApp.
2. **Cero Comisiones de Pasarela:** No se pagan tarifas del 3.5% + comisión fija por transacción a procesadores externos.
3. **Coordinación de Formas de Pago Flexibles:** El cliente puede optar por:
   * Transferencia bancaria local (BAC, Atlántida, Ficohsa, Banpaís, Banhcafé).
   * Pago contra entrega (donde la cobertura de paquetería lo permita).
   * Billeteras electrónicas hondureñas (Tengo, Dilo, etc.).
4. **Verificación de Talla en Vivo:** Antes de despachar, el personal de KAS Store en La Masica puede confirmar medidas exactas de cintura y largo de pierna, reduciendo drásticamente las devoluciones.

---

## 2. Arquitectura del Checkout

### A. Formulario de Envío
Ubicado en `src/pages/CheckoutPage.tsx`:
* **Datos personales:** Nombre completo, número telefónico hondureño de WhatsApp (+504) y correo electrónico opcional.
* **Geolocalización en Honduras:** Diccionario estático en `src/data/hondurasLocations.ts` con los 18 departamentos y municipios oficiales.
* **Dirección exacta:** Referencias urbanas/rurales y notas de entrega para el transportista.

### B. Cálculo Automático de Envíos en HNL
Controlado por `src/lib/shippingRates.ts`:
* **Zona Atlántida (Sede La Masica):** L 80 HNL (24 horas hábiles).
* **Zona Norte (Cortés, Yoro):** L 110 HNL (24 a 48 horas hábiles).
* **Zona Centro y Sur (Francisco Morazán, Comayagua, etc.):** L 130 HNL (48 horas hábiles).
* **Zona Foránea (Occidente, Olancho, Islas de la Bahía, etc.):** L 150 HNL (48 a 72 horas hábiles).
* **Envío Gratis:** Automático en compras superiores a **L 1,500 HNL**.

### C. Generación del Enlace de WhatsApp
Gestionado por `src/services/paymentService.ts`:
* **Número destinatario:** `50433056175`.
* **Formato del Mensaje:**
  * Número de Orden único (`#KAS-AÑO-XXXX`).
  * Nombre y teléfono del cliente.
  * Municipio y departamento de destino.
  * Lista detallada de pantalones con talla, color/tonalidad, cantidad y precios.
  * Subtotal, descuento aplicado (cupones `KAS10`, `LAMASICA`, etc.), costo de envío y **TOTAL EN HNL**.
  * Transportista asignado y tiempo estimado.

---

## 3. Registro y CRM de Pedidos

* **Persistencia sin SQL:** Cada pedido completado se guarda automáticamente en `localStorage` a través de `src/services/cartStorage.ts`.
* **Panel de Administración (CRM):** En `src/components/AccountModal.tsx`, el administrador puede:
  * Ver el total de pedidos recibidos e ingresos en HNL.
  * Filtrar por estado (`pendiente`, `en_proceso`, `enviado`, `entregado`).
  * Contactar con un solo clic al cliente por WhatsApp.
  * Cambiar el estado de la entrega.
