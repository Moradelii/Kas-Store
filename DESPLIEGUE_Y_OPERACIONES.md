# KAS STORE — MANUAL DE INFRAESTRUCTURA Y DESPLIEGUE EN CLOUDFLARE PAGES

> **Proyecto:** KAS Store — Tienda de Pantalones de Mezclilla.  
> **Arquitectura:** JAMstack Estático (React 19 + TypeScript + Vite + Tailwind CSS v4).  
> **Plataforma de Producción:** Cloudflare Pages (CDN Global de alta velocidad).  
> **Sede:** La Masica, Atlántida, Honduras.

---

## 1. Resumen de la Nueva Arquitectura

| Módulo | Configuración Anterior (Fase 5) | Nueva Configuración JAMstack (Cloudflare Pages) |
|---|---|---|
| **Alojamiento** | Google Cloud Run (Docker Containers) | **Cloudflare Pages** (Assets Estáticos en Edge CDN) |
| **Persistencia** | PostgreSQL (Cloud SQL) + Drizzle ORM | **mockProducts.ts** + **localStorage** (CRM/CMS) |
| **Checkout** | Tarjetas PixelPay + PayPal | **Botón interactivo de redirección a WhatsApp** |
| **Catálogo de Medios** | Carga dinámica desde base de datos | **Estructura fija en `/public/images/catalogo/`** |
| **Backend en Prod** | Servidor Node/Express persistente | **Cero servidor en prod** (Express sólo para dev local) |
| **Costo Operativo** | Costo mensual de Cloud SQL y Cloud Run | **$0 / mes (Tier gratuito de Cloudflare Pages)** |

---

## 2. Configuración para Despliegue en Cloudflare Pages

### A. Parámetros de Compilación en Cloudflare Dashboard
1. Conectar el repositorio de GitHub en **Cloudflare Pages** > **Create a project**.
2. Configurar los siguientes valores:
   * **Framework Preset:** `Vite`
   * **Build command:** `npm run build` (o `vite build`)
   * **Build output directory:** `dist`
   * **Node.js Version:** `20.x` o superior (se puede definir mediante la variable de entorno `NODE_VERSION=20.18.0`).

### B. Rutas de SPA en Cloudflare Pages
Para permitir que las rutas de React SPA se sirvan correctamente sin errores 404, Vite compila `index.html` en la raíz de `dist/`. En Cloudflare Pages, las SPAs son compatibles por defecto redirigiendo cualquier ruta no encontrada a `index.html`.

---

## 3. Estructura de Medios en `/public/images/`

Toda la galería de pantalones de mezclilla está optimizada y organizada en el directorio público:
```
public/images/
├── logo/
│   └── Logotipo_KAS_Store_9c74b5ef.png
└── catalogo/
    ├── hombres/        # Jeans rectos, slim, cargo, skinny
    ├── mujeres/        # Jeans wide leg, mom fit, flare, tiro alto
    ├── niños/          # Jeans reforzados rodilla y elástico
    └── niñas/          # Jeans corte suave bordado y stretch
```

Al compilar con `npm run build`, Vite copia automáticamente todo el contenido de `public/` hacia `dist/`, haciendo que las imágenes queden servidas directamente en el CDN de Cloudflare bajo:
* `https://tudominio.pages.dev/images/catalogo/hombres/...`
* `https://tudominio.pages.dev/images/catalogo/mujeres/...`
* `https://tudominio.pages.dev/images/catalogo/niños/...`
* `https://tudominio.pages.dev/images/catalogo/niñas/...`
* `https://tudominio.pages.dev/images/logo/Logotipo_KAS_Store_9c74b5ef.png`

---

## 4. Comandos de Operación

### Desarrollo Local (con servidor Express y Vite):
```bash
npm run dev
```
Inicia el entorno de desarrollo local en `http://localhost:3000`.

### Verificación de Tipos (TypeScript):
```bash
npm run lint
```
Ejecuta `tsc --noEmit` para garantizar que no existan errores de tipos.

### Compilación Estática para Cloudflare:
```bash
npm run build
```
Genera la carpeta optimizada `dist/` lista para subirse a Cloudflare Pages.

### Previsualización del Build Local:
```bash
npm run preview
```
Inicia un servidor HTTP ligero para probar el resultado de `dist/`.

---

## 5. Panel de Control CMS-CRM (Sin Base de Datos)
El propietario de KAS Store puede:
1. Acceder al panel presionando el ícono de **Usuario/Cuenta** en el encabezado.
2. Gestionar pedidos recibidos y actualizar su estado a *En Preparación*, *Enviado* o *Entregado*.
3. Agregar nuevas prendas de mezclilla con fotos y precios en Lempiras.
4. Todo se mantiene respaldado en el navegador del administrador sin requerir infraestructura adicional ni mantenimiento de servidores.
