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
  Headphones
} from 'lucide-react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/products/ProductCard';

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
  };

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-6 sm:py-8">
      <div className="site-container">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 font-['Inter'] mb-4 select-none">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link to="/products" className="hover:text-black transition-colors">
            All Products
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

        {/* Page Title & Sort Toolbar */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#e2e3e1] shadow-2xs mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-['Manrope'] font-bold text-xl sm:text-2xl lg:text-3xl text-black leading-tight tracking-tight">
                {categoryParam !== 'All Categories'
                  ? categoryParam
                  : searchParam
                  ? `Search results for "${searchParam}"`
                  : 'Stone Care, Polishing & Surface Solutions'}
              </h1>
              <p className="font-['Inter'] text-xs sm:text-sm text-neutral-500 mt-1">
                Showing {products.length} genuine products available for direct purchase
              </p>
            </div>

            {/* Mobile Filters Toggle & Sorting */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-[#f4f4f2] hover:bg-neutral-200 text-black text-xs font-semibold px-3 py-2 rounded-lg border border-neutral-300 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 ml-auto md:ml-0">
                <span className="hidden sm:inline text-neutral-500">Sort by:</span>
                <select
                  value={sortParam}
                  onChange={e => updateFilters({ sort: e.target.value })}
                  className="bg-[#f4f4f2] text-black text-xs font-medium rounded-lg px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="featured">Featured / Best Seller</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(categoryParam !== 'All Categories' ||
            brandParam !== 'All Brands' ||
            searchParam ||
            inStockParam) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3.5 border-t border-neutral-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mr-1">
                Active Filters:
              </span>
              {categoryParam !== 'All Categories' && (
                <span className="inline-flex items-center gap-1.5 bg-[#171717] text-white text-xs px-2.5 py-1 rounded-full">
                  <span>{categoryParam}</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-[#ffdf9c]"
                    onClick={() => updateFilters({ category: 'All Categories' })}
                  />
                </span>
              )}
              {brandParam !== 'All Brands' && (
                <span className="inline-flex items-center gap-1.5 bg-[#171717] text-white text-xs px-2.5 py-1 rounded-full">
                  <span>Brand: {brandParam}</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-[#ffdf9c]"
                    onClick={() => updateFilters({ brand: 'All Brands' })}
                  />
                </span>
              )}
              {inStockParam && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-800 text-white text-xs px-2.5 py-1 rounded-full">
                  <span>In Stock Only</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer"
                    onClick={() => updateFilters({ inStock: 'false' })}
                  />
                </span>
              )}
              {searchParam && (
                <span className="inline-flex items-center gap-1.5 bg-neutral-200 text-black text-xs px-2.5 py-1 rounded-full">
                  <span>"{searchParam}"</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer"
                    onClick={() => updateFilters({ search: '' })}
                  />
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs font-medium text-neutral-500 hover:text-black flex items-center gap-1 ml-2 underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Grid & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-5 sticky top-24">
            <div className="bg-white p-5 rounded-xl border border-[#e2e3e1] shadow-2xs space-y-5">
              
              {/* Category Filter */}
              <div>
                <h3 className="font-['Manrope'] font-bold text-xs uppercase tracking-wider text-black pb-2.5 border-b border-neutral-200">
                  Categories
                </h3>
                <div className="space-y-1 mt-2.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => updateFilters({ category: cat })}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        categoryParam === cat
                          ? 'bg-black text-[#ffdf9c] font-semibold'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                      }`}
                    >
                      <span className="truncate pr-1">{cat}</span>
                      {categoryParam === cat && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="font-['Manrope'] font-bold text-xs uppercase tracking-wider text-black pb-2.5 border-b border-neutral-200">
                  Brands
                </h3>
                <div className="space-y-1 mt-2.5">
                  {brands.map(b => (
                    <button
                      key={b}
                      onClick={() => updateFilters({ brand: b })}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        brandParam === b
                          ? 'bg-black text-[#ffdf9c] font-semibold'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                      }`}
                    >
                      <span>{b}</span>
                      {brandParam === b && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <h3 className="font-['Manrope'] font-bold text-xs uppercase tracking-wider text-black pb-2.5 border-b border-neutral-200">
                  Availability
                </h3>
                <label className="flex items-center gap-2 mt-2.5 cursor-pointer text-xs font-medium text-neutral-700">
                  <input
                    type="checkbox"
                    checked={inStockParam}
                    onChange={e => updateFilters({ inStock: e.target.checked ? 'true' : 'false' })}
                    className="rounded border-neutral-300 text-black focus:ring-black h-4 w-4 cursor-pointer"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Direct Customer Assurance Box */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Genuine Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900">
                  <Truck className="w-4 h-4 text-neutral-700" />
                  <span>Direct Doorstep Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900">
                  <Headphones className="w-4 h-4 text-amber-600" />
                  <span>Expert Product Guidance</span>
                </div>
                <p className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-200">
                  Need help choosing? Call us at <span className="font-semibold text-black">+91 98450 12345</span>
                </p>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-9 h-9 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Loading catalog products...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl border border-neutral-200 p-10 sm:p-14 text-center">
                <h3 className="font-['Manrope'] font-bold text-lg sm:text-xl text-black">
                  No matching products found
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 max-w-sm mx-auto">
                  Try clearing your search query or removing active filters to browse all inventory.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 bg-black text-[#ffdf9c] font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-md hover:bg-neutral-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Customer Assurance Help Banner */}
            <div className="mt-10 sm:mt-12 bg-white rounded-xl p-5 sm:p-7 border border-[#e2e3e1] flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xs">
              <div className="space-y-1">
                <h4 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                  Looking for Advice on Stone Care or Tile Installation?
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed">
                  Our stone technicians provide free guidance on stain removal, granite sealing, marble polishing, and choosing the right tile adhesive.
                </p>
              </div>
              <a
                href="https://wa.me/919845012345"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-neutral-800 text-[#ffdf9c] font-semibold text-xs px-5 py-2.5 rounded-md flex-shrink-0 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto p-5">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="font-['Manrope'] font-bold text-base text-black">Filter Products</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-md text-neutral-500 hover:text-black"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-6">
              {/* Category */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-black mb-2">
                  Category
                </h4>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        updateFilters({ category: cat });
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium ${
                        categoryParam === cat
                          ? 'bg-black text-[#ffdf9c] font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-black mb-2">
                  Brand
                </h4>
                <div className="space-y-1">
                  {brands.map(b => (
                    <button
                      key={b}
                      onClick={() => {
                        updateFilters({ brand: b });
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium ${
                        brandParam === b
                          ? 'bg-black text-[#ffdf9c] font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-neutral-200">
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full bg-neutral-200 text-black font-semibold text-xs py-2.5 rounded-lg hover:bg-neutral-300 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
