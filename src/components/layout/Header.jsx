import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, Phone, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import businessConfig from '../../config/businessConfig';

export default function Header({ onOpenMobileMenu, onOpenAccountModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-all duration-300 ease-out border-b ${
        isScrolled
          ? 'border-[#d0d2d0] shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
          : 'border-[#e2e3e1] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
      }`}
    >
      <div className="site-container">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-2 sm:gap-4 lg:gap-8">
          
          {/* Left: Mobile menu button & Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 min-w-0">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 -ml-1 text-neutral-800 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2 group select-none min-w-0">
              <img
                src="/logo.jpeg"
                alt={businessConfig.companyName}
                className="h-8 sm:h-10 lg:h-11 w-auto object-contain rounded-sm transition-transform duration-300 group-hover:scale-103 flex-shrink-0"
                onError={e => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  const fallback = e.target.nextSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                style={{ display: 'none' }}
                className="h-8 w-8 sm:h-10 sm:w-10 bg-black text-[#ffdf9c] rounded-md items-center justify-center font-['Manrope'] font-bold text-base sm:text-xl tracking-tight border border-neutral-800 flex-shrink-0"
              >
                NS
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <span className="font-['Manrope'] font-bold text-sm sm:text-base lg:text-xl tracking-tight text-black leading-tight group-hover:text-amber-900 transition-colors truncate">
                  {businessConfig.companyName}
                </span>
                <span className="font-['Inter'] text-[8px] sm:text-[9px] lg:text-[10px] tracking-wider uppercase text-neutral-500 font-semibold leading-tight truncate">
                  {businessConfig.tagline}
                </span>
              </div>
            </Link>
          </div>

          {/* Middle: Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg lg:max-w-xl mx-2 lg:mx-auto relative items-center"
          >
            <div className="relative w-full flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search stone polishes, adhesives, sealers, cleaners..."
                className="w-full bg-[#f4f4f2] text-neutral-900 placeholder-neutral-500 text-xs sm:text-sm rounded-lg pl-10 pr-20 py-2 sm:py-2.5 border border-[#c4c7c7] focus:outline-none focus:border-black focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black text-white hover:bg-neutral-800 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer active:scale-95"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right: Actions (Wishlist, Account, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
            {/* Quick WhatsApp Support on Large Screens */}
            <a
              href={businessConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden 2xl:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-102"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Customer Account Button */}
            <button
              onClick={onOpenAccountModal}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer text-neutral-700 transition-colors"
              title="My Account"
              aria-label="My Account"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 border border-neutral-200">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-left hidden xl:block">
                <span className="text-[9px] uppercase font-bold text-neutral-400 block leading-tight">
                  Account
                </span>
                <span className="text-xs font-bold text-black block leading-tight">
                  Sign In
                </span>
              </div>
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors flex items-center justify-center"
              title="My Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-[#ffdf9c] text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-all shadow-xs group cursor-pointer active:scale-95"
              aria-label="Shopping Cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#ffdf9c] group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-black text-[9px] font-extrabold rounded-full h-3.5 w-3.5 flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold tracking-wide hidden sm:inline text-neutral-100">
                Cart
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar below header */}
        <div className="md:hidden pb-2.5">
          <form onSubmit={handleSearch} className="relative flex items-center w-full">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search stone polishes, adhesives, tools..."
              className="w-full bg-[#f4f4f2] text-xs rounded-lg pl-8 pr-16 py-2 border border-[#c4c7c7] focus:outline-none focus:border-black text-[11px]"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-md"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
