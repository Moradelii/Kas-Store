import { INITIAL_PRODUCTS, INITIAL_CONTENT } from '../../src/data/initialData.ts';
import { Product, StoreContent, OrderRecord } from '../../src/types/index.ts';

interface KVNamespace {
  get(key: string, type?: 'text' | 'json' | 'arrayBuffer' | 'stream'): Promise<any>;
  getWithMetadata(
    key: string,
    type?: 'text' | 'json' | 'arrayBuffer' | 'stream'
  ): Promise<{ value: any; metadata: Record<string, any> | null }>;
  put(
    key: string,
    value: string | ArrayBuffer | ArrayBufferView,
    options?: { expirationTtl?: number; metadata?: Record<string, any> }
  ): Promise<void>;
  delete(key: string): Promise<void>;
}

interface Env {
  KAS_STORE_KV?: KVNamespace;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_PASSWORD_SALT?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
}

interface StoreDatabase {
  products: Product[];
  content: StoreContent;
  admin: {
    username: string;
    passwordHash: string;
    salt: string;
    customizedViaCms?: boolean;
  };
  orders: OrderRecord[];
  sessions: { [token: string]: { username: string; expiresAt: number } };
}

const STORE_KV_KEY = 'kas_store_db_v1';

function jsonResponse(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders
    }
  });
}

function randomHex(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const generatedSalt = salt || randomHex(16);
  const hash = await sha256Hex(password + generatedSalt);
  return { hash, salt: generatedSalt };
}

async function verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
  if (!storedHash || !salt) return false;
  const computed = await sha256Hex(password + salt);
  return computed === storedHash;
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function normalizeCategories(content: StoreContent): StoreContent {
  if (!content.categories) {
    return { ...content, categories: INITIAL_CONTENT.categories };
  }
  return {
    ...content,
    categories: {
      ...INITIAL_CONTENT.categories,
      ...content.categories,
      jeansHombre: content.categories.jeansHombre || INITIAL_CONTENT.categories.jeansHombre,
      jeansMujer: content.categories.jeansMujer || INITIAL_CONTENT.categories.jeansMujer,
      camisetasHombre: content.categories.camisetasHombre || INITIAL_CONTENT.categories.camisetasHombre,
      camisetasMujer: content.categories.camisetasMujer || INITIAL_CONTENT.categories.camisetasMujer
    }
  };
}

function createSeedDatabase(adminUsername: string, hash: string, salt: string): StoreDatabase {
  return {
    products: INITIAL_PRODUCTS,
    content: INITIAL_CONTENT,
    admin: {
      username: adminUsername,
      passwordHash: hash,
      salt,
      customizedViaCms: false
    },
    orders: [
      {
        id: 'ORD-1001',
        createdAt: new Date().toISOString(),
        customerName: 'Carlos M. Mejia',
        phone: '+504 9876-5432',
        address: 'Barrio El Carmen, La Ceiba, Atlántida',
        notes: 'Entregar preferiblemente por la tarde. Confirmar por WhatsApp.',
        items: [
          {
            productId: 'kas-jean-h01',
            name: "Levi's 511 Slim Fit Raw Denim",
            size: '32',
            color: 'Azul Índigo o Raw Denim',
            quantity: 1,
            price: 1350
          }
        ],
        total: 1350,
        status: 'completado'
      }
    ],
    sessions: {}
  };
}

async function getStore(env: Env): Promise<{ store: StoreDatabase; hasKv: boolean }> {
  if (!env.KAS_STORE_KV) {
    return {
      store: createSeedDatabase(env.ADMIN_USERNAME || 'admin', '', ''),
      hasKv: false
    };
  }

  const existing = (await env.KAS_STORE_KV.get(STORE_KV_KEY, 'json')) as StoreDatabase | null;
  if (existing && Array.isArray(existing.products) && existing.content) {
    existing.content = normalizeCategories(existing.content);
    if (!existing.sessions) existing.sessions = {};
    if (!existing.orders) existing.orders = [];
    return { store: existing, hasKv: true };
  }

  const adminUsername = env.ADMIN_USERNAME || 'admin';
  let hash = env.ADMIN_PASSWORD_HASH || '';
  let salt = env.ADMIN_PASSWORD_SALT || '';
  if ((!hash || !salt) && env.ADMIN_PASSWORD) {
    const generated = await hashPassword(env.ADMIN_PASSWORD);
    hash = generated.hash;
    salt = generated.salt;
  }

  const seeded = createSeedDatabase(adminUsername, hash, salt);
  if (hash && salt) {
    await env.KAS_STORE_KV.put(STORE_KV_KEY, JSON.stringify(seeded));
  }
  return { store: seeded, hasKv: true };
}

async function saveStore(env: Env, store: StoreDatabase): Promise<void> {
  if (!env.KAS_STORE_KV) {
    throw new Error('KV_NOT_BOUND');
  }
  // Prune expired sessions before persisting
  const now = Date.now();
  for (const [token, session] of Object.entries(store.sessions || {})) {
    if (!session || now > session.expiresAt) {
      delete store.sessions[token];
    }
  }
  await env.KAS_STORE_KV.put(STORE_KV_KEY, JSON.stringify(store));
}

async function requireAdmin(
  request: Request,
  env: Env
): Promise<{ authorized: true; store: StoreDatabase; token: string } | { authorized: false; response: Response }> {
  if (!env.KAS_STORE_KV) {
    return {
      authorized: false,
      response: jsonResponse(
        {
          error:
            'Falta vincular Cloudflare KV (KAS_STORE_KV) en Pages → Settings → Functions → KV namespace bindings.'
        },
        503
      )
    };
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authorized: false,
      response: jsonResponse({ error: 'No autorizado. Se requiere token administrativo.' }, 401)
    };
  }

  const token = authHeader.slice(7).trim();
  const { store } = await getStore(env);
  const session = store.sessions?.[token];

  if (!session || Date.now() > session.expiresAt) {
    if (session) {
      delete store.sessions[token];
      await saveStore(env, store);
    }
    return {
      authorized: false,
      response: jsonResponse({ error: 'Sesión expirada o inválida. Inicie sesión nuevamente.' }, 401)
    };
  }

  return { authorized: true, store, token };
}

async function parseJsonBody(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method.toUpperCase();

  // ==========================================
  // SERVE UPLOADED IMAGES FROM KV
  // ==========================================
  if (method === 'GET' && pathname.startsWith('/api/uploads/')) {
    if (!env.KAS_STORE_KV) {
      return new Response('Storage KV no configurado', { status: 404 });
    }
    const filename = decodeURIComponent(pathname.replace('/api/uploads/', ''));
    const result = await env.KAS_STORE_KV.getWithMetadata(`upload:${filename}`, 'arrayBuffer');
    if (!result || !result.value) {
      return new Response('Imagen no encontrada', { status: 404 });
    }
    return new Response(result.value, {
      status: 200,
      headers: {
        'Content-Type': (result.metadata?.contentType as string) || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  }

  // ==========================================
  // PUBLIC API ENDPOINTS
  // ==========================================
  if (method === 'GET' && pathname === '/api/products') {
    const { store } = await getStore(env);
    const showAll = url.searchParams.get('all') === 'true';
    const products = showAll ? store.products : store.products.filter((p) => p.active);
    return jsonResponse(products);
  }

  if (method === 'GET' && pathname.startsWith('/api/products/')) {
    const id = decodeURIComponent(pathname.replace('/api/products/', ''));
    const { store } = await getStore(env);
    const product = store.products.find((p) => p.id === id);
    if (!product) {
      return jsonResponse({ error: 'Producto no encontrado' }, 404);
    }
    return jsonResponse(product);
  }

  if (method === 'GET' && pathname === '/api/content') {
    const { store } = await getStore(env);
    return jsonResponse(store.content);
  }

  if (method === 'POST' && pathname === '/api/orders') {
    const body = await parseJsonBody(request);
    if (
      !body ||
      !body.customerName ||
      !body.phone ||
      !body.address ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return jsonResponse({ error: 'Datos de pedido incompletos' }, 400);
    }

    const { store, hasKv } = await getStore(env);
    const newOrder: OrderRecord = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      notes: body.notes || '',
      items: body.items.map((it: any) => ({
        productId: it.productId,
        name: it.name,
        size: it.size,
        color: it.color,
        quantity: it.quantity,
        price: it.price
      })),
      total: Number(body.total),
      status: 'nuevo'
    };

    if (hasKv) {
      body.items.forEach((orderedItem: any) => {
        const prod = store.products.find((p) => p.id === orderedItem.productId);
        if (prod && prod.variants) {
          const variant = prod.variants.find((v) => v.size === orderedItem.size);
          if (variant && variant.stock > 0) {
            variant.stock = Math.max(0, variant.stock - (orderedItem.quantity || 1));
          }
          prod.totalStock = prod.variants.reduce((sum, v) => sum + v.stock, 0);
        }
      });
      store.orders.unshift(newOrder);
      await saveStore(env, store);
    }

    return jsonResponse({ success: true, orderId: newOrder.id }, 201);
  }

  // ==========================================
  // ADMIN AUTH & CMS ENDPOINTS
  // ==========================================
  if (method === 'POST' && pathname === '/api/admin/login') {
    if (!env.KAS_STORE_KV) {
      return jsonResponse(
        {
          error:
            'Falta vincular Cloudflare KV (KAS_STORE_KV) en Cloudflare Pages → Settings → Functions → KV namespace bindings.'
        },
        503
      );
    }

    const body = await parseJsonBody(request);
    const username = body?.username?.trim();
    const password = body?.password;
    if (!username || !password) {
      return jsonResponse({ error: 'Usuario y contraseña requeridos' }, 400);
    }

    const { store } = await getStore(env);
    const envUsername = env.ADMIN_USERNAME || 'admin';
    const envPassword = env.ADMIN_PASSWORD;

    // Ensure admin bootstrap if env vars were added after KV creation or password wasn't overridden in CMS
    if ((!store.admin.passwordHash || !store.admin.salt) && !envPassword && !env.ADMIN_PASSWORD_HASH) {
      return jsonResponse(
        {
          error:
            'Configura ADMIN_USERNAME y ADMIN_PASSWORD en Cloudflare Pages → Settings → Environment variables.'
        },
        500
      );
    }

    let authenticated = false;

    if (username === store.admin.username && store.admin.passwordHash && store.admin.salt) {
      authenticated = await verifyPassword(password, store.admin.passwordHash, store.admin.salt);
    }

    // Allow environment variable credentials if CMS hasn't overridden password yet
    if (!authenticated && !store.admin.customizedViaCms && envPassword && username === envUsername && password === envPassword) {
      const generated = await hashPassword(envPassword);
      store.admin = {
        username: envUsername,
        passwordHash: generated.hash,
        salt: generated.salt,
        customizedViaCms: false
      };
      authenticated = true;
    }

    if (!authenticated) {
      return jsonResponse({ error: 'Credenciales inválidas' }, 401);
    }

    const token = randomHex(32);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    store.sessions[token] = { username, expiresAt };
    await saveStore(env, store);

    return jsonResponse({
      success: true,
      token,
      expiresAt,
      username
    });
  }

  if (method === 'GET' && pathname === '/api/admin/verify') {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    return jsonResponse({ valid: true });
  }

  if (method === 'POST' && pathname === '/api/admin/logout') {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    delete auth.store.sessions[auth.token];
    await saveStore(env, auth.store);
    return jsonResponse({ success: true });
  }

  if (method === 'GET' && pathname === '/api/admin/dashboard') {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    const { store } = auth;
    const totalProducts = store.products.length;
    const availableProducts = store.products.filter((p) => p.active && p.totalStock > 0).length;
    const outOfStockProducts = store.products.filter((p) => p.totalStock === 0).length;
    const featuredProducts = store.products.filter((p) => p.featured).length;
    const totalOrders = store.orders.length;
    const totalEstimatedSales = store.orders.reduce((sum, ord) => sum + (ord.total || 0), 0);

    return jsonResponse({
      metrics: {
        totalProducts,
        availableProducts,
        outOfStockProducts,
        featuredProducts,
        totalOrders,
        totalEstimatedSales
      },
      recentOrders: store.orders.slice(0, 8),
      products: store.products
    });
  }

  if (method === 'GET' && pathname === '/api/admin/orders') {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    return jsonResponse(auth.store.orders);
  }

  if (method === 'PUT' && pathname.startsWith('/api/admin/orders/')) {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    const orderId = decodeURIComponent(pathname.replace('/api/admin/orders/', ''));
    const body = await parseJsonBody(request);
    const order = auth.store.orders.find((o) => o.id === orderId);
    if (!order) {
      return jsonResponse({ error: 'Pedido no encontrado' }, 404);
    }
    order.status = body?.status || order.status;
    await saveStore(env, auth.store);
    return jsonResponse({ success: true, order });
  }

  if (method === 'POST' && pathname === '/api/admin/products') {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    const productData = await parseJsonBody(request);
    if (!productData?.name || !productData?.price || !productData?.category) {
      return jsonResponse({ error: 'Nombre, precio y categoría son requeridos' }, 400);
    }

    const id =
      productData.id ||
      `kas-${productData.category === 'jeans' ? 'jean' : 'tee'}-${Date.now().toString().slice(-4)}`;
    const variants = productData.variants || [];
    const totalStock = variants.reduce((sum: number, v: any) => sum + (Number(v.stock) || 0), 0);

    const newProduct: Product = {
      id,
      name: productData.name,
      category: productData.category,
      gender: productData.gender || 'hombre',
      brand: productData.brand || 'KAS',
      fitStyle: productData.fitStyle || undefined,
      description: productData.description || '',
      details: Array.isArray(productData.details) ? productData.details : [],
      price: Number(productData.price),
      compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : null,
      images:
        Array.isArray(productData.images) && productData.images.length > 0
          ? productData.images
          : ['/assets/images/kas_category_jeans_1793516509180.jpg'],
      colors:
        Array.isArray(productData.colors) && productData.colors.length > 0
          ? productData.colors
          : [{ name: 'Clásico', hex: '#111111' }],
      tag: productData.tag || null,
      featured: Boolean(productData.featured),
      active: productData.active !== undefined ? Boolean(productData.active) : true,
      variants,
      totalStock,
      createdAt: new Date().toISOString()
    };

    auth.store.products.unshift(newProduct);
    await saveStore(env, auth.store);
    return jsonResponse(newProduct, 201);
  }

  if (method === 'PUT' && pathname.startsWith('/api/admin/products/')) {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    const id = decodeURIComponent(pathname.replace('/api/admin/products/', ''));
    const index = auth.store.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return jsonResponse({ error: 'Producto no encontrado' }, 404);
    }

    const existing = auth.store.products[index];
    const updatedData = (await parseJsonBody(request)) || {};
    const variants = updatedData.variants || existing.variants || [];
    const totalStock = variants.reduce((sum: number, v: any) => sum + (Number(v.stock) || 0), 0);

    const updatedProduct: Product = {
      ...existing,
      ...updatedData,
      gender: updatedData.gender || existing.gender || 'hombre',
      brand: updatedData.brand || existing.brand || 'KAS',
      fitStyle: updatedData.fitStyle !== undefined ? updatedData.fitStyle : existing.fitStyle,
      price: Number(updatedData.price ?? existing.price),
      compareAtPrice: updatedData.compareAtPrice ? Number(updatedData.compareAtPrice) : null,
      variants,
      totalStock
    };

    auth.store.products[index] = updatedProduct;
    await saveStore(env, auth.store);
    return jsonResponse(updatedProduct);
  }

  if (method === 'DELETE' && pathname.startsWith('/api/admin/products/')) {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    const id = decodeURIComponent(pathname.replace('/api/admin/products/', ''));
    const initialLength = auth.store.products.length;
    auth.store.products = auth.store.products.filter((p) => p.id !== id);
    if (auth.store.products.length === initialLength) {
      return jsonResponse({ error: 'Producto no encontrado' }, 404);
    }
    await saveStore(env, auth.store);
    return jsonResponse({ success: true, message: 'Producto eliminado correctamente' });
  }

  if (method === 'PUT' && pathname === '/api/admin/content') {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    const body = (await parseJsonBody(request)) || {};
    auth.store.content = normalizeCategories({
      ...auth.store.content,
      ...body
    });
    await saveStore(env, auth.store);
    return jsonResponse({ success: true, content: auth.store.content });
  }

  if (method === 'PUT' && pathname === '/api/admin/settings') {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    const body = (await parseJsonBody(request)) || {};
    const { storeInfo, currentPassword, newPassword } = body;

    if (storeInfo) {
      auth.store.content.storeInfo = {
        ...auth.store.content.storeInfo,
        ...storeInfo
      };
    }

    if (newPassword) {
      if (!currentPassword) {
        return jsonResponse({ error: 'Debe ingresar la contraseña actual para cambiarla' }, 400);
      }
      const valid = await verifyPassword(currentPassword, auth.store.admin.passwordHash, auth.store.admin.salt);
      if (!valid) {
        return jsonResponse({ error: 'La contraseña actual es incorrecta' }, 400);
      }
      const { hash, salt } = await hashPassword(newPassword);
      auth.store.admin.passwordHash = hash;
      auth.store.admin.salt = salt;
      auth.store.admin.customizedViaCms = true;
    }

    await saveStore(env, auth.store);
    return jsonResponse({ success: true, message: 'Configuración actualizada con éxito' });
  }

  if (method === 'POST' && pathname === '/api/admin/upload') {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    const body = await parseJsonBody(request);
    const data = body?.data;
    const filename = body?.filename;

    if (!data || !filename) {
      return jsonResponse({ error: 'Datos de imagen incompletos' }, 400);
    }

    const matches = String(data).match(/^data:([A-Za-z0-9\-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return jsonResponse({ error: 'Formato base64 inválido' }, 400);
    }

    const contentType = matches[1];
    const bytes = base64ToUint8Array(matches[2]);
    const baseName = filename.split(/[\\/]/).pop() || 'image.jpg';
    const safeFilename = `img_${Date.now()}_${baseName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    await env.KAS_STORE_KV!.put(`upload:${safeFilename}`, bytes, {
      metadata: { contentType }
    });

    return jsonResponse({
      success: true,
      url: `/api/uploads/${safeFilename}`
    });
  }

  if (method === 'GET' && pathname === '/api/admin/backup') {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    const backupData = {
      ...auth.store,
      sessions: {}
    };
    return new Response(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename=kas_store_backup_${Date.now()}.json`
      }
    });
  }

  if (method === 'POST' && pathname === '/api/admin/restore') {
    const auth = await requireAdmin(request, env);
    if (!auth.authorized) return auth.response;
    const backupData = await parseJsonBody(request);
    if (!backupData || !Array.isArray(backupData.products) || !backupData.content) {
      return jsonResponse({ error: 'Estructura de copia de seguridad inválida' }, 400);
    }
    auth.store.products = backupData.products;
    auth.store.content = normalizeCategories(backupData.content);
    if (Array.isArray(backupData.orders)) {
      auth.store.orders = backupData.orders;
    }
    await saveStore(env, auth.store);
    return jsonResponse({ success: true, message: 'Copia de seguridad restaurada correctamente' });
  }

  return jsonResponse({ error: 'Ruta API no encontrada' }, 404);
}
