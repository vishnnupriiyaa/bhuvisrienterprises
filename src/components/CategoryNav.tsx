import React from 'react';
import { Scissors, Sparkles } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryNavProps {
  activeCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  selectedSubcategory: string;
  onSelectSubcategory: (sub: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onlyCustomizable: boolean;
  onToggleOnlyCustomizable: () => void;
  fabricFilter: string;
  onFabricFilterChange: (fabric: string) => void;
  productCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  sortBy,
  onSortChange,
  onlyCustomizable,
  onToggleOnlyCustomizable,
  fabricFilter,
  onFabricFilterChange,
  productCount,
}) => {
  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Silhouettes' },
    { id: 'sarees', label: 'Sarees' },
    { id: 'ethnic', label: 'Ethnic' },
    { id: 'western', label: 'Western' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'custom', label: 'Custom' },
  ];

  const subcategoriesMap: Record<string, string[]> = {
    all: ['All Items', 'Silk Sarees', 'Organza Sarees', 'Anarkali Sets', 'Lehengas', 'Linen Dresses', 'Potli Bags'],
    sarees: ['All Sarees', 'Silk Sarees', 'Organza Sarees', 'Tissue & Chanderi'],
    ethnic: ['All Ethnic', 'Anarkali Sets', 'Kurta Sets', 'Lehenga Ensembles'],
    western: ['All Western', 'Dresses & Outerwear', 'Co-ords & Suits', 'Dresses'],
    accessories: ['All Accessories', 'Bags & Potlis', 'Stoles & Dupattas', 'Jewelry'],
    custom: ['All Custom', 'Bespoke Atelier', 'Custom Stitching'],
  };

  const activeSubcategories = subcategoriesMap[activeCategory] || subcategoriesMap.all;

  const fabrics = ['All Fabrics', 'Silk', 'Organza', 'Linen', 'Tissue', 'Crepe', 'Cashmere'];

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

        {/* Filters & Sorting Bar */}
        <div className="pt-2 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          
          {/* Left: Customizable Toggle & Fabric Filter */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Custom Made-to-measure checkbox filter */}
            <button
              id="filter-customizable-toggle"
              onClick={onToggleOnlyCustomizable}
              className={`px-3.5 py-1.5 border text-[11px] uppercase tracking-[0.15em] flex items-center gap-1.5 transition-all cursor-pointer ${
                onlyCustomizable
                  ? 'bg-[#2A2A2A] text-white border-[#2A2A2A] font-bold'
                  : 'bg-[#F5F2ED] border-[#DCD7D0] text-[#2A2A2A] hover:border-[#2A2A2A]'
              }`}
            >
              <Scissors size={12} className={onlyCustomizable ? 'text-[#A68A64]' : 'text-[#A68A64]'} />
              <span>Bespoke Tailoring Only</span>
              {onlyCustomizable && <Sparkles size={11} className="text-[#A68A64]" />}
            </button>

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
                <option value="featured">Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
