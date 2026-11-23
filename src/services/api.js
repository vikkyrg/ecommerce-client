const BASE = import.meta.env.VITE_API_URL || '';
export const API_BASE_URL = BASE ? `${BASE.replace(/\/+$/, '')}/api` : '/api';

// Helper for authorized headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('ns_stone_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchProducts = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/products?${query}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('API error, falling back to local client data:', error);
    const local = await import('../data/catalogData.js');
    const filtered = local.filterProducts(params);
    return {
      products: filtered,
      total: filtered.length,
      page: 1,
      pages: 1
    };
  }
};

export const fetchFeaturedProducts = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/featured`);
    if (!res.ok) throw new Error('Failed to fetch featured');
    return await res.json();
  } catch (error) {
    const local = await import('../data/catalogData.js');
    return local.products.filter(p => p.isFeatured || p.isBestSeller).slice(0, 8);
  }
};

export const fetchProductById = async id => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Product not found');
    return await res.json();
  } catch (error) {
    const local = await import('../data/catalogData.js');
    const prod = local.products.find(
      p => p.id === id || p.sku === id || (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id.toLowerCase())
    );
    if (!prod) throw new Error('Product not found');
    return prod;
  }
};

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    const local = await import('../data/catalogData.js');
    return local.categories;
  }
};

export const createOrder = async orderData => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to place order');
    }
    return await res.json();
  } catch (error) {
    // Local fallback order generation
    console.warn('Order API offline, generating local order confirmation:', error);
    const orderNumber = `NSC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const mockOrder = {
      _id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      orderStatus: 'Order Placed',
      trackingNumber: `TRK-${Date.now().toString().slice(-8)}`,
      ...orderData
    };
    return mockOrder;
  }
};

export const fetchOrderById = async id => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Order not found');
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const trackOrderApi = async (orderNumber, phone) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber, phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Order tracking not found');
    return data;
  } catch (error) {
    throw error;
  }
};

export const validateCouponApi = async (code, cartTotal) => {
  try {
    const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartTotal })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid coupon');
    return data;
  } catch (error) {
    // Offline coupon check fallback
    const upper = (code || '').trim().toUpperCase();
    if (upper === 'STONE10') {
      const discount = Math.round(cartTotal * 0.1);
      return { valid: true, code: 'STONE10', discount, message: 'STONE10 applied (10% off)' };
    }
    throw error;
  }
};
