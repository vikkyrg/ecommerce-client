import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer({ onProceedCheckout }) {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#171717] text-white flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#ffdf9c]" />
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg tracking-wide">
                My Shopping Cart ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400 mb-3.5">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-['Manrope'] font-bold text-base text-neutral-800">
                  Your cart is empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  Browse our genuine stone care, adhesives, and polishing products to add items.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 inline-flex items-center gap-2 bg-black text-[#ffdf9c] text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-neutral-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-white rounded border border-neutral-200 p-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-semibold text-xs text-black line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider block mt-0.5">
                        {item.brand} {item.size && `• ${item.size}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-neutral-300 rounded bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-black min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-black font-['Manrope']">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Calculation */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#f9f9f7] border-t border-neutral-200 space-y-3">
              
              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="Enter Coupon (try STONE10)"
                    className="w-full bg-white text-xs pl-8 pr-2 py-2 rounded border border-neutral-300 uppercase focus:outline-none focus:border-black"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-neutral-800 hover:bg-black text-white text-xs font-semibold px-3 py-2 rounded transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponError && (
                <p className="text-[11px] text-rose-600">{couponError}</p>
              )}
              {appliedDiscount > 0 && (
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Coupon applied: ₹{appliedDiscount.toLocaleString('en-IN')} saved!
                </p>
              )}

              {/* Order breakdown */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-neutral-200">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery</span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE (Orders &gt; ₹1,999)</span>
                  ) : (
                    <span className="font-semibold text-neutral-900">₹{deliveryCharge}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-black pt-2 border-t border-neutral-300 font-['Manrope']">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Direct Checkout Button */}
              <div className="pt-1.5 space-y-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    if (onProceedCheckout) onProceedCheckout({ subtotal: cartSubtotal, discount: appliedDiscount, delivery: deliveryCharge, total: finalTotal });
                  }}
                  className="w-full bg-[#171717] text-[#ffdf9c] hover:bg-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure 256-Bit Encrypted Checkout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
