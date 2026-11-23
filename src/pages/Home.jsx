import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
  ChevronRight
} from 'lucide-react';
import { fetchCategories, fetchProducts, fetchFeaturedProducts } from '../services/api';
import CategoryCard from '../components/home/CategoryCard';
import ProductCard from '../components/products/ProductCard';
import ExploreAllProducts from '../components/home/ExploreAllProducts';
import ScrollReveal from '../components/common/ScrollReveal';
import StaggerContainer from '../components/common/StaggerContainer';
import heroImage from '../assets/hero.png';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, prodsData, featured] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
          fetchFeaturedProducts()
        ]);
        const productList = Array.isArray(prodsData)
          ? prodsData
          : (prodsData?.products || []);
        const featuredList = Array.isArray(featured)
          ? featured
          : (featured?.products || productList.slice(0, 8));

        setCategories(Array.isArray(cats) ? cats : (cats?.categories || []));
        setAllProducts(productList);
        setFeaturedProducts(featuredList.length > 0 ? featuredList : productList.slice(0, 8));
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Separate the 5 main categories from the Additional Essentials
  const mainCategories = categories.filter(c => c.name !== 'Additional Essentials');
  const additionalEssentials = categories.find(c => c.name === 'Additional Essentials');

  return (
    <div className="bg-[#f9f9f7] min-h-screen">
      
      {/* =========================================================================
          SECTION 1: HERO PROMOTIONAL BANNER SECTION
          ========================================================================= */}
      <section className="site-container pt-4 sm:pt-6 pb-4 sm:pb-6">
        <ScrollReveal direction="fade" duration={700}>
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-neutral-800 bg-[#0d0f12] flex items-center min-h-[460px] sm:min-h-[480px] lg:min-h-[500px]"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center',
              backgroundSize: 'cover'
            }}
          >
            {/* Subtle mobile readability shield */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent sm:from-black/75 sm:via-black/35 sm:to-transparent pointer-events-none md:hidden" />

            {/* Left Text Overlay Container */}
            <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14">
              <div className="max-w-xl sm:max-w-lg lg:max-w-[540px] flex flex-col justify-center space-y-4 sm:space-y-5">
                
                {/* Badge */}
                <ScrollReveal direction="up" delay={100} duration={600} distance={15}>
                  <span className="inline-flex items-center gap-1.5 bg-[#171717]/90 text-[#ffdf9c] border border-neutral-700/80 px-3.5 py-1.5 rounded-full font-['Inter'] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase shadow-xs backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffdf9c] animate-pulse"></span>
                    PREMIUM STONE CARE PRODUCTS
                  </span>
                </ScrollReveal>

                {/* Heading */}
                <ScrollReveal direction="up" delay={200} duration={600} distance={20}>
                  <h1 className="font-['Manrope'] font-bold text-2xl sm:text-4xl lg:text-[46px] text-white tracking-tight leading-[1.14]">
                    Premium Stone Care &amp; Surface Solutions
                  </h1>
                </ScrollReveal>

                {/* Description */}
                <ScrollReveal direction="up" delay={300} duration={600} distance={20}>
                  <p className="font-['Inter'] text-sm sm:text-base text-neutral-300 leading-relaxed max-w-lg">
                    Explore premium marble and granite polishing materials, adhesives, sealers, cleaners and professional tools from trusted brands.
                  </p>
                </ScrollReveal>

                {/* CTA Buttons */}
                <ScrollReveal direction="up" delay={400} duration={600} distance={20}>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                    <a
                      href="#all-products-section"
                      className="bg-black hover:bg-neutral-900 text-[#ffdf9c] border border-neutral-700 hover:border-[#ffdf9c]/50 font-['Inter'] font-semibold text-xs sm:text-sm px-6 py-3 sm:py-3.5 rounded-lg inline-flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      <span>Shop All Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    <a
                      href="#shop-by-category-section"
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-['Inter'] font-medium text-xs sm:text-sm px-5 py-3 sm:py-3.5 rounded-lg backdrop-blur-xs transition-colors"
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

      {/* CUSTOMER TRUST BENEFITS BAR */}
      <section className="site-container pb-8 sm:pb-12">
        <ScrollReveal direction="up" delay={150} duration={600} distance={20}>
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#e2e3e1] shadow-2xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-['Manrope'] font-bold text-xs sm:text-sm text-black leading-tight">
                    Genuine Products
                  </span>
                  <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">
                    100% Authentic Quality
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-800">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-['Manrope'] font-bold text-xs sm:text-sm text-black leading-tight">
                    Secure Payments
                  </span>
                  <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">
                    UPI, Cards &amp; NetBanking
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-800">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-['Manrope'] font-bold text-xs sm:text-sm text-black leading-tight">
                    Delivery Across India
                  </span>
                  <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">
                    Fast &amp; Safe Direct Shipping
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-['Manrope'] font-bold text-xs sm:text-sm text-black leading-tight">
                    Customer Support
                  </span>
                  <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">
                    Expert Chemical Guidance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* =========================================================================
          SECTION 2: SHOP BY CATEGORY
          ========================================================================= */}
      <section id="shop-by-category-section" className="py-8 sm:py-12">
        <div className="site-container">
          <ScrollReveal direction="up" duration={600} distance={20}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-wider text-amber-700 block mb-1">
                  Store Catalog
                </span>
                <h2 className="font-['Manrope'] font-bold text-2xl sm:text-3xl lg:text-4xl text-black tracking-tight">
                  Shop by Category
                </h2>
                <p className="font-['Inter'] text-xs sm:text-sm text-neutral-600 mt-1 max-w-lg">
                  Discover specialized materials, diamond tools, and chemicals tailored for stone surface care.
                </p>
              </div>
              <Link
                to="/products"
                className="text-xs font-semibold text-black hover:text-amber-700 inline-flex items-center gap-1 uppercase tracking-wider font-['Inter'] transition-colors group"
              >
                <span>View All Categories</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          {/* 5 Main Categories Grid with Staggered Reveal */}
          <StaggerContainer
            staggerDelay={80}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5"
          >
            {mainCategories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </StaggerContainer>

          {/* Additional Essentials Subsection Card */}
          {additionalEssentials && (
            <ScrollReveal direction="up" delay={200} duration={600} distance={20}>
              <div className="mt-5 p-4 sm:p-5 bg-white rounded-xl border border-[#e2e3e1] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-200">
                    <img
                      src={additionalEssentials.image}
                      alt={additionalEssentials.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-neutral-100 text-neutral-700 mb-0.5">
                      Jobsite Supplies
                    </div>
                    <h4 className="font-['Manrope'] font-bold text-sm sm:text-base text-black">
                      {additionalEssentials.name}
                    </h4>
                    <p className="font-['Inter'] text-xs text-neutral-500 line-clamp-1 max-w-xl">
                      {additionalEssentials.description}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/products?category=${encodeURIComponent(additionalEssentials.name)}`}
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-4 py-2.5 rounded-lg text-xs font-medium font-['Inter'] transition-colors shadow-2xs"
                >
                  <span>Browse Essentials</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CUSTOMER BEST SELLERS
          ========================================================================= */}
      <section className="py-12 sm:py-16 bg-[#ffffff] border-y border-[#e2e3e1]">
        <div className="site-container">
          <ScrollReveal direction="up" duration={600} distance={20}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-wider text-amber-700 block mb-1">
                  Highest Rated &amp; Frequently Bought
                </span>
                <h2 className="font-['Manrope'] font-bold text-2xl sm:text-3xl lg:text-4xl text-black tracking-tight">
                  Customer Best Sellers
                </h2>
                <p className="font-['Inter'] text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                  Popular products customers choose for stone care, polishing and installation.
                </p>
              </div>
              <Link
                to="/products"
                className="text-xs font-semibold text-black hover:text-amber-700 inline-flex items-center gap-1 uppercase tracking-wider font-['Inter'] transition-colors group"
              >
                <span>View All Products</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Staggered Product Cards Grid */}
          <StaggerContainer
            staggerDelay={70}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5"
          >
            {featuredProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </StaggerContainer>

          <ScrollReveal direction="up" delay={200} duration={600} distance={15}>
            <div className="mt-10 text-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-[#ffdf9c] font-['Inter'] font-semibold text-xs sm:text-sm px-7 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
              >
                <span>Explore Complete Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: TWO PROMOTIONAL CATEGORY CARDS
          ========================================================================= */}
      <section className="py-12 sm:py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner 1: Stone Polishing Solutions */}
            <ScrollReveal direction="left" duration={650} distance={25}>
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1c1c1c] via-[#141414] to-black text-white p-7 sm:p-9 flex flex-col justify-between min-h-[260px] border border-neutral-800 shadow-md group hover:border-neutral-700 transition-colors">
                <div className="relative z-10 max-w-md">
                  <span className="inline-block bg-[#ffdf9c]/15 text-[#ffdf9c] border border-[#ffdf9c]/30 text-[10px] sm:text-[11px] font-bold font-['Inter'] px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
                    Mirror Shine Restoration
                  </span>
                  <h3 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-white tracking-tight">
                    Marble &amp; Granite Care Solutions
                  </h3>
                  <p className="font-['Inter'] text-xs sm:text-sm text-neutral-300 mt-2.5 leading-relaxed">
                    Restore deep natural gloss, remove stubborn stains, and protect granite countertops and marble floors with authentic Tenax, Akemi, and Surie crystal shines.
                  </p>
                </div>
                <div className="relative z-10 pt-6">
                  <Link
                    to="/products?category=Marble+%26+Granite+Polishing"
                    className="inline-flex items-center gap-2 bg-[#ffdf9c] text-black hover:bg-amber-400 font-semibold font-['Inter'] text-xs uppercase tracking-wider px-5 py-3 rounded-lg shadow-xs transition-colors"
                  >
                    <span>Shop Stone Care</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Banner 2: Tile Adhesives & Grouts */}
            <ScrollReveal direction="right" duration={650} distance={25}>
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a1e06] via-[#1c1404] to-[#120d02] text-white p-7 sm:p-9 flex flex-col justify-between min-h-[260px] border border-amber-900/60 shadow-md group hover:border-amber-800 transition-colors">
                <div className="relative z-10 max-w-md">
                  <span className="inline-block bg-white/10 text-amber-200 border border-amber-400/30 text-[10px] sm:text-[11px] font-bold font-['Inter'] px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
                    Durable Surface Bonding
                  </span>
                  <h3 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-white tracking-tight">
                    Tile Adhesives &amp; Epoxy Grouts
                  </h3>
                  <p className="font-['Inter'] text-xs sm:text-sm text-amber-200/90 mt-2.5 leading-relaxed">
                    Waterproof Kerakoll Bioflex tile adhesives, high-strength Mapei mortars, and stain-resistant MYK Laticrete epoxy grouts for home and project renovations.
                  </p>
                </div>
                <div className="relative z-10 pt-6">
                  <Link
                    to="/products?category=Tile+Adhesives+%26+Epoxy+Grouts"
                    className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-100 font-semibold font-['Inter'] text-xs uppercase tracking-wider px-5 py-3 rounded-lg shadow-xs transition-colors"
                  >
                    <span>Shop Adhesives</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: EXPLORE ALL PRODUCTS (ON HOMEPAGE)
          ========================================================================= */}
      <ExploreAllProducts products={allProducts} categories={categories} />

    </div>
  );
}
