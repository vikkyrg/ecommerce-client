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
  Phone
} from 'lucide-react';
import { products } from '../data/catalogData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
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

  useEffect(() => {
    const found = products.find(p => p.id === id);
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
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-6 sm:py-10">
      <div className="site-container">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 font-['Inter'] mb-6 select-none flex-wrap">
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
            className="hover:text-black transition-colors truncate max-w-[200px]"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-black font-semibold truncate max-w-[220px]">
            {product.name}
          </span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#e2e3e1] shadow-2xs">
          
          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-xl bg-neutral-50 border border-neutral-200 p-8 flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full max-h-[380px] object-contain"
              />
              {product.discount > 0 && (
                <span className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                  {product.discount}% OFF
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-2.5 rounded-full border shadow-xs transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-neutral-400 hover:text-black border-neutral-200'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Thumbnail preview strip */}
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-lg border-2 border-black p-2 bg-neutral-50 flex items-center justify-center cursor-pointer">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing & Purchase Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3.5">
              
              {/* Brand and Stock Status */}
              <div className="flex items-center gap-2 font-['Inter'] text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <span className="text-black bg-neutral-100 px-2 py-0.5 rounded">
                  {product.brand}
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {product.inStock ? 'In Stock — Ready to Ship' : 'Out of Stock'}
                </span>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-['Manrope'] font-bold text-2xl sm:text-3xl text-black leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Reviews & Ratings */}
              <div className="flex items-center gap-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="font-['Inter'] text-xs font-semibold text-neutral-700">
                  {product.rating} ({product.reviewsCount} customer reviews)
                </span>
              </div>

              {/* Retail Price Display */}
              <div className="pt-2 border-t border-neutral-100">
                <div className="flex items-baseline gap-3">
                  <span className="font-['Manrope'] text-3xl font-extrabold text-black">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-base text-neutral-400 line-through">
                      MRP ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      Save ₹{(product.mrp - product.price).toLocaleString('en-IN')} ({product.discount}%)
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Inclusive of all taxes. Free delivery on orders above ₹1,999.
                </p>
              </div>

              {/* Product Size / Variant */}
              {product.size && (
                <div className="pt-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                    Package Size: <span className="text-black font-semibold">{selectedVariant}</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedVariant(product.size)}
                      className={`px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                        selectedVariant === product.size
                          ? 'bg-black text-[#ffdf9c] border-black'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
                      }`}
                    >
                      {product.size}
                    </button>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="pt-2">
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector and CTA Buttons */}
              <div className="pt-4 border-t border-neutral-200 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-neutral-700">Quantity:</span>
                  <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2 text-neutral-600 hover:bg-neutral-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-sm font-bold text-black min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-2 text-neutral-600 hover:bg-neutral-100"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Direct B2C Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#f4f4f2] hover:bg-neutral-200 text-black font-['Inter'] text-sm font-semibold py-3.5 px-5 rounded-lg flex items-center justify-center gap-2 border border-neutral-300 transition-colors cursor-pointer active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-4 h-4 text-neutral-800" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-black hover:bg-neutral-800 text-[#ffdf9c] font-['Inter'] text-sm font-bold py-3.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98] shadow-sm"
                  >
                    <Zap className="w-4 h-4 fill-[#ffdf9c]" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Direct WhatsApp Quick Enquiry & Order Button */}
                <div className="pt-1">
                  <a
                    href={businessConfig.getWhatsAppProductUrl(product.name, product.sku)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-['Inter'] text-xs sm:text-sm font-bold py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-2xs hover:shadow-sm"
                    title="Order or Ask Questions on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Ask or Order via WhatsApp ({businessConfig.phone})</span>
                  </a>
                </div>

                {addedNotice && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Added {quantity} item(s) to your shopping cart!</span>
                  </div>
                )}
              </div>

              {/* Direct Shipping & Assurance Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-neutral-700 flex-shrink-0" />
                  <span>Ships in 24 Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Genuine Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-neutral-700 flex-shrink-0" />
                  <span>Easy 7-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Usage Information Tabs */}
        <div className="mt-8 bg-white rounded-2xl p-6 sm:p-8 border border-[#e2e3e1] shadow-2xs">
          <h3 className="font-['Manrope'] font-bold text-lg text-black mb-4">
            Product Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications &&
              Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                >
                  <span className="font-semibold text-neutral-600">{key}</span>
                  <span className="font-bold text-black">{val}</span>
                </div>
              ))}
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs">
              <span className="font-semibold text-neutral-600">Brand Manufacturer</span>
              <span className="font-bold text-black">{product.brand}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs">
              <span className="font-semibold text-neutral-600">Category</span>
              <span className="font-bold text-black">{product.category}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
