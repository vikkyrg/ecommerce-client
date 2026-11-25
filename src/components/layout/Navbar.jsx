import React, { useState, useEffect } from 'react';
import { NavLink, useSearchParams, useLocation } from 'react-router-dom';
import { fetchCategories } from '../../services/api';

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const currentCategoryParam = searchParams.get('category') || '';
  const isProductsPage = location.pathname === '/products';

  useEffect(() => {
    fetchCategories()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Keep active categories sorted by displayOrder or name
          const validCats = data.filter(c => c.isActive !== false);
          setCategories(validCats);
        }
      })
      .catch(err => console.warn('Navbar categories load note:', err));
  }, []);

  // Helper to determine if a category is currently active
  const isCategoryActive = (cat) => {
    if (!isProductsPage) return false;
    if (!currentCategoryParam) return false;
    const cleanParam = currentCategoryParam.toLowerCase().trim();
    const catSlug = (cat.slug || '').toLowerCase().trim();
    const catName = (cat.name || '').toLowerCase().trim();
    const catId = (cat._id || cat.id || '').toString();

    return (
      cleanParam === catSlug ||
      cleanParam === catName ||
      cleanParam === catId ||
      cleanParam.replace(/-/g, ' ') === catName ||
      catSlug.replace(/-/g, ' ') === cleanParam
    );
  };

  const isAllProductsActive = isProductsPage && (!currentCategoryParam || currentCategoryParam === 'All' || currentCategoryParam === 'All Products' || currentCategoryParam === 'All Categories');

  return (
    <nav className="bg-[#f4f4f2] border-b border-[#e2e3e1] text-neutral-700 text-xs sm:text-[13px] font-medium font-['Inter'] relative select-none">
      <div className="site-container">
        <div className="flex items-center w-full min-w-0">
          {/* Responsive Horizontal Scrollable Categories Container */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto scrollbar-none py-1 w-full min-w-0">
            {/* All Products Tab */}
            <NavLink
              to="/products"
              end
              className={() =>
                `px-3 py-2 sm:px-3.5 sm:py-2.5 transition-all border-b-2 flex items-center whitespace-nowrap rounded-t-sm flex-shrink-0 cursor-pointer ${
                  isAllProductsActive
                    ? 'border-black text-black font-bold bg-white/80 shadow-2xs'
                    : 'border-transparent text-neutral-600 hover:text-black hover:bg-black/5 hover:border-neutral-300'
                }`
              }
            >
              <span>All Products</span>
            </NavLink>

            {/* Dynamic Categories */}
            {categories.map(cat => {
              const active = isCategoryActive(cat);
              const targetSlug = cat.slug || encodeURIComponent(cat.name);

              return (
                <NavLink
                  key={cat._id || cat.slug || cat.name}
                  to={`/products?category=${targetSlug}`}
                  className={() =>
                    `px-3 py-2 sm:px-3.5 sm:py-2.5 transition-all border-b-2 flex items-center whitespace-nowrap rounded-t-sm flex-shrink-0 cursor-pointer ${
                      active
                        ? 'border-black text-black font-bold bg-white/80 shadow-2xs'
                        : 'border-transparent text-neutral-600 hover:text-black hover:bg-black/5 hover:border-neutral-300'
                    }`
                  }
                >
                  <span>{cat.name}</span>
                </NavLink>
              );
            })}

            {/* Contact Us Tab */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 sm:px-3.5 sm:py-2.5 transition-all border-b-2 flex items-center whitespace-nowrap rounded-t-sm flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-black text-black font-bold bg-white/80 shadow-2xs'
                    : 'border-transparent text-neutral-600 hover:text-black hover:bg-black/5 hover:border-neutral-300'
                }`
              }
            >
              <span>Contact Us</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
