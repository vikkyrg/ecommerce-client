import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Globe, ShieldCheck, Truck, Headphones, MessageCircle, RotateCcw, MapPin } from 'lucide-react';
import businessConfig from '../../config/businessConfig';
import logoImg from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer className="w-full bg-[#171717] text-[#eeeeec] pt-12 sm:pt-16 pb-8 border-t border-neutral-800">
      <div className="site-container">
        
        {/* Customer Trust Features Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 sm:pb-12 border-b border-neutral-800">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-800 text-[#ffdf9c] flex-shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider font-['Inter']">
                100% Genuine Products
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Directly sourced authentic materials from Tenax, Akemi, Kerakoll, Mapei &amp; Surie Polex.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-800 text-[#ffdf9c] flex-shrink-0">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider font-['Inter']">
                Delivery Across India
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Fast and secure doorstep shipping to over 19,000+ pincodes nationwide.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-800 text-[#ffdf9c] flex-shrink-0">
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider font-['Inter']">
                7-Day Easy Returns
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Hassle-free return policy on intact, unopened packages with prompt refunds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-800 text-[#ffdf9c] flex-shrink-0">
              <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider font-['Inter']">
                Customer Care &amp; Advice
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Expert chemical advice on sealers, crystallization powder and tile adhesives.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 py-10 sm:py-12 border-b border-neutral-800 items-start">
          
          {/* Brand info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3.5">
            <div className="flex items-center gap-2.5">
              <img
                src={logoImg}
                alt={businessConfig.companyName}
                className="h-10 w-10 object-contain rounded-md"
              />
              <span className="font-['Manrope'] font-bold text-base sm:text-lg text-white uppercase tracking-tight">
                {businessConfig.companyName}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Your trusted direct online destination for authentic stone care, marble polishing chemicals, tile adhesives, diamond abrasive tools, and surface protection supplies.
            </p>
            
            {/* Official Contact Info Block */}
            <div className="text-xs text-neutral-300 space-y-2 mt-2 pt-2 border-t border-neutral-800">
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#ffdf9c] flex-shrink-0" />
                <a href={businessConfig.phoneTel} className="text-neutral-200 hover:text-[#ffdf9c] transition-colors">
                  {businessConfig.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#ffdf9c] flex-shrink-0" />
                <a href={businessConfig.emailMailto} className="text-neutral-200 hover:text-[#ffdf9c] transition-colors">
                  {businessConfig.email}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#ffdf9c] flex-shrink-0" />
                <a
                  href={businessConfig.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-200 hover:text-[#ffdf9c] transition-colors"
                >
                  {businessConfig.websiteDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#ffdf9c] flex-shrink-0" />
                <span>{businessConfig.address}</span>
              </p>
            </div>
          </div>

          {/* Shop Categories (3 cols) */}
          <div className="lg:col-span-3">
            <h5 className="font-['Manrope'] font-bold text-xs uppercase tracking-wider text-white mb-3 sm:mb-4">
              Shop Categories
            </h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/products" className="hover:text-[#ffdf9c] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Marble+and+Granite+Polishing+Materials" className="hover:text-[#ffdf9c] transition-colors">
                  Marble &amp; Granite Polishing
                </Link>
              </li>
              <li>
                <Link to="/products?category=Tile+Adhesives+and+Epoxy+Grouts" className="hover:text-[#ffdf9c] transition-colors">
                  Tile Adhesives &amp; Epoxy Grouts
                </Link>
              </li>
              <li>
                <Link to="/products?category=Marble+and+Granite+Cutting+Accessories" className="hover:text-[#ffdf9c] transition-colors">
                  Diamond Cutting Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=Machines" className="hover:text-[#ffdf9c] transition-colors">
                  Machines &amp; Tools
                </Link>
              </li>
              <li>
                <Link to="/products?category=Floor+Covering+Materials" className="hover:text-[#ffdf9c] transition-colors">
                  Floor Protection Materials
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support (2 cols) */}
          <div className="lg:col-span-2">
            <h5 className="font-['Manrope'] font-bold text-xs uppercase tracking-wider text-white mb-3 sm:mb-4">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/contact" className="text-[#ffdf9c] font-semibold hover:underline transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href={businessConfig.phoneTel} className="hover:text-[#ffdf9c] transition-colors">
                  Phone Assistance
                </a>
              </li>
              <li>
                <a href={businessConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#ffdf9c] transition-colors">
                  WhatsApp Support
                </a>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#ffdf9c] transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#ffdf9c] transition-colors">
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#ffdf9c] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp & Phone Assistance Box (3 cols) */}
          <div className="lg:col-span-3">
            <h5 className="font-['Manrope'] font-bold text-xs uppercase tracking-wider text-white mb-3 sm:mb-4">
              Direct Assistance
            </h5>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Need advice choosing the right stone chemical or placing an order? Contact our support team directly.
            </p>
            <div className="bg-neutral-900 border border-neutral-700 p-4 rounded-xl space-y-3">
              <a
                href={businessConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
              
              <div className="text-[11px] text-neutral-300 pt-1 space-y-1">
                <p>
                  Phone:{' '}
                  <a href={businessConfig.phoneTel} className="text-white font-semibold hover:underline">
                    {businessConfig.phone}
                  </a>
                </p>
                <p>
                  Email:{' '}
                  <a href={businessConfig.emailMailto} className="text-white hover:underline truncate block">
                    {businessConfig.email}
                  </a>
                </p>
                <p className="text-neutral-400 text-[10px] pt-1">
                  Hours: {businessConfig.supportHours}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <p>© {new Date().getFullYear()} {businessConfig.companyName}. All Rights Reserved. Official Store.</p>
          <div className="flex gap-4 sm:gap-6 text-[11px]">
            <Link to="/contact" className="hover:text-neutral-300 transition-colors">Contact Us</Link>
            <span className="hover:text-neutral-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-300 cursor-pointer">Shipping &amp; Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
