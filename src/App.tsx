import { useState, useEffect } from 'react';
import { api } from './lib/api';
import { Category, Brand, WebsiteSettings, Order, Coupon } from './types';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingAdmin from './components/FloatingAdmin';

// Pages
import ClientHome from './pages/ClientHome';
import ClientShop from './pages/ClientShop';
import ClientProductDetails from './pages/ClientProductDetails';
import ClientCart from './pages/ClientCart';
import ClientCheckout from './pages/ClientCheckout';
import ClientAccount from './pages/ClientAccount';
import ClientWishlist from './pages/ClientWishlist';
import ClientCompare from './pages/ClientCompare';
import ClientAbout from './pages/ClientAbout';
import ClientContact from './pages/ClientContact';
import AdminDashboard from './pages/AdminDashboard';
import InvoicePrint from './components/InvoicePrint';

import { CheckCircle, Printer, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Website data & configuration
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  // Cart Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Celebratory Order Success state
  const [successfulOrder, setSuccessfulOrder] = useState<Order | null>(null);

  // Fetch settings on mount
  const loadBaseConfig = async () => {
    try {
      const [cats, brs, setts] = await Promise.all([
        api.getCategories(),
        api.getBrands(),
        api.getSettings()
      ]);
      setCategories(cats);
      setBrands(brs);
      setSettings(setts);
    } catch (e) {
      console.error('Failed to boot platform configuration:', e);
    }
  };

  useEffect(() => {
    loadBaseConfig();
  }, []);

  // Sync scroll on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, viewParams]);

  const handleSetView = (view: string, params?: any) => {
    setCurrentView(view);
    setViewParams(params || {});
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleOrderSuccess = (order: Order) => {
    setSuccessfulOrder(order);
    setCurrentView('order-success');
  };

  if (!settings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Powering up BazareX Storefront...</p>
        </div>
      </div>
    );
  }

  // Check if viewing full screen print mode or full admin panel
  const isAdminView = currentView === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-neutral-800 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Client layout headers */}
      {!isAdminView && (
        <Navbar 
          currentView={currentView} 
          setView={handleSetView} 
          categories={categories} 
          onSearch={handleSearch} 
        />
      )}

      {/* RENDER DYNAMIC VIEWS */}
      <main className="flex-grow">
        {(() => {
          switch (currentView) {
            case 'home':
              return (
                <ClientHome 
                  setView={handleSetView} 
                  categories={categories} 
                  brands={brands} 
                />
              );
            
            case 'shop':
              return (
                <ClientShop 
                  setView={handleSetView} 
                  categories={categories} 
                  brands={brands} 
                  initialParams={viewParams} 
                  searchTerm={searchTerm} 
                  onClearSearch={() => setSearchTerm('')} 
                />
              );

            // Handle both product detail variants safely
            case 'product':
            case 'product-details':
              return (
                <ClientProductDetails 
                  productId={viewParams.id} 
                  setView={handleSetView} 
                />
              );

            case 'cart':
              return (
                <ClientCart 
                  setView={handleSetView} 
                  settings={settings} 
                  appliedCoupon={appliedCoupon} 
                  setAppliedCoupon={setAppliedCoupon} 
                />
              );

            case 'checkout':
              return (
                <ClientCheckout 
                  setView={handleSetView} 
                  settings={settings} 
                  appliedCoupon={appliedCoupon} 
                  setAppliedCoupon={setAppliedCoupon} 
                  onOrderSuccess={handleOrderSuccess} 
                />
              );

            case 'login':
              return (
                <ClientAccount 
                  initialSubView="login" 
                  setView={handleSetView} 
                  settings={settings} 
                />
              );

            case 'register':
              return (
                <ClientAccount 
                  initialSubView="register" 
                  setView={handleSetView} 
                  settings={settings} 
                />
              );

            case 'forgot':
              return (
                <ClientAccount 
                  initialSubView="forgot" 
                  setView={handleSetView} 
                  settings={settings} 
                />
              );

            case 'profile':
              return (
                <ClientAccount 
                  initialSubView="profile" 
                  setView={handleSetView} 
                  settings={settings} 
                />
              );

            case 'orders':
              return (
                <ClientAccount 
                  initialSubView="orders" 
                  setView={handleSetView} 
                  settings={settings} 
                />
              );

            case 'wishlist':
              return (
                <ClientWishlist 
                  setView={handleSetView} 
                />
              );

            case 'compare':
              return (
                <ClientCompare 
                  setView={handleSetView} 
                />
              );

            case 'about':
              return (
                <ClientAbout />
              );

            case 'contact':
              return (
                <ClientContact />
              );

            case 'admin':
              return (
                <AdminDashboard 
                  setView={handleSetView} 
                  settings={settings} 
                  onSettingsUpdate={loadBaseConfig} 
                />
              );

            // Order Placement Success Screen
            case 'order-success':
              if (!successfulOrder) {
                handleSetView('home');
                return null;
              }
              return (
                <div className="mx-auto max-w-3xl px-4 py-12 space-y-8 text-center animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-100">
                      <CheckCircle className="h-8 w-8 fill-current" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Placed Successfully!</h1>
                    <p className="text-xs text-gray-400 max-w-md mx-auto">
                      Thank you for your purchase! Your invoice has been processed under ID <strong className="text-blue-600">{successfulOrder.invoiceNo}</strong>.
                    </p>
                    
                    <div className="flex gap-3 justify-center pt-2">
                      <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1 rounded-xl bg-gray-150 hover:bg-neutral-900 hover:text-white text-gray-600 px-4 py-2 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Printer className="h-4 w-4" />
                        Print Invoice
                      </button>
                      <button
                        onClick={() => handleSetView('shop')}
                        className="inline-flex items-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer"
                      >
                        Continue Shopping
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-left pt-6 border-t border-gray-100">
                    <InvoicePrint order={successfulOrder} settings={settings} onBack={() => handleSetView(api.getCurrentUser() ? 'orders' : 'shop')} />
                  </div>
                </div>
              );

            default:
              return (
                <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
                  <h2 className="text-xl font-bold text-gray-800">404 View Not Found</h2>
                  <button onClick={() => handleSetView('home')} className="rounded-xl bg-blue-600 text-white px-5 py-2 text-xs font-bold">
                    Return Home
                  </button>
                </div>
              );
          }
        })()}
      </main>

      {/* Client layout footers */}
      {!isAdminView && (
        <Footer 
          settings={settings} 
          setView={handleSetView} 
        />
      )}

      {/* Absolute floating admin button */}
      {!isAdminView && (
        <FloatingAdmin 
          setView={handleSetView} 
          onLoginSuccess={() => loadBaseConfig()} 
        />
      )}

    </div>
  );
}
