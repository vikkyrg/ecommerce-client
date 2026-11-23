import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../products/ProductCard';

export default function ExploreAllProducts({ products = [], categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Normalize products prop to always guarantee an array
  const safeProducts = useMemo(() => {
    if (Array.isArray(products)) return products;
    if (products && Array.isArray(products.products)) return products.products;
    return [];
  }, [products]);

  // Categories list for tabs
  const tabCategories = useMemo(() => {
    const catsList = Array.isArray(categories) ? categories : [];
    return ['All', ...catsList.map(c => c.name).filter(Boolean)];
  }, [categories]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...safeProducts];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        p => p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
             p.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name?.toLowerCase().includes(q) ||
             p.brand?.toLowerCase().includes(q) ||
             p.category?.toLowerCase().includes(q) ||
             p.sku?.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="all-products-section" className="py-12 sm:py-16 bg-[#f9f9f7]">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-5 border-b border-neutral-200/80 gap-4">
          <div>
            <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-wider text-amber-700 block mb-1">
              Complete Store Inventory
            </span>
            <h2 className="font-['Manrope'] font-bold text-2xl sm:text-3xl lg:text-4xl text-black tracking-tight">
              Explore All Products
            </h2>
            <p className="font-['Inter'] text-xs sm:text-sm text-neutral-600 mt-1.5 max-w-xl leading-relaxed">
              Everything you need for stone care, polishing, installation and surface protection.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-['Inter'] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-['Inter'] font-medium text-neutral-800 focus:outline-none focus:border-black cursor-pointer"
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

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {tabCategories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-['Inter'] text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-[#ffdf9c] shadow-xs'
                    : 'bg-white text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {cat === 'All' ? 'All Products' : cat}
              </button>
            );
          })}
        </div>

        {/* Results Count Summary */}
        <div className="flex items-center justify-between text-xs text-neutral-500 font-['Inter'] mb-5">
          <span>
            Showing <strong className="text-black font-semibold">{filteredProducts.length}</strong> items
            {selectedCategory !== 'All' && <span> in <strong className="text-black font-semibold">{selectedCategory}</strong></span>}
          </span>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-amber-700 hover:underline font-medium cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* 4-Column Responsive Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center my-6">
            <p className="font-['Manrope'] font-bold text-base text-neutral-800">No products found</p>
            <p className="font-['Inter'] text-xs text-neutral-500 mt-1">
              Try adjusting your search query or switching to another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-black text-[#ffdf9c] text-xs font-medium rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              Show All Products
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
