import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Check,
  Package
} from 'lucide-react';
import { fetchProductById, fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/products/ProductCard';
import { getProductPricing } from '../utils/productPricing';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    let active = true;
    setProduct(null);
    setRelatedProducts([]);
    setLoading(true);
    setLoadError('');
    fetchProductById(id)
      .then(async found => {
        if (!active) return;
        setProduct(found);
        window.scrollTo(0, 0);
        const related = await fetchProducts({ category: found.category, limit: 5 });
        if (active) {
          setRelatedProducts((related.products || [])
            .filter(item => String(item._id || item.id || item.slug) !== String(found._id || found.id || found.slug))
            .slice(0, 4));
        }
      })
      .catch(error => {
        if (active) setLoadError(error.message || 'Unable to load this product');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return <div className="site-container py-20 text-center text-sm text-neutral-500">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="site-container py-20 text-center">
        <h2 className="font-['Manrope'] font-bold text-2xl text-black">Product Not Found</h2>
        <p className="text-sm text-neutral-500 mt-2">{loadError || 'The product you are looking for does not exist or has been moved.'}</p>
        <Link
          to="/products"
          className="mt-6 inline-block bg-black text-[#ffdf9c] font-semibold text-xs px-5 py-2.5 rounded-md"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const productId = product.id || product._id || product.slug;
  const isWishlisted = isInWishlist(productId);

  const { originalPrice, effectivePrice, discountPercent, hasPrice } = getProductPricing(product);

  const availableStock = Number.isSafeInteger(product.stock) && product.stock >= 0
    ? product.stock
    : null;
  const unavailable = availableStock === 0;
  const canPurchase = hasPrice && availableStock !== null && !unavailable;
  const availability = unavailable
    ? 'Out of Stock'
    : availableStock !== null
      ? `${availableStock} in stock`
      : 'Stock not listed';

  const handleAddToCart = () => {
    addToCart({ ...product, price: effectivePrice }, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, price: effectivePrice }, quantity);
    setIsCartOpen(true);
  };

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
            {product.categoryName || product.category}
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
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full max-h-[300px] sm:max-h-[380px] object-contain transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class=\"flex items-center justify-center w-full h-full\"><svg class=\"w-16 h-16 text-neutral-300\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"m7.5 4.27 9 5.15\"/><path d=\"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z\"/><path d=\"m3.3 7 8.7 5 8.7-5\"/><path d=\"M12 22V12\"/></svg></span>';
                  }}
                />
              ) : (
                <Package className="w-16 h-16 text-neutral-300" aria-label="No product image" />
              )}
              {discountPercent > 0 && (
                <span className="absolute top-3.5 left-3.5 bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                  {discountPercent}% OFF
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3.5 right-3.5 p-2.5 rounded-full border shadow-xs transition-colors cursor-pointer ${isWishlisted
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
                {product.brand && (
                  <span className="bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded font-bold uppercase tracking-wider text-[10px]">
                    {product.brand}
                  </span>
                )}
                {product.brand && <span>•</span>}
                <span className={availableStock > 0 ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}>
                  {availability}
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

              {product.rating != null && (
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(Math.round(product.rating))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-neutral-700">{Number(product.rating).toFixed(1)}</span>
                  {product.reviewsCount != null && (
                    <span className="text-xs text-neutral-400">({product.reviewsCount} customer reviews)</span>
                  )}
                </div>
              )}

              {/* Price & Tax details */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  {hasPrice ? (
                    <span className="font-['Manrope'] font-extrabold text-2xl sm:text-3xl text-black">
                      ₹{Number(effectivePrice).toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="font-['Manrope'] font-extrabold text-2xl sm:text-3xl text-black">Price unavailable</span>
                  )}
                  {hasPrice && originalPrice != null && originalPrice > effectivePrice && (
                    <span className="text-sm sm:text-base text-neutral-400 line-through">
                      ₹{Number(originalPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                  {hasPrice && originalPrice != null && originalPrice > effectivePrice && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                      Save ₹{(originalPrice - effectivePrice).toLocaleString('en-IN')}{discountPercent ? ` (${discountPercent}% OFF)` : ''}
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
              {product.shortDescription && (
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-['Inter']">
                  {product.shortDescription}
                </p>
              )}

              {/* Product Features Checklist (Highlights) */}
              {Array.isArray(product.features) && product.features.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block">Key Features</span>
                  <ul className="space-y-1">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Purchase controls are shown only when the catalog has a confirmed price. */}
              <div className="space-y-3 pt-2">
                {canPurchase ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-neutral-700">Quantity:</span>
                      <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          className="p-2 hover:bg-neutral-100 transition-colors cursor-pointer text-neutral-600"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-bold text-xs text-black">{quantity}</span>
                        <button
                          onClick={() => setQuantity(q => Math.min(availableStock, q + 1))}
                          disabled={quantity >= availableStock}
                          className="p-2 hover:bg-neutral-100 transition-colors cursor-pointer text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

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
                  </>
                ) : (
                  <p className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600">
                    {unavailable
                      ? 'This product is currently out of stock.'
                      : !hasPrice
                        ? 'A current price is unavailable for this product.'
                        : 'Stock availability has not been confirmed for this product.'}
                  </p>
                )}
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
              className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'description' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
                }`}
            >
              Full Description
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'applications' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
                }`}
            >
              Applications &amp; Uses
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'features' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
                }`}
            >
              Product Features
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'specs' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
                }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-2 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'shipping' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
                }`}
            >
              Shipping &amp; Returns
            </button>
          </div>

          <div className="pt-5 text-xs sm:text-sm text-neutral-600 leading-relaxed font-['Inter']">
            {activeTab === 'description' && (
              <div className="space-y-3">
                <p className="whitespace-pre-line">{product.description || product.shortDescription || 'No detailed product description is available.'}</p>
              </div>
            )}
            {activeTab === 'applications' && (
              <div className="space-y-3">
                <p className="whitespace-pre-line">{product.applications || 'No application details specified.'}</p>
              </div>
            )}
            {activeTab === 'features' && (
              <div className="space-y-2">
                {Array.isArray(product.features) && product.features.length > 0 ? (
                  <ul className="space-y-1.5">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No specific features listed for this product.</p>
                )}
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Brand:</span>
                  <span className="font-semibold text-black">{product.brand || 'Not specified'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Category:</span>
                  <span className="font-semibold text-black">{product.categoryName || product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Packaging:</span>
                  <span className="font-semibold text-black">{product.size || product.variants?.map(variant => variant.size || variant.name).filter(Boolean).join(', ') || 'Not specified'}</span>
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
