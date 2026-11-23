import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="bg-[#f9f9f7] min-h-[70vh] py-16 flex items-center">
        <div className="site-container max-w-md mx-auto text-center bg-white p-8 sm:p-12 rounded-2xl border border-[#e2e3e1] shadow-2xs">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 fill-rose-500" />
          </div>
          <h2 className="font-['Manrope'] font-bold text-2xl text-black">Your Wishlist is Empty</h2>
          <p className="font-['Inter'] text-xs sm:text-sm text-neutral-500 mt-2 mb-6">
            Tap the heart icon on any product to save it for easy access later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-black text-[#ffdf9c] font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-8 sm:py-12">
      <div className="site-container">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-['Manrope'] font-bold text-2xl sm:text-3xl text-black tracking-tight">
              My Wishlist ({wishlist.length} saved)
            </h1>
            <p className="font-['Inter'] text-xs text-neutral-500 mt-1">
              Your favorite stone care chemicals, diamond abrasives and adhesives.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
