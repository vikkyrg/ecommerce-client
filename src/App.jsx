import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileMenu from './components/layout/MobileMenu';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/checkout/CheckoutModal';
import AccountModal from './components/account/AccountModal';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import AuthPage from './pages/AuthPage';
import Account from './pages/Account';
import WishlistPage from './pages/WishlistPage';
import Contact from './pages/Contact';
import About from './pages/About';
import FAQ from './pages/FAQ';
import AdminDashboard from './pages/AdminDashboard';
import {
  ShippingPolicy,
  ReturnPolicy,
  PrivacyPolicy,
  TermsConditions
} from './pages/PolicyPages';

// Context Providers
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedAdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user || !isAdmin) {
    return <Navigate to="/login?redirect=/admin/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [checkoutSummary, setCheckoutSummary] = useState(null);

  const handleProceedCheckout = summary => {
    setCheckoutSummary(summary);
    setCheckoutModalOpen(true);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-[#f9f9f7] font-['Inter'] text-[#1a1c1b]">
              <AnnouncementBar />
              <Header
                onOpenMobileMenu={() => setMobileMenuOpen(true)}
                onOpenAccountModal={() => setAccountModalOpen(true)}
              />
              <Navbar />

              <main className="flex-grow">
                <Routes>
                  {/* Customer Core Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/categories/:slug" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/search" element={<Products />} />

                  {/* Shopping & Checkout */}
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                  <Route path="/track-order" element={<TrackOrder />} />

                  {/* Customer Authentication & Profile */}
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/register" element={<AuthPage />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/account/*" element={<Account />} />
                  <Route path="/wishlist" element={<WishlistPage />} />

                  {/* Information & Support */}
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/faq" element={<FAQ />} />

                  {/* Policies */}
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/return-policy" element={<ReturnPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-and-conditions" element={<TermsConditions />} />

                  {/* Admin Portal */}
                  <Route
                    path="/admin"
                    element={<Navigate to="/admin/dashboard" replace />}
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    }
                  />

                  {/* 404 Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />

              <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                onOpenAccountModal={() => setAccountModalOpen(true)}
              />

              <CartDrawer
                onProceedCheckout={handleProceedCheckout}
              />

              <CheckoutModal
                isOpen={checkoutModalOpen}
                onClose={() => setCheckoutModalOpen(false)}
                summary={checkoutSummary}
              />

              <AccountModal
                isOpen={accountModalOpen}
                onClose={() => setAccountModalOpen(false)}
              />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
