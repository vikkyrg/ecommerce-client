import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../common/ScrollReveal';
import bannerImage from '../../assets/banner.png';

export default function PromotionalBanner() {
  return (
    <section className="site-container py-8 sm:py-14">
      <ScrollReveal direction="fade" duration={700}>
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-neutral-800 bg-[#0d0f12]">
          
          {/* Desktop & Tablet Background Image */}
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-right"
            style={{
              backgroundImage: `url(${bannerImage})`
            }}
          >
            {/* Soft readability gradient over left side to preserve marble texture while keeping white text super legible */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-transparent pointer-events-none" />
          </div>

          {/* Mobile Layout (< 768px): Clean vertical stack */}
          <div className="md:hidden flex flex-col">
            {/* Top Text Content */}
            <div className="p-5 xs:p-6 bg-[#0d0f12] text-white space-y-3.5 z-10">
              <span className="inline-flex items-center gap-1.5 bg-[#171717] text-[#ffdf9c] border border-neutral-700/80 px-3 py-1 rounded-full font-['Inter'] text-[10px] font-bold tracking-widest uppercase shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffdf9c] animate-pulse" />
                PREMIUM STONE CARE PRODUCTS
              </span>

              <h2 className="font-['Manrope'] font-bold text-2xl xs:text-3xl text-white tracking-tight leading-[1.18]">
                Premium Stone Care &amp;<br className="hidden xs:inline" /> Surface Solutions
              </h2>

              <p className="font-['Inter'] text-xs text-neutral-300 leading-relaxed">
                Explore premium marble and granite polishing materials, adhesives, sealers, cleaners and professional tools from trusted brands.
              </p>

              <div className="flex flex-col xs:flex-row gap-2.5 pt-1">
                <Link
                  to="/products"
                  className="w-full xs:w-auto text-center bg-black/80 hover:bg-black text-[#ffdf9c] border border-neutral-600 hover:border-[#ffdf9c]/50 font-['Inter'] font-semibold text-xs px-5 py-3 rounded-xl inline-flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                >
                  <span>Shop All Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="#shop-by-category-section"
                  className="w-full xs:w-auto text-center bg-white/10 hover:bg-white/20 text-white border border-white/20 font-['Inter'] font-semibold text-xs px-4 py-3 rounded-xl backdrop-blur-xs transition-colors"
                >
                  Explore Categories
                </a>
              </div>
            </div>

            {/* Mobile Image Display */}
            <div className="relative w-full h-56 xs:h-64 bg-neutral-900 overflow-hidden border-t border-neutral-800">
              <img
                src={bannerImage}
                alt="NS Stone Chemicals Promotional Banner"
                className="w-full h-full object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2.5 right-3 text-[10px] font-mono font-semibold text-neutral-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                Genuine Brand Catalog
              </span>
            </div>
          </div>

          {/* Desktop & Tablet Overlay (>= 768px): Text on Left, Products on Right */}
          <div className="hidden md:flex relative z-10 w-full p-8 lg:p-14 min-h-[440px] lg:min-h-[480px] items-center">
            <div className="max-w-lg lg:max-w-[540px] flex flex-col justify-center space-y-4 lg:space-y-5">
              
              {/* Badge */}
              <ScrollReveal direction="up" delay={100} duration={600} distance={15}>
                <span className="inline-flex items-center gap-1.5 bg-[#171717]/90 text-[#ffdf9c] border border-neutral-700/80 px-3.5 py-1.5 rounded-full font-['Inter'] text-[11px] font-bold tracking-widest uppercase shadow-xs backdrop-blur-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffdf9c] animate-pulse" />
                  PREMIUM STONE CARE PRODUCTS
                </span>
              </ScrollReveal>

              {/* Main Heading */}
              <ScrollReveal direction="up" delay={200} duration={600} distance={20}>
                <h2 className="font-['Manrope'] font-bold text-3xl lg:text-[42px] text-white tracking-tight leading-[1.14]">
                  Premium Stone Care &amp;<br />Surface Solutions
                </h2>
              </ScrollReveal>

              {/* Description */}
              <ScrollReveal direction="up" delay={300} duration={600} distance={20}>
                <p className="font-['Inter'] text-sm sm:text-base text-neutral-300 leading-relaxed max-w-lg">
                  Explore premium marble and granite polishing materials, adhesives, sealers, cleaners and professional tools from trusted brands.
                </p>
              </ScrollReveal>

              {/* Action Buttons */}
              <ScrollReveal direction="up" delay={400} duration={600} distance={20}>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                  {/* Button 1: Shop All Products */}
                  <Link
                    to="/products"
                    className="bg-black/80 hover:bg-black text-[#ffdf9c] border border-neutral-600 hover:border-[#ffdf9c]/50 font-['Inter'] font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <span>Shop All Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Button 2: Explore Categories */}
                  <a
                    href="#shop-by-category-section"
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-['Inter'] font-medium text-xs sm:text-sm px-5 py-3.5 rounded-xl backdrop-blur-xs transition-colors"
                  >
                    Explore Categories
                  </a>
                </div>
              </ScrollReveal>

            </div>
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
}
