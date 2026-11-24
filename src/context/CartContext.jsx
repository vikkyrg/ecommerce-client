import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ns_stone_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('ns_stone_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const id = product.id || product._id || product.slug;
    const cartProduct = { ...product, id };
    setCartItems(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...cartProduct, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = productId => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === productId) {
            return quantity > 0 ? { ...item, quantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
  const couponDiscount = couponCode === 'STONE10'
    ? Math.min(Math.round(cartSubtotal * 0.1), 1000)
    : couponCode === 'WELCOME100'
      ? 100
      : couponCode === 'PREMIUM15'
        ? Math.min(Math.round(cartSubtotal * 0.15), 2500)
        : 0;
  const applyCoupon = code => {
    const normalized = String(code || '').trim().toUpperCase();
    const requirements = {
      STONE10: { minimum: 999 },
      WELCOME100: { minimum: 1499 },
      PREMIUM15: { minimum: 4999 }
    };
    if (!requirements[normalized]) return { success: false, message: 'Invalid coupon code' };
    if (cartSubtotal < requirements[normalized].minimum) {
      return { success: false, message: `Minimum order value of ₹${requirements[normalized].minimum.toLocaleString('en-IN')} required` };
    }
    setCouponCode(normalized);
    return { success: true };
  };
  const removeCoupon = () => setCouponCode('');

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cart: cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal: cartSubtotal,
        couponCode,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
