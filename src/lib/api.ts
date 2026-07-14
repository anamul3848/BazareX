import { 
  Product, Category, Brand, Coupon, Order, Review, Banner, UserProfile, WebsiteSettings 
} from '../types';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('bazarex_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('bazarex_token', data.token);
    localStorage.setItem('bazarex_user', JSON.stringify(data.user));
    return data;
  },

  async register(name: string, email: string, phone: string, address: string, password: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, address, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    localStorage.setItem('bazarex_token', data.token);
    localStorage.setItem('bazarex_user', JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem('bazarex_token');
    localStorage.removeItem('bazarex_user');
  },

  getCurrentUser(): UserProfile | null {
    const userStr = localStorage.getItem('bazarex_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async getProfile(): Promise<UserProfile> {
    const res = await fetch('/api/auth/profile', { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');
    localStorage.setItem('bazarex_user', JSON.stringify(data));
    return data;
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    localStorage.setItem('bazarex_user', JSON.stringify(data));
    return data;
  },

  // Settings
  async getSettings(): Promise<WebsiteSettings> {
    const res = await fetch('/api/settings');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch settings');
    return data;
  },

  async updateSettings(settings: WebsiteSettings): Promise<any> {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data;
  },

  // Banners
  async getBanners(): Promise<Banner[]> {
    const res = await fetch('/api/banners');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch banners');
    return data;
  },

  async addBanner(banner: Omit<Banner, 'id'>): Promise<Banner> {
    const res = await fetch('/api/banners', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(banner),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add banner');
    return data;
  },

  async updateBanner(id: string, banner: Partial<Banner>): Promise<Banner> {
    const res = await fetch(`/api/banners/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(banner),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update banner');
    return data;
  },

  async deleteBanner(id: string): Promise<any> {
    const res = await fetch(`/api/banners/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch categories');
    return data;
  },

  async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(category),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add category');
    return data;
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(category),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update category');
    return data;
  },

  async deleteCategory(id: string): Promise<any> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Brands
  async getBrands(): Promise<Brand[]> {
    const res = await fetch('/api/brands');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch brands');
    return data;
  },

  async addBrand(brand: Omit<Brand, 'id'>): Promise<Brand> {
    const res = await fetch('/api/brands', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(brand),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add brand');
    return data;
  },

  async updateBrand(id: string, brand: Partial<Brand>): Promise<Brand> {
    const res = await fetch(`/api/brands/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(brand),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update brand');
    return data;
  },

  async deleteBrand(id: string): Promise<any> {
    const res = await fetch(`/api/brands/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Products
  async getProducts(filters: Record<string, string | boolean | undefined> = {}): Promise<Product[]> {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        query.append(key, String(val));
      }
    });
    const res = await fetch(`/api/products?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
    return data;
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Product not found');
    return data;
  },

  async addProduct(product: Omit<Product, 'id' | 'rating' | 'ratingsCount'>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add product');
    return data;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data;
  },

  async deleteProduct(id: string): Promise<any> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    const res = await fetch('/api/coupons', { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch coupons');
    return data;
  },

  async addCoupon(coupon: Omit<Coupon, 'id' | 'usageCount'>): Promise<Coupon> {
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(coupon),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add coupon');
    return data;
  },

  async updateCoupon(id: string, coupon: Partial<Coupon>): Promise<Coupon> {
    const res = await fetch(`/api/coupons/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(coupon),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update coupon');
    return data;
  },

  async deleteCoupon(id: string): Promise<any> {
    const res = await fetch(`/api/coupons/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  async validateCoupon(code: string, cartTotal: number): Promise<Coupon> {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartTotal }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to validate coupon');
    return data;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch('/api/orders', { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
    return data;
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order not found');
    return data;
  },

  async createOrder(order: Omit<Order, 'id' | 'invoiceNo' | 'createdAt'>): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(order),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');
    return data;
  },

  async updateOrderStatus(id: string, orderStatus: Order['orderStatus'], paymentStatus?: Order['paymentStatus']): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ orderStatus, paymentStatus }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update order status');
    return data;
  },

  // Reviews
  async getReviews(productId?: string, approvedOnly = false): Promise<Review[]> {
    const query = new URLSearchParams();
    if (productId) query.append('productId', productId);
    if (approvedOnly) query.append('approvedOnly', 'true');
    const res = await fetch(`/api/reviews?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch reviews');
    return data;
  },

  async submitReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(review),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit review');
    return data;
  },

  async approveReview(id: string): Promise<Review> {
    const res = await fetch(`/api/reviews/${id}/approve`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to approve review');
    return data;
  },

  async replyReview(id: string, reply: string): Promise<Review> {
    const res = await fetch(`/api/reviews/${id}/reply`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ reply }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reply to review');
    return data;
  },

  async deleteReview(id: string): Promise<any> {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Customer Management (Admin)
  async getCustomers(): Promise<any[]> {
    const res = await fetch('/api/customers', { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch customers');
    return data;
  },

  async toggleBlockCustomer(id: string, block: boolean): Promise<any> {
    const res = await fetch(`/api/customers/${id}/block`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ block }),
    });
    return res.json();
  },

  async deleteCustomer(id: string): Promise<any> {
    const res = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Reports (Admin)
  async getSalesReport(): Promise<any> {
    const res = await fetch('/api/reports/sales', { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch sales report');
    return data;
  },
};
