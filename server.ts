import express, { type Request, type Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { MOCK_PRODUCTS } from './src/data/mockProducts.ts';

dotenv.config();

const app = express();

// Ensure public directories exist
const uploadsDir = path.resolve('public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = process.env.NGINX_PORT || process.env.NODE_ENV !== 'production'
  ? 3000
  : (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

app.use(express.json({ limit: '10mb' }));

// Static asset folders
app.use('/uploads', express.static(uploadsDir));
app.use('/images', express.static(path.resolve('public/images')));
app.use(express.static(path.resolve('public')));

// SEO endpoints
app.get('/robots.txt', (_req: Request, res: Response) => {
  res.sendFile(path.resolve('public/robots.txt'));
});

app.get('/sitemap.xml', (_req: Request, res: Response) => {
  res.sendFile(path.resolve('public/sitemap.xml'));
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    architecture: 'jamstack-cloudflare-pages',
    store: 'KAS Store',
    location: 'La Masica, Atlántida, Honduras',
    checkout: 'WhatsApp (+504 3305-6175)',
    timestamp: new Date().toISOString(),
  });
});

// Fallback products endpoint for API consumers
app.get('/api/products', (_req: Request, res: Response) => {
  res.json(MOCK_PRODUCTS);
});

// Start Express server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ KAS Store JAMstack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server error:', err);
});
