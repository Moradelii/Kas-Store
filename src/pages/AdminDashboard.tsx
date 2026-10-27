import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  Download,
  Upload,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sliders,
  Boxes,
  TrendingUp,
  LogOut,
  Save,
  ArrowLeft,
  Sparkles,
  Eye,
  Tag,
  DollarSign,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  LayoutTemplate,
  MessageCircle,
  Phone,
  Search,
  ExternalLink,
  Calendar,
  HelpCircle,
  FileText,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard.tsx';
import { Product, Gender, ProductCategory, ProductColor, WhatsAppOrder, OrderStatus } from '../types.ts';
import { api, AppConfig, StoreConfig, HomeConfig, DEFAULT_HOME_CONFIG } from '../services/api.ts';
import { cartStorage } from '../services/cartStorage.ts';
import { CATEGORIES_LIST, SIZES_LIST } from '../data/mockProducts.ts';
import {
  buildWhatsAppMessage,
  encodeWhatsAppText,
  OFFICIAL_WHATSAPP_PHONE,
} from '../services/paymentService.ts';

interface AdminDashboardProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

const STATIC_ADMIN_PASSWORD = 'Kas0105';

// Imagen y datos de respaldo seguro para la vista previa
const FALLBACK_PREVIEW_IMAGE = '/images/catalogo/hombres/model_men_jeans_1792801034731.jpg';

const AVAILABLE_SAMPLE_IMAGES = [
  { label: 'Hombre - Jeans Recto Índigo', url: '/images/catalogo/hombres/model_men_jeans_1792801034731.jpg' },
  { label: 'Hombre - Slim Fit Stone', url: '/images/catalogo/hombres/category_men_denim_1792794156758.jpg' },
  { label: 'Hombre - Denim Stack Colores', url: '/images/catalogo/hombres/denim_colors_stack_1792801036423.jpg' },
  { label: 'Mujer - Wide Leg Celeste', url: '/images/catalogo/mujeres/model_women_jeans_1792801034633.jpg' },
  { label: 'Mujer - Mom Fit Índigo', url: '/images/catalogo/mujeres/category_women_trousers_1792794159027.jpg' },
  { label: 'Niño - Jeans Reforzado', url: '/images/catalogo/niños/model_kids_jeans_1792801035749.jpg' },
  { label: 'Niño - Jogger Denim', url: '/images/catalogo/niños/category_denim_kids_1792796354351.jpg' },
  { label: 'Niña - Wide Leg Bordado', url: '/images/catalogo/niñas/model_kids_jeans_1792801035749.jpg' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('kas_cms_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Configuración de la tienda y catálogo
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog-editor' | 'home-cms' | 'crm-orders' | 'store-settings'>('catalog-editor');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Estado del CRM
  const [orders, setOrders] = useState<WhatsAppOrder[]>(() => cartStorage.loadOrders());
  const [orderFilter, setOrderFilter] = useState<string>('todos');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // ID del producto en edición (null si es nuevo)
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Formulario Reactivo del Producto (CRUD)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    shortDescription: '',
    fullDescription: '',
    priceHnl: 890,
    originalPriceHnl: 0,
    category: 'rectos' as ProductCategory,
    categoryLabel: 'Jeans Rectos',
    gender: 'hombre' as Gender,
    fitType: 'Recto Regular',
    denimWash: 'Índigo Profundo Raw',
    imageUrl: '/images/catalogo/hombres/model_men_jeans_1792801034731.jpg',
    availableSizes: ['28', '30', '32', '34', '36'],
    colorName: 'Índigo Profundo',
    colorHex: '#1C273A',
    isNew: true,
    isSale: false,
    isFeatured: true,
    stockStatus: 'in_stock' as 'in_stock' | 'low_stock' | 'out_of_stock',
    fabricComposition: '100% Algodón Denim Pesado (13 oz)',
    careInstructions: 'Lavar al revés con agua fría.',
  });

  // Cargar configuración de public/config.json o localStorage
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const data = await api.getConfig();
    setConfig(JSON.parse(JSON.stringify(data)));
  };

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === STATIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('kas_cms_auth', 'true');
      setAuthError(null);
      setPasswordInput('');
    } else {
      setAuthError('Contraseña incorrecta. Utiliza la clave administrativa de KAS Store.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('kas_cms_auth');
  };

  // Cargar un producto existente en el formulario para editar
  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      id: product.id,
      name: product.name,
      code: product.id,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      priceHnl: product.priceHnl,
      originalPriceHnl: product.originalPriceHnl || 0,
      category: product.category,
      categoryLabel: product.categoryLabel,
      gender: product.gender,
      fitType: product.fitType,
      denimWash: product.denimWash,
      imageUrl: product.images[0] || FALLBACK_PREVIEW_IMAGE,
      availableSizes: product.availableSizes || ['30', '32', '34'],
      colorName: product.availableColors[0]?.name || product.denimWash,
      colorHex: product.availableColors[0]?.hex || '#1C273A',
      isNew: Boolean(product.isNew),
      isSale: Boolean(product.isSale),
      isFeatured: Boolean(product.isFeatured),
      stockStatus: product.stockStatus || 'in_stock',
      fabricComposition: product.fabricComposition || '100% Algodón Denim',
      careInstructions: product.careInstructions || 'Lavar al revés con agua fría.',
    });
    // Scroll suave hacia el formulario
    window.scrollTo({ top: 120, behavior: 'smooth' });
    notify(`Editando: ${product.name}`);
  };

  // Limpiar formulario para nuevo producto
  const handleResetForm = () => {
    const newId = `kas-denim-${Math.floor(10 + Math.random() * 90)}`;
    setEditingProductId(null);
    setFormData({
      id: newId,
      name: '',
      code: newId,
      shortDescription: '',
      fullDescription: '',
      priceHnl: 850,
      originalPriceHnl: 0,
      category: 'rectos',
      categoryLabel: 'Jeans Rectos',
      gender: 'hombre',
      fitType: 'Recto Regular',
      denimWash: 'Índigo Profundo Raw',
      imageUrl: '/images/catalogo/hombres/model_men_jeans_1792801034731.jpg',
      availableSizes: ['28', '30', '32', '34', '36'],
      colorName: 'Índigo Profundo',
      colorHex: '#1C273A',
      isNew: true,
      isSale: false,
      isFeatured: false,
      stockStatus: 'in_stock',
      fabricComposition: '100% Algodón Denim Pesado',
      careInstructions: 'Lavar al revés con agua fría.',
    });
    notify('Formulario limpio listo para nuevo producto');
  };

  // Alternar talla seleccionada evitando fugas de memoria
  const handleToggleSize = (size: string) => {
    setFormData((prev) => {
      const exists = prev.availableSizes.includes(size);
      const nextSizes = exists
        ? prev.availableSizes.filter((s) => s !== size)
        : [...prev.availableSizes, size];
      return { ...prev, availableSizes: nextSizes };
    });
  };

  // Guardar producto en catálogo local (config.json en memoria / localStorage)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    if (!formData.name.trim()) {
      notify('Ingresa el nombre del jean.', 'error');
      return;
    }

    const prodId = formData.id.trim() || `kas-denim-${Date.now()}`;
    const cleanImg = formData.imageUrl.trim() || FALLBACK_PREVIEW_IMAGE;

    const colors: ProductColor[] = [
      {
        name: formData.colorName.trim() || formData.denimWash,
        hex: formData.colorHex || '#1C273A',
        washTone: formData.denimWash,
      },
    ];

    const updatedProduct: Product = {
      id: prodId,
      name: formData.name.trim(),
      shortDescription: formData.shortDescription.trim() || `${formData.name} - Calidad KAS Store.`,
      fullDescription: formData.fullDescription.trim() || formData.name,
      priceHnl: Number(formData.priceHnl) || 0,
      originalPriceHnl: formData.originalPriceHnl > 0 ? Number(formData.originalPriceHnl) : undefined,
      category: formData.category,
      categoryLabel: formData.categoryLabel,
      gender: formData.gender,
      fitType: formData.fitType,
      denimWash: formData.denimWash,
      images: [cleanImg],
      availableSizes: formData.availableSizes.length > 0 ? formData.availableSizes : ['30', '32', '34'],
      availableColors: colors,
      isNew: formData.isNew,
      isSale: formData.isSale,
      isFeatured: formData.isFeatured,
      stockStatus: formData.stockStatus,
      fabricComposition: formData.fabricComposition,
      careInstructions: formData.careInstructions,
    };

    const existingIdx = config.products.findIndex((p) => p.id === prodId);
    let newProductsList: Product[];

    if (existingIdx >= 0) {
      newProductsList = [...config.products];
      newProductsList[existingIdx] = updatedProduct;
      notify(`✓ Producto "${updatedProduct.name}" actualizado.`);
    } else {
      newProductsList = [updatedProduct, ...config.products];
      notify(`✓ Nuevo producto "${updatedProduct.name}" añadido al catálogo.`);
    }

    const newConfig: AppConfig = {
      ...config,
      products: newProductsList,
    };

    setConfig(newConfig);
    api.saveConfigLocally(newConfig);
  };

  // Eliminar producto
  const handleDeleteProduct = (productId: string, productName: string) => {
    if (!config) return;
    if (window.confirm(`¿Deseas eliminar "${productName}" del catálogo?`)) {
      const filtered = config.products.filter((p) => p.id !== productId);
      const newConfig = { ...config, products: filtered };
      setConfig(newConfig);
      api.saveConfigLocally(newConfig);
      notify(`Producto "${productName}" eliminado.`);
      if (editingProductId === productId) {
        handleResetForm();
      }
    }
  };

  // Descargar config.json
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
    notify('✓ config.json descargado con éxito.');
  };

  // Importar config.json
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
          notify('✓ config.json importado correctamente.');
        } else {
          notify('El archivo no tiene el formato válido de config.json.', 'error');
        }
      } catch {
        notify('Error al parsear el archivo JSON.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // ========================================================
  // OBJETO REACTIVO DE VISTA PREVIA (CON ESTADO DE FALLBACK SEGURO)
  // ========================================================
  const previewProduct = useMemo<Product>(() => {
    const safePrice = Number(formData.priceHnl) || 0;
    const safeOriginal = formData.originalPriceHnl > 0 ? Number(formData.originalPriceHnl) : undefined;
    const safeName = formData.name.trim() || 'Nombre del Jean (Vista Previa)';
    const safeImage = formData.imageUrl.trim() || FALLBACK_PREVIEW_IMAGE;

    return {
      id: formData.id || 'preview-id',
      name: safeName,
      shortDescription: formData.shortDescription || 'Descripción breve del jean...',
      fullDescription: formData.fullDescription || 'Descripción detallada...',
      priceHnl: safePrice,
      originalPriceHnl: safeOriginal,
      category: formData.category,
      categoryLabel: formData.categoryLabel || 'Jeans Mezclilla',
      gender: formData.gender,
      fitType: formData.fitType || 'Regular Fit',
      denimWash: formData.denimWash || 'Índigo Clásico',
      images: [safeImage],
      availableSizes: formData.availableSizes.length > 0 ? formData.availableSizes : ['28', '30', '32'],
      availableColors: [
        {
          name: formData.colorName || 'Índigo Profundo',
          hex: formData.colorHex || '#1C273A',
          washTone: formData.denimWash || 'Raw Denim',
        },
      ],
      isNew: formData.isNew,
      isSale: formData.isSale,
      isFeatured: formData.isFeatured,
      stockStatus: formData.stockStatus,
      fabricComposition: formData.fabricComposition || '100% Algodón Denim',
      careInstructions: formData.careInstructions || 'Lavar al revés con agua fría.',
    };
  }, [formData]);

  // ==========================================
  // HELPERS HOME CMS
  // ==========================================
  const updateHomeConfig = (updater: (prev: HomeConfig) => HomeConfig) => {
    if (!config) return;
    const currentHome = config.home || DEFAULT_HOME_CONFIG;
    const updatedHome = updater(currentHome);
    const newConfig: AppConfig = {
      ...config,
      home: updatedHome,
    };
    setConfig(newConfig);
    api.saveConfigLocally(newConfig);
  };

  const handleResetHomeConfig = () => {
    if (window.confirm('¿Restablecer todos los textos e imágenes de la página de inicio a los valores iniciales?')) {
      if (!config) return;
      const newConfig: AppConfig = {
        ...config,
        home: DEFAULT_HOME_CONFIG,
      };
      setConfig(newConfig);
      api.saveConfigLocally(newConfig);
      notify('Textos e imágenes de inicio restablecidos.');
    }
  };

  // ==========================================
  // HELPERS CRM PEDIDOS WHATSAPP
  // ==========================================
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    cartStorage.updateOrderStatus(orderId, newStatus);
    setOrders(cartStorage.loadOrders());
    notify(`Estado del pedido cambiado a: ${newStatus.toUpperCase()}`);
  };

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    if (window.confirm(`¿Deseas eliminar el pedido ${orderNumber} del registro del CRM?`)) {
      const updated = orders.filter((o) => o.id !== orderId);
      localStorage.setItem('kas_store_orders_crm_v1', JSON.stringify(updated));
      setOrders(updated);
      notify(`Pedido ${orderNumber} eliminado.`);
    }
  };

  const handleClearAllOrders = () => {
    if (window.confirm('¿Estás seguro de vaciar todo el historial de pedidos del CRM? Esta acción no se puede deshacer.')) {
      cartStorage.clearOrders();
      setOrders([]);
      notify('Historial de pedidos del CRM vaciado.');
    }
  };

  const handleCreateSampleOrder = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const partialSample: Omit<WhatsAppOrder, 'whatsappUrl'> = {
      id: `kas-order-${Date.now()}`,
      orderNumber: `#KAS-2026-${randomSuffix}`,
      customerName: 'Cesar Moradel',
      customerPhone: '9865-8519',
      customerEmail: 'moradelii@gmail.com',
      departamento: 'Atlántida',
      municipio: 'La Masica (Sede KAS Store)',
      address: 'Colonia Lazo',
      deliveryNotes: 'Atrás de la Estación de Bomberos',
      carrierName: 'Entrega Local Express KAS Store',
      estimatedDelivery: '24 horas hábiles',
      items: [
        {
          productId: 'kas-denim-01',
          productName: 'Jeans Hombre Selvedge Heritage Orillo Rojo',
          selectedSize: '30',
          selectedColor: 'Índigo Selvedge',
          quantity: 1,
          unitPriceHnl: 1390,
          totalHnl: 1390,
          image: '/images/catalogo/hombres/model_men_jeans_1792801034731.jpg',
        },
      ],
      subtotalHnl: 1390,
      shippingFeeHnl: 80,
      discountHnl: 0,
      totalHnl: 1470,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    };

    const msg = buildWhatsAppMessage(partialSample as WhatsAppOrder);
    const sample: WhatsAppOrder = {
      ...partialSample,
      whatsappUrl: `https://wa.me/${OFFICIAL_WHATSAPP_PHONE}?text=${encodeWhatsAppText(msg)}`,
    };

    cartStorage.saveOrder(sample);
    setOrders(cartStorage.loadOrders());
    notify('Pedido de demostración añadido al CRM.');
  };

  const crmMetrics = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'pendiente').length;
    const inProcessOrders = orders.filter((o) => o.status === 'en_proceso' || o.status === 'enviado').length;
    const deliveredOrders = orders.filter((o) => o.status === 'entregado').length;
    const totalSalesHnl = orders.reduce((sum, o) => (o.status !== 'cancelado' ? sum + (o.totalHnl || 0) : sum), 0);
    return { totalOrders, pendingOrders, inProcessOrders, deliveredOrders, totalSalesHnl };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter = orderFilter === 'todos' || o.status === orderFilter;
      const search = orderSearch.toLowerCase().trim();
      const matchesSearch =
        !search ||
        o.customerName.toLowerCase().includes(search) ||
        o.orderNumber.toLowerCase().includes(search) ||
        o.customerPhone.includes(search) ||
        o.departamento.toLowerCase().includes(search) ||
        o.municipio.toLowerCase().includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [orders, orderFilter, orderSearch]);

  // Si no está autenticado, pantalla de login estático
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="bg-[#FFFEFC] border border-[#D9CCB8] p-8 sm:p-10 max-w-md w-full shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 bg-[#2E2721] rounded-full flex items-center justify-center mx-auto text-[#E8DEC9]">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-bold text-[#2E2721]">
              Panel Administrativo KAS Store
            </h1>
            <p className="text-xs text-[#2E2721]/70">
              Gestión del catálogo con Live Preview en tiempo real (La Masica, Atlántida).
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresa la contraseña del CMS..."
                className="w-full px-4 py-2.5 text-xs text-center tracking-widest bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721]"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-red-500 font-medium mt-2">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2E2721] hover:bg-[#44382F] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              Desbloquear Panel
            </button>
          </form>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-[#2E2721]/60 hover:text-[#B88B4A] inline-flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver a la tienda pública
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner & Control Actions */}
      <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-[#2E2721]/60 hover:text-[#B88B4A] inline-flex items-center gap-1 mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Tienda
            </button>
            <h1 className="font-serif text-2xl font-bold text-[#2E2721]">
              Panel CMS · Catálogo & Live Preview
            </h1>
            <span className="text-[10px] bg-[#B88B4A] text-white font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs">
              config.json
            </span>
          </div>
          <p className="text-xs text-[#2E2721]/60 mt-0.5">
            Sede La Masica, Atlántida · Edición reactiva con previsualización simultánea
          </p>
        </div>

        {/* Botones de Exportar/Importar config.json */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={handleExportConfigJson}
            className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold inline-flex items-center gap-1.5 rounded-xs shadow-xs transition-all cursor-pointer"
            title="Descarga el archivo modificado para subir a public/config.json"
          >
            <Download className="w-4 h-4" />
            Descargar config.json
          </button>

          <label className="px-3 py-2 bg-[#FAF7F2] border border-[#D9CCB8] text-[#2E2721] hover:bg-[#E8DEC9]/40 font-medium inline-flex items-center gap-1.5 rounded-xs cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Importar JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImportConfigJson}
              className="hidden"
            />
          </label>

          <button
            onClick={handleLogout}
            className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-medium inline-flex items-center gap-1.5 rounded-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Salir
          </button>
        </div>
      </div>

      {/* Notificación de feedback */}
      {feedbackMsg && (
        <div
          className={`p-3 text-xs font-semibold flex items-center justify-between border rounded-xs animate-fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-current opacity-70 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#E8DEC9] gap-4 text-xs font-semibold overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('catalog-editor')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'catalog-editor'
              ? 'border-[#B88B4A] text-[#B88B4A]'
              : 'border-transparent text-[#2E2721]/60 hover:text-[#2E2721]'
          }`}
        >
          <Boxes className="w-4 h-4" />
          Editor de Catálogo con Live Preview
        </button>

        <button
          onClick={() => setActiveTab('home-cms')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'home-cms'
              ? 'border-[#B88B4A] text-[#B88B4A]'
              : 'border-transparent text-[#2E2721]/60 hover:text-[#2E2721]'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          Página de Inicio (Home CMS)
        </button>

        <button
          onClick={() => {
            setActiveTab('crm-orders');
            setOrders(cartStorage.loadOrders());
          }}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'crm-orders'
              ? 'border-[#B88B4A] text-[#B88B4A]'
              : 'border-transparent text-[#2E2721]/60 hover:text-[#2E2721]'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          CRM Pedidos WhatsApp
          {orders.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] bg-[#B88B4A] text-white rounded-full font-bold">
              {orders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('store-settings')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'store-settings'
              ? 'border-[#B88B4A] text-[#B88B4A]'
              : 'border-transparent text-[#2E2721]/60 hover:text-[#2E2721]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Parámetros de Tienda & WhatsApp
        </button>
      </div>

      {/* CONTENIDO: PESTAÑA PRINCIPAL SPLIT SCREEN */}
      {activeTab === 'catalog-editor' && (
        <div className="space-y-10">
          {/* ========================================================
              REJILLA DIVIDIDA (SPLIT SCREEN / GRID)
              Lado Izquierdo: Formulario CRUD
              Lado Derecho: Live Preview en Tiempo Real (Sticky)
             ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* LADO IZQUIERDO: FORMULARIO DINÁMICO CRUD */}
            <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC9]">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#2E2721]">
                    {editingProductId ? '✏️ Editar Producto' : '✨ Agregar Nuevo Jean al Catálogo'}
                  </h2>
                  <p className="text-xs text-[#2E2721]/60">
                    Escribe para ver reflejados los cambios instantáneamente en la tarjeta de la derecha.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-2.5 py-1 text-[11px] border border-[#D9CCB8] hover:bg-[#FAF7F2] text-[#2E2721] font-semibold flex items-center gap-1 rounded-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  Nuevo
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                {/* 1. Título y Código */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#2E2721] mb-1">
                      Título / Nombre del Jean <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Jeans Hombre Selvedge Heritage"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2E2721] mb-1">
                      Código / ID
                    </label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      placeholder="kas-denim-01"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721] font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* 2. Categoría, Género y Corte */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2E2721] mb-1">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const cat = e.target.value as ProductCategory;
                        const labelItem = CATEGORIES_LIST.find((c) => c.id === cat);
                        setFormData({
                          ...formData,
                          category: cat,
                          categoryLabel: labelItem ? labelItem.label : 'Jeans Mezclilla',
                        });
                      }}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721]"
                    >
                      <option value="rectos">Corte Recto</option>
                      <option value="slim-fit">Slim Fit</option>
                      <option value="wide-leg">Wide Leg</option>
                      <option value="mom-fit">Mom Fit</option>
                      <option value="flare-denim">Flare Acampanado</option>
                      <option value="cargo-denim">Cargo Denim</option>
                      <option value="skinny">Skinny</option>
                      <option value="jogger-denim">Jogger Denim</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2E2721] mb-1">
                      Género / Sección
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721]"
                    >
                      <option value="hombre">Hombre</option>
                      <option value="mujer">Mujer</option>
                      <option value="nino">Niño</option>
                      <option value="nina">Niña</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2E2721] mb-1">
                      Corte / Fit Type
                    </label>
                    <input
                      type="text"
                      value={formData.fitType}
                      onChange={(e) => setFormData({ ...formData, fitType: e.target.value })}
                      placeholder="Ej. Recto Regular, Wide Leg"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721]"
                    />
                  </div>
                </div>

                {/* 3. Precios en Lempiras (HNL) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#FAF7F2] border border-[#E8DEC9]">
                  <div>
                    <label className="block font-semibold text-[#2E2721] mb-1">
                      Precio de Venta (Lempiras) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-bold text-[#B88B4A]">L</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="10"
                        value={formData.priceHnl}
                        onChange={(e) => setFormData({ ...formData, priceHnl: Number(e.target.value) })}
                        className="w-full pl-7 pr-3 py-1.5 bg-white border border-[#D9CCB8] font-bold text-[#B88B4A] text-sm focus:border-[#B88B4A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2E2721] mb-1">
                      Precio Original / Antes (Opcional para Oferta)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-[#2E2721]/60">L</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={formData.originalPriceHnl || ''}
                        onChange={(e) => setFormData({ ...formData, originalPriceHnl: Number(e.target.value) })}
                        placeholder="0 para sin descuento"
                        className="w-full pl-7 pr-3 py-1.5 bg-white border border-[#D9CCB8] text-xs focus:border-[#B88B4A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Tonalidad y Color */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#2E2721] mb-1">
                      Tonalidad de Mezclilla (Denim Wash)
                    </label>
                    <input
                      type="text"
                      value={formData.denimWash}
                      onChange={(e) => setFormData({ ...formData, denimWash: e.target.value, colorName: e.target.value })}
                      placeholder="Índigo Profundo Raw, Stone Wash, Celeste 90s"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2E2721] mb-1">
                      Muestra de Color Hex
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.colorHex}
                        onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                        className="w-8 h-8 rounded-xs cursor-pointer border border-[#D9CCB8] p-0"
                      />
                      <input
                        type="text"
                        value={formData.colorHex}
                        onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                        className="w-full px-2 py-1.5 bg-[#FAF7F2] border border-[#D9CCB8] text-[11px] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Tallas Disponibles (Selectores Interactivos) */}
                <div>
                  <label className="block font-semibold text-[#2E2721] mb-1.5">
                    Tallas Disponibles (Haz clic para activar/desactivar)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SIZES_LIST.map((sz) => {
                      const isSelected = formData.availableSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleToggleSize(sz)}
                          className={`w-9 h-8 text-xs font-semibold rounded-xs border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#2E2721] text-white border-[#2E2721]'
                              : 'bg-white text-[#2E2721]/70 border-[#D9CCB8] hover:border-[#2E2721]'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Enlace de Imagen y Selector de Muestras */}
                <div className="space-y-2">
                  <label className="block font-semibold text-[#2E2721]">
                    Ruta de Imagen en public/images/
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/images/catalogo/hombres/..."
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721] text-[11px] font-mono"
                  />

                  {/* Selector rápido de fotos preexistentes */}
                  <div>
                    <span className="text-[11px] text-[#2E2721]/60 block mb-1">
                      O selecciona una foto rápida del catálogo:
                    </span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData({ ...formData, imageUrl: e.target.value });
                        }
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D9CCB8] text-xs text-[#2E2721]"
                    >
                      <option value="">-- Galería rápida en public/images/catalogo/ --</option>
                      {AVAILABLE_SAMPLE_IMAGES.map((img) => (
                        <option key={img.url} value={img.url}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 7. Descripciones */}
                <div>
                  <label className="block font-semibold text-[#2E2721] mb-1">
                    Descripción Corta
                  </label>
                  <textarea
                    rows={2}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Mezclilla rígida pesada 13 oz en tonalidad índigo..."
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-[#2E2721] resize-none"
                  />
                </div>

                {/* 8. Checkboxes de estado */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E8DEC9]">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="text-[#B88B4A] rounded-xs"
                    />
                    <span>¿Es Nuevo?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formData.isSale}
                      onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                      className="text-[#B88B4A] rounded-xs"
                    />
                    <span>¿En Oferta?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="text-[#B88B4A] rounded-xs"
                    />
                    <span>¿Destacado?</span>
                  </label>
                </div>

                {/* Botón de Guardar */}
                <div className="pt-3 border-t border-[#E8DEC9] flex items-center justify-between">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#B88B4A] hover:bg-[#8A622A] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center gap-2 rounded-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {editingProductId ? 'Guardar Cambios en Catálogo' : 'Agregar Jean al Catálogo'}
                  </button>
                </div>
              </form>
            </div>

            {/* LADO DERECHO: CONTENEDOR ESTÁTICO/FIJO "VISTA PREVIA EN TIEMPO REAL" */}
            <div className="sticky top-24 space-y-4">
              <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <h3 className="font-serif text-base font-bold text-[#2E2721]">
                    Vista Previa en Tiempo Real
                  </h3>
                </div>
                <span className="text-[11px] text-[#B88B4A] font-semibold uppercase tracking-wider bg-[#E8DEC9]/40 px-2.5 py-0.5 rounded-xs">
                  Live Card
                </span>
              </div>

              {/* Contenedor del Componente ProductCard */}
              <div className="bg-[#FAF7F2] border-2 border-dashed border-[#D9CCB8] p-6 flex flex-col items-center justify-center min-h-[460px]">
                <div className="w-full max-w-[280px] shadow-lg transition-all duration-200">
                  <ProductCard
                    product={previewProduct}
                    onSelect={() => {}}
                  />
                </div>

                <div className="mt-4 text-center space-y-1">
                  <p className="text-xs font-semibold text-[#2E2721]">
                    {previewProduct.name}
                  </p>
                  <p className="text-[11px] text-[#2E2721]/60">
                    Renderizado exacto con los estilos Tailwind v4 de la tienda.
                  </p>
                </div>
              </div>

              {/* Panel de Inspección de Variantes y Datos */}
              <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-4 text-xs space-y-2">
                <p className="font-bold text-[#2E2721] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#B88B4A]" />
                  Resumen de Atributos Vinculados:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[#2E2721]/80 text-[11px]">
                  <div>
                    <span className="text-[#2E2721]/50">Precio Formateado:</span>{' '}
                    <strong className="text-[#B88B4A]">L {previewProduct.priceHnl.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-[#2E2721]/50">Categoría:</span> {previewProduct.categoryLabel}
                  </div>
                  <div>
                    <span className="text-[#2E2721]/50">Género:</span> {previewProduct.gender.toUpperCase()}
                  </div>
                  <div>
                    <span className="text-[#2E2721]/50">Tonalidad:</span> {previewProduct.denimWash}
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#2E2721]/50">Tallas Activas:</span>{' '}
                    {previewProduct.availableSizes.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              TABLA INFERIOR DE PRODUCTOS REGISTRADOS
             ======================================================== */}
          <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC9]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2E2721]">
                  Prendas en el Catálogo ({config?.products.length || 0})
                </h3>
                <p className="text-xs text-[#2E2721]/60">
                  Haz clic en "Editar" para cargar cualquier jean en el formulario y ver el Live Preview en paralelo.
                </p>
              </div>

              <button
                onClick={handleExportConfigJson}
                className="px-3 py-1.5 bg-[#2E2721] hover:bg-[#44382F] text-white text-xs font-semibold rounded-xs inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar config.json
              </button>
            </div>

            <div className="divide-y divide-[#E8DEC9]">
              {config?.products.map((prod) => (
                <div
                  key={prod.id}
                  className={`py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 transition-colors ${
                    editingProductId === prod.id ? 'bg-[#FAF7F2] p-2' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-12 h-14 object-cover border border-[#D9CCB8] shrink-0"
                    />
                    <div className="min-w-0 text-xs">
                      <p className="font-bold text-[#2E2721] truncate">{prod.name}</p>
                      <p className="text-[#2E2721]/60 text-[11px]">
                        ID: <span className="font-mono">{prod.id}</span> · {prod.gender.toUpperCase()} · Tono: {prod.denimWash}
                      </p>
                      <p className="text-[11px] text-[#2E2721]/50">
                        Tallas: {prod.availableSizes.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-bold text-[#B88B4A] text-sm tabular-nums">
                      L {prod.priceHnl.toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleEditProduct(prod)}
                      className="px-3 py-1 bg-[#FAF7F2] hover:bg-[#E8DEC9] text-[#2E2721] border border-[#D9CCB8] text-xs font-semibold rounded-xs transition-colors"
                    >
                      Editar en Live Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CONTENIDO: PESTAÑA PÁGINA DE INICIO (HOME CMS)
          Edición de textos e imágenes de portada, categorías, editorial y FAQs
         ======================================================== */}
      {activeTab === 'home-cms' && config && (
        <div className="space-y-8 max-w-5xl">
          {/* Header del Home CMS */}
          <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-[#B88B4A]" />
                <h3 className="font-serif text-lg font-bold text-[#2E2721]">
                  Editor de la Página de Inicio (Home CMS)
                </h3>
              </div>
              <p className="text-xs text-[#2E2721]/70 mt-1">
                Modifica todos los textos, imágenes de portada, banners de categorías familiares, bloque editorial y preguntas frecuentes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#E8DEC9] text-[#2E2721] border border-[#D9CCB8] text-xs font-semibold rounded-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#B88B4A]" />
                Ver Tienda Pública
              </button>

              <button
                type="button"
                onClick={handleResetHomeConfig}
                className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                title="Restablecer textos e imágenes a los originales"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restablecer Originales
              </button>

              <button
                type="button"
                onClick={handleExportConfigJson}
                className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xs shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Descargar config.json
              </button>
            </div>
          </div>

          {/* 1. SECCIÓN HERO PRINCIPAL */}
          <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-6 shadow-xs space-y-5">
            <div className="border-b border-[#E8DEC9] pb-3 flex items-center justify-between">
              <div>
                <h4 className="font-serif text-base font-bold text-[#2E2721] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B88B4A]" />
                  1. Portada Principal (Hero Banner)
                </h4>
                <p className="text-[11px] text-[#2E2721]/60">
                  Textos centrales de impacto y foto principal visible al entrar a la tienda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#2E2721]">Distintivo Superior (Badge)</label>
                <input
                  type="text"
                  value={config.home?.hero?.badgeText || ''}
                  onChange={(e) =>
                    updateHomeConfig((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, badgeText: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none"
                  placeholder="Especialistas en Mezclilla · La Masica"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#2E2721]">Subtítulo de Ubicación (Tagline)</label>
                <input
                  type="text"
                  value={config.home?.hero?.tagline || ''}
                  onChange={(e) =>
                    updateHomeConfig((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, tagline: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none"
                  placeholder="Tienda de Mezclilla · La Masica, Atlántida"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#2E2721]">Título Principal - Línea 1</label>
                <input
                  type="text"
                  value={config.home?.hero?.titleLine1 || ''}
                  onChange={(e) =>
                    updateHomeConfig((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, titleLine1: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none"
                  placeholder="Tu estilo,"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#2E2721]">Título Principal - Línea 2 (Cursiva / Acento)</label>
                <input
                  type="text"
                  value={config.home?.hero?.titleLine2 || ''}
                  onChange={(e) =>
                    updateHomeConfig((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, titleLine2: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none"
                  placeholder="tu esencia."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-[#2E2721]">Descripción de la Portada</label>
                <textarea
                  rows={3}
                  value={config.home?.hero?.description || ''}
                  onChange={(e) =>
                    updateHomeConfig((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, description: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none"
                  placeholder="Encuentra el pantalón de mezclilla ideal para cada ocasión..."
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#2E2721]">Texto del Botón Principal</label>
                <input
                  type="text"
                  value={config.home?.hero?.ctaButtonText || ''}
                  onChange={(e) =>
                    updateHomeConfig((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, ctaButtonText: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none"
                  placeholder="Comprar colección"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#2E2721]">Ruta de Imagen de Portada (Hero Image)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.home?.hero?.heroImage || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, heroImage: e.target.value },
                      }))
                    }
                    className="flex-1 p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none font-mono text-[11px]"
                    placeholder="/images/hero_denim_store_1792794154448.jpg"
                  />
                  {config.home?.hero?.heroImage && (
                    <img
                      src={config.home.hero.heroImage}
                      alt="Hero preview"
                      className="w-10 h-10 object-cover border border-[#D9CCB8] shrink-0"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Presets rápidos para portada */}
            <div className="pt-2 border-t border-[#E8DEC9]/50">
              <span className="text-[11px] text-[#2E2721]/60 font-semibold block mb-1.5">
                Rutas rápidas de imagen recomendadas:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {[
                  { name: 'Mezclilla Store Principal', url: '/images/hero_denim_store_1792794154448.jpg' },
                  { name: 'Hombre Denim Recto', url: '/images/catalogo/hombres/model_men_jeans_1792801034731.jpg' },
                  { name: 'Mujer Denim Wide', url: '/images/catalogo/mujeres/model_women_jeans_1792801034633.jpg' },
                  { name: 'Pila de Mezclilla', url: '/images/catalogo/hombres/denim_colors_stack_1792801036423.jpg' },
                ].map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, heroImage: preset.url },
                      }))
                    }
                    className="px-2 py-1 bg-[#FAF7F2] hover:bg-[#E8DEC9] border border-[#D9CCB8] rounded-xs text-[#2E2721] cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. SECCIÓN TARJETAS DE CATEGORÍAS */}
          <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-6 shadow-xs space-y-6">
            <div className="border-b border-[#E8DEC9] pb-3">
              <h4 className="font-serif text-base font-bold text-[#2E2721] flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#B88B4A]" />
                2. Bloque de Categorías de Inicio (Hombre, Mujer, Niño, Niña)
              </h4>
              <p className="text-[11px] text-[#2E2721]/60">
                Personaliza títulos, descripciones e imágenes de los 4 accesos principales de la tienda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#2E2721]">Título Principal de la Sección</label>
                <input
                  type="text"
                  value={config.home?.categories?.sectionTitle || ''}
                  onChange={(e) =>
                    updateHomeConfig((prev) => ({
                      ...prev,
                      categories: { ...prev.categories, sectionTitle: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none"
                  placeholder="Explora por Categoría"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#2E2721]">Subtítulo de la Sección</label>
                <input
                  type="text"
                  value={config.home?.categories?.sectionSubtitle || ''}
                  onChange={(e) =>
                    updateHomeConfig((prev) => ({
                      ...prev,
                      categories: { ...prev.categories, sectionSubtitle: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none"
                  placeholder="Mezclilla para Toda la Familia"
                />
              </div>
            </div>

            {/* 4 Cards de categorías */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Hombre */}
              <div className="bg-[#FAF7F2] p-4 border border-[#D9CCB8] space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[#D9CCB8] pb-1.5">
                  <span className="font-bold text-[#2E2721] uppercase tracking-wide text-[11px]">
                    Tarjetón: Jeans Hombre
                  </span>
                  {config.home?.categories?.menImage && (
                    <img
                      src={config.home.categories.menImage}
                      alt="Hombre preview"
                      className="w-8 h-8 object-cover border border-[#D9CCB8]"
                    />
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">Título</label>
                  <input
                    type="text"
                    value={config.home?.categories?.menTitle || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, menTitle: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#D9CCB8]"
                    placeholder="Jeans Hombre"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Subtítulo</label>
                  <input
                    type="text"
                    value={config.home?.categories?.menSubtitle || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, menSubtitle: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#D9CCB8]"
                    placeholder="Rectos, Slim Fit, Cargo & Selvedge"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ruta de Imagen</label>
                  <input
                    type="text"
                    value={config.home?.categories?.menImage || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, menImage: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#D9CCB8] font-mono text-[11px]"
                    placeholder="/images/catalogo/hombres/category_men_denim_1792794156758.jpg"
                  />
                </div>
              </div>

              {/* Mujer */}
              <div className="bg-[#FAF7F2] p-4 border border-[#D9CCB8] space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[#D9CCB8] pb-1.5">
                  <span className="font-bold text-[#2E2721] uppercase tracking-wide text-[11px]">
                    Tarjetón: Jeans Mujer
                  </span>
                  {config.home?.categories?.womenImage && (
                    <img
                      src={config.home.categories.womenImage}
                      alt="Mujer preview"
                      className="w-8 h-8 object-cover border border-[#D9CCB8]"
                    />
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">Título</label>
                  <input
                    type="text"
                    value={config.home?.categories?.womenTitle || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, womenTitle: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#D9CCB8]"
                    placeholder="Jeans Mujer"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Subtítulo</label>
                  <input
                    type="text"
                    value={config.home?.categories?.womenSubtitle || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, womenSubtitle: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#D9CCB8]"
                    placeholder="Wide-Leg, Mom Fit, Flare & Skinny"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ruta de Imagen</label>
                  <input
                    type="text"
                    value={config.home?.categories?.womenImage || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, womenImage: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#D9CCB8] font-mono text-[11px]"
                    placeholder="/images/catalogo/mujeres/category_women_trousers_1792794159027.jpg"
                  />
                </div>
              </div>

              {/* Niño */}
              <div className="bg-[#FAF7F2] p-4 border border-[#D9CCB8] space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[#D9CCB8] pb-1.5">
                  <span className="font-bold text-[#2E2721] uppercase tracking-wide text-[11px]">
                    Tarjetón: Jeans Niño
                  </span>
                  {config.home?.categories?.kidsBoyImage && (
                    <img
                      src={config.home.categories.kidsBoyImage}
                      alt="Niño preview"
                      className="w-8 h-8 object-cover border border-[#D9CCB8]"
                    />
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">Título</label>
                  <input
                    type="text"
                    value={config.home?.categories?.kidsBoyTitle || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, kidsBoyTitle: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#D9CCB8]"
                    placeholder="Jeans Niño"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Subtítulo</label>
                  <input
                    type="text"
                    value={config.home?.categories?.kidsBoySubtitle || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, kidsBoySubtitle: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#D9CCB8]"
                    placeholder="Rodillas reforzadas & cintura elástica"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ruta de Imagen</label>
                  <input
                    type="text"
                    value={config.home?.categories?.kidsBoyImage || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, kidsBoyImage: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#D9CCB8] font-mono text-[11px]"
                    placeholder="/images/catalogo/niños/category_denim_kids_1792796354351.jpg"
                  />
                </div>
              </div>

              {/* Niña */}
              <div className="bg-[#FAF7F2] p-4 border border-[#D9CCB8] space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[#D9CCB8] pb-1.5">
                  <span className="font-bold text-[#2E2721] uppercase tracking-wide text-[11px]">
                    Tarjetón: Jeans Niña
                  </span>
                  {config.home?.categories?.kidsGirlImage && (
                    <img
                      src={config.home.categories.kidsGirlImage}
                      alt="Niña preview"
                      className="w-8 h-8 object-cover border border-[#D9CCB8]"
                    />
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">Título</label>
                  <input
                    type="text"
                    value={config.home?.categories?.kidsGirlTitle || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, kidsGirlTitle: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#D9CCB8]"
                    placeholder="Jeans Niña"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Subtítulo</label>
                  <input
                    type="text"
                    value={config.home?.categories?.kidsGirlSubtitle || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, kidsGirlSubtitle: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#D9CCB8]"
                    placeholder="Wide leg suave, bordados & stretch"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ruta de Imagen</label>
                  <input
                    type="text"
                    value={config.home?.categories?.kidsGirlImage || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, kidsGirlImage: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#D9CCB8] font-mono text-[11px]"
                    placeholder="/images/catalogo/niñas/model_kids_jeans_1792801035749.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. SECCIÓN EDITORIAL & HERENCIA */}
          <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-6 shadow-xs space-y-5">
            <div className="border-b border-[#E8DEC9] pb-3">
              <h4 className="font-serif text-base font-bold text-[#2E2721] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#B88B4A]" />
                3. Sección Editorial & Herencia Denim
              </h4>
              <p className="text-[11px] text-[#2E2721]/60">
                Bloque institucional donde se explica la durabilidad, confección y despacho desde La Masica, Atlántida.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#2E2721]">Distintivo Superior</label>
                <input
                  type="text"
                  value={config.home?.editorial?.badge || ''}
                  onChange={(e) =>
                    updateHomeConfig((prev) => ({
                      ...prev,
                      editorial: { ...prev.editorial, badge: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none"
                  placeholder="Herencia y Confección KAS Store"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#2E2721]">Título Principal del Bloque</label>
                <input
                  type="text"
                  value={config.home?.editorial?.title || ''}
                  onChange={(e) =>
                    updateHomeConfig((prev) => ({
                      ...prev,
                      editorial: { ...prev.editorial, title: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none"
                  placeholder="Auténtica mezclilla seleccionada para durar"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-[#2E2721]">Párrafo 1 (Calidad & Curaduría de Telas)</label>
                <textarea
                  rows={3}
                  value={config.home?.editorial?.paragraph1 || ''}
                  onChange={(e) =>
                    updateHomeConfig((prev) => ({
                      ...prev,
                      editorial: { ...prev.editorial, paragraph1: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-[#2E2721]">Párrafo 2 (Envíos Nacionales & Asesoría de Medidas)</label>
                <textarea
                  rows={3}
                  value={config.home?.editorial?.paragraph2 || ''}
                  onChange={(e) =>
                    updateHomeConfig((prev) => ({
                      ...prev,
                      editorial: { ...prev.editorial, paragraph2: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-[#2E2721]">Ruta de Imagen Editorial</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.home?.editorial?.image || ''}
                    onChange={(e) =>
                      updateHomeConfig((prev) => ({
                        ...prev,
                        editorial: { ...prev.editorial, image: e.target.value },
                      }))
                    }
                    className="flex-1 p-2.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none font-mono text-[11px]"
                    placeholder="/images/catalogo/hombres/denim_colors_stack_1792801036423.jpg"
                  />
                  {config.home?.editorial?.image && (
                    <img
                      src={config.home.editorial.image}
                      alt="Editorial preview"
                      className="w-10 h-10 object-cover border border-[#D9CCB8] shrink-0"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4. SECCIÓN PREGUNTAS FRECUENTES (FAQ) */}
          <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-6 shadow-xs space-y-5">
            <div className="border-b border-[#E8DEC9] pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-serif text-base font-bold text-[#2E2721] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#B88B4A]" />
                  4. Preguntas Frecuentes (FAQ) de la Tienda
                </h4>
                <p className="text-[11px] text-[#2E2721]/60">
                  Responde dudas comunes sobre envíos a Honduras, tallas en cm, métodos de pago y calidad de mezclilla.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  updateHomeConfig((prev) => ({
                    ...prev,
                    faqs: [
                      ...(prev.faqs || []),
                      {
                        q: '¿Nueva pregunta frecuente sobre KAS Store?',
                        a: 'Ingresa aquí la respuesta clara para tus clientes.',
                      },
                    ],
                  }));
                  notify('Nueva pregunta añadida al FAQ.');
                }}
                className="px-3 py-1.5 bg-[#2E2721] hover:bg-[#44382F] text-white text-xs font-semibold rounded-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar Pregunta
              </button>
            </div>

            <div className="space-y-4">
              {config.home?.faqs?.map((faq, idx) => (
                <div key={idx} className="p-4 bg-[#FAF7F2] border border-[#D9CCB8] space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#B88B4A] text-[11px]">
                      Pregunta #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`¿Deseas eliminar la pregunta #${idx + 1}?`)) {
                          updateHomeConfig((prev) => ({
                            ...prev,
                            faqs: prev.faqs.filter((_, i) => i !== idx),
                          }));
                          notify(`Pregunta #${idx + 1} eliminada.`);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Eliminar pregunta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-[#2E2721]">Pregunta</label>
                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => {
                        const newFaqs = [...(config.home?.faqs || [])];
                        newFaqs[idx] = { ...newFaqs[idx], q: e.target.value };
                        updateHomeConfig((prev) => ({ ...prev, faqs: newFaqs }));
                      }}
                      className="w-full p-2 bg-white border border-[#D9CCB8]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-[#2E2721]">Respuesta</label>
                    <textarea
                      rows={2}
                      value={faq.a}
                      onChange={(e) => {
                        const newFaqs = [...(config.home?.faqs || [])];
                        newFaqs[idx] = { ...newFaqs[idx], a: e.target.value };
                        updateHomeConfig((prev) => ({ ...prev, faqs: newFaqs }));
                      }}
                      className="w-full p-2 bg-white border border-[#D9CCB8]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botón inferior para exportar config.json */}
          <div className="p-5 bg-[#FAF7F2] border border-[#D9CCB8] flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold text-xs text-[#2E2721]">
                ¿Listo para aplicar los cambios a la tienda en producción?
              </p>
              <p className="text-[11px] text-[#2E2721]/70">
                Descarga el archivo y reemplázalo en <code className="bg-white px-1.5 py-0.5 border border-[#D9CCB8]">public/config.json</code>.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportConfigJson}
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Descargar config.json con Modificaciones de Inicio
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          CONTENIDO: PESTAÑA CRM PEDIDOS WHATSAPP
          Control de órdenes, estados, clientes y contacto directo
         ======================================================== */}
      {activeTab === 'crm-orders' && (
        <div className="space-y-6 max-w-6xl">
          {/* Header del CRM con métricas */}
          <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <h3 className="font-serif text-lg font-bold text-[#2E2721]">
                    CRM de Pedidos WhatsApp
                  </h3>
                </div>
                <p className="text-xs text-[#2E2721]/70 mt-1">
                  Recepción y seguimiento de órdenes enviadas a WhatsApp desde el checkout de KAS Store.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleCreateSampleOrder}
                  className="px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#E8DEC9] text-[#2E2721] border border-[#D9CCB8] font-semibold rounded-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#B88B4A]" />
                  Crear Pedido de Demostración
                </button>

                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllOrders}
                    className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Limpiar Historial
                  </button>
                )}
              </div>
            </div>

            {/* Tarjetas de Métricas del CRM */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="bg-[#FAF7F2] p-4 border border-[#D9CCB8] rounded-xs">
                <p className="text-[11px] text-[#2E2721]/60 font-semibold uppercase">Total Pedidos</p>
                <p className="font-serif text-2xl font-bold text-[#2E2721] mt-1">{crmMetrics.totalOrders}</p>
                <p className="text-[10px] text-[#2E2721]/50 mt-0.5">Órdenes recibidas</p>
              </div>

              <div className="bg-amber-50 p-4 border border-amber-200 rounded-xs">
                <p className="text-[11px] text-amber-900 font-semibold uppercase">Pendientes</p>
                <p className="font-serif text-2xl font-bold text-amber-700 mt-1">{crmMetrics.pendingOrders}</p>
                <p className="text-[10px] text-amber-800/60 mt-0.5">Por contactar cliente</p>
              </div>

              <div className="bg-blue-50 p-4 border border-blue-200 rounded-xs">
                <p className="text-[11px] text-blue-900 font-semibold uppercase">En Proceso / Enviados</p>
                <p className="font-serif text-2xl font-bold text-blue-700 mt-1">{crmMetrics.inProcessOrders}</p>
                <p className="text-[10px] text-blue-800/60 mt-0.5">En paquetería / ruta</p>
              </div>

              <div className="bg-green-50 p-4 border border-green-200 rounded-xs">
                <p className="text-[11px] text-green-900 font-semibold uppercase">Ventas Totales</p>
                <p className="font-serif text-xl font-bold text-green-700 mt-1 tabular-nums">
                  L {crmMetrics.totalSalesHnl.toFixed(2)}
                </p>
                <p className="text-[10px] text-green-800/60 mt-0.5">{crmMetrics.deliveredOrders} pedidos entregados</p>
              </div>
            </div>
          </div>

          {/* Barra de Filtros y Búsqueda */}
          <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'pendiente', label: 'Pendiente' },
                { id: 'en_proceso', label: 'En Proceso' },
                { id: 'enviado', label: 'Enviado' },
                { id: 'entregado', label: 'Entregado' },
                { id: 'cancelado', label: 'Cancelado' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setOrderFilter(pill.id)}
                  className={`px-3 py-1.5 rounded-xs font-semibold cursor-pointer transition-colors ${
                    orderFilter === pill.id
                      ? 'bg-[#2E2721] text-white'
                      : 'bg-[#FAF7F2] text-[#2E2721]/70 hover:bg-[#E8DEC9]/50 border border-[#D9CCB8]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#2E2721]/40" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Buscar por cliente, orden o teléfono..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#D9CCB8] focus:border-[#B88B4A] focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Listado de Pedidos */}
          {filteredOrders.length === 0 ? (
            <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-12 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-[#D9CCB8] mx-auto" />
              <h4 className="font-serif text-base font-bold text-[#2E2721]">
                No hay pedidos registrados {orderFilter !== 'todos' ? `con estado "${orderFilter}"` : ''}
              </h4>
              <p className="text-xs text-[#2E2721]/60 max-w-md mx-auto">
                Los clientes que finalicen su compra desde el carrito y envíen su orden a WhatsApp aparecerán automáticamente en esta lista.
              </p>
              <button
                type="button"
                onClick={handleCreateSampleOrder}
                className="mt-2 px-4 py-2 bg-[#B88B4A] hover:bg-[#8A622A] text-white text-xs font-semibold rounded-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Generar Pedido de Demostración
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusColors: Record<OrderStatus, { bg: string; text: string; border: string }> = {
                  pendiente: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
                  en_proceso: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300' },
                  enviado: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-300' },
                  entregado: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-300' },
                  cancelado: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300' },
                };
                const st = statusColors[order.status] || statusColors.pendiente;

                return (
                  <div
                    key={order.id}
                    className="bg-[#FFFEFC] border border-[#E8DEC9] p-5 shadow-xs space-y-4 transition-all"
                  >
                    {/* Fila superior: Orden, Fecha y Selector de Estado */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DEC9] pb-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-[#2E2721]">
                          {order.orderNumber}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${st.bg} ${st.text} ${st.border}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-[#2E2721]/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#B88B4A]" />
                          <span>{new Date(order.createdAt).toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {/* Selector de estado interactivo */}
                        <div className="flex items-center gap-1.5 ml-2">
                          <span className="font-medium text-[#2E2721]">Estado:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="p-1 bg-[#FAF7F2] border border-[#D9CCB8] text-[11px] font-semibold text-[#2E2721] rounded-xs cursor-pointer focus:outline-none focus:border-[#B88B4A]"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="en_proceso">En Proceso</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors ml-1 cursor-pointer"
                          title="Eliminar orden"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Detalle del cliente y dirección */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#FAF7F2] p-4 border border-[#E8DEC9]">
                      <div className="space-y-1">
                        <p className="font-bold text-[#2E2721] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#B88B4A]" />
                          {order.customerName}
                        </p>
                        <p className="text-[#2E2721]/70">
                          <span className="font-semibold">Teléfono:</span> {order.customerPhone}
                        </p>
                        {order.customerEmail && (
                          <p className="text-[#2E2721]/70">
                            <span className="font-semibold">Correo:</span> {order.customerEmail}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-[#2E2721]/80">
                          <span className="font-semibold">Destino:</span> {order.municipio}, {order.departamento}
                        </p>
                        <p className="text-[#2E2721]/80">
                          <span className="font-semibold">Dirección:</span> {order.address}
                        </p>
                        {order.deliveryNotes && (
                          <p className="text-[11px] text-[#2E2721]/60 italic">
                            Ref: {order.deliveryNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Prendas compradas */}
                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-[#2E2721] text-[11px] uppercase tracking-wider">
                        Prendas en el Pedido ({order.items.length})
                      </p>
                      <div className="divide-y divide-[#E8DEC9] border border-[#E8DEC9] bg-white">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="p-2.5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-10 h-12 object-cover border border-[#D9CCB8] shrink-0"
                                />
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold text-[#2E2721] truncate">{item.productName}</p>
                                <p className="text-[11px] text-[#2E2721]/60">
                                  Talla: <span className="font-semibold">{item.selectedSize}</span> · Tono: {item.selectedColor} · Cant: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-[#B88B4A] text-xs tabular-nums shrink-0">
                              L {item.totalHnl.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resumen financiero y botón de WhatsApp */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E8DEC9]">
                      <div className="text-xs text-[#2E2721]/70 flex items-center gap-3">
                        <span>Subtotal: L {order.subtotalHnl.toFixed(2)}</span>
                        <span>·</span>
                        <span>Envío: L {order.shippingFeeHnl.toFixed(2)}</span>
                        <span>·</span>
                        <span className="font-bold text-[#2E2721] text-sm">
                          Total: <span className="text-[#B88B4A]">L {order.totalHnl.toFixed(2)}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/504${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `¡Hola ${order.customerName}! Te saludamos de KAS Store respecto a tu pedido ${order.orderNumber}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xs inline-flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Chat con Cliente ({order.customerPhone})
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO: PESTAÑA PARÁMETROS DE TIENDA */}
      {activeTab === 'store-settings' && config && (
        <div className="bg-[#FFFEFC] border border-[#E8DEC9] p-6 shadow-xs max-w-2xl space-y-6 text-xs">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2E2721]">
              Información de la Tienda y Despachos
            </h3>
            <p className="text-[#2E2721]/70">
              Datos oficiales que aparecen en el recibo de WhatsApp y en el encabezado.
            </p>
          </div>

          <div className="space-y-4 bg-[#FAF7F2] p-5 border border-[#E8DEC9]">
            <div>
              <label className="block font-semibold mb-1">Nombre Comercial</label>
              <input
                type="text"
                value={config.store.name}
                onChange={(e) => {
                  const updated = { ...config, store: { ...config.store, name: e.target.value } };
                  setConfig(updated);
                  api.saveConfigLocally(updated);
                }}
                className="w-full p-2 bg-white border border-[#D9CCB8]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Sede Oficial</label>
              <input
                type="text"
                value={config.store.location}
                onChange={(e) => {
                  const updated = { ...config, store: { ...config.store, location: e.target.value } };
                  setConfig(updated);
                  api.saveConfigLocally(updated);
                }}
                className="w-full p-2 bg-white border border-[#D9CCB8]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">WhatsApp para Pedidos</label>
                <input
                  type="text"
                  value={config.store.whatsapp}
                  onChange={(e) => {
                    const updated = { ...config, store: { ...config.store, whatsapp: e.target.value } };
                    setConfig(updated);
                    api.saveConfigLocally(updated);
                  }}
                  className="w-full p-2 bg-white border border-[#D9CCB8]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Monto Mínimo Envío Gratis (HNL)</label>
                <input
                  type="number"
                  value={config.store.freeShippingThresholdHnl}
                  onChange={(e) => {
                    const updated = { ...config, store: { ...config.store, freeShippingThresholdHnl: Number(e.target.value) } };
                    setConfig(updated);
                    api.saveConfigLocally(updated);
                  }}
                  className="w-full p-2 bg-white border border-[#D9CCB8]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Anuncio en Barra Superior</label>
              <input
                type="text"
                value={config.store.announcement}
                onChange={(e) => {
                  const updated = { ...config, store: { ...config.store, announcement: e.target.value } };
                  setConfig(updated);
                  api.saveConfigLocally(updated);
                }}
                className="w-full p-2 bg-white border border-[#D9CCB8]"
              />
            </div>
          </div>

          <button
            onClick={handleExportConfigJson}
            className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold uppercase tracking-wider text-xs rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            Descargar config.json con Nuevos Parámetros
          </button>
        </div>
      )}
    </div>
  );
};
