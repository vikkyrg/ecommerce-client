import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { fetchCategories } from '../../services/api';

export default function Navbar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(err => console.warn('Navbar categories load note:', err));
  }, []);

  return (
    <nav className="hidden lg:block bg-[#f4f4f2] border-b border-[#e2e3e1] text-neutral-700 text-[13px] font-medium font-['Inter']">
      <div className="site-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-0.5">
            <NavLink
              to="/products"
              end
              className={({ isActive }) =>
                `px-3 py-2.5 transition-colors border-b-2 flex items-center whitespace-nowrap ${
                  isActive
                    ? 'border-black text-black font-semibold bg-white/70'
                    : 'border-transparent text-neutral-600 hover:text-black hover:border-neutral-300'
                }`
              }
            >
              <span>All Products</span>
            </NavLink>

            {categories.slice(0, 6).map(cat => (
              <NavLink
                key={cat.slug || cat._id}
                to={`/products?category=${encodeURIComponent(cat.slug || cat.name)}`}
                className={({ isActive }) =>
                  `px-3 py-2.5 transition-colors border-b-2 flex items-center whitespace-nowrap ${
                    isActive
                      ? 'border-black text-black font-semibold bg-white/70'
                      : 'border-transparent text-neutral-600 hover:text-black hover:border-neutral-300'
                  }`
                }
              >
                <span>{cat.name}</span>
              </NavLink>
            ))}

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2.5 transition-colors border-b-2 flex items-center whitespace-nowrap ${
                  isActive
                    ? 'border-black text-black font-semibold bg-white/70'
                    : 'border-transparent text-neutral-600 hover:text-black hover:border-neutral-300'
                }`
              }
            >
              <span>Contact Us</span>
            </NavLink>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-neutral-600 flex-shrink-0 ml-4">
            <span className="flex items-center gap-1.5 text-neutral-800 bg-neutral-200/70 px-2.5 py-1 rounded border border-neutral-300">
              <Truck className="w-3.5 h-3.5 text-neutral-700" />
              <span>Doorstep Delivery Across India</span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
