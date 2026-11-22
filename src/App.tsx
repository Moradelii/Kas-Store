import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Product, StoreContent, CartItem, GenderCategory, Brand } from './types/index.ts';
import { INITIAL_PRODUCTS, INITIAL_CONTENT } from './data/initialData.ts';
import { fetchProducts, fetchStoreContent, verifyAdminSession } from './services/api.ts';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { Categories } from './components/Categories.tsx';
import { FeaturedSection } from './components/FeaturedSection.tsx';
import { Catalog } from './components/Catalog.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { SizeGuideModal } from './components/SizeGuideModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { Benefits } from './components/Benefits.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { LegalModal } from './components/LegalModal.tsx';

const AdminPanel = lazy(() =>
  import('./components/admin/AdminPanel.tsx').then((m) => ({ default: m.AdminPanel }))
);
const AdminLogin = lazy(() =>
  import('./components/admin/AdminLogin.tsx').then((m) => ({ default: m.AdminLogin }))
);

const CART_STORAGE_KEY = 'kas_store_cart_v1';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [content, setContent] = useState<StoreContent>(INITIAL_CONTENT);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & Modals state
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Department & Category Filters
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'jeans' | 'camisetas'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | GenderCategory>('all');
  const [selectedBrand, setSelectedBrand] = useState<'all' | Brand>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Routing: Storefront vs Admin CMS
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Error saving cart to localStorage', e);
    }
  }, [cart]);

  // Initial data loading from server API
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        const [prodsData, contentData] = await Promise.all([
          fetchProducts(false),
          fetchStoreContent()
        ]);
        if (prodsData && prodsData.length > 0) setProducts(prodsData);
        if (contentData) setContent(contentData);
      } catch (err) {
        console.warn('Usando datos locales predeterminados:', err);
      }
    };
    loadStoreData();

    // Check if admin session exists
    verifyAdminSession().then((isValid) => setIsAdminAuth(isValid));

    // Handle hash routing
    const handleHashChange = () => {
      const isAdm = window.location.pathname === '/admin' || window.location.hash === '#admin';
      setIsAdminView(isAdm);
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    // Secret Keyboard Shortcut for CMS:
    // 1. Ctrl + Shift + K (K de KAS Store - sin conflicto con Recortes de Windows)
    // 2. Ctrl + Alt + A o Ctrl + Alt + K
    // 3. Ctrl + Shift + A (original) / Cmd + Shift + A (Mac)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isA = e.key === 'a' || e.key === 'A' || e.code === 'KeyA';
      const isK = e.key === 'k' || e.key === 'K' || e.code === 'KeyK';

      const matchCtrlShiftA = (e.ctrlKey || e.metaKey) && e.shiftKey && isA;
      const matchCtrlShiftK = (e.ctrlKey || e.metaKey) && e.shiftKey && isK;
      const matchCtrlAltA = (e.ctrlKey || e.metaKey) && e.altKey && isA;
      const matchCtrlAltK = (e.ctrlKey || e.metaKey) && e.altKey && isK;
      const matchAltShiftA = e.altKey && e.shiftKey && isA;
      const matchAltShiftK = e.altKey && e.shiftKey && isK;

      if (matchCtrlShiftA || matchCtrlShiftK || matchCtrlAltA || matchCtrlAltK || matchAltShiftA || matchAltShiftK) {
        e.preventDefault();
        e.stopPropagation();
        setIsAdminView((prev) => {
          const next = !prev;
          window.location.hash = next ? '#admin' : '';
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  // Filter application dispatcher
  const handleApplyFilter = (filter: {
    category?: 'all' | 'jeans' | 'camisetas';
    gender?: 'all' | GenderCategory;
    brand?: 'all' | Brand;
  }) => {
    if (filter.category !== undefined) setSelectedCategory(filter.category);
    if (filter.gender !== undefined) setSelectedGender(filter.gender);
    if (filter.brand !== undefined) setSelectedBrand(filter.brand);
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: string, quantity: number) => {
    const variant = product.variants.find((v) => v.size === size);
    const maxStock = variant ? variant.stock : 0;
    if (maxStock <= 0) return;

    setCart((prev) => {
      const itemKey = `${product.id}-${size}-${color}`;
      const existingIndex = prev.findIndex((item) => item.id === itemKey);

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = Math.min(maxStock, currentQty + quantity);
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemKey,
          productId: product.id,
          name: product.name,
          category: product.category,
          gender: product.gender,
          brand: product.brand,
          price: product.price,
          size,
          color,
          quantity: Math.min(maxStock, quantity),
          image: product.images[0] || '/assets/images/kas_category_jeans_1793516509180.jpg',
          maxStock
        };
        return [...prev, newItem];
      }
    });

    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: Math.min(item.maxStock, newQty)
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOrderSuccess = () => {
    setCart([]);
    fetchProducts(false).then((prods) => {
      if (prods && prods.length > 0) setProducts(prods);
    });
  };

  const totalCartUnits = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Switch to admin view
  const handleOpenAdmin = () => {
    window.location.hash = '#admin';
    setIsAdminView(true);
  };

  const handleBackToStore = () => {
    window.location.hash = '';
    setIsAdminView(false);
  };

  // If Admin view is active
  if (isAdminView) {
    return (
      <div className="min-h-screen bg-[#111111] text-[#F9F8F5]">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-widest text-[#E6D5B8]">
              Cargando Panel CMS...
            </div>
          }
        >
          {!isAdminAuth ? (
            <AdminLogin
              onLoginSuccess={() => setIsAdminAuth(true)}
              onBackToStore={handleBackToStore}
            />
          ) : (
            <AdminPanel
              onBackToStore={handleBackToStore}
              onLogout={() => setIsAdminAuth(false)}
              storeContent={content}
              onContentUpdated={(newContent) => setContent(newContent)}
            />
          )}
        </Suspense>
      </div>
    );
  }

  // Storefront view
  return (
    <div className="min-h-screen bg-[#F9F8F5] text-[#111111] flex flex-col font-sans selection:bg-[#E6D5B8] selection:text-[#111111]">
      {/* 1. Header Navigation */}
      <Header
        content={content}
        cartCount={totalCartUnits}
        onOpenCart={() => setCartOpen(true)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        onApplyFilter={handleApplyFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Hero Section */}
      <Hero
        content={content}
        onExploreCollection={() => {
          const el = document.getElementById('catalogo');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onViewProducts={() => {
          const el = document.getElementById('destacados');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Categories (Hombre / Mujer, Jeans / Camisetas, Marcas Pepe, Levi's, Tommy) */}
      <Categories
        content={content}
        onApplyFilter={handleApplyFilter}
      />

      {/* 4. Featured Section (Selección Premium) */}
      <FeaturedSection
        products={products}
        content={content}
        onQuickView={(p) => setQuickViewProduct(p)}
        onAddToCartDirect={(p, size) => handleAddToCart(p, size, p.colors[0]?.name || 'Clásico', 1)}
        onGoToCatalog={() => {
          setSelectedCategory('all');
          setSelectedGender('all');
          setSelectedBrand('all');
          const el = document.getElementById('catalogo');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 5. Complete Catalog */}
      <Catalog
        products={products}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedGender={selectedGender}
        onSelectGender={setSelectedGender}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickView={(p) => setQuickViewProduct(p)}
        onAddToCartDirect={(p, size) => handleAddToCart(p, size, p.colors[0]?.name || 'Clásico', 1)}
      />

      {/* 6. Benefits */}
      <Benefits content={content} />

      {/* 7. Footer (sin enlaces visibles al admin, con trigger secreto por triple clic) */}
      <Footer
        content={content}
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* 8. Permanent Floating WhatsApp Button */}
      <FloatingWhatsApp whatsappNumber={content.storeInfo.whatsapp} />

      {/* Modals & Drawers */}
      {/* Product Detail Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onOpenSizeGuide={() => {
            setQuickViewProduct(null);
            setSizeGuideOpen(true);
          }}
          whatsappNumber={content.storeInfo.whatsapp}
        />
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <SizeGuideModal
          content={content}
          onClose={() => setSizeGuideOpen(false)}
          defaultTab={selectedCategory === 'camisetas' ? 'camisetas' : 'jeans'}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        onContinueShopping={() => setCartOpen(false)}
      />

      {/* WhatsApp Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        whatsappNumber={content.storeInfo.whatsapp}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Legal Information Modal */}
      <LegalModal
        type={legalModalType}
        content={content}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
