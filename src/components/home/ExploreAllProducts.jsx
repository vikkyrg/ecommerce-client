import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../products/ProductCard';

export default function ExploreAllProducts({ products = [], categories = [] }) {
  // selectedCategory stores the selected category slug or 'All'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Normalize products prop to always guarantee an array
  const safeProducts = useMemo(() => {
    if (Array.isArray(products)) return products;
    if (products && Array.isArray(products.products)) return products.products;
    return [];
  }, [products]);

  // Categories list for tabs with both slug and display name
  const tabCategories = useMemo(() => {
    const catsList = Array.isArray(categories) ? categories : [];
    return [
      { name: 'All Products', slug: 'All' },
      ...catsList.map(c => ({
        name: c.name,
        slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        id: c._id || c.id
      }))
    ];
  }, [categories]);

  // Find active category object for display
  const activeCategoryObj = useMemo(() => {
    return tabCategories.find(c => c.slug === selectedCategory) || { name: 'All Products', slug: 'All' };
  }, [tabCategories, selectedCategory]);

  // Helper to check if a product matches a category
  const matchesCategory = (product, catSlug) => {
    if (catSlug === 'All') return true;

    const targetCat = tabCategories.find(c => c.slug === catSlug);
    const targetSlug = catSlug.toLowerCase();
    const targetName = targetCat ? targetCat.name.toLowerCase() : '';
    const targetId = targetCat && targetCat.id ? targetCat.id.toString() : '';

    const pCat = (product.category || '').toLowerCase();
    const pCatName = (product.categoryName || '').toLowerCase();
    const pCatRef = product.categoryRef ? (product.categoryRef._id || product.categoryRef).toString() : '';

    return (
      pCat === targetSlug ||
      pCat === targetName ||
      pCatName === targetName ||
      pCatName === targetSlug ||
      (targetId && pCatRef === targetId) ||
      pCat.replace(/-/g, ' ') === targetName ||
      targetSlug.replace(/-/g, ' ') === pCat
    );
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...safeProducts];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => matchesCategory(p, selectedCategory));
    }

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p => (p.name && p.name.toLowerCase().includes(q)) ||
             (p.brand && p.brand.toLowerCase().includes(q)) ||
             (p.category && p.category.toLowerCase().includes(q)) ||
             (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
             (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [safeProducts, selectedCategory, searchQuery, sortBy, tabCategories]);

  return (
    <section id="all-products-section" className="py-8 sm:py-16 bg-[#f9f9f7]">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-neutral-200/80 gap-3 sm:gap-4">
          <div>
            <span className="font-['Inter'] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-amber-700 block mb-1">
              Complete Store Inventory
            </span>
            <h2 className="font-['Manrope'] font-bold text-xl sm:text-3xl lg:text-4xl text-black tracking-tight">
              Explore All Products
            </h2>
            <p className="font-['Inter'] text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl leading-relaxed">
              Everything you need for stone care, polishing, installation and surface protection.
            </p>
          </div>

          {/* Search & Sort Controls: Responsive flex-row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-['Inter'] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-black transition-all"
              />
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-['Inter'] font-semibold text-neutral-800 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Tabs: Smooth Horizontal Scrollbar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 scrollbar-none select-none">
          {tabCategories.map(cat => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex-shrink-0 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-['Inter'] text-[11px] sm:text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-black text-[#ffdf9c] shadow-xs'
                    : 'bg-white text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Results Count Summary */}
        <div className="flex items-center justify-between text-xs text-neutral-500 font-['Inter'] mb-4 sm:mb-5">
          <span>
            Showing <strong className="text-black font-semibold">{filteredProducts.length}</strong> items
            {selectedCategory !== 'All' && <span> in <strong className="text-black font-semibold">{activeCategoryObj.name}</strong></span>}
          </span>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-amber-700 hover:underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Responsive Product Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map(product => (
              <ProductCard key={product.id || product._id || product.sku} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center my-4">
            <p className="font-['Manrope'] font-bold text-base text-neutral-800">No products found</p>
            <p className="font-['Inter'] text-xs text-neutral-500 mt-1">
              Try adjusting your search query or switching to another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-black text-[#ffdf9c] text-xs font-bold rounded-xl hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              Show All Products
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
