import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck, Check, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer({ onProceedCheckout }) {
  const navigate = useNavigate();
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
    cartStockError
  } = useCart();

  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = e => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'STONE10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedDiscount(discount);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon. Try STONE10 for 10% off.');
    }
  };

  const deliveryCharge = cartSubtotal >= 1999 || cartSubtotal === 0 ? 0 : 150;
  const finalTotal = Math.max(0, cartSubtotal - appliedDiscount + deliveryCharge);
  const hasUnpricedItems = cartItems.some(item =>
    item.price === null || item.price === undefined || !Number.isFinite(Number(item.price))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-0">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Container:
          - Mobile (< 640px): Centered, compact popup (92-94% width, max-w-[400px], auto height up to 80vh)
          - Tablet/Desktop (>= 640px): Fixed right-side drawer (h-full max-w-md sm:rounded-l-2xl)
      */}
      <div className="relative z-10 w-full flex items-center justify-center sm:justify-end sm:fixed sm:inset-y-0 sm:right-0 sm:pl-10 pointer-events-none">
        <div className="w-[94%] max-w-[400px] sm:w-full sm:max-w-md bg-white shadow-2xl flex flex-col rounded-2xl sm:rounded-none sm:rounded-l-2xl overflow-hidden pointer-events-auto max-h-[82vh] sm:max-h-full sm:h-full border border-neutral-200 sm:border-0 transition-all">
          
          {/* Header */}
          <div className="px-3.5 py-3 sm:px-5 sm:py-4 bg-[#171717] text-white flex items-center justify-between border-b border-neutral-800 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#242424] border border-neutral-700/60 flex items-center justify-center text-[#ffdf9c] flex-shrink-0">
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <h2 className="font-['Manrope'] font-bold text-sm sm:text-base tracking-wide leading-tight text-white">
                  Shopping Cart
                </h2>
                <span className="text-[11px] sm:text-xs text-neutral-400 font-['Inter']">
                  ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Cart Items List: Scrollable middle section with compact natural height */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2.5 sm:space-y-3 min-h-0">
            {cartItems.length === 0 ? (
              <div className="text-center py-8 sm:py-16">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400 mb-2.5">
                  <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-['Manrope'] font-bold text-sm sm:text-base text-neutral-800">
                  Your cart is empty
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  Browse our genuine stone care, adhesives, and polishing products to add items.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 inline-flex items-center gap-2 bg-black text-[#ffdf9c] text-xs font-semibold px-4 py-2 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex gap-2.5 sm:gap-3 p-2 sm:p-3 bg-[#fafaf9] rounded-xl border border-neutral-200/90 shadow-2xs hover:border-neutral-300 transition-colors"
                >
                  {/* Product Image (approx 65-75px square) */}
                  <div className="w-[68px] h-[68px] sm:w-20 sm:h-20 bg-white rounded-lg border border-neutral-200 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    ) : (
                      <Package className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-300" aria-label="No product image" />
                    )}
                  </div>

                  {/* Product Info & Controls */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-semibold text-xs sm:text-[13px] text-black line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors flex-shrink-0 ml-1"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-neutral-500 block font-mono mt-0.5 truncate">
                        {item.brand || 'NS Stone'} {item.size && `• ${item.size}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-1.5 pt-1 border-t border-neutral-200/70">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-neutral-300 rounded-md bg-white shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-1.5 py-0.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-l-md cursor-pointer transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-black min-w-[18px] text-center font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={!Number.isSafeInteger(item.stock) || item.quantity >= item.stock}
                          className="px-1.5 py-0.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-r-md cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-extrabold text-xs sm:text-sm text-black font-['Manrope']">
                        {item.price == null ? 'Price unavailable' : `₹${(Number(item.price) * item.quantity).toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary & Checkout Button: Directly follows items without unnecessary white space */}
          {cartItems.length > 0 && (
            <div className="p-3 sm:p-5 border-t border-neutral-200 bg-[#fbfbfa] space-y-2.5 sm:space-y-3 flex-shrink-0">
              <div className="space-y-1 text-xs text-neutral-600">
                {cartStockError && (
                  <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-900 text-xs">
                    {cartStockError}
                  </p>
                )}
                {hasUnpricedItems && (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 p-1.5 text-amber-900 text-xs">
                    Remove items with unconfirmed pricing before checkout.
                  </p>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Subtotal:</span>
                  <span className="font-semibold text-black">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Shipping:</span>
                  <span className="font-semibold text-black">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        FREE
                      </span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-neutral-200/90 text-xs sm:text-sm font-bold text-black">
                  <span>Total Amount:</span>
                  <span className="font-['Manrope'] text-sm sm:text-base text-black font-extrabold">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                disabled={hasUnpricedItems || Boolean(cartStockError)}
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full bg-[#111111] hover:bg-neutral-900 text-[#ffdf9c] font-['Manrope'] font-bold text-xs sm:text-sm py-2.5 sm:py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-800"
              >
                <span>Proceed to Order</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffdf9c]" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
