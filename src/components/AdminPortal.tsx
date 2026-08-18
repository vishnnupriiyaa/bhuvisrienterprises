import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Package, 
  Upload, 
  Truck, 
  Scissors, 
  Plus, 
  Trash2, 
  Edit3, 
  MessageCircle, 
  X, 
  Settings, 
  LogOut,
  Sparkles,
  Search,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product, Order, BespokeRequest, OrderStatus, ProductCategory } from '../types';
import { formatCurrency, generateWhatsAppLink, getOrderWhatsAppText } from '../utils/formatters';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  bespokeRequests: BespokeRequest[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, trackingNumber?: string, courierPartner?: string) => void;
  onUpdateBespokeStatus: (requestId: string, newStatus: BespokeRequest['status']) => void;
  isAdminLoggedIn: boolean;
  onAdminLogin: (pass: string) => boolean;
  onAdminLogout: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  bespokeRequests,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateBespokeStatus,
  isAdminLoggedIn,
  onAdminLogin,
  onAdminLogout,
}) => {
  if (!isOpen) return null;

  // Login form state
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'bespoke' | 'settings'>('overview');

  // Product Manager State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');

  // New Product Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<ProductCategory>('sarees');
  const [subcategory, setSubcategory] = useState('Silk Sarees');
  const [price, setPrice] = useState(14500);
  const [originalPrice, setOriginalPrice] = useState(17000);
  
  // Multi-Image Upload State
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageGallery, setImageGallery] = useState<string[]>([
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
  ]);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fabric, setFabric] = useState('Pure Mulberry Handloom Silk');
  const [color, setColor] = useState('Sand Gold');
  const [colorHex, setColorHex] = useState('#D4AF37');
  const [occasion, setOccasion] = useState('Weddings & Festive');
  const [description, setDescription] = useState('');
  const [availableSizes, setAvailableSizes] = useState('Free Size (6.2m with blouse)');
  const [stockCount, setStockCount] = useState(10);
  const [isCustomizable, setIsCustomizable] = useState(true);

  // Order Search & Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Settings State
  const [whatsappHelpline, setWhatsappHelpline] = useState('+91 98765 43210');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAdminLogin(password);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
    }
  };

  // Multiple File Processing
  const processFiles = (files: FileList | File[]) => {
    const validImageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (validImageFiles.length === 0) return;

    setUploadStatusMsg(`Processing ${validImageFiles.length} photo(s)...`);

    const readPromises = validImageFiles.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises)
      .then(newImages => {
        setImageGallery(prev => [...prev, ...newImages]);
        setUploadStatusMsg(`Successfully added ${newImages.length} image(s).`);
        setTimeout(() => setUploadStatusMsg(null), 3000);
      })
      .catch(() => {
        setUploadStatusMsg('Error reading some images. Please retry.');
        setTimeout(() => setUploadStatusMsg(null), 4000);
      });
  };

  const handleImageFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = ''; // Reset input to allow re-selecting same files
    }
  };

  // Drag and Drop Handlers for Multiple Images
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImages(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImages(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImages(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Bulk URL Adder (handles single URL or comma/newline separated URLs)
  const handleAddImageUrls = () => {
    if (!imageUrlInput.trim()) return;
    
    // Split by newlines, commas, or spaces
    const urls = imageUrlInput
      .split(/[\n,]+/)
      .map(u => u.trim())
      .filter(u => u.length > 0 && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image')));

    if (urls.length > 0) {
      setImageGallery(prev => [...prev, ...urls]);
      setImageUrlInput('');
      setUploadStatusMsg(`Added ${urls.length} image URL(s).`);
      setTimeout(() => setUploadStatusMsg(null), 3000);
    } else {
      setUploadStatusMsg('Please enter valid image URL(s) starting with http:// or https://');
      setTimeout(() => setUploadStatusMsg(null), 4000);
    }
  };

  // Image Reordering & Removal Controls
  const setCoverImage = (index: number) => {
    if (index === 0) return;
    setImageGallery(prev => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= imageGallery.length) return;
    setImageGallery(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const removeImage = (index: number) => {
    setImageGallery(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    if (window.confirm('Clear all uploaded images for this product?')) {
      setImageGallery([]);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sku = editingProduct ? editingProduct.sku : `AL-${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      sku,
      name,
      tagline,
      category,
      subcategory,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images: imageGallery.length > 0 ? imageGallery : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'],
      fabric,
      color,
      colorHex,
      occasion,
      description: description || 'Exquisite handcrafted apparel tailored for the discerning connoisseur.',
      craftDetails: [
        'Pure certified artisanal handloom weave',
        'Custom made-to-measure tailoring available'
      ],
      careInstructions: 'Dry clean only. Store in muslin cloth.',
      availableSizes: availableSizes.split(',').map((s) => s.trim()),
      inStock: stockCount > 0,
      stockCount: Number(stockCount),
      isCustomizable,
      customizationBasePrice: isCustomizable ? 1500 : 0,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      reviews: editingProduct ? editingProduct.reviews : []
    };

    if (editingProduct) {
      onUpdateProduct(productPayload);
    } else {
      onAddProduct(productPayload);
    }

    setShowAddProductModal(false);
    setEditingProduct(null);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setTagline(prod.tagline);
    setCategory(prod.category);
    setSubcategory(prod.subcategory);
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice || prod.price);
    setImageGallery([...prod.images]);
    setImageUrlInput('');
    setFabric(prod.fabric);
    setColor(prod.color);
    setColorHex(prod.colorHex);
    setOccasion(prod.occasion);
    setDescription(prod.description);
    setAvailableSizes(prod.availableSizes.join(', '));
    setStockCount(prod.stockCount);
    setIsCustomizable(prod.isCustomizable);
    setShowAddProductModal(true);
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setName('');
    setTagline('');
    setCategory('sarees');
    setSubcategory('Silk Sarees');
    setPrice(14500);
    setOriginalPrice(17000);
    setImageGallery([
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
    ]);
    setImageUrlInput('');
    setFabric('Pure Mulberry Handloom Silk');
    setColor('Sand Gold');
    setColorHex('#D4AF37');
    setOccasion('Weddings & Festive');
    setDescription('');
    setAvailableSizes('Free Size (6.2m with blouse)');
    setStockCount(10);
    setIsCustomizable(true);
    setShowAddProductModal(true);
  };

  // KPIs
  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);
  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        id="admin-owner-portal"
        className="relative bg-[#F5F2ED] w-full max-w-6xl border border-[#DCD7D0] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#2A2A2A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#404040] text-[#A68A64] flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif italic text-lg text-white">
                  {isAdminLoggedIn ? 'Brand Owner Management' : 'Staff & Owner Sign In'}
                </h1>
                <span className={`px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-widest ${
                  isAdminLoggedIn ? 'bg-[#404040] text-[#A68A64]' : 'bg-[#333333] text-[#8C857D]'
                }`}>
                  {isAdminLoggedIn ? 'Active' : 'Locked'}
                </span>
              </div>
              <p className="text-[10px] text-[#A68A64] uppercase tracking-wider">
                {isAdminLoggedIn ? 'Multi-Image Catalog • Orders • Bespoke Dockets' : 'Secure Passcode Authentication Required'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                onClick={onAdminLogout}
                className="text-xs text-[#DCD7D0] hover:text-white flex items-center gap-1 px-2.5 py-1 bg-[#404040] cursor-pointer"
              >
                <LogOut size={12} />
                <span className="text-[10px] uppercase tracking-wider">Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 text-[#DCD7D0] hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isAdminLoggedIn ? (
          /* Authentication Screen */
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-[#EAE5DF] p-8 border border-[#DCD7D0] text-center space-y-5">
              <div className="w-12 h-12 bg-[#F5F2ED] text-[#2A2A2A] mx-auto flex items-center justify-center border border-[#DCD7D0]">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h2 className="font-serif italic text-2xl text-[#2A2A2A]">Brand Sign In</h2>
                <p className="text-xs text-[#6B655E] mt-1 font-light">
                  Access multi-image product uploader, live orders, and tailoring studio.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6B655E] mb-1 font-bold">Passcode</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="demo: admin123"
                    className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A] focus:outline-none focus:border-[#2A2A2A]"
                  />
                  <span className="text-[10px] text-[#6B655E] mt-1 block">
                    Demo passcode: <strong className="text-[#2A2A2A]">admin123</strong>
                  </span>
                </div>

                {loginError && (
                  <p className="text-xs text-[#2A2A2A] font-bold">Incorrect passcode. Try 'admin123'.</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#2A2A2A] hover:bg-[#404040] text-white text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer"
                >
                  Enter Portal
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="bg-[#EAE5DF] px-6 border-b border-[#DCD7D0] flex items-center space-x-6 text-[10px] font-bold uppercase tracking-[0.2em] overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Sparkles },
                { id: 'products', label: `Catalog (${products.length})`, icon: Package },
                { id: 'orders', label: `Orders (${orders.length})`, icon: Truck },
                { id: 'bespoke', label: `Bespoke (${bespokeRequests.length})`, icon: Scissors },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3.5 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-[#2A2A2A] text-[#2A2A2A]'
                        : 'border-transparent text-[#6B655E] hover:text-[#2A2A2A]'
                    }`}
                  >
                    <Icon size={13} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Tab Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#EAE5DF] p-4 border border-[#DCD7D0]">
                      <span className="text-[10px] uppercase tracking-wider text-[#6B655E] block font-bold">Gross Sales</span>
                      <p className="font-serif italic text-2xl text-[#2A2A2A] mt-1 font-bold">
                        {formatCurrency(totalRevenue, 'INR')}
                      </p>
                      <span className="text-[10px] text-[#6B655E] font-mono">{orders.length} orders total</span>
                    </div>

                    <div className="bg-[#EAE5DF] p-4 border border-[#DCD7D0]">
                      <span className="text-[10px] uppercase tracking-wider text-[#6B655E] block font-bold">Active Pipeline</span>
                      <p className="font-serif italic text-2xl text-[#A68A64] mt-1 font-bold">
                        {activeOrdersCount} Orders
                      </p>
                      <span className="text-[10px] text-[#6B655E]">In crafting & transit</span>
                    </div>

                    <div className="bg-[#EAE5DF] p-4 border border-[#DCD7D0]">
                      <span className="text-[10px] uppercase tracking-wider text-[#6B655E] block font-bold">Bespoke Inquiries</span>
                      <p className="font-serif italic text-2xl text-[#2A2A2A] mt-1 font-bold">
                        {bespokeRequests.length} Dockets
                      </p>
                      <span className="text-[10px] text-[#6B655E]">WhatsApp consults ready</span>
                    </div>

                    <div className="bg-[#EAE5DF] p-4 border border-[#DCD7D0]">
                      <span className="text-[10px] uppercase tracking-wider text-[#6B655E] block font-bold">Active Catalog</span>
                      <p className="font-serif italic text-2xl text-[#2A2A2A] mt-1 font-bold">
                        {products.length} SKUs
                      </p>
                      <span className="text-[10px] text-[#6B655E]">Multi-photo gallery active</span>
                    </div>
                  </div>

                  {/* Recent Orders Snapshot & Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-[#EAE5DF] p-5 border border-[#DCD7D0] space-y-3">
                      <div className="flex justify-between items-center">
                        <h2 className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#2A2A2A]">Recent Orders</h2>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-[10px] uppercase tracking-wider text-[#A68A64] hover:underline font-bold cursor-pointer"
                        >
                          View All →
                        </button>
                      </div>

                      <div className="space-y-2">
                        {orders.slice(0, 3).map((ord) => (
                          <div key={ord.id} className="p-3 bg-[#F5F2ED] border border-[#DCD7D0] flex items-center justify-between text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#2A2A2A]">#{ord.orderNumber}</span>
                                <span className="text-[#6B655E]">• {ord.customer.name}</span>
                              </div>
                              <p className="text-[10px] text-[#6B655E] uppercase tracking-wider">{ord.items.length} item(s) • {ord.paymentMethod.toUpperCase()}</p>
                            </div>

                            <div className="text-right">
                              <span className="font-bold text-[#2A2A2A] block">{formatCurrency(ord.totalAmount, 'INR')}</span>
                              <span className="text-[9px] px-2 py-0.5 bg-[#2A2A2A] text-white uppercase font-bold">
                                {ord.orderStatus}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-[#EAE5DF] p-5 border border-[#DCD7D0] space-y-3">
                      <h2 className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#2A2A2A]">Quick Actions</h2>
                      
                      <button
                        onClick={openNewProductModal}
                        className="w-full py-2.5 px-4 bg-[#2A2A2A] hover:bg-[#404040] text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>Upload Product Photos</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('bespoke')}
                        className="w-full py-2.5 px-4 bg-[#F5F2ED] border border-[#DCD7D0] text-[#2A2A2A] text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer hover:border-[#2A2A2A]"
                      >
                        <Scissors size={13} />
                        <span>Review Bespoke References</span>
                      </button>

                      <div className="p-3 bg-[#F5F2ED] border border-[#DCD7D0] text-[10px] text-[#2A2A2A] flex items-center gap-2">
                        <MessageCircle size={14} className="text-[#25D366]" />
                        <span>WhatsApp helpline: <strong>{whatsappHelpline}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS MANAGER & MULTI-IMAGE UPLOADER */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search size={13} className="absolute left-3 top-2.5 text-[#6B655E]" />
                      <input
                        type="text"
                        placeholder="Search products by title, fabric, or SKU..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full bg-[#EAE5DF] border border-[#DCD7D0] pl-8 pr-3 py-1.5 text-xs text-[#2A2A2A] focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={openNewProductModal}
                      className="px-4 py-2 bg-[#2A2A2A] text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 cursor-pointer hover:bg-[#404040]"
                    >
                      <Plus size={13} />
                      <span>Upload New Product</span>
                    </button>
                  </div>

                  {/* Products Table */}
                  <div className="bg-[#EAE5DF] border border-[#DCD7D0] overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#DCD7D0] text-[#2A2A2A] uppercase tracking-[0.2em] text-[9px] font-bold border-b border-[#DCD7D0]">
                        <tr>
                          <th className="p-3">Product & Gallery</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Bespoke Fit</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCD7D0]">
                        {products
                          .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase()))
                          .map((prod) => (
                            <tr key={prod.id} className="hover:bg-[#F5F2ED] transition-colors">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <img
                                      src={prod.images[0]}
                                      alt={prod.name}
                                      className="w-12 h-14 object-cover border border-[#DCD7D0]"
                                    />
                                    {prod.images.length > 1 && (
                                      <span className="absolute -bottom-1 -right-1 px-1 bg-[#2A2A2A] text-white text-[8px] font-mono font-bold">
                                        +{prod.images.length - 1}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-bold text-[#2A2A2A] block">{prod.name}</span>
                                    <span className="text-[10px] text-[#6B655E] font-mono">
                                      {prod.sku} • {prod.fabric} • {prod.images.length} photo{prod.images.length > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 uppercase text-[10px] font-medium text-[#6B655E]">{prod.category}</td>
                              <td className="p-3 font-bold text-[#2A2A2A]">₹{prod.price.toLocaleString('en-IN')}</td>
                              <td className="p-3">
                                {prod.isCustomizable ? (
                                  <span className="px-2 py-0.5 bg-[#2A2A2A] text-white text-[9px] font-bold uppercase tracking-wider">
                                    Enabled
                                  </span>
                                ) : (
                                  <span className="text-[#6B655E] text-[10px]">Standard</span>
                                )}
                              </td>
                              <td className="p-3">
                                <span className={`font-mono text-xs ${prod.stockCount > 0 ? 'text-[#2A2A2A]' : 'text-[#6B655E]'}`}>
                                  {prod.stockCount} in stock
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => openEditModal(prod)}
                                    className="p-1.5 text-[#2A2A2A] hover:bg-[#DCD7D0] cursor-pointer"
                                    title="Edit Product & Photos"
                                  >
                                    <Edit3 size={13} />
                                  </button>
                                  <button
                                    onClick={() => onDeleteProduct(prod.id)}
                                    className="p-1.5 text-[#6B655E] hover:text-[#2A2A2A] cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: ORDER FULFILLMENT & WHATSAPP TRACKING */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#6B655E]">Filter:</span>
                      {['All', 'Order Placed', 'Crafting & Stitching', 'Dispatched', 'Delivered'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setOrderStatusFilter(st)}
                          className={`text-[10px] uppercase tracking-wider px-3 py-1 border transition-all cursor-pointer ${
                            orderStatusFilter === st
                              ? 'bg-[#2A2A2A] text-white border-[#2A2A2A] font-bold'
                              : 'bg-[#EAE5DF] text-[#2A2A2A] border-[#DCD7D0]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-[#EAE5DF] border border-[#DCD7D0] overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#DCD7D0] text-[#2A2A2A] uppercase tracking-[0.2em] text-[9px] font-bold border-b border-[#DCD7D0]">
                        <tr>
                          <th className="p-3">Order Ref</th>
                          <th className="p-3">Client</th>
                          <th className="p-3">Items & Tailoring</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Status Pipeline</th>
                          <th className="p-3 text-right">WhatsApp Update</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCD7D0]">
                        {orders
                          .filter((o) => orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter)
                          .map((ord) => (
                            <tr key={ord.id} className="hover:bg-[#F5F2ED] transition-colors">
                              <td className="p-3">
                                <strong className="font-mono text-[#2A2A2A] block">#{ord.orderNumber}</strong>
                                <span className="text-[10px] text-[#6B655E]">{ord.date}</span>
                              </td>
                              <td className="p-3">
                                <span className="font-medium text-[#2A2A2A] block">{ord.customer.name}</span>
                                <span className="text-[10px] text-[#6B655E] font-mono">{ord.customer.phone}</span>
                              </td>
                              <td className="p-3">
                                <div className="space-y-1">
                                  {ord.items.map((it, i) => (
                                    <div key={i} className="text-[11px]">
                                      <span>{it.product.name} (x{it.quantity})</span>
                                      {it.isCustomized && (
                                        <span className="block text-[10px] text-[#A68A64] font-bold">
                                          ↳ Bespoke: {it.customization?.blouseStyle || 'Tailored'}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="p-3">
                                <strong className="text-[#2A2A2A] block font-mono">₹{ord.totalAmount.toLocaleString('en-IN')}</strong>
                                <span className="text-[10px] text-[#6B655E] uppercase">{ord.paymentStatus} ({ord.paymentMethod.toUpperCase()})</span>
                              </td>
                              <td className="p-3">
                                <select
                                  value={ord.orderStatus}
                                  onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                                  className="bg-[#F5F2ED] border border-[#DCD7D0] px-2 py-1 text-xs text-[#2A2A2A]"
                                >
                                  <option value="Order Placed">Order Placed</option>
                                  <option value="Crafting & Stitching">Crafting & Stitching</option>
                                  <option value="Quality Inspection">Quality Inspection</option>
                                  <option value="Dispatched">Dispatched</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => {
                                    const msg = getOrderWhatsAppText(ord.orderNumber, ord.customer.name, ord.orderStatus);
                                    const link = generateWhatsAppLink(ord.customer.phone, msg);
                                    window.open(link, '_blank');
                                  }}
                                  className="p-1.5 bg-[#25D366] text-white cursor-pointer inline-flex items-center gap-1 text-[10px] uppercase font-bold"
                                  title="Send WhatsApp Update"
                                >
                                  <MessageCircle size={13} />
                                  <span>Notify</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: BESPOKE REQUESTS WITH CUSTOM PHOTO REFERENCES */}
              {activeTab === 'bespoke' && (
                <div className="space-y-4">
                  <div className="bg-[#EAE5DF] border border-[#DCD7D0] p-4">
                    <h2 className="font-bold text-[10px] uppercase tracking-[0.25em] text-[#2A2A2A] mb-3">Custom Made-to-Measure Dockets</h2>
                    
                    <div className="space-y-3">
                      {bespokeRequests.map((req) => (
                        <div key={req.id} className="p-4 bg-[#F5F2ED] border border-[#DCD7D0] space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#2A2A2A]">{req.customerName}</span>
                                <span className="font-mono text-xs text-[#6B655E]">({req.requestNumber})</span>
                              </div>
                              <p className="text-xs text-[#6B655E]">{req.phone} • {req.email}</p>
                            </div>

                            <select
                              value={req.status}
                              onChange={(e) => onUpdateBespokeStatus(req.id, e.target.value as any)}
                              className="bg-[#EAE5DF] border border-[#DCD7D0] px-2.5 py-1 text-xs text-[#2A2A2A]"
                            >
                              <option value="New Request">New Request</option>
                              <option value="Consultation Scheduled">Consultation Scheduled</option>
                              <option value="Design Drafted">Design Drafted</option>
                              <option value="In Production">In Production</option>
                              <option value="Ready for Dispatch">Ready for Dispatch</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#EAE5DF] p-3 border border-[#DCD7D0]">
                            <div>
                              <span className="text-[#6B655E] block text-[10px] uppercase">Garment:</span>
                              <strong>{req.category}</strong>
                            </div>
                            <div>
                              <span className="text-[#6B655E] block text-[10px] uppercase">Date & Budget:</span>
                              <strong>{req.targetDate} ({req.budgetRange})</strong>
                            </div>
                            <div>
                              <span className="text-[#6B655E] block text-[10px] uppercase">Measurements:</span>
                              <strong>Bust {req.measurements?.bust || '-'}, Waist {req.measurements?.waist || '-'}</strong>
                            </div>
                          </div>

                          {/* Client Uploaded Reference Photos */}
                          {req.referenceImages && req.referenceImages.length > 0 && (
                            <div className="bg-[#EAE5DF] p-3 border border-[#DCD7D0] space-y-2">
                              <span className="block text-[10px] uppercase font-bold text-[#6B655E] tracking-wider">
                                Client Reference & Inspiration Photos ({req.referenceImages.length})
                              </span>
                              <div className="flex gap-2 flex-wrap">
                                {req.referenceImages.map((refImg, rIdx) => (
                                  <a 
                                    key={rIdx} 
                                    href={refImg} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="relative w-16 h-20 border border-[#DCD7D0] overflow-hidden hover:opacity-80 transition-opacity cursor-zoom-in"
                                  >
                                    <img src={refImg} alt={`Reference ${rIdx + 1}`} className="w-full h-full object-cover" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {req.description && (
                            <p className="text-xs text-[#2A2A2A] bg-[#EAE5DF] p-2.5 border border-[#DCD7D0]">
                              <strong>Client Notes:</strong> {req.description}
                            </p>
                          )}

                          <div className="flex justify-between items-center pt-2">
                            <span className="text-[10px] text-[#6B655E]">Logged: {req.createdAt}</span>

                            <button
                              onClick={() => {
                                const msg = `Hello ${req.customerName}! 🌸\nThis is the Master Designer from Aura & Loom regarding your Bespoke Custom Request (#${req.requestNumber} - ${req.category}).\nWe have reviewed your references and would love to schedule a video drape call.`;
                                const link = generateWhatsAppLink(req.phone, msg);
                                window.open(link, '_blank');
                              }}
                              className="px-3.5 py-1.5 bg-[#25D366] text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 cursor-pointer"
                            >
                              <MessageCircle size={13} />
                              <span>WhatsApp Drape Consult</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="max-w-xl space-y-6 text-xs">
                  <div className="bg-[#EAE5DF] p-5 border border-[#DCD7D0] space-y-3">
                    <h2 className="font-bold text-[10px] uppercase tracking-[0.25em] text-[#2A2A2A]">WhatsApp Integration</h2>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#6B655E] mb-1 font-bold">Store Support Number</label>
                      <input
                        type="text"
                        value={whatsappHelpline}
                        onChange={(e) => setWhatsappHelpline(e.target.value)}
                        className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                      />
                      <p className="text-[10px] text-[#6B655E] mt-1">
                        All product inquiries, custom tailoring consultations, and order updates redirect to this number.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#EAE5DF] p-5 border border-[#DCD7D0] space-y-3">
                    <h2 className="font-bold text-[10px] uppercase tracking-[0.25em] text-[#2A2A2A]">Payment Gateways</h2>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2.5 bg-[#F5F2ED] border border-[#DCD7D0]">
                        <span className="font-medium text-[#2A2A2A]">UPI & QR Codes (GPay, PhonePe)</span>
                        <span className="px-2 py-0.5 bg-[#2A2A2A] text-white text-[9px] font-bold uppercase tracking-wider">Active</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-[#F5F2ED] border border-[#DCD7D0]">
                        <span className="font-medium text-[#2A2A2A]">Credit & Debit Cards (3D Secure)</span>
                        <span className="px-2 py-0.5 bg-[#2A2A2A] text-white text-[9px] font-bold uppercase tracking-wider">Active</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-[#F5F2ED] border border-[#DCD7D0]">
                        <span className="font-medium text-[#2A2A2A]">Cash on Delivery</span>
                        <span className="px-2 py-0.5 bg-[#2A2A2A] text-white text-[9px] font-bold uppercase tracking-wider">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Upload / Edit Product Modal with Multi-Image Capabilities */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-60 overflow-y-auto bg-black/70 flex items-center justify-center p-4">
            <div className="bg-[#F5F2ED] w-full max-w-3xl border border-[#DCD7D0] shadow-2xl p-6 space-y-5 max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-[#DCD7D0]">
                <div>
                  <h2 className="font-serif italic text-2xl text-[#2A2A2A]">
                    {editingProduct ? 'Edit Product & Gallery' : 'Upload New Product'}
                  </h2>
                  <p className="text-[10px] text-[#6B655E] uppercase tracking-wider">
                    Add multi-angle photos, saree pallu close-ups, and fabric details
                  </p>
                </div>
                <button onClick={() => setShowAddProductModal(false)} className="p-1 text-[#2A2A2A] hover:opacity-60 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                {/* Product Name & Tagline */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amber Kanjeevaram Handloom Silk Saree"
                    className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Pure mulberry silk with antique gold zari border"
                    className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                  />
                </div>

                {/* Category & Subcategory */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProductCategory)}
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2 text-xs"
                    >
                      <option value="sarees">Sarees</option>
                      <option value="ethnic">Ethnic Wear</option>
                      <option value="western">Western Wear</option>
                      <option value="accessories">Accessories</option>
                      <option value="custom">Custom Studio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Subcategory</label>
                    <input
                      type="text"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      placeholder="e.g. Silk Sarees / Anarkalis"
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2 text-xs"
                    />
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Inventory (Units)</label>
                    <input
                      type="number"
                      value={stockCount}
                      onChange={(e) => setStockCount(Number(e.target.value))}
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* MULTI-IMAGE UPLOAD SUITE */}
                <div className="bg-[#EAE5DF] p-4 border border-[#DCD7D0] space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ImageIcon size={16} className="text-[#2A2A2A]" />
                      <label className="text-[10px] uppercase tracking-wider font-bold text-[#2A2A2A]">
                        Product Image Gallery ({imageGallery.length} photo{imageGallery.length === 1 ? '' : 's'})
                      </label>
                    </div>

                    {imageGallery.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAllImages}
                        className="text-[9px] uppercase tracking-wider text-[#6B655E] hover:text-[#2A2A2A] font-bold cursor-pointer"
                      >
                        Clear All Photos
                      </button>
                    )}
                  </div>

                  {/* Drag & Drop Multi-Image Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed p-5 text-center cursor-pointer transition-all ${
                      isDraggingImages 
                        ? 'border-[#2A2A2A] bg-[#DCD7D0]' 
                        : 'border-[#DCD7D0] bg-[#F5F2ED] hover:border-[#2A2A2A]'
                    }`}
                  >
                    <Upload size={22} className="mx-auto text-[#2A2A2A] mb-1.5" />
                    <p className="font-bold text-xs text-[#2A2A2A]">
                      Drag & drop multiple product photos here
                    </p>
                    <p className="text-[10px] text-[#6B655E] mt-0.5">
                      or click to browse your computer (select multiple files: JPEG, PNG, WEBP)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageFileInput}
                      className="hidden"
                    />
                  </div>

                  {/* Bulk / Single URL Input */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#6B655E] mb-1 font-bold">
                      Or Add by URL(s) (Paste single or multiple comma/newline separated URLs):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://example.com/saree1.jpg, https://example.com/saree2.jpg"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="flex-1 bg-[#F5F2ED] border border-[#DCD7D0] p-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrls}
                        className="px-4 bg-[#2A2A2A] text-white text-[10px] uppercase tracking-wider font-bold hover:bg-[#404040] cursor-pointer whitespace-nowrap"
                      >
                        Add URL(s)
                      </button>
                    </div>
                  </div>

                  {/* Feedback Status Message */}
                  {uploadStatusMsg && (
                    <div className="p-2 bg-[#F5F2ED] border border-[#2A2A2A] text-xs text-[#2A2A2A] flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-[#2A2A2A]" />
                      <span>{uploadStatusMsg}</span>
                    </div>
                  )}

                  {/* Multi-Image Preview & Management Grid */}
                  {imageGallery.length > 0 ? (
                    <div className="pt-2 space-y-2">
                      <span className="block text-[9px] uppercase tracking-wider text-[#6B655E] font-bold">
                        Attached Images (First photo is Primary Cover):
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {imageGallery.map((img, idx) => (
                          <div 
                            key={idx} 
                            className={`relative bg-[#F5F2ED] border ${
                              idx === 0 ? 'border-[#2A2A2A] ring-1 ring-[#2A2A2A]' : 'border-[#DCD7D0]'
                            } p-1 group`}
                          >
                            <div className="w-full h-28 overflow-hidden relative">
                              <img 
                                src={img} 
                                alt={`Product view ${idx + 1}`} 
                                className="w-full h-full object-cover" 
                              />

                              {idx === 0 && (
                                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#2A2A2A] text-white text-[8px] uppercase font-bold tracking-wider flex items-center gap-0.5">
                                  <Star size={8} className="fill-white" />
                                  <span>Cover</span>
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-black/80 hover:bg-black text-white p-1 transition-colors cursor-pointer"
                                title="Remove photo"
                              >
                                <X size={11} />
                              </button>
                            </div>

                            {/* Image Controls: Reorder & Set as Cover */}
                            <div className="mt-1 flex items-center justify-between text-[9px] pt-1 border-t border-[#DCD7D0]">
                              {idx !== 0 ? (
                                <button
                                  type="button"
                                  onClick={() => setCoverImage(idx)}
                                  className="text-[#A68A64] hover:underline font-bold uppercase cursor-pointer"
                                >
                                  Set Cover
                                </button>
                              ) : (
                                <span className="text-[#6B655E] text-[8px] uppercase">Primary</span>
                              )}

                              <div className="flex items-center gap-1">
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => moveImage(idx, 'left')}
                                    className="p-0.5 hover:bg-[#DCD7D0] cursor-pointer"
                                    title="Move left"
                                  >
                                    <ArrowLeft size={10} />
                                  </button>
                                )}
                                {idx < imageGallery.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => moveImage(idx, 'right')}
                                    className="p-0.5 hover:bg-[#DCD7D0] cursor-pointer"
                                    title="Move right"
                                  >
                                    <ArrowRight size={10} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#F5F2ED] border border-[#DCD7D0] text-center text-[#6B655E] text-[10px]">
                      No photos attached. Upload at least 1 image for the product cover.
                    </div>
                  )}
                </div>

                {/* Fabric & Color */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Fabric & Weave</label>
                    <input
                      type="text"
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      placeholder="e.g. Pure Mulberry Handloom Silk"
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Color Name</label>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="e.g. Sand Gold / Royal Ruby"
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2 text-xs"
                    />
                  </div>
                </div>

                {/* Available Sizes & Occasion */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Available Sizes (comma separated)</label>
                    <input
                      type="text"
                      value={availableSizes}
                      onChange={(e) => setAvailableSizes(e.target.value)}
                      placeholder="Free Size (6.2m), XS, S, M, L, XL"
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Occasion / Festive</label>
                    <input
                      type="text"
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      placeholder="e.g. Weddings, Sangeet, Festive"
                      className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2 text-xs"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Artisanal details, drape feel, blouse piece inclusion..."
                    className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-2.5 text-xs text-[#2A2A2A]"
                  />
                </div>

                {/* Bespoke Tailoring Toggle */}
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCustomizable}
                      onChange={(e) => setIsCustomizable(e.target.checked)}
                    />
                    <span className="font-bold text-[10px] uppercase tracking-wider text-[#2A2A2A]">Enable Bespoke Tailoring Option</span>
                  </label>
                </div>

                {/* Save Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-[#DCD7D0]">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 border border-[#DCD7D0] text-[10px] uppercase tracking-wider font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#2A2A2A] hover:bg-[#404040] text-white text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer"
                  >
                    Save Product ({imageGallery.length} photo{imageGallery.length === 1 ? '' : 's'})
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
