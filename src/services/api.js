import api from './apiClient';

export { API_BASE_URL, resolveImageUrl } from './apiClient';

const responseData = response => response.data;

export const loginUserApi = (email, password) =>
  api.post('/auth/login', { email, password }).then(responseData);

export const registerUserApi = (name, email, phone, password) =>
  api.post('/auth/register', { name, email, phone, password }).then(responseData);

export const updateProfileApi = profileData =>
  api.put('/auth/profile', profileData).then(responseData);

export const submitEnquiryApi = enquiryData =>
  api.post('/enquiries', enquiryData).then(responseData);

export const fetchProducts = (params = {}) =>
  api.get('/products', { params }).then(responseData);

export const fetchFeaturedProducts = () =>
  api.get('/products/featured').then(responseData);

export const fetchProductById = id =>
  api.get(`/products/${encodeURIComponent(id)}`).then(responseData);

export const fetchCategories = () =>
  api.get('/categories').then(responseData);

export const fetchBrands = (params = {}) =>
  api.get('/brands', { params }).then(responseData);

export const createOrder = orderData =>
  api.post('/orders', orderData).then(responseData);

export const fetchOrderById = id =>
  api.get(`/orders/${encodeURIComponent(id)}`).then(responseData);

export const fetchMyOrders = () =>
  api.get('/orders/myorders').then(responseData);

export const trackOrderApi = (orderNumber, phone) =>
  api.post('/orders/track', { orderNumber, phone }).then(responseData);

export const validateCouponApi = (code, cartTotal) =>
  api.post('/coupons/validate', { code, cartTotal }).then(responseData);

export const sendContactMessage = contactData =>
  api.post('/contact', contactData).then(responseData);
