import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS, INITIAL_CONTENT } from './src/data/initialData.ts';
import { Product, StoreContent, OrderRecord } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Ensure data directory exists
const DATA_DIR = path.resolve(__dirname, 'data');
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const UPLOADS_DIR = path.resolve(__dirname, 'public/uploads');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Password helper using SHA-256 with Salt
function hashPassword(password: string, salt?: string) {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(password + generatedSalt).digest('hex');
  return { hash, salt: generatedSalt };
}

function verifyPassword(password: string, storedHash: string, salt: string) {
  // 1. Verify salted SHA-256
  const sha256Salted = crypto.createHash('sha256').update(password + salt).digest('hex');
  if (sha256Salted === storedHash) return true;

  // 2. Fallback compatibility with previous PBKDF2 hashes
  try {
    const pbkdf2 = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    if (pbkdf2 === storedHash) return true;
  } catch (e) {}

  return false;
}

interface StoreDatabase {
  products: Product[];
  content: StoreContent;
  admin: {
    username: string;
    passwordHash: string;
    salt: string;
  };
  orders: OrderRecord[];
  sessions: { [token: string]: { username: string; expiresAt: number } };
}

// Initial DB setup if not present
function getStore(): StoreDatabase {
  if (fs.existsSync(STORE_FILE)) {
    try {
      const data: StoreDatabase = JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8'));
      // Ensure all 4 main category banners exist in loaded content
      if (data.content) {
        if (!data.content.categories) {
          data.content.categories = INITIAL_CONTENT.categories;
        } else {
          data.content.categories = {
            ...INITIAL_CONTENT.categories,
            ...data.content.categories,
            jeansHombre: data.content.categories.jeansHombre || INITIAL_CONTENT.categories.jeansHombre,
            jeansMujer: data.content.categories.jeansMujer || INITIAL_CONTENT.categories.jeansMujer,
            camisetasHombre: data.content.categories.camisetasHombre || INITIAL_CONTENT.categories.camisetasHombre,
            camisetasMujer: data.content.categories.camisetasMujer || INITIAL_CONTENT.categories.camisetasMujer,
          };
        }
      }
      return data;
    } catch (e) {
      console.error('Error reading store.json, reinitializing', e);
    }
  }

  // Bootstrap admin credentials strictly from environment variables or secure random generation
  const initialUsername = process.env.ADMIN_USERNAME || 'admin';
  const envPassword = process.env.ADMIN_PASSWORD;
  let hash = process.env.ADMIN_PASSWORD_HASH || '';
  let salt = process.env.ADMIN_PASSWORD_SALT || '';

  if (!hash || !salt) {
    const bootstrapPassword = envPassword || crypto.randomBytes(12).toString('base64url');
    const generated = hashPassword(bootstrapPassword);
    hash = generated.hash;
    salt = generated.salt;
    if (!envPassword) {
      console.log(`[KAS Store] DB inicializada. Define ADMIN_USERNAME y ADMIN_PASSWORD en .env. Usuario: ${initialUsername} | Clave temporal generada: ${bootstrapPassword}`);
    }
  }

  const initialStore: StoreDatabase = {
    products: INITIAL_PRODUCTS,
    content: INITIAL_CONTENT,
    admin: {
      username: initialUsername,
      passwordHash: hash,
      salt: salt
    },
    orders: [
      {
        id: 'ORD-1001',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        customerName: 'Carlos M. Mejia',
        phone: '+504 9876-5432',
        address: 'Barrio El Carmen, La Ceiba, Atlántida',
        notes: 'Entregar preferiblemente por la tarde. Confirmar por WhatsApp.',
        items: [
          {
            productId: 'kas-jean-01',
            name: 'Selvedge Raw Denim Slim Jeans',
            size: '32',
            color: 'Azul Índigo Profundo',
            quantity: 1,
            price: 1250
          },
          {
            productId: 'kas-tee-01',
            name: 'Heavyweight Boxy Crewneck Tee',
            size: 'M',
            color: 'Negro Carbón',
            quantity: 2,
            price: 490
          }
        ],
        total: 2230,
        status: 'completado'
      }
    ],
    sessions: {}
  };

  saveStore(initialStore);
  return initialStore;
}

function saveStore(store: StoreDatabase) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

// Rate limiting for admin login
const loginAttempts: { [ip: string]: { count: number; resetAt: number } } = {};

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts[ip];
  if (!record || now > record.resetAt) {
    loginAttempts[ip] = { count: 1, resetAt: now + 60000 };
    return true;
  }
  if (record.count >= 6) {
    return false;
  }
  record.count += 1;
  return true;
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Static assets serving (public directory and /assets)
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use(express.static(PUBLIC_DIR));
  app.use('/assets', express.static(path.resolve(PUBLIC_DIR, 'assets')));

  // Middleware: Auth check
  function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No autorizado. Se requiere token administrativo.' });
      return;
    }
    const token = authHeader.split(' ')[1];
    const store = getStore();
    const session = store.sessions[token];

    if (!session || Date.now() > session.expiresAt) {
      if (session) {
        delete store.sessions[token];
        saveStore(store);
      }
      res.status(401).json({ error: 'Sesión expirada o inválida. Inicie sesión nuevamente.' });
      return;
    }

    next();
  }

  // ==========================================
  // PUBLIC API ENDPOINTS
  // ==========================================

  // Get active products for the storefront
  app.get('/api/products', (req: Request, res: Response) => {
    try {
      const store = getStore();
      const showAll = req.query.all === 'true';
      const products = showAll ? store.products : store.products.filter(p => p.active);
      res.json(products);
    } catch (e: any) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  });

  // Get single product
  app.get('/api/products/:id', (req: Request, res: Response) => {
    try {
      const store = getStore();
      const product = store.products.find(p => p.id === req.params.id);
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
      res.json(product);
    } catch (e: any) {
      res.status(500).json({ error: 'Error al consultar producto' });
    }
  });

  // Get store content (hero, categories, size guides, contact info)
  app.get('/api/content', (req: Request, res: Response) => {
    try {
      const store = getStore();
      res.json(store.content);
    } catch (e: any) {
      res.status(500).json({ error: 'Error al obtener contenido' });
    }
  });

  // Log order from WhatsApp checkout
  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const { customerName, phone, address, notes, items, total } = req.body;
      if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Datos de pedido incompletos' });
        return;
      }

      const store = getStore();
      const newOrder: OrderRecord = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        customerName,
        phone,
        address,
        notes: notes || '',
        items: items.map((it: any) => ({
          productId: it.productId,
          name: it.name,
          size: it.size,
          color: it.color,
          quantity: it.quantity,
          price: it.price
        })),
        total: Number(total),
        status: 'nuevo'
      };

      // Also deduct variant inventory automatically
      items.forEach((orderedItem: any) => {
        const prod = store.products.find(p => p.id === orderedItem.productId);
        if (prod && prod.variants) {
          const variant = prod.variants.find(v => v.size === orderedItem.size);
          if (variant && variant.stock > 0) {
            variant.stock = Math.max(0, variant.stock - (orderedItem.quantity || 1));
          }
          prod.totalStock = prod.variants.reduce((sum, v) => sum + v.stock, 0);
        }
      });

      store.orders.unshift(newOrder);
      saveStore(store);

      res.status(201).json({ success: true, orderId: newOrder.id });
    } catch (e: any) {
      res.status(500).json({ error: 'Error al registrar pedido' });
    }
  });

  // ==========================================
  // ADMIN AUTH & CMS ENDPOINTS
  // ==========================================

  // Admin login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const ip = req.ip || 'anonymous';
    if (!checkRateLimit(ip)) {
      res.status(429).json({ error: 'Demasiados intentos fallidos. Intente de nuevo en un minuto.' });
      return;
    }

    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Usuario y contraseña requeridos' });
      return;
    }

    const store = getStore();
    if (username !== store.admin.username) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const isValid = verifyPassword(password, store.admin.passwordHash, store.admin.salt);
    if (!isValid) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Generate secure session token (valid 24h)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    store.sessions[token] = {
      username,
      expiresAt
    };
    saveStore(store);

    res.json({
      success: true,
      token,
      expiresAt,
      username: store.admin.username
    });
  });

  // Verify session
  app.get('/api/admin/verify', requireAdmin, (req: Request, res: Response) => {
    res.json({ valid: true });
  });

  // Logout
  app.post('/api/admin/logout', requireAdmin, (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const store = getStore();
      delete store.sessions[token];
      saveStore(store);
    }
    res.json({ success: true });
  });

  // Admin dashboard metrics
  app.get('/api/admin/dashboard', requireAdmin, (req: Request, res: Response) => {
    const store = getStore();
    const totalProducts = store.products.length;
    const availableProducts = store.products.filter(p => p.active && p.totalStock > 0).length;
    const outOfStockProducts = store.products.filter(p => p.totalStock === 0).length;
    const featuredProducts = store.products.filter(p => p.featured).length;
    const totalOrders = store.orders.length;
    const totalEstimatedSales = store.orders.reduce((sum, ord) => sum + (ord.total || 0), 0);

    res.json({
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
  });

  // Orders list
  app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
    const store = getStore();
    res.json(store.orders);
  });

  // Update order status
  app.put('/api/admin/orders/:id', requireAdmin, (req: Request, res: Response) => {
    const { status } = req.body;
    const store = getStore();
    const order = store.orders.find(o => o.id === req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }
    order.status = status;
    saveStore(store);
    res.json({ success: true, order });
  });

  // Create product
  app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
    try {
      const productData = req.body;
      if (!productData.name || !productData.price || !productData.category) {
        res.status(400).json({ error: 'Nombre, precio y categoría son requeridos' });
        return;
      }

      const store = getStore();
      const id = productData.id || `kas-${productData.category === 'jeans' ? 'jean' : 'tee'}-${Date.now().toString().slice(-4)}`;
      
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
        images: Array.isArray(productData.images) && productData.images.length > 0
          ? productData.images
          : ['/assets/images/kas_category_jeans_1793516509180.jpg'],
        colors: Array.isArray(productData.colors) && productData.colors.length > 0
          ? productData.colors
          : [{ name: 'Clásico', hex: '#111111' }],
        tag: productData.tag || null,
        featured: Boolean(productData.featured),
        active: productData.active !== undefined ? Boolean(productData.active) : true,
        variants,
        totalStock,
        createdAt: new Date().toISOString()
      };

      store.products.unshift(newProduct);
      saveStore(store);
      res.status(201).json(newProduct);
    } catch (e: any) {
      res.status(500).json({ error: 'Error al crear producto' });
    }
  });

  // Update product
  app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const store = getStore();
      const index = store.products.findIndex(p => p.id === req.params.id);
      if (index === -1) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }

      const existing = store.products[index];
      const updatedData = req.body;

      const variants = updatedData.variants || existing.variants || [];
      const totalStock = variants.reduce((sum: number, v: any) => sum + (Number(v.stock) || 0), 0);

      const updatedProduct: Product = {
        ...existing,
        ...updatedData,
        gender: updatedData.gender || existing.gender || 'hombre',
        brand: updatedData.brand || existing.brand || 'KAS',
        fitStyle: updatedData.fitStyle !== undefined ? updatedData.fitStyle : existing.fitStyle,
        price: Number(updatedData.price),
        compareAtPrice: updatedData.compareAtPrice ? Number(updatedData.compareAtPrice) : null,
        variants,
        totalStock
      };

      store.products[index] = updatedProduct;
      saveStore(store);
      res.json(updatedProduct);
    } catch (e: any) {
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  });

  // Delete product
  app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const store = getStore();
      const initialLength = store.products.length;
      store.products = store.products.filter(p => p.id !== req.params.id);
      if (store.products.length === initialLength) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
      saveStore(store);
      res.json({ success: true, message: 'Producto eliminado correctamente' });
    } catch (e: any) {
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  });

  // Update store content (hero, banners, size guides, legal, etc.)
  app.put('/api/admin/content', requireAdmin, (req: Request, res: Response) => {
    try {
      const store = getStore();
      store.content = {
        ...store.content,
        ...req.body
      };
      saveStore(store);
      res.json({ success: true, content: store.content });
    } catch (e: any) {
      res.status(500).json({ error: 'Error al actualizar contenido' });
    }
  });

  // Update general settings & credentials
  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    try {
      const store = getStore();
      const { storeInfo, currentPassword, newPassword } = req.body;

      if (storeInfo) {
        store.content.storeInfo = {
          ...store.content.storeInfo,
          ...storeInfo
        };
      }

      if (newPassword) {
        if (!currentPassword) {
          res.status(400).json({ error: 'Debe ingresar la contraseña actual para cambiarla' });
          return;
        }
        const isValid = verifyPassword(currentPassword, store.admin.passwordHash, store.admin.salt);
        if (!isValid) {
          res.status(400).json({ error: 'La contraseña actual es incorrecta' });
          return;
        }
        const { hash, salt } = hashPassword(newPassword);
        store.admin.passwordHash = hash;
        store.admin.salt = salt;
      }

      saveStore(store);
      res.json({ success: true, message: 'Configuración actualizada con éxito' });
    } catch (e: any) {
      res.status(500).json({ error: 'Error al actualizar configuración' });
    }
  });

  // Image upload handler (base64 data)
  app.post('/api/admin/upload', requireAdmin, (req: Request, res: Response) => {
    try {
      const { data, filename } = req.body;
      if (!data || !filename) {
        res.status(400).json({ error: 'Datos de imagen incompletos' });
        return;
      }

      const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        res.status(400).json({ error: 'Formato base64 inválido' });
        return;
      }

      const buffer = Buffer.from(matches[2], 'base64');
      const safeFilename = `img_${Date.now()}_${path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(UPLOADS_DIR, safeFilename);

      fs.writeFileSync(filePath, buffer);
      res.json({
        success: true,
        url: `/uploads/${safeFilename}`
      });
    } catch (e: any) {
      res.status(500).json({ error: 'Error al guardar archivo' });
    }
  });

  // Download complete database backup
  app.get('/api/admin/backup', requireAdmin, (req: Request, res: Response) => {
    const store = getStore();
    // Exclude active session tokens from backup for security
    const backupData = {
      ...store,
      sessions: {}
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=kas_store_backup_${Date.now()}.json`);
    res.send(JSON.stringify(backupData, null, 2));
  });

  // Restore database backup
  app.post('/api/admin/restore', requireAdmin, (req: Request, res: Response) => {
    try {
      const backupData = req.body;
      if (!backupData || !Array.isArray(backupData.products) || !backupData.content) {
        res.status(400).json({ error: 'Estructura de copia de seguridad inválida' });
        return;
      }

      const store = getStore();
      store.products = backupData.products;
      store.content = backupData.content;
      if (backupData.orders) store.orders = backupData.orders;
      saveStore(store);

      res.json({ success: true, message: 'Copia de seguridad restaurada correctamente' });
    } catch (e: any) {
      res.status(500).json({ error: 'Error al restaurar respaldo' });
    }
  });

  // ==========================================
  // FRONTEND INTEGRATION (Vite dev or Static dist)
  // ==========================================

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback to guarantee transformed index.html is always returned for SPA routing
    app.use('*', async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      if (
        url.startsWith('/api') ||
        url.startsWith('/uploads') ||
        url.startsWith('/assets') ||
        url.startsWith('/src') ||
        url.startsWith('/@')
      ) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KAS Store] Servidor activo en http://0.0.0.0:${PORT} (${isProd ? 'producción' : 'desarrollo'})`);
  });
}

startServer().catch(err => {
  console.error('Error starting KAS Store server:', err);
  process.exit(1);
});
