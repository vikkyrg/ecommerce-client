import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  ChevronRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
  Search,
  ArrowUpDown
} from 'lucide-react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import StaggerContainer from '../components/common/StaggerContainer';
import ScrollReveal from '../components/common/ScrollReveal';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter states initialized from URL params
  const categoryParam = searchParams.get('category') || 'All Categories';
  const brandParam = searchParams.get('brand') || 'All Brands';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const inStockParam = searchParams.get('inStock') === 'true';

  const categories = [
    'All Categories',
    'Marble & Granite Polishing',
    'Tile Adhesives & Grouts',
    'Cutting Accessories',
    'Machines & Tools',
    'Floor Protection'
  ];

  const brands = [
    'All Brands',
    'Tenax',
    'Akemi',
    'Kerakoll',
    'Mapei',
    'Surie',
    'Makita',
    'Dongcheng',
    'Accurate'
  ];

  // Load products based on query params
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (categoryParam && categoryParam !== 'All Categories') params.category = categoryParam;
        if (brandParam && brandParam !== 'All Brands') params.brand = brandParam;
        if (searchParam) params.search = searchParam;
        if (sortParam) params.sort = sortParam;
        if (inStockParam) params.inStock = 'true';

        const data = await fetchProducts(params);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryParam, brandParam, searchParam, sortParam, inStockParam]);

  const updateFilters = newParams => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newParams };
    Object.keys(merged).forEach(k => {
      if (!merged[k] || merged[k] === 'All Categories' || merged[k] === 'All Brands' || merged[k] === 'false') {
        delete merged[k];
      }
    });
    setSearchParams(merged);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setIsMobileFilterOpen(false);
  };

  const activeFiltersCount =
    (categoryParam !== 'All Categories' ? 1 : 0) +
    (brandParam !== 'All Brands' ? 1 : 0) +
    (searchParam ? 1 : 0) +
    (inStockParam ? 1 : 0);

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-4 sm:py-8">
      <div className="site-container">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 font-['Inter'] mb-4 select-none flex-wrap">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link to="/products" className="hover:text-black transition-colors">
            Catalog
          </Link>
          {categoryParam !== 'All Categories' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-black font-semibold truncate max-w-[200px]">
                {categoryParam}
              </span>
            </>
          )}
        </nav>

        {/* Catalog Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-neutral-200 gap-3">
          <div>
            <h1 className="font-['Manrope'] font-bold text-xl sm:text-2xl lg:text-3xl text-black tracking-tight">
              {categoryParam !== 'All Categories' ? categoryParam : 'All Stone Care Products'}
            </h1>
            <p className="font-['Inter'] text-xs sm:text-sm text-neutral-500 mt-1">
              Showing {products.length} verified products available for direct online purchase.
            </p>
          </div>

          {/* Mobile Filter Toggle & Sort Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-black shadow-2xs hover:border-black transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-black text-[#ffdf9c] rounded-full text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Select */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortParam}
                onChange={e => updateFilters({ sort: e.target.value })}
                className="w-full sm:w-auto px-3 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:border-black cursor-pointer shadow-2xs pr-8"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4 pb-3 border-b border-neutral-200 text-xs">
            <span className="text-neutral-500 font-medium">Active:</span>
            {categoryParam !== 'All Categories' && (
              <span className="inline-flex items-center gap-1.5 bg-neutral-200/80 px-2.5 py-1 rounded-full font-medium text-neutral-800 text-[11px]">
                {categoryParam}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => updateFilters({ category: 'All Categories' })}
                />
              </span>
            )}
            {brandParam !== 'All Brands' && (
              <span className="inline-flex items-center gap-1.5 bg-neutral-200/80 px-2.5 py-1 rounded-full font-medium text-neutral-800 text-[11px]">
                {brandParam}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => updateFilters({ brand: 'All Brands' })}
                />
              </span>
            )}
            {inStockParam && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium text-[11px]">
                In Stock Only
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => updateFilters({ inStock: 'false' })}
                />
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:underline font-semibold ml-auto cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Desktop Filter Sidebar (4 cols on lg, hidden on mobile/tablet) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-2xl border border-[#e2e3e1] shadow-2xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-['Manrope'] font-bold text-sm text-black uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-700" />
                <span>Filters</span>
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-neutral-500 hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <h4 className="font-semibold text-xs text-black mb-2.5">Categories</h4>
              <div className="space-y-1">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => updateFilters({ category: c })}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      categoryParam === c
                        ? 'bg-black text-[#ffdf9c] font-bold'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="truncate">{c}</span>
                    {categoryParam === c && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="pt-4 border-t border-neutral-100">
              <h4 className="font-semibold text-xs text-black mb-2.5">Brands</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {brands.map(b => (
                  <button
                    key={b}
                    onClick={() => updateFilters({ brand: b })}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer truncate ${
                      brandParam === b
                        ? 'bg-black text-[#ffdf9c] border-black font-bold'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-black'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Filter Checkbox */}
            <div className="pt-4 border-t border-neutral-100">
              <label className="flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockParam}
                  onChange={e => updateFilters({ inStock: e.target.checked ? 'true' : 'false' })}
                  className="rounded w-4 h-4 cursor-pointer"
                />
                <span>In Stock Products Only</span>
              </label>
            </div>
          </aside>

          {/* Main Product Grid (9 cols on lg, full width on mobile) */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="py-20 text-center font-['Inter'] text-xs text-neutral-500">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e2e3e1] p-10 sm:p-14 text-center space-y-3">
                <h3 className="font-['Manrope'] font-bold text-lg text-black">No Products Found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try adjusting your selected filters or clearing the search keyword.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-3 inline-flex items-center gap-2 bg-black text-[#ffdf9c] text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <StaggerContainer
                staggerDelay={50}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5"
              >
                {products.map(product => (
                  <ProductCard key={product.id || product._id || product.sku} product={product} />
                ))}
              </StaggerContainer>
            )}
          </main>
        </div>

      </div>

      {/* Mobile Filters Slide-in Bottom Sheet / Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Bottom Drawer */}
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl z-10 overflow-y-auto flex flex-col max-w-lg">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-700" />
                <h3 className="font-['Manrope'] font-bold text-base text-black">Filter Catalog</h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs font-['Inter'] flex-1">
              {/* Category Options */}
              <div>
                <h4 className="font-bold text-neutral-900 mb-2">Category</h4>
                <div className="space-y-1">
                  {categories.map(c => (
                    <button
                      key={c}
                      onClick={() => updateFilters({ category: c })}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                        categoryParam === c
                          ? 'bg-black text-[#ffdf9c]'
                          : 'bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span>{c}</span>
                      {categoryParam === c && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Options */}
              <div className="pt-3 border-t border-neutral-100">
                <h4 className="font-bold text-neutral-900 mb-2">Brand</h4>
                <div className="grid grid-cols-2 gap-2">
                  {brands.map(b => (
                    <button
                      key={b}
                      onClick={() => updateFilters({ brand: b })}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-center ${
                        brandParam === b
                          ? 'bg-black text-[#ffdf9c] border-black'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div className="pt-3 border-t border-neutral-100">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockParam}
                    onChange={e => updateFilters({ inStock: e.target.checked ? 'true' : 'false' })}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <span>Show In-Stock Products Only</span>
                </label>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-neutral-100 sticky bottom-0 bg-white">
              <button
                onClick={handleResetFilters}
                className="w-1/3 py-3 border border-neutral-300 rounded-xl font-semibold text-neutral-700 text-xs hover:bg-neutral-100"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-2/3 py-3 bg-black text-[#ffdf9c] rounded-xl font-bold text-xs hover:bg-neutral-800 shadow-xs"
              >
                Apply Filters ({products.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
