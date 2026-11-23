import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleBuyNow = e => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  return (
    <div className="group relative bg-[#ffffff] rounded-lg border border-[#e2e3e1] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-neutral-400 transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* Top Badges & Wishlist Overlay */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
        {product.discount ? (
          <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase shadow-2xs">
            {product.discount}% OFF
          </span>
        ) : product.badge ? (
          <span className="bg-[#171717] text-[#ffdf9c] text-[10px] font-bold px-2.5 py-1 rounded tracking-wider uppercase shadow-2xs">
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
          className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-xs transition-colors shadow-2xs cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'bg-white/90 text-neutral-400 hover:text-black hover:bg-white border border-neutral-200'
          }`}
          title="Add to Wishlist"
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* Product Image Link to PDP */}
      <Link
        to={`/product/${product.id}`}
        className="relative w-full aspect-square p-5 sm:p-6 flex items-center justify-center bg-white overflow-hidden border-b border-neutral-100 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full max-h-[180px] sm:max-h-[210px] object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Details Section */}
      <div className="p-3.5 sm:p-4.5 flex-1 flex flex-col justify-between bg-white">
        <div className="space-y-1.5">
          {/* Metadata Row: Brand & Stock Status */}
          <div className="flex items-center gap-1.5 font-['Inter'] text-[10px] sm:text-[11px] font-medium text-neutral-500">
            <span className="text-black font-semibold uppercase tracking-wider">{product.brand}</span>
            <span>•</span>
            <span className={product.inStock ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            {product.size && (
              <>
                <span>•</span>
                <span className="truncate max-w-[100px]">{product.size}</span>
              </>
            )}
          </div>

          {/* Product Title with PDP Link */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-['Manrope'] font-semibold text-[13px] sm:text-[14px] text-neutral-900 leading-snug line-clamp-2 min-h-[38px] group-hover:text-black transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Ratings & Customer Reviews */}
          <div className="flex items-center gap-1 pt-0.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="font-['Inter'] text-[10px] sm:text-[11px] text-neutral-500 font-medium">
              ({product.reviewsCount || 48})
            </span>
          </div>
        </div>

        {/* Pricing & Customer Purchase Actions */}
        <div className="pt-3 mt-3 border-t border-neutral-100 flex flex-col justify-end">
          <div className="flex items-baseline gap-2">
            <span className="font-['Manrope'] text-base sm:text-lg font-bold text-black tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-[11px] sm:text-xs text-neutral-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-[11px] text-emerald-700 font-semibold ml-auto">
                Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <p className="font-['Inter'] text-[9px] sm:text-[10px] text-neutral-400 mt-0.5">
            Inclusive of all taxes
          </p>

          {/* Dual Direct B2C Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-2 mt-2.5">
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full bg-[#f4f4f2] hover:bg-neutral-200 text-black font-['Inter'] text-[11px] sm:text-xs font-semibold py-2 px-2.5 rounded-md flex items-center justify-center gap-1.5 transition-colors border border-neutral-300 cursor-pointer active:scale-[0.98]"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-700 flex-shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full bg-[#171717] hover:bg-black text-[#ffffff] hover:text-[#ffdf9c] font-['Inter'] text-[11px] sm:text-xs font-semibold py-2 px-2.5 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.98] shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-[#ffdf9c] flex-shrink-0 fill-[#ffdf9c]" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
