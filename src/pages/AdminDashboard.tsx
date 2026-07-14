import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { 
  Product, Category, Brand, Coupon, Order, Review, Banner, UserProfile, WebsiteSettings 
} from '../types';
import { 
  TrendingUp, BarChart3, Package, ClipboardCheck, Users, Tags, Gift, 
  MessageSquare, Settings, LogOut, Plus, Edit, Trash2, CheckCircle, 
  AlertTriangle, X, ShieldAlert, ArrowLeft, Printer, RefreshCw, Star,
  Upload, Image
} from 'lucide-react';
import InvoicePrint from '../components/InvoicePrint';

interface AdminDashboardProps {
  setView: (view: string) => void;
  settings: WebsiteSettings;
  onSettingsUpdate: () => void;
}

type AdminTab = 
  | 'overview' 
  | 'products' 
  | 'orders' 
  | 'customers' 
  | 'categories_brands' 
  | 'banners_coupons' 
  | 'reviews' 
  | 'settings';

export default function AdminDashboard({ setView, settings, onSettingsUpdate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(false);

  // Core collections
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Analytics
  const [report, setReport] = useState<any>({
    totalSales: 0,
    todaySales: 0,
    ordersCount: 0,
    confirmedOrdersCount: 0,
    lowStock: [],
    monthlyTrends: []
  });

  // Modals / Form editing state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Partial<Brand> | null>(null);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);

  // Single order view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Settings form state
  const [setLogo, setSetLogo] = useState(settings.logo);
  const [setSeoTitle, setSetSeoTitle] = useState(settings.seoTitle);
  const [setSeoDesc, setSetSeoDesc] = useState(settings.seoDescription);
  const [setEmail, setSetEmail] = useState(settings.contactEmail);
  const [setPhone, setSetPhone] = useState(settings.contactPhone);
  const [setAddress, setSetAddress] = useState(settings.contactAddress);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || '');
  const [twitterUrl, setTwitterUrl] = useState(settings.twitterUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || '');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '');
  const [tiktokUrl, setTiktokUrl] = useState(settings.tiktokUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl || '');
  const [setFlatRate, setSetFlatRate] = useState(settings.shippingFlatRate);
  const [setTax, setSetTax] = useState(settings.taxPercentage);

  // Reply states
  const [activeReplyReviewId, setActiveReplyReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Fetch all admin data on tab change
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [p, o, c, cat, br, coup, ban, rev, rep] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getCustomers(),
        api.getCategories(),
        api.getBrands(),
        api.getCoupons(),
        api.getBanners(),
        api.getReviews(),
        api.getSalesReport()
      ]);
      setProducts(p);
      setOrders(o);
      setCustomers(c);
      setCategories(cat);
      setBrands(br);
      setCoupons(coup);
      setBanners(ban);
      setReviews(rev);
      setReport(rep);
    } catch (e) {
      console.error('Failed to load admin context:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const handleLogout = () => {
    api.logout();
    setView('home');
  };

  // Product Images Upload Helpers
  const handleImageFilesUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          const base64Str = e.target.result;
          setEditingProduct(prev => {
            if (!prev) return prev;
            const currentImages = prev.images ? [...prev.images] : [];
            if (!currentImages.includes(base64Str)) {
              currentImages.push(base64Str);
            }
            return { ...prev, images: currentImages };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFilesUpload(e.dataTransfer.files);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setEditingProduct(prev => {
      if (!prev) return prev;
      const currentImages = prev.images ? [...prev.images] : [];
      if (!currentImages.includes(imageUrlInput.trim())) {
        currentImages.push(imageUrlInput.trim());
      }
      return { ...prev, images: currentImages };
    });
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setEditingProduct(prev => {
      if (!prev) return prev;
      const currentImages = prev.images ? prev.images.filter((_, i) => i !== indexToRemove) : [];
      return { ...prev, images: currentImages };
    });
  };

  const handleMakePrimary = (indexToMakePrimary: number) => {
    setEditingProduct(prev => {
      if (!prev || !prev.images) return prev;
      const currentImages = [...prev.images];
      const targetImg = currentImages[indexToMakePrimary];
      currentImages.splice(indexToMakePrimary, 1);
      currentImages.unshift(targetImg);
      return { ...prev, images: currentImages };
    });
  };

  // Product Actions
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      if (editingProduct.id) {
        await api.updateProduct(editingProduct.id, editingProduct);
      } else {
        // Add defaults
        await api.addProduct({
          name: editingProduct.name || 'Unnamed Product',
          description: editingProduct.description || '',
          sku: editingProduct.sku || 'SKU-' + Date.now(),
          brand: editingProduct.brand || brands[0]?.name || 'Apple',
          category: editingProduct.category || categories[0]?.name || 'Smartphones',
          price: editingProduct.price || 0,
          discountPrice: editingProduct.discountPrice || 0,
          stock: editingProduct.stock || 0,
          images: editingProduct.images || ['https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80'],
          specifications: editingProduct.specifications || { 'Warranty': '1 Year' },
          isFeatured: editingProduct.isFeatured || false,
          isFlashSale: editingProduct.isFlashSale || false,
          isBestSeller: editingProduct.isBestSeller || false,
          isNewArrival: editingProduct.isNewArrival || false,
          status: editingProduct.status || 'active'
        });
      }
      setIsProductModalOpen(false);
      fetchAdminData();
    } catch (err) {
      alert('Product submission failed');
    }
  };

  const handleProductDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id);
      fetchAdminData();
    }
  };

  // Order status actions
  const handleUpdateOrderStatus = async (orderId: string, orderStatus: Order['orderStatus'], paymentStatus?: Order['paymentStatus']) => {
    await api.updateOrderStatus(orderId, orderStatus, paymentStatus);
    fetchAdminData();
    if (selectedOrder) {
      const updated = await api.getOrder(selectedOrder.id);
      setSelectedOrder(updated);
    }
  };

  // Category CRUD
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (editingCategory.id) {
      await api.updateCategory(editingCategory.id, editingCategory);
    } else {
      await api.addCategory({
        name: editingCategory.name || '',
        slug: (editingCategory.name || '').toLowerCase().replace(/ /g, '-'),
        image: editingCategory.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&q=80'
      });
    }
    setIsCategoryModalOpen(false);
    fetchAdminData();
  };

  const handleCategoryDelete = async (id: string) => {
    if (confirm('Delete this category?')) {
      await api.deleteCategory(id);
      fetchAdminData();
    }
  };

  // Brand CRUD
  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;
    if (editingBrand.id) {
      await api.updateBrand(editingBrand.id, editingBrand);
    } else {
      await api.addBrand({
        name: editingBrand.name || '',
        slug: (editingBrand.name || '').toLowerCase().replace(/ /g, '-'),
        logo: editingBrand.logo || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&q=80'
      });
    }
    setIsBrandModalOpen(false);
    fetchAdminData();
  };

  const handleBrandDelete = async (id: string) => {
    if (confirm('Delete this brand?')) {
      await api.deleteBrand(id);
      fetchAdminData();
    }
  };

  // Coupon CRUD
  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;
    if (editingCoupon.id) {
      await api.updateCoupon(editingCoupon.id, editingCoupon);
    } else {
      await api.addCoupon({
        code: (editingCoupon.code || '').toUpperCase(),
        discountType: editingCoupon.discountType || 'percentage',
        value: editingCoupon.value || 0,
        minPurchase: editingCoupon.minPurchase || 0,
        expiryDate: editingCoupon.expiryDate || '2026-12-31',
        usageLimit: editingCoupon.usageLimit || 100
      });
    }
    setIsCouponModalOpen(false);
    fetchAdminData();
  };

  const handleCouponDelete = async (id: string) => {
    if (confirm('Delete this coupon?')) {
      await api.deleteCoupon(id);
      fetchAdminData();
    }
  };

  // Banner CRUD
  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    if (editingBanner.id) {
      await api.updateBanner(editingBanner.id, editingBanner);
    } else {
      await api.addBanner({
        title: editingBanner.title || '',
        subtitle: editingBanner.subtitle || '',
        image: editingBanner.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80',
        link: editingBanner.link || '/shop',
        type: editingBanner.type || 'hero'
      });
    }
    setIsBannerModalOpen(false);
    fetchAdminData();
  };

  const handleBannerDelete = async (id: string) => {
    if (confirm('Delete this promotion banner?')) {
      await api.deleteBanner(id);
      fetchAdminData();
    }
  };

  // Customer block/delete
  const handleToggleBlockCustomer = async (id: string, block: boolean) => {
    await api.toggleBlockCustomer(id, block);
    fetchAdminData();
  };

  const handleCustomerDelete = async (id: string) => {
    if (confirm('Are you sure you want to completely delete this customer account?')) {
      await api.deleteCustomer(id);
      fetchAdminData();
    }
  };

  // Reviews approval & replies
  const handleReviewApprove = async (id: string) => {
    await api.approveReview(id);
    fetchAdminData();
  };

  const handleReviewReplySubmit = async (id: string) => {
    if (!replyText.trim()) return;
    await api.replyReview(id, replyText);
    setActiveReplyReviewId(null);
    setReplyText('');
    fetchAdminData();
  };

  const handleReviewDelete = async (id: string) => {
    if (confirm('Delete this review post?')) {
      await api.deleteReview(id);
      fetchAdminData();
    }
  };

  // Website Settings Submit
  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings({
        logo: setLogo,
        favicon: settings.favicon,
        seoTitle: setSeoTitle,
        seoDescription: setSeoDesc,
        contactEmail: setEmail,
        contactPhone: setPhone,
        contactAddress: setAddress,
        facebookUrl,
        twitterUrl,
        instagramUrl,
        whatsappNumber,
        tiktokUrl,
        youtubeUrl,
        shippingFlatRate: Number(setFlatRate),
        taxPercentage: Number(setTax)
      });
      alert('Settings updated successfully!');
      onSettingsUpdate();
    } catch (e) {
      alert('Failed to update website configurations.');
    }
  };

  // Print Order receipt overlay
  const [printInvoiceOrder, setPrintInvoiceOrder] = useState<Order | null>(null);
  if (printInvoiceOrder) {
    return (
      <div className="bg-white py-10 px-4">
        <InvoicePrint order={printInvoiceOrder} settings={settings} onBack={() => setPrintInvoiceOrder(null)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 md:flex-row">
      
      {/* 1. ADMIN SIDEBAR (Desktop) */}
      <aside className="w-full md:w-64 bg-neutral-900 text-gray-300 flex flex-col shrink-0">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 px-3 py-1 text-base font-black tracking-tighter text-white">
              B
            </div>
            <span className="text-base font-extrabold tracking-tight text-white">
              BazareX <span className="text-blue-500 text-[10px] font-bold">CONTROL</span>
            </span>
          </div>
          <button onClick={() => setView('home')} className="text-xs font-bold text-blue-500 hover:underline md:hidden">
            Shop
          </button>
        </div>

        {/* Navigation Tabs lists */}
        <nav className="flex-1 p-4 space-y-1 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' : 'hover:bg-neutral-800 hover:text-white'}`}
          >
            <BarChart3 className="h-4.5 w-4.5" />
            Analytics Overview
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-neutral-800 hover:text-white'}`}
          >
            <Package className="h-4.5 w-4.5" />
            Products Catalogue
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-neutral-800 hover:text-white'}`}
          >
            <ClipboardCheck className="h-4.5 w-4.5" />
            Orders Management
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'customers' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-neutral-800 hover:text-white'}`}
          >
            <Users className="h-4.5 w-4.5" />
            Customer Profiles
          </button>

          <button
            onClick={() => setActiveTab('categories_brands')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'categories_brands' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-neutral-800 hover:text-white'}`}
          >
            <Tags className="h-4.5 w-4.5" />
            Categories & Brands
          </button>

          <button
            onClick={() => setActiveTab('banners_coupons')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'banners_coupons' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-neutral-800 hover:text-white'}`}
          >
            <Gift className="h-4.5 w-4.5" />
            Banners & Vouchers
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'reviews' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-neutral-800 hover:text-white'}`}
          >
            <MessageSquare className="h-4.5 w-4.5" />
            Reviews Moderator
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-neutral-800 hover:text-white'}`}
          >
            <Settings className="h-4.5 w-4.5" />
            Store Settings
          </button>
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-neutral-800 text-xs font-bold">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-950 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout Securely
          </button>
        </div>
      </aside>

      {/* 2. ADMIN MAIN PANEL */}
      <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-x-hidden">
        
        {/* Top bar header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl font-black text-gray-900 capitalize tracking-tight">{activeTab.replace('_', ' & ')} Tab</h1>
            <p className="text-xs text-gray-400">Master e-commerce administration and full-stack backend configurations</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setView('home')}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Storefront View
            </button>
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:bg-neutral-400"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Sync DB
            </button>
          </div>
        </div>

        {/* TAB CONTENTS */}

        {/* A. OVERVIEW TABS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Metrics grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Gross Sales</span>
                  <div className="rounded-lg bg-green-50 p-2 text-green-600"><TrendingUp className="h-4.5 w-4.5" /></div>
                </div>
                <p className="text-2xl font-black text-gray-950">৳{report.totalSales.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1">Accumulated gross e-commerce sales</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Today's Sales</span>
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600"><TrendingUp className="h-4.5 w-4.5" /></div>
                </div>
                <p className="text-2xl font-black text-gray-950">৳{report.todaySales.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1">Total revenue collected today</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
                  <div className="rounded-lg bg-purple-50 p-2 text-purple-600"><ClipboardCheck className="h-4.5 w-4.5" /></div>
                </div>
                <p className="text-2xl font-black text-gray-950">{report.ordersCount}</p>
                <p className="text-[10px] text-gray-400 mt-1">Completed & pending transactions</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Customers</span>
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-600"><Users className="h-4.5 w-4.5" /></div>
                </div>
                <p className="text-2xl font-black text-gray-950">{customers.length}</p>
                <p className="text-[10px] text-gray-400 mt-1">Registered buyer profiles</p>
              </div>
            </div>

            {/* Low inventory alert notification box */}
            {report.lowStock.length > 0 && (
              <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4 flex gap-3.5">
                <ShieldAlert className="h-5 w-5 text-orange-600 shrink-0 mt-0.5 animate-bounce" />
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black text-orange-800 uppercase tracking-wider">Low Stock inventory warning</h4>
                  <p className="text-[11px] text-orange-700 leading-normal">
                    The following hardware products have dropped below safety thresholds (5 units remaining):
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {report.lowStock.map((prod: any) => (
                      <span key={prod.id} className="rounded-lg bg-orange-100 px-2.5 py-1 text-[10px] font-extrabold text-orange-800">
                        {prod.name} ({prod.stock} units remaining)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Responsive visual chart for trends using SVG bar chart */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-6">Revenue Trend (Last 6 Months)</h3>
              
              <div className="h-64 w-full flex items-end justify-between gap-4 pt-4 border-b border-gray-150 px-2">
                {report.monthlyTrends.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center w-full py-20">Waiting for transactions data...</p>
                ) : (
                  report.monthlyTrends.map((trend: any, idx: number) => {
                    const maxVal = Math.max(...report.monthlyTrends.map((t: any) => t.sales)) || 1;
                    const heightPercent = Math.max(10, (trend.sales / maxVal) * 90);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        {/* Tooltip value */}
                        <span className="opacity-0 group-hover:opacity-100 rounded-lg bg-neutral-950 px-2 py-1 text-[10px] font-bold text-white transition-opacity whitespace-nowrap shadow-md">
                          ৳{trend.sales.toLocaleString()}
                        </span>
                        
                        {/* Elegant bar */}
                        <div 
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[40px] rounded-t-lg bg-blue-600 hover:bg-blue-700 transition-all duration-500 ease-out shadow-sm"
                        />
                        
                        {/* Label */}
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{trend.month}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* B. PRODUCTS MANAGEMENT TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">Manage products, pricing, models, and inventory levels</p>
              <button
                onClick={() => {
                  setEditingProduct({});
                  setIsProductModalOpen(true);
                }}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>

            {/* Products Table lists */}
            <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 uppercase text-[10px] tracking-wider">
                      <th className="p-4">Device Item</th>
                      <th className="p-4">SKU Code</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Brand</th>
                      <th className="p-4">Base Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.images[0]} alt="" className="h-10 w-10 object-cover rounded-lg border" />
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                            {p.discountPrice > 0 && (
                              <p className="text-[10px] text-blue-600 font-bold">Promo Price: ৳{p.discountPrice.toLocaleString()}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-gray-500">{p.sku}</td>
                        <td className="p-4">{p.category}</td>
                        <td className="p-4">{p.brand}</td>
                        <td className="p-4 font-bold text-gray-950">৳{p.price.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`font-bold ${p.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>{p.stock}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase ${p.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-neutral-900 hover:text-white text-gray-500 transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleProductDelete(p.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* C. ORDERS MANAGEMENT TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <p className="text-xs text-gray-400">Track and dispatch customer orders, generate invoices, and log payments</p>

            {selectedOrder ? (
              // Detailed Single Order Buy-Box View
              <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <button onClick={() => setSelectedOrder(null)} className="text-xs font-bold text-blue-600 hover:underline">
                      ← Back to Orders list
                    </button>
                    <h2 className="text-base font-black text-gray-900 mt-2">Order {selectedOrder.invoiceNo}</h2>
                  </div>

                  <button
                    onClick={() => setPrintInvoiceOrder(selectedOrder)}
                    className="flex items-center gap-1.5 rounded-xl bg-neutral-900 text-white py-2 px-4 text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    Print Receipt
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Status update selector panel */}
                  <div className="rounded-xl bg-gray-50/50 border border-gray-100 p-4 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">Modify Order Status</h4>
                    
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Fulfillment Status</label>
                      <select
                        value={selectedOrder.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as Order['orderStatus'])}
                        className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs focus:outline-none focus:border-blue-500 font-bold text-gray-700"
                      >
                        <option value="pending">Pending Review</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Payment Status</label>
                      <select
                        value={selectedOrder.paymentStatus}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, selectedOrder.orderStatus, e.target.value as Order['paymentStatus'])}
                        className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs focus:outline-none focus:border-blue-500 font-bold text-gray-700"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="md:col-span-2 rounded-xl bg-white border border-gray-150 p-4 space-y-4 text-xs">
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">Shipping Coordinates</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider">Customer Name</p>
                        <p className="font-bold text-gray-800">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider">Contact Phone</p>
                        <p className="font-bold text-gray-800">{selectedOrder.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider">Email Account</p>
                        <p className="font-bold text-gray-800">{selectedOrder.customerEmail || 'No Email (Guest)'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider">Shipping Destination</p>
                        <p className="font-bold text-gray-800">{selectedOrder.shippingAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Manifest list */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Purchased Items</p>
                  <div className="rounded-xl border overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b font-bold text-gray-500">
                          <th className="p-3">Device Item Name</th>
                          <th className="p-3 text-center">Unit Price</th>
                          <th className="p-3 text-center">Qty</th>
                          <th className="p-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-gray-700">
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-3">
                              <p className="font-bold text-gray-900">{item.name}</p>
                              {item.selectedVariant && <p className="text-[10px] text-blue-600 font-bold uppercase mt-0.5">{item.selectedVariant}</p>}
                            </td>
                            <td className="p-3 text-center">৳{item.price.toLocaleString()}</td>
                            <td className="p-3 text-center font-bold">{item.quantity}</td>
                            <td className="p-3 text-right font-black text-gray-950">৳{(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              // Orders Table directory
              <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 uppercase text-[10px] tracking-wider">
                        <th className="p-4">Receipt No</th>
                        <th className="p-4">Order Date</th>
                        <th className="p-4">Buyer Account</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Fulfillment</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Invoice Total</th>
                        <th className="p-4 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50/50">
                          <td className="p-4 font-bold text-blue-600">{o.invoiceNo}</td>
                          <td className="p-4 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="p-4">
                            <p className="font-bold text-gray-950">{o.customerName}</p>
                            <p className="text-[10px] text-gray-400">{o.customerPhone}</p>
                          </td>
                          <td className="p-4 capitalize font-bold text-gray-500">{o.paymentMethod}</td>
                          <td className="p-4">
                            <span className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase ${o.orderStatus === 'delivered' ? 'bg-green-50 text-green-700' : o.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase ${o.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="p-4 font-black text-gray-950">৳{o.total.toLocaleString()}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="rounded-lg bg-gray-100 hover:bg-neutral-900 hover:text-white text-gray-600 px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* D. CUSTOMER DIRECTORIES TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <p className="text-xs text-gray-400">Manage buyer registrations, purchase metrics, and suspension controls</p>

            <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 uppercase text-[10px] tracking-wider">
                      <th className="p-4">Buyer Coordinates</th>
                      <th className="p-4">Registration Date</th>
                      <th className="p-4 text-center">Receipts Counts</th>
                      <th className="p-4">Total Accumulated Spent</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Fulfillment Options</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50">
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{c.name}</p>
                          <p className="text-[10px] text-gray-400">{c.email} • {c.phone}</p>
                        </td>
                        <td className="p-4 text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-center font-bold text-neutral-800">{c.orderCount}</td>
                        <td className="p-4 font-black text-gray-950">৳{c.totalSpent.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase ${c.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {c.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1 shrink-0">
                          <button
                            onClick={() => handleToggleBlockCustomer(c.id, !c.isBlocked)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${c.isBlocked ? 'bg-green-50 hover:bg-green-600 hover:text-white text-green-600' : 'bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-600'}`}
                          >
                            {c.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            onClick={() => handleCustomerDelete(c.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* E. CATEGORIES & BRANDS TAB (CRUD) */}
        {activeTab === 'categories_brands' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Categories CRUD block */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="text-sm font-black uppercase text-gray-900">Store Categories</h3>
                <button
                  onClick={() => { setEditingCategory({}); setIsCategoryModalOpen(true); }}
                  className="rounded-lg bg-blue-600 text-white px-2.5 py-1.5 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Category
                </button>
              </div>

              <div className="rounded-xl border overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b font-bold text-gray-500">
                      <th className="p-3">Cover Image</th>
                      <th className="p-3">Category Name</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700 font-medium">
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td className="p-3">
                          <img src={cat.image} alt="" className="h-8 w-8 rounded-full object-cover border" />
                        </td>
                        <td className="p-3 font-bold text-gray-800">{cat.name}</td>
                        <td className="p-3 text-right space-x-1">
                          <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleCategoryDelete(cat.id)} className="text-red-600 hover:underline pl-2">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Brands CRUD block */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="text-sm font-black uppercase text-gray-900">Brand Partners</h3>
                <button
                  onClick={() => { setEditingBrand({}); setIsBrandModalOpen(true); }}
                  className="rounded-lg bg-blue-600 text-white px-2.5 py-1.5 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Brand
                </button>
              </div>

              <div className="rounded-xl border overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b font-bold text-gray-500">
                      <th className="p-3">Logo</th>
                      <th className="p-3">Brand Name</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700 font-medium">
                    {brands.map((b) => (
                      <tr key={b.id}>
                        <td className="p-3">
                          <img src={b.logo} alt="" className="h-8 w-8 rounded-full object-cover border" />
                        </td>
                        <td className="p-3 font-bold text-gray-800">{b.name}</td>
                        <td className="p-3 text-right space-x-1">
                          <button onClick={() => { setEditingBrand(b); setIsBrandModalOpen(true); }} className="text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleBrandDelete(b.id)} className="text-red-600 hover:underline pl-2">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* F. BANNERS & PROMOS MANAGEMENT TAB */}
        {activeTab === 'banners_coupons' && (
          <div className="space-y-12">
            
            {/* Banner Slider management */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="text-sm font-black uppercase text-gray-900">Homepage Slideshow Banners</h3>
                <button
                  onClick={() => { setEditingBanner({}); setIsBannerModalOpen(true); }}
                  className="rounded-lg bg-blue-600 text-white px-2.5 py-1.5 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Slider
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {banners.map((ban) => (
                  <div key={ban.id} className="rounded-xl border border-gray-150 bg-white overflow-hidden shadow-xs">
                    <img src={ban.image} alt="" className="h-32 w-full object-cover" />
                    <div className="p-4 space-y-2 text-xs">
                      <h4 className="font-bold text-gray-900">{ban.title}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{ban.subtitle}</p>
                      <div className="pt-2 flex justify-between items-center border-t border-gray-50">
                        <span className="rounded bg-blue-50 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 uppercase">{ban.type}</span>
                        <div className="space-x-3 font-bold">
                          <button onClick={() => { setEditingBanner(ban); setIsBannerModalOpen(true); }} className="text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleBannerDelete(ban.id)} className="text-red-600 hover:underline">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupons system CRUD */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-sm font-black uppercase text-gray-900">Active Coupons System</h3>
                <button
                  onClick={() => { setEditingCoupon({}); setIsCouponModalOpen(true); }}
                  className="rounded-lg bg-blue-600 text-white px-2.5 py-1.5 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Coupon
                </button>
              </div>

              <div className="rounded-xl border overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b font-bold text-gray-500">
                      <th className="p-3">Promo Code</th>
                      <th className="p-3">Discount Type</th>
                      <th className="p-3 text-center">Value</th>
                      <th className="p-3">Min Purchase</th>
                      <th className="p-3">Expiry Date</th>
                      <th className="p-3 text-center">Usage counts</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700 font-medium">
                    {coupons.map((c) => (
                      <tr key={c.id}>
                        <td className="p-3 font-mono font-bold text-blue-600">{c.code}</td>
                        <td className="p-3 capitalize">{c.discountType}</td>
                        <td className="p-3 text-center font-bold text-gray-950">
                          {c.discountType === 'percentage' ? `${c.value}%` : `৳${c.value}`}
                        </td>
                        <td className="p-3">৳{c.minPurchase.toLocaleString()}</td>
                        <td className="p-3 text-gray-400">{c.expiryDate}</td>
                        <td className="p-3 text-center font-bold">{c.usageCount} / {c.usageLimit}</td>
                        <td className="p-3 text-right space-x-1">
                          <button onClick={() => { setEditingCoupon(c); setIsCouponModalOpen(true); }} className="text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleCouponDelete(c.id)} className="text-red-600 hover:underline pl-2">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* G. REVIEWS MODERATOR TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <p className="text-xs text-gray-400">Review client comment posts, toggle catalog approvals, and reply to suggestions</p>

            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-gray-150 bg-white p-4 shadow-xs space-y-3 text-xs">
                  <div className="flex items-center justify-between text-gray-400 font-bold">
                    <span>{r.userName} ({r.userEmail}) • on <strong className="text-gray-800">{r.productName}</strong></span>
                    <span className="text-[10px]">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>

                  <p className="font-medium text-gray-700 leading-relaxed italic">"{r.comment}"</p>

                  {r.reply && (
                    <div className="rounded-lg bg-blue-50/50 p-2.5 text-gray-700 border-l-2 border-blue-600 font-medium leading-normal">
                      <strong className="text-blue-800 text-[10px] block uppercase tracking-wider mb-0.5">Your Response</strong>
                      {r.reply}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2.5 border-t border-gray-50">
                    {/* Moderation actions */}
                    {!r.isApproved && (
                      <button
                        onClick={() => handleReviewApprove(r.id)}
                        className="rounded bg-green-50 hover:bg-green-600 hover:text-white text-green-700 text-[10px] font-extrabold px-2.5 py-1 border border-green-100 uppercase cursor-pointer"
                      >
                        Approve Review
                      </button>
                    )}

                    <button
                      onClick={() => setActiveReplyReviewId(activeReplyReviewId === r.id ? null : r.id)}
                      className="rounded bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-[10px] font-extrabold px-2.5 py-1 border border-blue-100 uppercase cursor-pointer"
                    >
                      {r.reply ? 'Change Response' : 'Reply'}
                    </button>

                    <button
                      onClick={() => handleReviewDelete(r.id)}
                      className="rounded bg-red-50 hover:bg-red-600 hover:text-white text-red-700 text-[10px] font-extrabold px-2.5 py-1 border border-red-100 uppercase ml-auto cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Reply Input container */}
                  {activeReplyReviewId === r.id && (
                    <div className="pt-3 flex gap-2">
                      <input
                        type="text"
                        required
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type administrator response comments..."
                        className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:bg-white"
                      />
                      <button
                        onClick={() => handleReviewReplySubmit(r.id)}
                        className="rounded-lg bg-neutral-900 text-white px-4 py-2 font-bold hover:bg-neutral-800 cursor-pointer"
                      >
                        Send Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* H. WEBSITE CONFIGURATIONS TAB */}
        {activeTab === 'settings' && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs max-w-2xl">
            <h2 className="text-base font-black text-gray-900 mb-6">Website General Settings</h2>
            
            <form onSubmit={handleSaveSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Logo Label</label>
                  <input
                    type="text"
                    required
                    value={setLogo}
                    onChange={(e) => setSetLogo(e.target.value)}
                    className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">SEO Title Header</label>
                  <input
                    type="text"
                    required
                    value={setSeoTitle}
                    onChange={(e) => setSetSeoTitle(e.target.value)}
                    className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">SEO Meta Description</label>
                <textarea
                  required
                  rows={2}
                  value={setSeoDesc}
                  onChange={(e) => setSetSeoDesc(e.target.value)}
                  className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Support Email</label>
                  <input
                    type="email"
                    required
                    value={setEmail}
                    onChange={(e) => setSetEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Support Phone</label>
                  <input
                    type="text"
                    required
                    value={setPhone}
                    onChange={(e) => setSetPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Headquarters Address</label>
                <input
                  type="text"
                  required
                  value={setAddress}
                  onChange={(e) => setSetAddress(e.target.value)}
                  className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Social Media & Communication Channels</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Facebook Page/Profile Link</label>
                    <input
                      type="url"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Instagram Link</label>
                    <input
                      type="url"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/yourprofile"
                      className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">WhatsApp Number/Link</label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+8801700000000"
                      className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">TikTok Link/ID</label>
                    <input
                      type="text"
                      value={tiktokUrl}
                      onChange={(e) => setTiktokUrl(e.target.value)}
                      placeholder="https://tiktok.com/@username"
                      className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">YouTube Channel/ID</label>
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://youtube.com/@channel"
                      className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Twitter/X Link (Optional)</label>
                    <input
                      type="url"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="https://twitter.com/username"
                      className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Shipping Flat Rate (৳)</label>
                  <input
                    type="number"
                    required
                    value={setFlatRate}
                    onChange={(e) => setSetFlatRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Vat Tax Percentage (%)</label>
                  <input
                    type="number"
                    required
                    value={setTax}
                    onChange={(e) => setSetTax(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-neutral-900 hover:bg-blue-600 px-6 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer mt-2"
              >
                Save General Settings
              </button>
            </form>
          </div>
        )}

      </main>

      {/* ==========================================
          MODALS / FORMS POPUPS
          ========================================== */}

      {/* 1. PRODUCT MODAL */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[85vh] border border-gray-100 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-sm font-black text-gray-950 uppercase">{editingProduct.id ? 'Modify Tech Product' : 'Add New Tech Product'}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="rounded-full p-1.5 hover:bg-gray-100 text-gray-400"><X className="h-4.5 w-4.5" /></button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Device Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">SKU Identification</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Product Category</label>
                  <select
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none font-bold text-gray-700"
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Brand Owner</label>
                  <select
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none font-bold text-gray-700"
                  >
                    {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Standard Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Promo Discount Price (৳)</label>
                  <input
                    type="number"
                    value={editingProduct.discountPrice || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, discountPrice: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Warehouse Stock</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              {/* Multi-Image Uploader Area */}
              <div className="space-y-3">
                <label className="block font-bold text-gray-500">Product Images</label>
                
                {/* Drag & Drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                    isDragging 
                      ? 'border-blue-600 bg-blue-50/50' 
                      : 'border-gray-200 hover:border-blue-500 bg-gray-50/50'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleImageFilesUpload(e.target.files);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-600 animate-bounce' : 'text-gray-400'}`} />
                    <p className="text-xs font-bold text-gray-700">
                      Drag & drop multiple images, or <span className="text-blue-600 underline">browse local files</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">PNG, JPG, JPEG, GIF, WEBP</p>
                  </div>
                </div>

                {/* Web URL input */}
                <div className="flex gap-2 text-xs">
                  <input
                    type="url"
                    placeholder="Or enter external Image URL..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-blue-500 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="rounded-xl bg-gray-900 hover:bg-neutral-800 text-white text-[11px] font-black px-4 py-2.5 transition-colors shrink-0"
                  >
                    Add URL
                  </button>
                </div>

                {/* Image List */}
                {editingProduct.images && editingProduct.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
                    {editingProduct.images.map((img, index) => {
                      const isPrimary = index === 0;
                      return (
                        <div 
                          key={index} 
                          className={`group relative aspect-square rounded-xl border overflow-hidden bg-white ${
                            isPrimary ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200'
                          }`}
                        >
                          <img 
                            src={img} 
                            alt={`Product image ${index + 1}`} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Hover Overlay Controls */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="rounded-lg bg-red-600 p-1 text-white hover:bg-red-700 transition-colors"
                                title="Remove image"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            
                            <div className="w-full">
                              {isPrimary ? (
                                <span className="w-full block text-center rounded-md bg-blue-600 text-[9px] font-bold text-white py-1">
                                  Primary Cover
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleMakePrimary(index)}
                                  className="w-full rounded-md bg-white text-gray-950 text-[9px] font-black py-1 hover:bg-blue-600 hover:text-white transition-colors"
                                >
                                  Set as Cover
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Cover badge */}
                          {isPrimary && (
                            <div className="absolute top-1.5 left-1.5 rounded-md bg-blue-600 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-white shadow-xs">
                              Cover
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center bg-gray-50/30">
                    <Image className="h-5 w-5 text-gray-300 mx-auto mb-1" />
                    <p className="text-[11px] text-gray-400 font-medium">No images uploaded yet. Primary default photo will be used on save.</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-500 mb-1">Detailed Hardware description</label>
                <textarea
                  required
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none"
                />
              </div>

              {/* Status & tags checkboxes */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-gray-50 p-4 rounded-xl">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFeatured || false}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    />
                    Featured Product
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFlashSale || false}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, isFlashSale: e.target.checked }))}
                    />
                    Active Flash Sale
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={editingProduct.isBestSeller || false}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                    />
                    Best Seller model
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={editingProduct.isNewArrival || false}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, isNewArrival: e.target.checked }))}
                    />
                    New Tech Arrival
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-neutral-900 hover:bg-blue-600 text-white font-bold py-3 text-center transition-colors cursor-pointer"
                >
                  Save Hardware Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CATEGORY MODAL */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-gray-150 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-xs font-black uppercase text-gray-900">Manage Category</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400"><X className="h-4.5 w-4.5" /></button>
            </div>
            <form onSubmit={handleCategorySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-500 mb-1">Category Label</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full rounded-lg border p-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1">Graphic Image URL</label>
                <input
                  type="text"
                  required
                  value={editingCategory.image || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                  className="w-full rounded-lg border p-2 focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full rounded-xl bg-neutral-900 hover:bg-blue-600 py-2.5 text-white font-bold">Save Category</button>
            </form>
          </div>
        </div>
      )}

      {/* 3. BRAND MODAL */}
      {isBrandModalOpen && editingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-gray-150 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-xs font-black uppercase text-gray-900">Manage Brand partner</h3>
              <button onClick={() => setIsBrandModalOpen(false)} className="text-gray-400"><X className="h-4.5 w-4.5" /></button>
            </div>
            <form onSubmit={handleBrandSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-500 mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={editingBrand.name || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                  className="w-full rounded-lg border p-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1">Logo URL Graphic</label>
                <input
                  type="text"
                  required
                  value={editingBrand.logo || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, logo: e.target.value })}
                  className="w-full rounded-lg border p-2 focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full rounded-xl bg-neutral-900 hover:bg-blue-600 py-2.5 text-white font-bold">Save Brand</button>
            </form>
          </div>
        </div>
      )}

      {/* 4. COUPON MODAL */}
      {isCouponModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 border shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-xs font-black uppercase text-gray-900">Configure Coupon</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-gray-400"><X className="h-4.5 w-4.5" /></button>
            </div>
            <form onSubmit={handleCouponSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-500 mb-1">Promo Voucher Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WELCOME10"
                  value={editingCoupon.code || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
                  className="w-full rounded-lg border p-2 focus:outline-none uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Discount Type</label>
                  <select
                    value={editingCoupon.discountType || 'percentage'}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value as any })}
                    className="w-full rounded-lg border p-2 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Voucher Value</label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.value || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })}
                    className="w-full rounded-lg border p-2 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Min Purchase (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.minPurchase || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, minPurchase: Number(e.target.value) })}
                    className="w-full rounded-lg border p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Usage limit counts</label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.usageLimit || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: Number(e.target.value) })}
                    className="w-full rounded-lg border p-2 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1">Expiration Date</label>
                <input
                  type="text"
                  required
                  placeholder="YYYY-MM-DD"
                  value={editingCoupon.expiryDate || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, expiryDate: e.target.value })}
                  className="w-full rounded-lg border p-2 focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full rounded-xl bg-neutral-900 hover:bg-blue-600 py-2.5 text-white font-bold">Save Coupon</button>
            </form>
          </div>
        </div>
      )}

      {/* 5. BANNER MODAL */}
      {isBannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 border shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-xs font-black uppercase text-gray-900">Manage promo Banner</h3>
              <button onClick={() => setIsBannerModalOpen(false)} className="text-gray-400"><X className="h-4.5 w-4.5" /></button>
            </div>
            <form onSubmit={handleBannerSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-500 mb-1">Headline Header</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full rounded-lg border p-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1">Subtitle Details</label>
                <input
                  type="text"
                  required
                  value={editingBanner.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full rounded-lg border p-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1">Banner Image URL</label>
                <input
                  type="text"
                  required
                  value={editingBanner.image || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                  className="w-full rounded-lg border p-2 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Click Route Path</label>
                  <input
                    type="text"
                    required
                    value={editingBanner.link || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
                    className="w-full rounded-lg border p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Banner Position Category</label>
                  <select
                    value={editingBanner.type || 'hero'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, type: e.target.value as any })}
                    className="w-full rounded-lg border p-2 focus:outline-none font-bold"
                  >
                    <option value="hero">Homepage Top Slider</option>
                    <option value="promo">Mid Page Promotion Banner</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full rounded-xl bg-neutral-900 hover:bg-blue-600 py-2.5 text-white font-bold">Save Banner Slider</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
