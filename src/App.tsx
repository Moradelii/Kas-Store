import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CartDrawer } from './components/CartDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AccountModal } from './components/AccountModal';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { PoliciesPage, PolicyTab } from './pages/PoliciesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminDashboard } from './pages/AdminDashboard';

type ViewType = 'home' | 'catalog' | 'product-detail' | 'cart' | 'checkout' | 'favorites' | 'policies' | 'admin' | 'not-found';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [policiesTab, setPoliciesTab] = useState<PolicyTab>('envios');
  const [selectedProductId, setSelectedProductId] = useState<string>('kas-denim-01');
  const [catalogFilters, setCatalogFilters] = useState<{
    gender?: string;
    category?: string;
    search?: string;
    saleOnly?: boolean;
    newOnly?: boolean;
  }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProductId]);

  const handleNavigate = (view: string, params?: Record<string, string>) => {
    if (params) {
      if (params.tab) {
        setPoliciesTab(params.tab as PolicyTab);
      }
      setCatalogFilters({
        gender: params.gender,
        category: params.category,
        search: params.search,
        saleOnly: params.saleOnly === 'true',
        newOnly: params.isNewOnly === 'true',
      });
      if (params.search) {
        setSearchQuery(params.search);
      }
    } else {
      setCatalogFilters({});
    }

    const validViews: ViewType[] = ['home', 'catalog', 'product-detail', 'cart', 'checkout', 'favorites', 'policies', 'admin', 'not-found'];
    if (validViews.includes(view as ViewType)) {
      setCurrentView(view as ViewType);
    } else {
      setCurrentView('not-found');
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2E2721] font-sans">
      {/* Header with Top Announcement Bar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          />
        )}

        {currentView === 'catalog' && (
          <CatalogPage
            onSelectProduct={handleSelectProduct}
            initialGender={catalogFilters.gender}
            initialCategory={catalogFilters.category}
            initialSearch={catalogFilters.search || searchQuery}
            initialSaleOnly={catalogFilters.saleOnly}
            initialNewOnly={catalogFilters.newOnly}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailPage
            productId={selectedProductId}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'favorites' && (
          <FavoritesPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'policies' && (
          <PoliciesPage
            initialTab={policiesTab}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'not-found' && (
          <NotFoundPage
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Cart Drawer Slide-out */}
      <CartDrawer onNavigate={handleNavigate} />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Account & Orders Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onNavigateToCatalog={() => handleNavigate('catalog')}
        onOpenAdminDashboard={() => {
          setIsAccountModalOpen(false);
          handleNavigate('admin');
        }}
      />

      {/* Floating WhatsApp Action */}
      <WhatsAppButton />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenCMS={() => handleNavigate('admin')}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <AppContent />
      </WishlistProvider>
    </CartProvider>
  );
}
