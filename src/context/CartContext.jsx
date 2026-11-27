import React, { createContext, useContext, useState, useEffect } from 'react';
import { resolveImageUrl } from '../services/apiClient';
import { fetchProductById } from '../services/api';
import { getProductPricing } from '../utils/productPricing';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ns_stone_cart');
      const items = saved ? JSON.parse(saved) : [];
      return Array.isArray(items)
        ? items.map(item => ({ ...item, price: null, image: resolveImageUrl(item.image) }))
        : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [cartPricingLoading, setCartPricingLoading] = useState(false);
  const [cartPricingError, setCartPricingError] = useState('');
  const [cartStockMessage, setCartStockMessage] = useState('');

  useEffect(() => {
    if (cartItems.length === 0) return undefined;
    let isCancelled = false;

    const refreshSavedCartPrices = async () => {
      setCartPricingLoading(true);
      const results = await Promise.all(cartItems.map(async item => {
        try {
          const product = await fetchProductById(item.id);
          const pricing = getProductPricing(product);
          if (!pricing.hasPrice) {
            return { id: item.id, error: new Error(`No current price is available for ${item.name}`) };
          }
          return { id: item.id, product, price: pricing.effectivePrice };
        } catch (error) {
          return { id: item.id, error };
        }
      }));

      if (isCancelled) return;
      const resultsById = new Map(results.map(result => [String(result.id), result]));
      setCartItems(currentItems => currentItems.map(item => {
        const result = resultsById.get(String(item.id));
        if (!result) return item;
        if (result.error) return { ...item, price: null, stock: null };
        return {
          ...item,
          ...result.product,
          id: item.id,
          quantity: item.quantity,
          price: result.price,
          image: resolveImageUrl(result.product.image)
        };
      }));

      const failures = results.filter(result => result.error);
      setCartPricingError(failures.length > 0
        ? failures.map(result => result.error.message || 'Unable to refresh a cart product').join(' ')
        : '');
      setCartPricingLoading(false);
    };

    refreshSavedCartPrices();
    return () => {
      isCancelled = true;
    };
  }, []);

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
    const stock = product.stock;
    const existingQuantity = cartItems.find(item => item.id === id)?.quantity || 0;
    if (!Number.isSafeInteger(stock) || stock < 0) {
      setCartStockMessage(`Stock availability for ${product.name} could not be confirmed. Refresh the product and try again.`);
      setIsCartOpen(true);
      return false;
    }
    if (existingQuantity + quantity > stock) {
      setCartStockMessage(`Only ${stock} units are currently available for ${product.name}.`);
      setIsCartOpen(true);
      return false;
    }
    setCartStockMessage('');
    setCartItems(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item =>
          item.id === id ? { ...item, ...cartProduct, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...cartProduct, quantity }];
    });
    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = productId => {
    setCartStockMessage('');
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const item = cartItems.find(cartItem => cartItem.id === productId);
    if (quantity > 0 && item &&
      (!Number.isSafeInteger(item.stock) || quantity > item.stock)) {
      const availableStock = Number.isSafeInteger(item.stock) ? item.stock : 0;
      setCartStockMessage(`Only ${availableStock} units are currently available for ${item.name}.`);
      return;
    }
    setCartStockMessage('');
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
    setCartStockMessage('');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartStockError = cartItems.reduce((message, item) => {
    if (message) return message;
    if (!Number.isSafeInteger(item.stock) || item.stock < 0) {
      return `Stock availability for ${item.name} could not be confirmed. Refresh the product before checkout.`;
    }
    if (item.quantity > item.stock) {
      return `Only ${item.stock} units are currently available for ${item.name}.`;
    }
    return '';
  }, '') || cartStockMessage;
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
        cartPricingLoading,
        cartPricingError,
        cartStockError,
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
