import React from 'react';
import { X, ChevronRight, Phone, ShieldCheck, User, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import businessConfig from '../../config/businessConfig';

export default function MobileMenu({ isOpen, onClose, onOpenAccountModal }) {
  if (!isOpen) return null;

  const categories = [
    { label: 'All Products', path: '/products' },
    { label: 'Marble & Granite Polishing', path: '/products?category=Marble+%26+Granite+Polishing' },
    { label: 'Tile Adhesives & Grouts', path: '/products?category=Tile+Adhesives+%26+Grouts' },
    { label: 'Cutting Accessories', path: '/products?category=Cutting+Accessories' },
    { label: 'Machines & Tools', path: '/products?category=Machines+%26+Tools' },
    { label: 'Floor Protection', path: '/products?category=Floor+Protection' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-[#171717] text-white">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.jpeg"
              alt={businessConfig.companyName}
              className="h-9 w-auto object-contain rounded-sm"
              onError={e => {
                e.target.style.display = 'none';
              }}
            />
            <span className="font-['Manrope'] font-bold text-sm tracking-tight uppercase">
              {businessConfig.companyName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Account Quick Link */}
        <div className="p-3.5 bg-neutral-100 border-b border-neutral-200">
          <button
            onClick={() => {
              onClose();
              if (onOpenAccountModal) onOpenAccountModal();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 bg-white rounded-lg border border-neutral-300 text-left hover:border-black transition-colors"
          >
            <User className="w-4 h-4 text-neutral-700" />
            <div>
              <span className="text-xs font-bold text-black block leading-none">
                My Account
              </span>
              <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">
                Sign In / Register
              </span>
            </div>
          </button>
        </div>

        <div className="flex-1 py-3">
          <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Navigation &amp; Categories
          </div>
          <nav className="space-y-0.5 px-2">
            {categories.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-neutral-800 hover:bg-neutral-100 transition-colors"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Support & Official Contact actions */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 text-xs text-neutral-600 space-y-3">
          <a
            href={businessConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-lg font-bold text-xs shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </a>

          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Genuine Certified Products</span>
          </div>

          <div className="pt-2 border-t border-neutral-200 space-y-1.5 text-[11px]">
            <a
              href={businessConfig.phoneTel}
              className="flex items-center gap-2 font-semibold text-neutral-900 hover:text-black"
            >
              <Phone className="w-3.5 h-3.5 text-amber-700" />
              <span>{businessConfig.phone}</span>
            </a>
            <a
              href={businessConfig.emailMailto}
              className="flex items-center gap-2 text-neutral-700 hover:text-black"
            >
              <Mail className="w-3.5 h-3.5 text-amber-700" />
              <span className="truncate">{businessConfig.email}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
