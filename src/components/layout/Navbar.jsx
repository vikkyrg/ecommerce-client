import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Truck, MessageCircle, Phone } from 'lucide-react';
import businessConfig from '../../config/businessConfig';

export default function Navbar() {
  const navItems = [
    { label: 'All Products', path: '/products' },
    { label: 'Marble & Granite Polishing', path: '/products?category=Marble+%26+Granite+Polishing' },
    { label: 'Tile Adhesives & Grouts', path: '/products?category=Tile+Adhesives+%26+Grouts' },
    { label: 'Cutting Accessories', path: '/products?category=Cutting+Accessories' },
    { label: 'Machines & Tools', path: '/products?category=Machines+%26+Tools' },
    { label: 'Floor Protection', path: '/products?category=Floor+Protection' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <nav className="hidden lg:block bg-[#f4f4f2] border-b border-[#e2e3e1] text-neutral-700 text-[13px] font-medium font-['Inter']">
      <div className="site-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {navItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2.5 transition-colors border-b-2 flex items-center whitespace-nowrap ${
                    isActive
                      ? 'border-black text-black font-semibold bg-white/70'
                      : 'border-transparent text-neutral-600 hover:text-black hover:border-neutral-300'
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-neutral-600 flex-shrink-0">
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
