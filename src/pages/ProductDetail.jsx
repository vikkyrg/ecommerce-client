import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  Award,
  MessageCircle,
  Phone,
  Check
} from 'lucide-react';
import { products } from '../data/catalogData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/products/ProductCard';
import businessConfig from '../config/businessConfig';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const found = products.find(p => p.id === id || p.sku === id);
    if (found) {
      setProduct(found);
      setSelectedVariant(found.size || 'Standard Pack');
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="site-container py-20 text-center">
        <h2 className="font-['Manrope'] font-bold text-2xl text-black">Product Not Found</h2>
        <p className="text-sm text-neutral-500 mt-2">The product you are looking for does not exist or has been moved.</p>
        <Link
          to="/products"
          className="mt-6 inline-block bg-black text-[#ffdf9c] font-semibold text-xs px-5 py-2.5 rounded-md"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-4 sm:py-8 lg:py-10">
      <div className="site-container">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 font-['Inter'] mb-4 sm:mb-6 select-none flex-wrap">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link to="/products" className="hover:text-black transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-black transition-colors truncate max-w-[160px] sm:max-w-[200px]"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-black font-semibold truncate max-w-[180px] sm:max-w-[240px]">
            {product.name}
          </span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 bg-white rounded-2xl p-4 sm:p-8 lg:p-10 border border-[#e2e3e1] shadow-2xs">
          
          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-neutral-50 border border-neutral-200 p-6 sm:p-8 flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full max-h-[300px] sm:max-h-[380px] object-contain transition-transform duration-300 hover:scale-105"
              />
              {product.discount > 0 && (
                <span className="absolute top-3.5 left-3.5 bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                  {product.discount}% OFF
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3.5 right-3.5 p-2.5 rounded-full border shadow-xs transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-neutral-500 border-neutral-200 hover:text-black'
                }`}
                title="Wishlist"
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Trust Badges Bar beneath image */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-neutral-800 block">100% Genuine</span>
                <span className="text-[9px] text-neutral-500 block leading-tight">Direct from Brand</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
                <Truck className="w-4 h-4 text-neutral-700 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-neutral-800 block">All India Express</span>
                <span className="text-[9px] text-neutral-500 block leading-tight">Doorstep Delivery</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
                <RotateCcw className="w-4 h-4 text-amber-700 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-neutral-800 block">7-Day Returns</span>
                <span className="text-[9px] text-neutral-500 block leading-tight">Easy Policy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Information & Purchase CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3 sm:space-y-4">
              
              {/* Brand, Stock, SKU */}
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium flex-wrap">
                <span className="bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded font-bold uppercase tracking-wider text-[10px]">
                  {product.brand}
                </span>
                <span>•</span>
                <span className={product.inStock ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}>
                  {product.inStock ? 'In Stock (Ready to Ship)' : 'Currently Unavailable'}
                </span>
                {product.sku && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-neutral-400">SKU: {product.sku}</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="font-['Manrope'] font-bold text-xl sm:text-2xl lg:text-3xl text-black tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Reviews & Ratings */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-700">4.8</span>
                <span className="text-xs text-neutral-400">({product.reviewsCount || 48} customer reviews)</span>
              </div>

              {/* Price & Tax details */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-['Manrope'] font-extrabold text-2xl sm:text-3xl text-black">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-sm sm:text-base text-neutral-400 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                      Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 font-['Inter']">
                  Price inclusive of all taxes. Free shipping on orders over ₹1,999.
                </p>
              </div>

              {/* Package Size Variant */}
              {product.size && (
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5 uppercase tracking-wide">
                    Package Size: <span className="text-black font-semibold">{product.size}</span>
                  </label>
                  <div className="inline-block px-3 py-1.5 rounded-lg border-2 border-black bg-neutral-50 text-xs font-bold text-black">
                    {product.size}
                  </div>
                </div>
              )}

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-['Inter']">
                {product.description}
              </p>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-neutral-700">Quantity:</span>
                  <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2 hover:bg-neutral-100 transition-colors cursor-pointer text-neutral-600"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-xs text-black">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-2 hover:bg-neutral-100 transition-colors cursor-pointer text-neutral-600"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Dual B2C Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#f4f4f2] hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-neutral-300 transition-all cursor-pointer active:scale-98"
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-black hover:bg-neutral-900 text-[#ffdf9c] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-md"
                  >
                    <Zap className="w-4 h-4 fill-[#ffdf9c]" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

              {/* WhatsApp Technical Assistance Button */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/919738893424?text=${encodeURIComponent(
                    `Hi NS Stone Chemicals, I have a question regarding: ${product.name}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                  <span>Ask a Product Specialist on WhatsApp</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Tabbed Product Technical Details & Specifications */}
        <div className="mt-8 sm:mt-12 bg-white rounded-2xl border border-[#e2e3e1] p-5 sm:p-8 shadow-2xs">
          <div className="flex items-center gap-4 sm:gap-6 border-b border-neutral-200 pb-3 overflow-x-auto text-xs sm:text-sm font-semibold select-none">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'description' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
              }`}
            >
              Description &amp; Applications
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'specs' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'shipping' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
              }`}
            >
              Shipping &amp; Returns
            </button>
          </div>

          <div className="pt-5 text-xs sm:text-sm text-neutral-600 leading-relaxed font-['Inter']">
            {activeTab === 'description' && (
              <div className="space-y-3">
                <p>{product.description}</p>
                <p>
                  Manufactured according to stringent European and Indian surface care standards. Suitable for professional stonemasons, contractors, and home DIY restorers seeking high-gloss finish, oil and water repellence, and long-lasting durability.
                </p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Brand:</span>
                  <span className="font-semibold text-black">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Category:</span>
                  <span className="font-semibold text-black">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Packaging:</span>
                  <span className="font-semibold text-black">{product.size || '1 Unit'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Origin:</span>
                  <span className="font-semibold text-black">Original Brand Stock</span>
                </div>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-2">
                <p>• Dispatched within 24–48 hours from our central warehouse.</p>
                <p>• Fast delivery across India via tracked courier partners (Delhivery, BlueDart, DTDC).</p>
                <p>• 7-Day return policy on unopened, intact containers with original seal.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h3 className="font-['Manrope'] font-bold text-lg sm:text-2xl text-black mb-6">
              Related Products in this Category
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
