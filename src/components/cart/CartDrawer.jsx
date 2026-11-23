import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck, Check } from 'lucide-react';
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

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#171717] text-white flex items-center justify-between border-b border-neutral-800 flex-shrink-0">
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
                  className="mt-5 inline-flex items-center gap-2 bg-black text-[#ffdf9c] text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-white rounded-lg border border-neutral-200 p-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-semibold text-xs text-black line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-neutral-400 block font-mono mt-0.5 truncate">
                        {item.brand} {item.size && `• ${item.size}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-neutral-200">
                      <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-xs text-black font-['Manrope']">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Actions */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/70 space-y-3 flex-shrink-0">
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-black">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold text-black">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-black">
                  <span>Total:</span>
                  <span className="font-['Manrope'] text-base text-black">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  if (onProceedCheckout) {
                    onProceedCheckout({
                      subtotal: cartSubtotal,
                      shipping: deliveryCharge,
                      discount: appliedDiscount,
                      total: finalTotal
                    });
                  }
                }}
                className="w-full bg-black hover:bg-neutral-900 text-[#ffdf9c] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
              >
                <span>Proceed to Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
