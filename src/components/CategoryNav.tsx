import React, { useState } from 'react';
import { ProductCategory } from '../types';

interface CategoryNavProps {
  activeCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  selectedSubcategory: string;
  onSelectSubcategory: (sub: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  fabricFilter: string;
  onFabricFilterChange: (fabric: string) => void;
  colorFilter: string;
  onColorFilterChange: (color: string) => void;
  colorOptions: string[];
  sizeFilters: string[];
  onSizeFiltersChange: (sizes: string[]) => void;
  pricePreset: string;
  onPricePresetChange: (price: string) => void;
  maxPriceFilter: number;
  maxCatalogPrice: number;
  onMaxPriceChange: (price: number) => void;
  brandFilter: string;
  onBrandFilterChange: (brand: string) => void;
  fitFilter: string;
  onFitFilterChange: (fit: string) => void;
  materialFilter: string;
  onMaterialFilterChange: (material: string) => void;
  occasionFilter: string;
  onOccasionFilterChange: (occasion: string) => void;
  offerFilter: string;
  onOfferFilterChange: (offer: string) => void;
  availabilityFilter: string;
  onAvailabilityFilterChange: (availability: string) => void;
  productCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  sortBy,
  onSortChange,
  fabricFilter,
  onFabricFilterChange,
  colorFilter,
  onColorFilterChange,
  colorOptions,
  sizeFilters,
  onSizeFiltersChange,
  pricePreset,
  onPricePresetChange,
  maxPriceFilter,
  maxCatalogPrice,
  onMaxPriceChange,
  brandFilter,
  onBrandFilterChange,
  fitFilter,
  onFitFilterChange,
  materialFilter,
  onMaterialFilterChange,
  occasionFilter,
  onOccasionFilterChange,
  offerFilter,
  onOfferFilterChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  productCount,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Silhouettes' },
    { id: 'sarees', label: 'Sarees' },
    { id: 'ethnic', label: 'Ethnic' },
    { id: 'western', label: 'Western' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'gifts', label: 'Gifts & Novelties' },
  ];

  const subcategoriesMap: Record<string, string[]> = {
    all: ['All Items', 'Silk Sarees', 'Organza Sarees', 'Anarkali Sets', 'Lehengas', 'Linen Dresses', 'Potli Bags'],
    sarees: ['All Sarees', 'Silk Sarees', 'Organza Sarees', 'Tissue & Chanderi'],
    ethnic: ['All Ethnic', 'Anarkali Sets', 'Kurta Sets', 'Lehenga Ensembles'],
    western: ['All Western', 'Dresses & Outerwear', 'Co-ords & Suits', 'Dresses'],
    accessories: ['All Accessories', 'Bags & Potlis', 'Stoles & Dupattas', 'Jewelry'],
    gifts: ['All Gifts', 'Gift Sets', 'Home & Novelties', 'Festive Gifts'],
  };

  const activeSubcategories = subcategoriesMap[activeCategory] || subcategoriesMap.all;

  const fabrics = ['All Fabrics', 'Silk', 'Organza', 'Linen', 'Tissue', 'Crepe', 'Cashmere'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const selectClass = 'bg-[#F5F2ED] border border-[#DCD7D0] px-2.5 py-1.5 text-xs text-[#2A2A2A] focus:outline-none';
  const filterCount = sizeFilters.length + [colorFilter, pricePreset, brandFilter, fitFilter, materialFilter, occasionFilter, offerFilter, availabilityFilter].filter((value) => !value.startsWith('All')).length;
  const toggleSize = (size: string) => onSizeFiltersChange(sizeFilters.includes(size) ? sizeFilters.filter((item) => item !== size) : [...sizeFilters, size]);

  const filterControls = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <label className="text-[10px] uppercase tracking-wider font-bold text-[#6B655E]">Category<select value={activeCategory} onChange={(e) => { onSelectCategory(e.target.value as ProductCategory | 'all'); onSelectSubcategory('All Items'); }} className={`${selectClass} mt-1 w-full`}><option value="all">All Categories</option>{categories.filter((category) => category.id !== 'all').map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
      <div><span className="block text-[10px] uppercase tracking-wider font-bold text-[#6B655E] mb-1">Size</span><div className="flex flex-wrap gap-1">{sizes.map((size) => <button key={size} type="button" onClick={() => toggleSize(size)} className={`px-2 py-1 border text-[10px] cursor-pointer ${sizeFilters.includes(size) ? 'bg-[#2A2A2A] text-white border-[#2A2A2A]' : 'border-[#DCD7D0] text-[#6B655E]'}`}>{size}</button>)}</div></div>
      <label className="text-[10px] uppercase tracking-wider font-bold text-[#6B655E]">Price<select value={pricePreset} onChange={(e) => onPricePresetChange(e.target.value)} className={`${selectClass} mt-1 w-full`}><option value="All Prices">All Prices</option><option value="under_499">Under ₹499</option><option value="500_999">₹500–₹999</option><option value="1000_1999">₹1,000–₹1,999</option><option value="2000_3999">₹2,000–₹3,999</option><option value="4000_plus">₹4,000+</option></select><input type="range" min="499" max={maxCatalogPrice} value={Math.min(maxPriceFilter, maxCatalogPrice)} onChange={(e) => onMaxPriceChange(Number(e.target.value))} className="w-full mt-2 accent-[#2A2A2A]" /></label>
      <label className="text-[10px] uppercase tracking-wider font-bold text-[#6B655E]">Color<select value={colorFilter} onChange={(e) => onColorFilterChange(e.target.value)} className={`${selectClass} mt-1 w-full`}>{colorOptions.map((color) => <option key={color} value={color}>{color}</option>)}</select></label>
      <label className="text-[10px] uppercase tracking-wider font-bold text-[#6B655E]">Brand<select value={brandFilter} onChange={(e) => onBrandFilterChange(e.target.value)} className={`${selectClass} mt-1 w-full`}><option>All Brands</option><option>BhuviSri Enterprises</option></select></label>
      <label className="text-[10px] uppercase tracking-wider font-bold text-[#6B655E]">Fit<select value={fitFilter} onChange={(e) => onFitFilterChange(e.target.value)} className={`${selectClass} mt-1 w-full`}><option>All Fits</option><option>Slim</option><option>Regular</option><option>Relaxed</option><option>Oversized</option></select></label>
      <label className="text-[10px] uppercase tracking-wider font-bold text-[#6B655E]">Material<select value={materialFilter} onChange={(e) => onMaterialFilterChange(e.target.value)} className={`${selectClass} mt-1 w-full`}><option>All Materials</option>{['Cotton', 'Linen', 'Denim', 'Polyester', 'Rayon', 'Silk', 'Wool', 'Blended'].map((material) => <option key={material}>{material}</option>)}</select></label>
      <label className="text-[10px] uppercase tracking-wider font-bold text-[#6B655E]">Occasion<select value={occasionFilter} onChange={(e) => onOccasionFilterChange(e.target.value)} className={`${selectClass} mt-1 w-full`}><option>All Occasions</option>{['Casual', 'Formal', 'Party', 'Wedding', 'Workwear', 'Sports', 'Travel'].map((occasion) => <option key={occasion}>{occasion}</option>)}</select></label>
      <label className="text-[10px] uppercase tracking-wider font-bold text-[#6B655E]">Offers<select value={offerFilter} onChange={(e) => onOfferFilterChange(e.target.value)} className={`${selectClass} mt-1 w-full`}><option>All Offers</option><option>On Sale</option><option>20%+ Off</option><option>40%+ Off</option><option>50%+ Off</option><option>Clearance</option></select></label>
      <label className="text-[10px] uppercase tracking-wider font-bold text-[#6B655E]">Availability<select value={availabilityFilter} onChange={(e) => onAvailabilityFilterChange(e.target.value)} className={`${selectClass} mt-1 w-full`}><option>All Availability</option><option>In stock</option><option>New arrivals</option><option>Pre-order</option></select></label>
      <label className="text-[10px] uppercase tracking-wider font-bold text-[#6B655E]">Sort<select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className={`${selectClass} mt-1 w-full`}><option value="featured">Recommended</option><option value="newest">Newest arrivals</option><option value="best_selling">Best selling</option><option value="rating">Top rated</option><option value="price_low">Price: Low to High</option><option value="price_high">Price: High to Low</option><option value="discount">Discount: High to Low</option></select></label>
    </div>
  );

  return (
    <section id="category-navigation-section" className="bg-[#F5F2ED] py-6 border-b border-[#DCD7D0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-5">
        
        {/* Main Category Header Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-filter-btn-${cat.id}`}
              onClick={() => {
                onSelectCategory(cat.id);
                onSelectSubcategory('All Items');
              }}
              className={`px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-medium transition-all cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-[#2A2A2A] text-white border-[#2A2A2A]'
                  : 'bg-[#EAE5DF] text-[#2A2A2A] border-[#DCD7D0] hover:bg-[#DCD7D0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Subcategories Horizontal Scroll */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {activeSubcategories.map((sub) => {
            const isSelected = selectedSubcategory === sub || (selectedSubcategory === '' && sub.startsWith('All'));
            return (
              <button
                key={sub}
                onClick={() => onSelectSubcategory(sub)}
                className={`px-3 py-1 text-[11px] border transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'border-[#2A2A2A] bg-white text-[#2A2A2A] font-bold'
                    : 'border-[#DCD7D0] bg-[#F5F2ED] text-[#6B655E] hover:border-[#2A2A2A]'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        <div className="hidden md:block border-t border-[#DCD7D0] pt-5">
          {filterControls}
        </div>

        <div className="md:hidden sticky top-0 z-20 -mx-4 px-4 py-3 bg-[#F5F2ED]/95 backdrop-blur border-y border-[#DCD7D0] flex gap-2">
          <button type="button" onClick={() => setMobileFiltersOpen(true)} className="flex-1 py-2.5 bg-[#2A2A2A] text-white text-[10px] uppercase tracking-[0.2em] font-bold cursor-pointer">Filter {filterCount > 0 ? `(${filterCount})` : ''}</button>
          <label className="flex-1"><span className="sr-only">Sort products</span><select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className={`${selectClass} w-full h-full`}><option value="featured">Recommended</option><option value="newest">Newest arrivals</option><option value="best_selling">Best selling</option><option value="rating">Top rated</option><option value="price_low">Price: Low to High</option><option value="price_high">Price: High to Low</option><option value="discount">Discount: High to Low</option></select></label>
        </div>

        {mobileFiltersOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setMobileFiltersOpen(false)}>
            <div className="w-full max-h-[86vh] overflow-y-auto bg-[#F5F2ED] border-t border-[#DCD7D0] p-5 space-y-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[0.25em] text-[#A68A64] font-bold">Refine collection</p><h2 className="font-serif italic text-2xl text-[#2A2A2A]">Filters</h2></div><button type="button" onClick={() => setMobileFiltersOpen(false)} className="px-3 py-2 border border-[#DCD7D0] text-[10px] uppercase tracking-wider cursor-pointer">Done</button></div>
              {filterControls}
            </div>
          </div>
        )}

        {/* Filters & Sorting Bar */}
        <div className="hidden pt-2 flex-col md:flex-row justify-between items-center gap-4 text-xs">
          
          {/* Left: Fabric and Color Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Fabric Selector */}
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <span className="text-[#6B655E] font-medium hidden sm:inline">Fabric:</span>
              <select
                value={fabricFilter}
                onChange={(e) => onFabricFilterChange(e.target.value)}
                className="bg-[#F5F2ED] border border-[#DCD7D0] px-2.5 py-1.5 text-xs text-[#2A2A2A] focus:outline-none"
              >
                {fabrics.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <span className="text-[#6B655E] font-medium hidden sm:inline">Color:</span>
              <select
                value={colorFilter}
                onChange={(e) => onColorFilterChange(e.target.value)}
                className="bg-[#F5F2ED] border border-[#DCD7D0] px-2.5 py-1.5 text-xs text-[#2A2A2A] focus:outline-none"
              >
                {colorOptions.map((color) => <option key={color} value={color}>{color}</option>)}
              </select>
            </div>
          </div>

          {/* Right: Results Count & Sort By */}
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <span className="text-xs text-[#6B655E] font-light">
              Showing <strong>{productCount}</strong> designs
            </span>

            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <span className="text-[#6B655E] font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-[#F5F2ED] border border-[#DCD7D0] px-2.5 py-1.5 text-xs text-[#2A2A2A] focus:outline-none font-medium"
              >
                <option value="featured">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
                <option value="best_selling">Best Selling</option>
                <option value="discount">Discount: High to Low</option>
              </select>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
