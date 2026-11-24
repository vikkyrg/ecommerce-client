import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Zap, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = e => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 900);
  };

  const handleBuyNow = e => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  const productId = product.id || product._id || product.slug;

  return (
    <div className="group relative bg-[#ffffff] rounded-xl border border-[#e2e3e1] shadow-2xs hover:shadow-lg hover:border-neutral-400 transition-all duration-350 ease-out flex flex-col h-full overflow-hidden transform hover:-translate-y-1">
      
      {/* Top Badges & Wishlist Overlay */}
      <div className="absolute top-2 left-2 right-2 sm:top-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between z-10 pointer-events-none">
        {product.discount ? (
          <span className="bg-amber-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 rounded tracking-wide uppercase shadow-2xs transition-transform group-hover:scale-105">
            {product.discount}% OFF
          </span>
        ) : product.badge ? (
          <span className="bg-[#171717] text-[#ffdf9c] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded tracking-wider uppercase shadow-2xs transition-transform group-hover:scale-105">
            {product.badge}
          </span>
        ) : (
          <span />
        )}

        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-xs transition-all duration-200 shadow-2xs cursor-pointer active:scale-90 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 scale-105'
              : 'bg-white/90 text-neutral-400 hover:text-rose-600 hover:bg-white border border-neutral-200 hover:scale-105'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isWishlisted ? 'fill-rose-600 scale-105' : ''}`} />
        </button>
      </div>

      {/* Product Image Link to PDP */}
      <Link
        to={`/product/${productId}`}
        className="relative w-full aspect-square p-3 sm:p-5 flex items-center justify-center bg-white overflow-hidden border-b border-neutral-100 cursor-pointer"
      >
        <img
          src={product.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="w-full h-full max-h-[140px] xs:max-h-[160px] sm:max-h-[200px] object-contain transition-transform duration-500 ease-out group-hover:scale-106"
          loading="lazy"
          onError={e => {
            e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';
          }}
        />
      </Link>

      {/* Product Details Section */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between bg-white min-w-0">
        <div className="space-y-1">
          {/* Metadata Row: Brand & Stock Status */}
          <div className="flex items-center gap-1 font-['Inter'] text-[9px] sm:text-[11px] font-medium text-neutral-500 flex-wrap">
            <span className="text-black font-semibold uppercase tracking-wider">{product.brand}</span>
            <span>•</span>
            <span className={product.inStock !== false ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}>
              {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Product Title with PDP Link */}
          <Link to={`/product/${productId}`}>
            <h3 className="font-['Manrope'] font-semibold text-[12px] sm:text-[14px] text-neutral-900 leading-snug line-clamp-2 min-h-[34px] sm:min-h-[38px] group-hover:text-black transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Ratings & Customer Reviews */}
          <div className="flex items-center gap-1 pt-0.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="font-['Inter'] text-[9px] sm:text-[10px] text-neutral-500 font-medium">
              ({product.reviewsCount || 48})
            </span>
          </div>
        </div>

        {/* Pricing & Customer Purchase Actions */}
        <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-neutral-100 flex flex-col justify-end">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {product.price > 0 ? (
              <span className="font-['Manrope'] text-sm sm:text-lg font-bold text-black tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            ) : (
              <span className="font-['Manrope'] text-xs sm:text-sm font-bold text-amber-800 tracking-tight">
                Price On Request
              </span>
            )}
            {product.mrp && product.mrp > product.price && (
              <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <p className="font-['Inter'] text-[8px] sm:text-[10px] text-neutral-400 mt-0.5">
            Incl. of taxes
          </p>

          {/* Dual Direct B2C Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-2">
            <button
              onClick={handleAddToCart}
              className={`w-full font-['Inter'] text-[10px] sm:text-xs font-semibold py-1.5 sm:py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-all duration-200 border cursor-pointer active:scale-95 ${
                addedAnimation
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-[#f4f4f2] hover:bg-neutral-200 text-black border-neutral-300'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce" />
                  <span className="truncate">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-700 flex-shrink-0" />
                  <span className="truncate">Add</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full bg-[#171717] hover:bg-black text-[#ffffff] hover:text-[#ffdf9c] font-['Inter'] text-[10px] sm:text-xs font-semibold py-1.5 sm:py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs hover:shadow-xs"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffdf9c] flex-shrink-0 fill-[#ffdf9c]" />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
