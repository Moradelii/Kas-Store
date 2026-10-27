import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Download,
  Upload,
  Package,
  TrendingUp,
  Boxes,
  Plus,
  Trash2,
  Check,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Save,
  Sliders,
  DollarSign,
  Eye,
} from 'lucide-react';
import { api, AppConfig, StoreConfig } from '../services/api.ts';
import { cartStorage } from '../services/cartStorage.ts';
import { WhatsAppOrder, OrderStatus, Product, Gender, ProductCategory } from '../types.ts';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCatalog?: () => void;
  onOpenAdminDashboard?: () => void;
}

const STATIC_ADMIN_PASSWORD = 'Kas0105';

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onNavigateToCatalog,
  onOpenAdminDashboard,
}) => {
  // Autenticación estática local
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('kas_cms_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Estado del CMS / config.json
  const [activeTab, setActiveTab] = useState<'cms-products' | 'cms-store' | 'crm-orders'>('cms-products');
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [ordersList, setOrdersList] = useState<WhatsAppOrder[]>([]);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [selectedOrderStatusFilter, setSelectedOrderStatusFilter] = useState<string>('todos');

  // Formulario nuevo producto
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    priceHnl: 850,
    category: 'rectos' as ProductCategory,
    categoryLabel: 'Jeans Rectos',
    gender: 'hombre' as Gender,
    fitType: 'Recto Regular',
    denimWash: 'Índigo Profundo Raw',
    imageCategory: 'hombres',
    availableSizes: '28, 30, 32, 34, 36',
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    const cfg = await api.getConfig();
    setConfig(JSON.parse(JSON.stringify(cfg))); // Clon para edición segura
    setOrdersList(cartStorage.loadOrders());
  };

  if (!isOpen) return null;

  // Manejo de inicio de sesión administrativo con contraseña estática
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === STATIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('kas_cms_auth', 'true');
      setAuthError(null);
      setPasswordInput('');
    } else {
      setAuthError('Contraseña incorrecta. Verifica la clave de acceso del CMS.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('kas_cms_auth');
  };

  // Actualizar precio de un producto en memoria
  const handlePriceChange = (productId: string, newPrice: number) => {
    if (!config) return;
    const updatedProducts = config.products.map((p) =>
      p.id === productId ? { ...p, priceHnl: newPrice } : p
    );
    const newConfig = { ...config, products: updatedProducts };
    setConfig(newConfig);
    api.saveConfigLocally(newConfig);
  };

  // Eliminar producto del catálogo
  const handleDeleteProduct = (productId: string) => {
    if (!config) return;
    if (window.confirm('¿Deseas eliminar este producto del catálogo en config.json?')) {
      const updatedProducts = config.products.filter((p) => p.id !== productId);
      const newConfig = { ...config, products: updatedProducts };
      setConfig(newConfig);
      api.saveConfigLocally(newConfig);
      setSaveFeedback('Producto eliminado en la previsualización local.');
      setTimeout(() => setSaveFeedback(null), 3000);
    }
  };

  // Crear nuevo producto y agregarlo a config.json
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config || !newProductForm.name.trim()) return;

    const sizes = newProductForm.availableSizes.split(',').map((s) => s.trim()).filter(Boolean);
    const id = `kas-denim-${Date.now().toString().slice(-4)}`;
    const defaultImg = `/images/catalogo/${newProductForm.imageCategory}/${
      newProductForm.gender === 'hombre'
        ? 'model_men_jeans_1792801034731.jpg'
        : newProductForm.gender === 'mujer'
        ? 'model_women_jeans_1792801034633.jpg'
        : 'model_kids_jeans_1792801035749.jpg'
    }`;

    const newProd: Product = {
      id,
      name: newProductForm.name.trim(),
      shortDescription: newProductForm.shortDescription.trim() || 'Pantalón de mezclilla confeccionado con estándares KAS Store.',
      fullDescription: newProductForm.fullDescription.trim() || newProductForm.name,
      priceHnl: Number(newProductForm.priceHnl),
      category: newProductForm.category,
      categoryLabel: newProductForm.categoryLabel,
      gender: newProductForm.gender,
      fitType: newProductForm.fitType,
      denimWash: newProductForm.denimWash,
      images: [defaultImg],
      availableSizes: sizes.length > 0 ? sizes : ['30', '32', '34'],
      availableColors: [
        { name: newProductForm.denimWash, hex: '#2A3F5F', washTone: newProductForm.denimWash },
      ],
      isNew: true,
      stockStatus: 'in_stock',
      fabricComposition: '100% Algodón Denim Premium',
      careInstructions: 'Lavar al revés con agua fría.',
    };

    const newConfig = {
      ...config,
      products: [newProd, ...config.products],
    };

    setConfig(newConfig);
    api.saveConfigLocally(newConfig);
    setIsCreatingProduct(false);
    setSaveFeedback('¡Producto agregado! Descarga el config.json para guardarlo en el repositorio.');
    setTimeout(() => setSaveFeedback(null), 4000);
    if (onNavigateToCatalog) onNavigateToCatalog();
  };

  // Guardar cambios en configuración de tienda
  const handleStoreConfigChange = (key: keyof StoreConfig, value: any) => {
    if (!config) return;
    const newConfig = {
      ...config,
      store: {
        ...config.store,
        [key]: value,
      },
    };
    setConfig(newConfig);
    api.saveConfigLocally(newConfig);
  };

  // EXPORTAR Y DESCARGAR ARCHIVO public/config.json
  const handleExportConfigJson = () => {
    if (!config) return;
    const jsonString = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSaveFeedback('✓ Archivo config.json descargado con éxito. Súbelo a public/config.json en tu repositorio.');
    setTimeout(() => setSaveFeedback(null), 5000);
  };

  // IMPORTAR ARCHIVO config.json LOCAL
  const handleImportConfigJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.products)) {
          setConfig(parsed);
          api.saveConfigLocally(parsed);
          setSaveFeedback('✓ Archivo config.json importado correctamente en la previsualización.');
          setTimeout(() => setSaveFeedback(null), 4000);
        } else {
          alert('El archivo no tiene el formato válido de config.json con lista de productos.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Cambiar estado de orden en el CRM
  const handleOrderStatusChange = (orderId: string, newStatus: OrderStatus) => {
    cartStorage.updateOrderStatus(orderId, newStatus);
    setOrdersList(cartStorage.loadOrders());
  };

  const filteredOrders = ordersList.filter((o) => {
    if (selectedOrderStatusFilter === 'todos') return true;
    return o.status === selectedOrderStatusFilter;
  });

  const totalRevenue = ordersList.reduce((acc, o) => acc + o.totalHnl, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-[#FFFEFC] border border-[#D9CCB8] w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8DEC9] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#2E2721] rounded-full flex items-center justify-center text-[#E8DEC9]">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg font-bold text-[#2E2721]">
                    Panel CMS Autónomo · KAS Store
                  </h2>
                  <span className="text-[10px] bg-[#B88B4A] text-white font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs">
                    config.json
                  </span>
                </div>
                <p className="text-xs text-[#2E2721]/60">
                  La Masica, Atlántida, Honduras · Gestión sin servidor ni bases de datos externas
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#2E2721]/60 hover:text-[#2E2721] hover:bg-[#E8DEC9]/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CONTENIDO: PANTALLA DE ACCESO POR CONTRASEÑA */}
          {!isAuthenticated ? (
            <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-5">
              <div className="w-14 h-14 bg-[#FAF7F2] border border-[#D9CCB8] rounded-full flex items-center justify-center mx-auto text-[#B88B4A]">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#2E2721]">
                  Acceso Administrativo
                </h3>
                <p className="text-xs text-[#2E2721]/70">
                  Ingresa la contraseña de seguridad para acceder a la gestión del catálogo y configuración de KAS Store.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Contraseña del Panel..."
                    className="w-full px-4 py-2.5 text-xs text-center tracking-widest bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721]"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-xs text-red-500 font-medium mt-2">{authError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2E2721] hover:bg-[#44382F] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Desbloquear Panel CMS
                </button>
              </form>

              <p className="text-[11px] text-[#2E2721]/50">
                Acceso restringido para el propietario de KAS Store en La Masica, Atlántida.
              </p>
            </div>
          ) : (
            /* CONTENIDO: PANEL CMS / CRM DESBLOQUEADO */
            <>
              {/* Barra de Acciones del Archivo config.json */}
              <div className="bg-[#FAF7F2] border-b border-[#E8DEC9] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportConfigJson}
                    className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold inline-flex items-center gap-1.5 rounded-xs shadow-xs transition-colors cursor-pointer"
                    title="Descarga el archivo para reemplazar public/config.json"
                  >
                    <Download className="w-4 h-4" />
                    Descargar config.json Actualizado
                  </button>

                  <label className="px-3 py-1.5 bg-white border border-[#D9CCB8] text-[#2E2721] hover:bg-[#E8DEC9]/30 font-medium inline-flex items-center gap-1.5 rounded-xs cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    Importar config.json
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportConfigJson}
                      className="hidden"
                    />
                  </label>

                  {onOpenAdminDashboard && (
                    <button
                      onClick={onOpenAdminDashboard}
                      className="px-3 py-1.5 bg-[#2E2721] hover:bg-[#44382F] text-white font-medium inline-flex items-center gap-1.5 rounded-xs cursor-pointer transition-colors"
                      title="Abrir vista dividida con Live Preview en tiempo real"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B88B4A]" />
                      Live Preview Completo
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {saveFeedback && (
                    <span className="text-xs font-semibold text-[#25D366] animate-fade-in">
                      {saveFeedback}
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-[#2E2721]/60 hover:text-red-600 text-xs inline-flex items-center gap-1 cursor-pointer"
                    title="Cerrar sesión del panel"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Salir
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-[#E8DEC9] bg-[#FAF7F2]/60 px-4 gap-2 overflow-x-auto text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('cms-products')}
                  className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                    activeTab === 'cms-products'
                      ? 'border-[#B88B4A] text-[#B88B4A]'
                      : 'border-transparent text-[#2E2721]/70 hover:text-[#2E2721]'
                  }`}
                >
                  <Boxes className="w-4 h-4" />
                  Catálogo y Precios HNL ({config?.products.length || 0})
                </button>

                <button
                  onClick={() => setActiveTab('cms-store')}
                  className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                    activeTab === 'cms-store'
                      ? 'border-[#B88B4A] text-[#B88B4A]'
                      : 'border-transparent text-[#2E2721]/70 hover:text-[#2E2721]'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  Textos y WhatsApp Oficial
                </button>

                <button
                  onClick={() => setActiveTab('crm-orders')}
                  className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                    activeTab === 'crm-orders'
                      ? 'border-[#B88B4A] text-[#B88B4A]'
                      : 'border-transparent text-[#2E2721]/70 hover:text-[#2E2721]'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  CRM Pedidos WhatsApp ({ordersList.length})
                </button>
              </div>

              {/* Tab Panels */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
                {/* TAB: CATÁLOGO Y PRECIOS CMS */}
                {activeTab === 'cms-products' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#2E2721]">
                          Gestión Rápida de Precios y Pantalones
                        </h3>
                        <p className="text-xs text-[#2E2721]/60">
                          Edita los precios directamente en los casilleros. Los cambios se previsualizan de inmediato.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsCreatingProduct(!isCreatingProduct)}
                        className="px-3.5 py-2 bg-[#B88B4A] hover:bg-[#8A622A] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        {isCreatingProduct ? 'Cerrar Formulario' : 'Nuevo Producto'}
                      </button>
                    </div>

                    {/* Formulario nuevo producto */}
                    {isCreatingProduct && (
                      <form
                        onSubmit={handleCreateProduct}
                        className="p-4 bg-[#FAF7F2] border border-[#B88B4A]/50 space-y-3 text-xs"
                      >
                        <h4 className="font-serif font-bold text-sm text-[#2E2721]">
                          Agregar Nuevo Pantalón de Mezclilla
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold mb-1">Nombre del Modelo</label>
                            <input
                              type="text"
                              required
                              value={newProductForm.name}
                              onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                              placeholder="Ej. Jeans Recto Atlántida Stone"
                              className="w-full p-2 bg-white border border-[#D9CCB8]"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">Precio en Lempiras (HNL)</label>
                            <input
                              type="number"
                              required
                              value={newProductForm.priceHnl}
                              onChange={(e) => setNewProductForm({ ...newProductForm, priceHnl: Number(e.target.value) })}
                              className="w-full p-2 bg-white border border-[#D9CCB8]"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">Género / Sección</label>
                            <select
                              value={newProductForm.gender}
                              onChange={(e) => setNewProductForm({
                                ...newProductForm,
                                gender: e.target.value as Gender,
                                imageCategory: e.target.value === 'hombre' ? 'hombres' : e.target.value === 'mujer' ? 'mujeres' : 'niños'
                              })}
                              className="w-full p-2 bg-white border border-[#D9CCB8]"
                            >
                              <option value="hombre">Hombre (/images/catalogo/hombres/)</option>
                              <option value="mujer">Mujer (/images/catalogo/mujeres/)</option>
                              <option value="nino">Niño (/images/catalogo/niños/)</option>
                              <option value="nina">Niña (/images/catalogo/niñas/)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">Tonalidad de Mezclilla</label>
                            <input
                              type="text"
                              value={newProductForm.denimWash}
                              onChange={(e) => setNewProductForm({ ...newProductForm, denimWash: e.target.value })}
                              placeholder="Índigo Profundo Raw, Stone Wash, Stay-Black"
                              className="w-full p-2 bg-white border border-[#D9CCB8]"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block font-semibold mb-1">Tallas Disponibles (separadas por coma)</label>
                            <input
                              type="text"
                              value={newProductForm.availableSizes}
                              onChange={(e) => setNewProductForm({ ...newProductForm, availableSizes: e.target.value })}
                              placeholder="28, 30, 32, 34, 36"
                              className="w-full p-2 bg-white border border-[#D9CCB8]"
                            />
                          </div>
                        </div>
                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsCreatingProduct(false)}
                            className="px-4 py-2 border border-[#D9CCB8] text-[#2E2721]"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-[#B88B4A] hover:bg-[#8A622A] text-white font-semibold"
                          >
                            Guardar y Previsualizar
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Tabla de Productos del Catálogo */}
                    <div className="space-y-2">
                      {config?.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-3 bg-[#FAF7F2] border border-[#E8DEC9] flex flex-wrap sm:flex-nowrap items-center justify-between text-xs gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-10 h-12 object-cover bg-white shrink-0 border border-[#D9CCB8]"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-[#2E2721] truncate">{prod.name}</p>
                              <p className="text-[11px] text-[#2E2721]/60">
                                {prod.gender.toUpperCase()} · Tono: {prod.denimWash} · Tallas: {prod.availableSizes.join(', ')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-[#2E2721]">L</span>
                              <input
                                type="number"
                                value={prod.priceHnl}
                                onChange={(e) => handlePriceChange(prod.id, Number(e.target.value))}
                                className="w-20 px-2 py-1 text-xs bg-white border border-[#D9CCB8] font-bold text-[#B88B4A] focus:border-[#B88B4A] focus:outline-none text-right"
                              />
                              <span className="text-[10px] text-[#2E2721]/60">HNL</span>
                            </div>

                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="text-[#2E2721]/50 hover:text-red-600 p-1 transition-colors"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: TEXTOS Y CONFIGURACIÓN GENERAL */}
                {activeTab === 'cms-store' && config && (
                  <div className="space-y-4 text-xs max-w-xl">
                    <h3 className="font-serif text-base font-bold text-[#2E2721]">
                      Parámetros de la Tienda (La Masica, Atlántida)
                    </h3>
                    <p className="text-[#2E2721]/70">
                      Modifica los textos informativos y el contacto de WhatsApp sin editar código fuente.
                    </p>

                    <div className="space-y-3 bg-[#FAF7F2] p-4 border border-[#E8DEC9]">
                      <div>
                        <label className="block font-semibold mb-1">Nombre Comercial de la Tienda</label>
                        <input
                          type="text"
                          value={config.store.name}
                          onChange={(e) => handleStoreConfigChange('name', e.target.value)}
                          className="w-full p-2 bg-white border border-[#D9CCB8]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Lema / Subtítulo</label>
                        <input
                          type="text"
                          value={config.store.tagline || ''}
                          onChange={(e) => handleStoreConfigChange('tagline', e.target.value)}
                          className="w-full p-2 bg-white border border-[#D9CCB8]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Barra de Anuncios Superior</label>
                        <input
                          type="text"
                          value={config.store.announcement}
                          onChange={(e) => handleStoreConfigChange('announcement', e.target.value)}
                          className="w-full p-2 bg-white border border-[#D9CCB8]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Número de WhatsApp (con código país 504)</label>
                          <input
                            type="text"
                            value={config.store.whatsapp}
                            onChange={(e) => handleStoreConfigChange('whatsapp', e.target.value)}
                            placeholder="50433056175"
                            className="w-full p-2 bg-white border border-[#D9CCB8]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">Monto para Envío Gratis (HNL)</label>
                          <input
                            type="number"
                            value={config.store.freeShippingThresholdHnl}
                            onChange={(e) => handleStoreConfigChange('freeShippingThresholdHnl', Number(e.target.value))}
                            className="w-full p-2 bg-white border border-[#D9CCB8]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-xs">
                      Recuerda hacer clic en <strong>"Descargar config.json Actualizado"</strong> al terminar para subir los cambios a tu repositorio de GitHub.
                    </div>
                  </div>
                )}

                {/* TAB: CRM PEDIDOS WHATSAPP */}
                {activeTab === 'crm-orders' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 bg-[#FAF7F2] border border-[#E8DEC9]">
                        <span className="text-[11px] text-[#2E2721]/60 uppercase font-semibold">
                          Total Pedidos Registrados
                        </span>
                        <p className="font-serif text-2xl font-bold text-[#2E2721] mt-0.5">
                          {ordersList.length}
                        </p>
                      </div>
                      <div className="p-3.5 bg-[#FAF7F2] border border-[#E8DEC9]">
                        <span className="text-[11px] text-[#2E2721]/60 uppercase font-semibold">
                          Total Acumulado HNL
                        </span>
                        <p className="font-serif text-2xl font-bold text-[#B88B4A] mt-0.5">
                          L {totalRevenue.toFixed(2)}
                        </p>
                      </div>
                      <div className="p-3.5 bg-[#FAF7F2] border border-[#E8DEC9]">
                        <span className="text-[11px] text-[#2E2721]/60 uppercase font-semibold">
                          Sede Central Logística
                        </span>
                        <p className="font-serif text-sm font-bold text-[#2E2721] mt-1">
                          La Masica, Atlántida
                        </p>
                      </div>
                    </div>

                    {/* Filtros de estado */}
                    <div className="flex gap-2 text-xs">
                      {['todos', 'pendiente', 'en_proceso', 'enviado', 'entregado'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setSelectedOrderStatusFilter(st)}
                          className={`px-3 py-1.5 border capitalize rounded-xs font-medium transition-colors ${
                            selectedOrderStatusFilter === st
                              ? 'bg-[#2E2721] text-white border-[#2E2721]'
                              : 'bg-[#FAF7F2] text-[#2E2721] border-[#D9CCB8]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    {filteredOrders.length === 0 ? (
                      <p className="text-xs text-[#2E2721]/60 py-6 text-center">
                        No hay pedidos registrados con este estado.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {filteredOrders.map((order) => (
                          <div
                            key={order.id}
                            className="bg-[#FFFEFC] border border-[#D9CCB8] p-4 text-xs space-y-3 shadow-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8DEC9] pb-2">
                              <div>
                                <span className="font-bold text-sm text-[#2E2721]">
                                  #{order.orderNumber}
                                </span>
                                <span className="text-[#2E2721]/60 ml-2">
                                  Cliente: <strong>{order.customerName}</strong>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-[#2E2721]/70 font-semibold">Estado:</span>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderStatus)}
                                  className="px-2 py-1 text-xs bg-[#FAF7F2] border border-[#D9CCB8] font-semibold text-[#2E2721] focus:outline-none"
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="en_proceso">En Preparación</option>
                                  <option value="enviado">Enviado</option>
                                  <option value="entregado">Entregado</option>
                                  <option value="cancelado">Cancelado</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[#2E2721]/80">
                              <div>
                                <p className="font-semibold text-[#2E2721]">Contacto:</p>
                                <p>📞 {order.customerPhone}</p>
                                {order.customerEmail && <p>✉️ {order.customerEmail}</p>}
                              </div>
                              <div>
                                <p className="font-semibold text-[#2E2721]">Entrega en Honduras:</p>
                                <p>📍 {order.municipio}, {order.departamento}</p>
                                <p>{order.address}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-[#2E2721]">Desglose:</p>
                                <p>Prendas: {order.items.length} · Subtotal: L {order.subtotalHnl.toFixed(2)}</p>
                                <p className="font-bold text-[#B88B4A]">Total: L {order.totalHnl.toFixed(2)} HNL</p>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-[#E8DEC9] flex justify-between items-center">
                              <span className="text-[11px] text-[#2E2721]/60">
                                Transportista: {order.carrierName} ({order.estimatedDelivery})
                              </span>
                              <a
                                href={`https://wa.me/504${order.customerPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(order.customerName)}%2C%20te%20escribimos%20de%20KAS%20Store%20en%20La%20Masica%20respecto%20a%20tu%20orden%20%23${order.orderNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold rounded-xs"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                                Contactar Cliente por WhatsApp
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
