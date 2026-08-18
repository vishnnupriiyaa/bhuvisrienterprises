import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CustomStudio } from './components/CustomStudio';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPortal } from './components/AdminPortal';
import { UserAccountModal } from './components/UserAccountModal';
import { OrderTrackLookup } from './components/OrderTrackLookup';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { Footer } from './components/Footer';

import { 
  Product, 
  CartItem, 
  Order, 
  BespokeRequest, 
  UserProfile, 
  ProductCategory, 
  CustomizationDetails, 
  OrderStatus 
} from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_BESPOKE_REQUESTS } from './data/initialProducts';
import { generateWhatsAppLink } from './utils/formatters';

export default function App() {
  // 1. Persistent Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aura_loom_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 2. Persistent Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('aura_loom_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // 3. Persistent Bespoke Custom Tailoring Requests
  const [bespokeRequests, setBespokeRequests] = useState<BespokeRequest[]>(() => {
    try {
      const saved = localStorage.getItem('aura_loom_bespoke_requests');
      return saved ? JSON.parse(saved) : INITIAL_BESPOKE_REQUESTS;
    } catch {
      return INITIAL_BESPOKE_REQUESTS;
    }
  });

  // 4. Persistent Shopping Bag
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_loom_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Persistent Wishlist
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aura_loom_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. User Profile & Admin Auth
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('aura_loom_user');
      return saved ? JSON.parse(saved) : {
        id: 'usr-priya',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 98765 43210',
        role: 'customer',
      };
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('aura_loom_admin_active') === 'true';
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('aura_loom_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('aura_loom_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aura_loom_bespoke_requests', JSON.stringify(bespokeRequests));
  }, [bespokeRequests]);

  useEffect(() => {
    localStorage.setItem('aura_loom_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_loom_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aura_loom_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aura_loom_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aura_loom_admin_active', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  // Currency State
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Navigation & Filtering State
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all' | 'custom_studio'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [fabricFilter, setFabricFilter] = useState('All Fabrics');

  // Coupons
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Modals / Drawers State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCustomStudioOpen, setIsCustomStudioOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isUserAccountOpen, setIsUserAccountOpen] = useState(false);
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState(false);

  // Wishlist handler
  const handleToggleWishlist = (prod: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === prod.id);
      if (exists) {
        return prev.filter((p) => p.id !== prod.id);
      } else {
        return [...prev, prod];
      }
    });
  };

  // Add to Bag Handlers
  const handleAddToCartSimple = (prod: Product) => {
    handleAddToCartDetailed(prod, prod.availableSizes[0] || 'Free Size', false);
  };

  const handleAddToCartDetailed = (
    prod: Product,
    size: string,
    isCustomized: boolean,
    customization?: CustomizationDetails,
    customizationFee: number = 0
  ) => {
    const itemTotal = (prod.price + customizationFee);
    const cartItemId = `${prod.id}-${size}-${isCustomized ? JSON.stringify(customization) : 'std'}`;

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + 1;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          itemTotal: (prod.price + customizationFee) * newQty
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: prod.id,
          product: prod,
          selectedSize: size,
          selectedColor: prod.color,
          quantity: 1,
          isCustomized,
          customization,
          customizationFee,
          itemTotal
        };
        return [...prev, newItem];
      }
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const unitPrice = item.product.price + item.customizationFee;
          return {
            ...item,
            quantity: newQty,
            itemTotal: unitPrice * newQty
          };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  // Coupon Logic
  const handleApplyCoupon = (code: string) => {
    const subtotal = cart.reduce((acc, i) => acc + i.itemTotal, 0);
    if (code === 'AURA10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setCouponCode(code);
      return { success: true, message: `✨ Coupon AURA10 applied! 10% discount (-₹${disc.toLocaleString('en-IN')})` };
    } else if (code === 'FIRSTFASHION') {
      const disc = 1500;
      setDiscountAmount(disc);
      setCouponCode(code);
      return { success: true, message: `✨ Coupon FIRSTFASHION applied! (-₹1,500 off)` };
    } else if (code === 'BESPOKE500') {
      const disc = 500;
      setDiscountAmount(disc);
      setCouponCode(code);
      return { success: true, message: `✨ Coupon BESPOKE500 applied! (-₹500 off)` };
    }
    return { success: false, message: 'Invalid coupon code. Try AURA10 or FIRSTFASHION.' };
  };

  // Order Placement
  const handleOrderPlaced = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setDiscountAmount(0);
    setCouponCode('');
  };

  // Bespoke submission
  const handleSubmitBespoke = (request: BespokeRequest) => {
    setBespokeRequests((prev) => [request, ...prev]);
  };

  // Product Add / Update / Delete (Brand Owner)
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
  };

  const handleDeleteProduct = (prodId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
  };

  // Order status update (Brand Owner)
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, trackingNumber?: string, courierPartner?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedTimeline = o.timeline.map((step) => {
            if (step.status === newStatus) {
              return { ...step, completed: true, timestamp: 'Updated by Atelier' };
            }
            return step;
          });
          return {
            ...o,
            orderStatus: newStatus,
            trackingNumber: trackingNumber || o.trackingNumber,
            courierPartner: courierPartner || o.courierPartner,
            timeline: updatedTimeline
          };
        }
        return o;
      })
    );
  };

  const handleUpdateBespokeStatus = (requestId: string, newStatus: BespokeRequest['status']) => {
    setBespokeRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );
  };

  // Admin login
  const handleAdminLogin = (pass: string) => {
    if (pass === 'admin123' || pass === 'owner' || pass === 'admin') {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  // Review submission
  const handleAddReview = (productId: string, reviewData: any) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newRev = {
            id: `rev-${Date.now()}`,
            ...reviewData,
            date: 'Just now',
            verified: true
          };
          const updatedReviews = [newRev, ...p.reviews];
          const newRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            rating: Number(newRating.toFixed(1)),
            reviewCount: updatedReviews.length
          };
        }
        return p;
      })
    );
  };

  // Filtering products
  const filteredProducts = products.filter((p) => {
    // Category
    if (activeCategory !== 'all' && activeCategory !== 'custom_studio' && p.category !== activeCategory) {
      return false;
    }
    // Subcategory
    if (selectedSubcategory && !selectedSubcategory.startsWith('All') && p.subcategory !== selectedSubcategory) {
      return false;
    }
    // Customizable only
    if (onlyCustomizable && !p.isCustomizable) {
      return false;
    }
    // Fabric
    if (fabricFilter && fabricFilter !== 'All Fabrics') {
      if (!p.fabric.toLowerCase().includes(fabricFilter.toLowerCase())) {
        return false;
      }
    }
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    return 0; // featured
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2824]">
      
      {/* Navigation Header */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          if (cat === 'custom_studio') {
            setIsCustomStudioOpen(true);
          } else {
            setActiveCategory(cat);
            setSelectedSubcategory('All Items');
          }
        }}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsUserAccountOpen(true)}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        onOpenUserAccount={() => setIsUserAccountOpen(true)}
        onOpenOrderLookup={() => setIsOrderLookupOpen(true)}
        onOpenCustomStudio={() => setIsCustomStudioOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currency={currency}
        onToggleCurrency={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
        currentUser={currentUser}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        
        {/* Editorial Hero Banner */}
        <HeroBanner
          onSelectCategory={(cat) => {
            if (cat === 'custom_studio') {
              setIsCustomStudioOpen(true);
            } else {
              setActiveCategory(cat);
              setSelectedSubcategory('All Items');
              const el = document.getElementById('catalog-products-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onOpenCustomStudio={() => setIsCustomStudioOpen(true)}
          onOpenWhatsApp={() => {
            const link = generateWhatsAppLink('919876543210', 'Namaste Aura & Loom! ✨ I would like assistance with saree draping & custom sizing.');
            window.open(link, '_blank');
          }}
        />

        {/* Category & Filters Section */}
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            if (cat === 'custom_studio') {
              setIsCustomStudioOpen(true);
            } else {
              setActiveCategory(cat);
              setSelectedSubcategory('All Items');
            }
          }}
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={setSelectedSubcategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onlyCustomizable={onlyCustomizable}
          onToggleOnlyCustomizable={() => setOnlyCustomizable(!onlyCustomizable)}
          fabricFilter={fabricFilter}
          onFabricFilterChange={setFabricFilter}
          productCount={filteredProducts.length}
        />

        {/* Products Grid Section */}
        <section id="catalog-products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          
          {searchQuery && (
            <div className="mb-6 flex items-center justify-between bg-[#EAE5DF] p-3 border border-[#DCD7D0] text-xs">
              <span className="text-[#2A2A2A]">Showing search results for: <strong>"{searchQuery}"</strong></span>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[#A68A64] hover:underline uppercase tracking-wider font-bold text-[10px] cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#EAE5DF] border border-[#DCD7D0] space-y-4">
              <p className="font-serif italic text-2xl text-[#2A2A2A]">No items found.</p>
              <p className="text-xs text-[#6B655E] max-w-sm mx-auto font-light">
                We couldn't find matching items with current filters. Try resetting the filters or enquire directly on WhatsApp.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSelectedSubcategory('All Items');
                  setOnlyCustomizable(false);
                  setFabricFilter('All Fabrics');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 bg-[#2A2A2A] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#404040] cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  currency={currency}
                  isWishlisted={wishlist.some((w) => w.id === prod.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={(p) => {
                    setSelectedProduct(p);
                    setIsProductModalOpen(true);
                  }}
                  onAddToCart={handleAddToCartSimple}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <Footer
        onOpenOrderLookup={() => setIsOrderLookupOpen(true)}
        onOpenCustomStudio={() => setIsCustomStudioOpen(true)}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
      />

      {/* Floating WhatsApp Concierge Widget */}
      <WhatsAppWidget
        onOpenCustomStudio={() => setIsCustomStudioOpen(true)}
        onOpenOrderLookup={() => setIsOrderLookupOpen(true)}
      />

      {/* Modals & Slide-Overs */}

      {/* 1. Product Details & Custom Tailoring Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        currency={currency}
        isWishlisted={selectedProduct ? wishlist.some((w) => w.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCartDetailed}
        onAddReview={handleAddReview}
      />

      {/* 2. Bespoke Custom Tailoring Atelier Studio */}
      <CustomStudio
        isOpen={isCustomStudioOpen}
        onClose={() => setIsCustomStudioOpen(false)}
        onSubmitBespoke={handleSubmitBespoke}
      />

      {/* 3. Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
        couponCode={couponCode}
        onApplyCoupon={handleApplyCoupon}
        discount={discountAmount}
      />

      {/* 4. Secure Checkout & Payment Gateway */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        discount={discountAmount}
        couponCode={couponCode}
        onOrderPlaced={handleOrderPlaced}
        initialCustomer={currentUser ? {
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone
        } : undefined}
      />

      {/* 5. Brand Owner / Admin Portal */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        products={products}
        orders={orders}
        bespokeRequests={bespokeRequests}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateBespokeStatus={handleUpdateBespokeStatus}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
      />

      {/* 6. Customer Account & Order History Modal */}
      <UserAccountModal
        isOpen={isUserAccountOpen}
        onClose={() => setIsUserAccountOpen(false)}
        currentUser={currentUser}
        onLogin={(usr) => setCurrentUser(usr)}
        onLogout={() => setCurrentUser(null)}
        orders={orders}
        wishlist={wishlist}
        bespokeRequests={bespokeRequests}
        currency={currency}
        onOpenProduct={(p) => {
          setSelectedProduct(p);
          setIsProductModalOpen(true);
        }}
      />

      {/* 7. Public Order Tracking Lookup Modal */}
      <OrderTrackLookup
        isOpen={isOrderLookupOpen}
        onClose={() => setIsOrderLookupOpen(false)}
        orders={orders}
        currency={currency}
      />

    </div>
  );
}
