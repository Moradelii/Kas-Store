import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileEdit,
  Ruler,
  Settings,
  LogOut,
  ExternalLink,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Star
} from 'lucide-react';
import { Product, StoreContent, OrderRecord } from '../../types/index.ts';
import { formatLempiras } from '../../utils/format.ts';
import {
  fetchAdminDashboard,
  saveProduct,
  deleteProduct,
  adminLogout
} from '../../services/api.ts';
import { AdminProducts } from './AdminProducts.tsx';
import { AdminOrders } from './AdminOrders.tsx';
import { AdminContent } from './AdminContent.tsx';
import { AdminSizeGuides } from './AdminSizeGuides.tsx';
import { AdminSettings } from './AdminSettings.tsx';

interface AdminPanelProps {
  onBackToStore: () => void;
  onLogout: () => void;
  storeContent: StoreContent;
  onContentUpdated: (updated: StoreContent) => void;
}

type TabType = 'dashboard' | 'products' | 'orders' | 'content' | 'sizeGuides' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToStore,
  onLogout,
  storeContent,
  onContentUpdated
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminDashboard();
      setDashboardData(data);
    } catch (e) {
      console.error('Error loading admin dashboard', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshIndex]);

  const handleSaveProduct = async (productData: Partial<Product>, isEdit: boolean) => {
    await saveProduct(productData, isEdit);
    setRefreshIndex((prev) => prev + 1);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
    setRefreshIndex((prev) => prev + 1);
  };

  const handleLogout = async () => {
    await adminLogout();
    onLogout();
  };

  const metrics = dashboardData?.metrics || {
    totalProducts: 0,
    availableProducts: 0,
    outOfStockProducts: 0,
    featuredProducts: 0,
    totalOrders: 0,
    totalEstimatedSales: 0
  };

  const products: Product[] = dashboardData?.products || [];
  const orders: OrderRecord[] = dashboardData?.recentOrders || [];

  return (
    <div className="min-h-screen bg-[#F2EBDD]/40 text-[#111111] flex flex-col font-sans selection:bg-[#E6D5B8] selection:text-[#111111]">
      {/* Admin Top Header */}
      <header className="bg-[#111111] text-[#F9F8F5] border-b border-[#2A2A2A] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold tracking-widest text-[#F9F8F5] font-heading">
              KAS STORE
            </span>
            <span className="text-[10px] tracking-widest uppercase bg-[#E6D5B8] text-[#111111] px-2 py-0.5 font-bold">
              CMS INDEPENDIENTE
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#111111] bg-[#E6D5B8] hover:bg-white px-3.5 py-1.5 font-bold uppercase tracking-wider transition-colors shadow-sm"
              title="Abrir la tienda online en una nueva pestaña"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Tienda Online</span>
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#333] border border-[#444] text-xs text-[#F9F8F5] font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto flex space-x-1 sm:space-x-4 border-t border-[#222]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-[#E6D5B8] text-[#E6D5B8]'
                : 'border-transparent text-[#AAA] hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#E6D5B8] text-[#E6D5B8]'
                : 'border-transparent text-[#AAA] hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Productos ({metrics.totalProducts})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#E6D5B8] text-[#E6D5B8]'
                : 'border-transparent text-[#AAA] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pedidos WhatsApp ({metrics.totalOrders})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'content'
                ? 'border-[#E6D5B8] text-[#E6D5B8]'
                : 'border-transparent text-[#AAA] hover:text-white'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Contenido & Banners</span>
          </button>

          <button
            onClick={() => setActiveTab('sizeGuides')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sizeGuides'
                ? 'border-[#E6D5B8] text-[#E6D5B8]'
                : 'border-transparent text-[#AAA] hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Guías de Tallas</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#E6D5B8] text-[#E6D5B8]'
                : 'border-transparent text-[#AAA] hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configuración & Respaldo</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !dashboardData ? (
          <div className="py-20 text-center text-[#777] text-sm font-medium">
            Cargando información administrativa...
          </div>
        ) : (
          <>
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Card 1: Total Products */}
                  <div className="bg-white p-5 border border-[#D4C4A8] shadow-sm">
                    <div className="flex items-center justify-between text-xs text-[#9E8B6E] font-bold uppercase">
                      <span>Total Prendas</span>
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#111111] tabular-nums font-heading">
                      {metrics.totalProducts}
                    </div>
                    <div className="mt-1 text-[11px] text-[#666]">
                      {metrics.availableProducts} en stock · {metrics.outOfStockProducts} agotadas
                    </div>
                  </div>

                  {/* Card 2: Featured */}
                  <div className="bg-white p-5 border border-[#D4C4A8] shadow-sm">
                    <div className="flex items-center justify-between text-xs text-[#9E8B6E] font-bold uppercase">
                      <span>Destacados</span>
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </div>
                    <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#111111] tabular-nums font-heading">
                      {metrics.featuredProducts}
                    </div>
                    <div className="mt-1 text-[11px] text-[#666]">
                      Visibles en portada principal
                    </div>
                  </div>

                  {/* Card 3: Orders */}
                  <div className="bg-white p-5 border border-[#D4C4A8] shadow-sm">
                    <div className="flex items-center justify-between text-xs text-[#9E8B6E] font-bold uppercase">
                      <span>Pedidos WhatsApp</span>
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#111111] tabular-nums font-heading">
                      {metrics.totalOrders}
                    </div>
                    <div className="mt-1 text-[11px] text-[#666]">
                      Solicitudes de compra generadas
                    </div>
                  </div>

                  {/* Card 4: Estimated Volume */}
                  <div className="bg-white p-5 border border-[#D4C4A8] shadow-sm">
                    <div className="flex items-center justify-between text-xs text-[#9E8B6E] font-bold uppercase">
                      <span>Volumen Estimado</span>
                      <DollarSign className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="mt-3 text-xl sm:text-2xl font-extrabold text-emerald-800 tabular-nums font-heading">
                      {formatLempiras(metrics.totalEstimatedSales)}
                    </div>
                    <div className="mt-1 text-[11px] text-[#666]">
                      En Lempiras hondureños (HNL)
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-[#111111] text-[#F9F8F5] p-6 border border-[#333] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#E6D5B8]">
                      Accesos Rápidos de Operación
                    </h3>
                    <p className="text-xs text-[#AAA] font-light mt-0.5">
                      Administra existencias por talla, crea nuevas prendas o consulta los pedidos de WhatsApp.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => setActiveTab('products')}
                      className="px-4 py-2 bg-[#E6D5B8] text-[#111111] hover:bg-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      + Añadir o Editar Prendas
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="px-4 py-2 bg-[#252525] text-white hover:bg-[#333] border border-[#555] text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Ver Pedidos
                    </button>
                    <button
                      onClick={() => setActiveTab('content')}
                      className="px-4 py-2 bg-[#252525] text-white hover:bg-[#333] border border-[#555] text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Editar Portada
                    </button>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D4C4A8]">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
                      Últimos Pedidos Recibidos
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#9E8B6E] hover:underline font-bold"
                    >
                      Ver Todos los Pedidos →
                    </button>
                  </div>

                  <AdminOrders orders={orders} onOrdersUpdated={loadData} />
                </div>
              </div>
            )}

            {/* TAB: PRODUCTS */}
            {activeTab === 'products' && (
              <AdminProducts
                products={products}
                onSaveProduct={handleSaveProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            )}

            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
              <AdminOrders orders={orders} onOrdersUpdated={loadData} />
            )}

            {/* TAB: CONTENT */}
            {activeTab === 'content' && (
              <AdminContent content={storeContent} onContentUpdated={onContentUpdated} />
            )}

            {/* TAB: SIZE GUIDES */}
            {activeTab === 'sizeGuides' && (
              <AdminSizeGuides content={storeContent} onContentUpdated={onContentUpdated} />
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <AdminSettings content={storeContent} onContentUpdated={onContentUpdated} />
            )}
          </>
        )}
      </main>
    </div>
  );
};
