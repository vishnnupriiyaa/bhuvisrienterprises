import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  MessageCircle, 
  Sparkles, 
  Scissors, 
  ShieldCheck, 
  Truck, 
  Check, 
  Ruler
} from 'lucide-react';
import { Product, CustomizationDetails, Review } from '../types';
import { formatCurrency, generateWhatsAppLink, getProductWhatsAppText } from '../utils/formatters';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currency: 'INR' | 'USD';
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (
    product: Product, 
    selectedSize: string, 
    isCustomized: boolean, 
    customization?: CustomizationDetails,
    customizationFee?: number
  ) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date' | 'verified'>) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onAddReview
}) => {
  if (!isOpen || !product) return null;

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes[0] || 'Free Size');
  const [isCustomFitting, setIsCustomFitting] = useState(false);
  
  // Customization Options State
  const [blouseStyle, setBlouseStyle] = useState('Sweetheart Neck');
  const [sleeveLength, setSleeveLength] = useState('Elbow Sleeve (10.5 in)');
  const [neckline, setNeckline] = useState('Sweetheart');
  const [fallAndPico, setFallAndPico] = useState(true);
  const [petticoatAdded, setPetticoatAdded] = useState(false);
  const [monogramText, setMonogramText] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState<'inches' | 'cm'>('inches');
  const [measurements, setMeasurements] = useState({
    bust: 36,
    waist: 30,
    hips: 38,
    shoulder: 14.5,
    blouseLength: 14,
    sleeveLength: 10.5,
  });
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showMeasureGuide, setShowMeasureGuide] = useState(false);

  // Delivery check state
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'details' | 'customization' | 'reviews'>('details');
  const [addedNotice, setAddedNotice] = useState(false);

  // Calculate customization extra fee
  let customizationFee = 0;
  if (isCustomFitting && product.isCustomizable) {
    customizationFee += (product.customizationBasePrice || 1500);
    if (petticoatAdded) customizationFee += 600;
    if (monogramText.trim()) customizationFee += 350;
  }

  const finalPrice = product.price + customizationFee;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) {
      setDeliveryStatus('Please enter a valid 6-digit pincode');
      return;
    }
    const days = isCustomFitting ? '6-8 business days (includes bespoke tailoring)' : '3-4 business days';
    setDeliveryStatus(`Express delivery available to ${pincode} in ${days}. Free shipping applied.`);
  };

  const handleAddToCart = () => {
    const customDetails: CustomizationDetails | undefined = isCustomFitting ? {
      blouseStyle,
      sleeveLength,
      neckline,
      fallAndPico,
      petticoatAdded,
      monogramText: monogramText.trim() || undefined,
      customMeasurements: {
        ...measurements,
        unit: measurementUnit,
      },
      additionalNotes: additionalNotes.trim() || undefined
    } : undefined;

    onAddToCart(
      product,
      isCustomFitting ? 'Custom Made-to-Measure' : selectedSize,
      isCustomFitting,
      customDetails,
      customizationFee
    );

    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 1200);
  };

  const handleWhatsAppConsultation = () => {
    const customNote = isCustomFitting 
      ? `\nI want custom tailoring with: ${blouseStyle}, ${sleeveLength}. Measurements: Bust ${measurements.bust}", Waist ${measurements.waist}".`
      : '';
    const msg = getProductWhatsAppText(product.name, product.sku, finalPrice) + customNote;
    const link = generateWhatsAppLink('8008889317', msg);
    window.open(link, '_blank');
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;
    onAddReview(product.id, {
      author: newReviewAuthor,
      rating: newReviewRating,
      comment: newReviewComment,
      location: newReviewLocation || 'Verified Client'
    });
    setNewReviewAuthor('');
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        id="product-details-modal"
        className="relative bg-[#F5F2ED] w-full max-w-5xl border border-[#DCD7D0] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Controls */}
        <div className="px-6 py-3.5 bg-[#EAE5DF] border-b border-[#DCD7D0] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#2A2A2A] font-bold">{product.category} / {product.subcategory}</span>
            <span className="text-xs text-[#8C857D]">•</span>
            <span className="text-[10px] font-mono text-[#6B655E]">SKU: {product.sku}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(product)}
              className={`p-1.5 border transition-colors cursor-pointer ${
                isWishlisted
                  ? 'bg-[#2A2A2A] text-white border-[#2A2A2A]'
                  : 'bg-[#F5F2ED] text-[#2A2A2A] border-[#DCD7D0] hover:bg-[#2A2A2A] hover:text-white'
              }`}
              title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>

            <button
              id="close-product-modal-btn"
              onClick={onClose}
              className="p-1.5 text-[#2A2A2A] hover:opacity-60 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Multi-Image Showcase */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Active Image */}
              <div className="relative aspect-3/4 overflow-hidden bg-[#F0EDE9] border border-[#DCD7D0]">
                <img
                  src={product.images[selectedImgIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />
                
                {product.isCustomizable && (
                  <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 border border-[#DCD7D0] text-[10px] uppercase tracking-[0.2em] font-bold text-[#A68A64] flex items-center gap-1.5 shadow-xs">
                    <Scissors size={11} />
                    <span>Bespoke Fit Enabled</span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`relative w-16 h-20 overflow-hidden border transition-all shrink-0 cursor-pointer ${
                        selectedImgIndex === idx
                          ? 'border-[#2A2A2A]'
                          : 'border-[#DCD7D0] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Guarantee Box */}
              <div className="bg-[#EAE5DF] p-4 border border-[#DCD7D0] space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A2A2A]">
                  <ShieldCheck size={14} className="text-[#A68A64]" />
                  <span>BhuviSri Enterprises Authenticity</span>
                </div>
                <p className="text-xs text-[#6B655E] font-light leading-relaxed">
                  Silk Mark certified & hand-inspected for zari purity. Shipped in signature archival linen box.
                </p>
              </div>
            </div>

            {/* Right: Narrative & Configurator */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h1 className="font-serif italic text-3xl text-[#2A2A2A] leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-[#6B655E] font-light mt-1">{product.tagline}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-3 mt-3 text-xs">
                  <div className="bg-[#2A2A2A] text-white px-2 py-0.5 text-[10px] font-mono font-bold">
                    ★ {product.rating.toFixed(1)}
                  </div>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className="text-[#6B655E] underline hover:text-[#2A2A2A] cursor-pointer"
                  >
                    {product.reviews.length || product.reviewCount} reviews
                  </button>
                  <span className="text-[#DCD7D0]">|</span>
                  <span className="text-[#A68A64] uppercase tracking-wider text-[10px] font-bold">
                    In Stock ({product.stockCount} left)
                  </span>
                </div>
              </div>

              {/* Price Panel */}
              <div className="p-4 bg-[#EAE5DF] border border-[#DCD7D0] flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold text-[#2A2A2A]">
                      {formatCurrency(finalPrice, currency)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#6B655E] line-through">
                        {formatCurrency(product.originalPrice + customizationFee, currency)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-[#6B655E] mt-1">
                    {isCustomFitting ? 'Includes bespoke tailoring & custom stitching' : 'Inclusive of all taxes & express insured shipping'}
                  </p>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-[#DCD7D0] space-x-6 text-xs uppercase tracking-[0.2em] font-medium">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                    activeTab === 'details'
                      ? 'border-[#2A2A2A] text-[#2A2A2A] font-bold'
                      : 'border-transparent text-[#6B655E] hover:text-[#2A2A2A]'
                  }`}
                >
                  Specifications
                </button>

                {product.isCustomizable && (
                  <button
                    onClick={() => {
                      setActiveTab('customization');
                      setIsCustomFitting(true);
                    }}
                    className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'customization'
                        ? 'border-[#A68A64] text-[#A68A64] font-bold'
                        : 'border-transparent text-[#6B655E] hover:text-[#A68A64]'
                    }`}
                  >
                    <Scissors size={13} />
                    <span>Custom Tailoring</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'border-[#2A2A2A] text-[#2A2A2A] font-bold'
                      : 'border-transparent text-[#6B655E] hover:text-[#2A2A2A]'
                  }`}
                >
                  Reviews ({product.reviews.length || product.reviewCount})
                </button>
              </div>

              {/* Tab 1: Specs */}
              {activeTab === 'details' && (
                <div className="space-y-4 text-xs">
                  {/* Standard Sizing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2A2A2A]">
                        Select Standard Size:
                      </label>
                      {product.isCustomizable && (
                        <button
                          onClick={() => {
                            setIsCustomFitting(true);
                            setActiveTab('customization');
                          }}
                          className="text-[10px] uppercase tracking-wider text-[#A68A64] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Scissors size={11} />
                          <span>Switch to Custom Fit</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {product.availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setIsCustomFitting(false);
                          }}
                          className={`px-4 py-2 text-xs border transition-all cursor-pointer ${
                            !isCustomFitting && selectedSize === size
                              ? 'bg-[#2A2A2A] text-white border-[#2A2A2A] font-bold'
                              : 'bg-[#F5F2ED] text-[#2A2A2A] border-[#DCD7D0] hover:border-[#2A2A2A]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-3 bg-[#EAE5DF] border border-[#DCD7D0]">
                      <span className="text-[10px] uppercase tracking-wider text-[#6B655E] block">Fabric</span>
                      <strong className="text-[#2A2A2A] font-medium">{product.fabric}</strong>
                    </div>
                    <div className="p-3 bg-[#EAE5DF] border border-[#DCD7D0]">
                      <span className="text-[10px] uppercase tracking-wider text-[#6B655E] block">Color</span>
                      <strong className="text-[#2A2A2A] font-medium">{product.color}</strong>
                    </div>
                    <div className="p-3 bg-[#EAE5DF] border border-[#DCD7D0]">
                      <span className="text-[10px] uppercase tracking-wider text-[#6B655E] block">Occasion</span>
                      <strong className="text-[#2A2A2A] font-medium">{product.occasion}</strong>
                    </div>
                    <div className="p-3 bg-[#EAE5DF] border border-[#DCD7D0]">
                      <span className="text-[10px] uppercase tracking-wider text-[#6B655E] block">Care</span>
                      <strong className="text-[#2A2A2A] font-medium">{product.careInstructions}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-[#6B655E] leading-relaxed font-light pt-2">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Tab 2: Customization */}
              {activeTab === 'customization' && (
                <div className="space-y-4 bg-[#EAE5DF] p-4 border border-[#DCD7D0] text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DCD7D0]">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2A2A2A]">
                      Bespoke Tailoring Studio
                    </span>
                    <button
                      onClick={() => setShowMeasureGuide(!showMeasureGuide)}
                      className="text-[10px] uppercase tracking-wider text-[#A68A64] font-bold hover:underline"
                    >
                      {showMeasureGuide ? 'Hide Guide' : 'Measure Guide'}
                    </button>
                  </div>

                  {showMeasureGuide && (
                    <div className="bg-[#F5F2ED] p-3 border border-[#DCD7D0] text-[11px] text-[#6B655E] space-y-1">
                      <p><strong>Bust:</strong> Measure around fullest part of bust.</p>
                      <p><strong>Waist:</strong> Measure natural waist 2" above navel.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[#2A2A2A] mb-1">Neckline:</label>
                      <select
                        value={neckline}
                        onChange={(e) => {
                          setNeckline(e.target.value);
                          setBlouseStyle(`${e.target.value} Neck with ${sleeveLength}`);
                        }}
                        className="w-full bg-[#F5F2ED] border border-[#DCD7D0] px-2.5 py-1.5 text-xs text-[#2A2A2A]"
                      >
                        <option value="Sweetheart">Sweetheart Cut</option>
                        <option value="Deep-V Cut">Deep-V Cut</option>
                        <option value="Jewel High Neck">Royal Jewel High Neck</option>
                        <option value="Boat Neck">Wide Boat Neck</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[#2A2A2A] mb-1">Sleeve Cut:</label>
                      <select
                        value={sleeveLength}
                        onChange={(e) => {
                          setSleeveLength(e.target.value);
                          setBlouseStyle(`${neckline} Neck with ${e.target.value}`);
                        }}
                        className="w-full bg-[#F5F2ED] border border-[#DCD7D0] px-2.5 py-1.5 text-xs text-[#2A2A2A]"
                      >
                        <option value="Elbow Sleeve (10.5 in)">Elbow Sleeve (10.5")</option>
                        <option value="Cap Sleeve (4 in)">Cap Sleeve (4")</option>
                        <option value="Sleeveless">Sleeveless</option>
                        <option value="Full Sleeve">Full Sheer Organza Sleeve</option>
                      </select>
                    </div>
                  </div>

                  {/* Measurements */}
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-[#2A2A2A] mb-1">Dimensions ({measurementUnit}):</span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { key: 'bust', label: 'Bust' },
                        { key: 'waist', label: 'Waist' },
                        { key: 'hips', label: 'Hips' },
                        { key: 'shoulder', label: 'Shoulder' },
                        { key: 'blouseLength', label: 'Length' },
                        { key: 'sleeveLength', label: 'Sleeve' },
                      ].map((item) => (
                        <div key={item.key} className="bg-[#F5F2ED] p-2 border border-[#DCD7D0]">
                          <span className="block text-[9px] uppercase tracking-wider text-[#6B655E]">{item.label}</span>
                          <input
                            type="number"
                            step="0.5"
                            value={measurements[item.key as keyof typeof measurements]}
                            onChange={(e) => setMeasurements({
                              ...measurements,
                              [item.key]: parseFloat(e.target.value) || 0
                            })}
                            className="w-full bg-transparent font-mono font-bold text-xs text-[#2A2A2A]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="pt-2 border-t border-[#DCD7D0] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer text-[#2A2A2A]">
                        <input
                          type="checkbox"
                          checked={fallAndPico}
                          onChange={(e) => setFallAndPico(e.target.checked)}
                        />
                        <span>Fall & Pico Stitching</span>
                      </label>
                      <span className="text-[#A68A64] font-bold text-[10px] uppercase">Free</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer text-[#2A2A2A]">
                        <input
                          type="checkbox"
                          checked={petticoatAdded}
                          onChange={(e) => setPetticoatAdded(e.target.checked)}
                        />
                        <span>Matching Satin Shaper (+₹600)</span>
                      </label>
                      <span className="font-mono text-xs">+₹600</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2A2A2A]">Verified Testimonials</span>
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="text-[10px] uppercase tracking-wider px-3 py-1 bg-[#2A2A2A] text-white"
                    >
                      {showReviewForm ? 'Cancel' : 'Write Review'}
                    </button>
                  </div>

                  {showReviewForm && (
                    <form onSubmit={submitReview} className="bg-[#EAE5DF] p-3 border border-[#DCD7D0] space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          className="bg-[#F5F2ED] border border-[#DCD7D0] p-1.5 text-xs text-[#2A2A2A]"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={newReviewLocation}
                          onChange={(e) => setNewReviewLocation(e.target.value)}
                          className="bg-[#F5F2ED] border border-[#DCD7D0] p-1.5 text-xs text-[#2A2A2A]"
                        />
                      </div>
                      <textarea
                        required
                        rows={2}
                        placeholder="Your review comments..."
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full bg-[#F5F2ED] border border-[#DCD7D0] p-1.5 text-xs text-[#2A2A2A]"
                      />
                      <button type="submit" className="px-4 py-1 bg-[#2A2A2A] text-white text-[10px] uppercase tracking-wider">
                        Post Review
                      </button>
                    </form>
                  )}

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {product.reviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-[#EAE5DF] border border-[#DCD7D0] space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#2A2A2A]">{rev.author}</span>
                          <span className="text-xs font-mono">★ {rev.rating}</span>
                        </div>
                        <p className="text-xs text-[#6B655E]">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Checker */}
              <div className="pt-2 border-t border-[#DCD7D0]">
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <div className="relative flex-1">
                    <Truck size={14} className="absolute left-3 top-2.5 text-[#6B655E]" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter Delivery Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-[#EAE5DF] border border-[#DCD7D0] pl-8 pr-3 py-1.5 text-xs text-[#2A2A2A] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#2A2A2A] text-white text-[10px] uppercase tracking-[0.2em] font-medium"
                  >
                    Check
                  </button>
                </form>
                {deliveryStatus && (
                  <p className="text-[10px] text-[#2A2A2A] mt-1 font-medium">{deliveryStatus}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  id="modal-add-to-bag-btn"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 text-[11px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    addedNotice
                      ? 'bg-[#2A2A2A] text-white'
                      : 'bg-[#2A2A2A] hover:bg-[#404040] text-white'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check size={14} />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={14} />
                      <span>Add to Bag • {formatCurrency(finalPrice, currency)}</span>
                    </>
                  )}
                </button>

                <button
                  id="modal-whatsapp-consult-btn"
                  onClick={handleWhatsAppConsultation}
                  className="py-3.5 px-5 bg-[#25D366] text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp Stylist</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
