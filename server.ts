import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';

const app = express();
const PORT = 3000;

// Middleware for JSON parsing and form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple Security: Custom Rate Limiter
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();
app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const rateLimitWindow = 60 * 1000; // 1 minute
  const maxRequests = 5000;

  const current = ipRequestCounts.get(ip);
  if (!current || now > current.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + rateLimitWindow });
    next();
  } else {
    current.count++;
    if (current.count > maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
    }
    next();
  }
});

// Simple Security: XSS Sanitization Middleware
function cleanString(str: any): any {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
}

app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = cleanString(req.body[key]);
      }
    }
  }
  next();
});

// Simple JWT-less authentication check
// Standard clients will send header: `Authorization: Bearer <user_id_or_admin_id>`
const authenticateUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  
  // Find user by id
  const users = db.getUsers();
  const found = users.find(u => u.id === token);
  const fullUser = found ? db.findUserByEmail(found.email) : null;

  if (!fullUser) {
    return res.status(401).json({ error: 'Invalid authentication session' });
  }

  if (fullUser.isBlocked) {
    return res.status(403).json({ error: 'Your account has been suspended' });
  }

  (req as any).user = fullUser;
  next();
};

const optionalAuthenticateUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  
  const users = db.getUsers();
  const found = users.find(u => u.id === token);
  const fullUser = found ? db.findUserByEmail(found.email) : null;

  if (fullUser) {
    if (fullUser.isBlocked) {
      return res.status(403).json({ error: 'Your account has been suspended' });
    }
    (req as any).user = fullUser;
  }
  next();
};

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  authenticateUser(req, res, () => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }
    next();
  });
};


// ==========================================
// API ROUTES
// ==========================================

// Settings
app.get('/api/settings', (req, res) => {
  res.json(db.getSettings());
});

app.post('/api/settings', requireAdmin, (req, res) => {
  db.updateSettings(req.body);
  res.json({ message: 'Settings updated successfully', settings: db.getSettings() });
});

// Banners
app.get('/api/banners', (req, res) => {
  res.json(db.getBanners());
});

app.post('/api/banners', requireAdmin, (req, res) => {
  const banner = db.addBanner(req.body);
  res.status(201).json(banner);
});

app.put('/api/banners/:id', requireAdmin, (req, res) => {
  const banner = db.updateBanner(req.params.id, req.body);
  if (!banner) return res.status(404).json({ error: 'Banner not found' });
  res.json(banner);
});

app.delete('/api/banners/:id', requireAdmin, (req, res) => {
  const ok = db.deleteBanner(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Banner not found' });
  res.json({ success: true });
});

// Categories
app.get('/api/categories', (req, res) => {
  res.json(db.getCategories());
});

app.post('/api/categories', requireAdmin, (req, res) => {
  const category = db.addCategory(req.body);
  res.status(201).json(category);
});

app.put('/api/categories/:id', requireAdmin, (req, res) => {
  const category = db.updateCategory(req.params.id, req.body);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

app.delete('/api/categories/:id', requireAdmin, (req, res) => {
  const ok = db.deleteCategory(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Category not found' });
  res.json({ success: true });
});

// Brands
app.get('/api/brands', (req, res) => {
  res.json(db.getBrands());
});

app.post('/api/brands', requireAdmin, (req, res) => {
  const brand = db.addBrand(req.body);
  res.status(201).json(brand);
});

app.put('/api/brands/:id', requireAdmin, (req, res) => {
  const brand = db.updateBrand(req.params.id, req.body);
  if (!brand) return res.status(404).json({ error: 'Brand not found' });
  res.json(brand);
});

app.delete('/api/brands/:id', requireAdmin, (req, res) => {
  const ok = db.deleteBrand(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Brand not found' });
  res.json({ success: true });
});

// Products
app.get('/api/products', (req, res) => {
  let products = db.getProducts();

  const { category, brand, isFeatured, isFlashSale, isBestSeller, isNewArrival, search, minPrice, maxPrice, rating, status, sort } = req.query;

  if (category) {
    products = products.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }
  if (brand) {
    products = products.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
  }
  if (isFeatured) {
    products = products.filter(p => p.isFeatured === (isFeatured === 'true'));
  }
  if (isFlashSale) {
    products = products.filter(p => p.isFlashSale === (isFlashSale === 'true'));
  }
  if (isBestSeller) {
    products = products.filter(p => p.isBestSeller === (isBestSeller === 'true'));
  }
  if (isNewArrival) {
    products = products.filter(p => p.isNewArrival === (isNewArrival === 'true'));
  }
  if (status) {
    products = products.filter(p => p.status === status);
  }
  if (search) {
    const term = (search as string).toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term));
  }
  if (minPrice) {
    products = products.filter(p => {
      const activePrice = p.discountPrice > 0 ? p.discountPrice : p.price;
      return activePrice >= parseFloat(minPrice as string);
    });
  }
  if (maxPrice) {
    products = products.filter(p => {
      const activePrice = p.discountPrice > 0 ? p.discountPrice : p.price;
      return activePrice <= parseFloat(maxPrice as string);
    });
  }
  if (rating) {
    products = products.filter(p => p.rating >= parseFloat(rating as string));
  }

  // Sort by
  if (sort === 'priceAsc') {
    products.sort((a, b) => {
      const pA = a.discountPrice > 0 ? a.discountPrice : a.price;
      const pB = b.discountPrice > 0 ? b.discountPrice : b.price;
      return pA - pB;
    });
  } else if (sort === 'priceDesc') {
    products.sort((a, b) => {
      const pA = a.discountPrice > 0 ? a.discountPrice : a.price;
      const pB = b.discountPrice > 0 ? b.discountPrice : b.price;
      return pB - pA;
    });
  } else if (sort === 'popularity') {
    products.sort((a, b) => b.ratingsCount - a.ratingsCount);
  } else if (sort === 'latest') {
    // Keep order as-is or reverse
    products.reverse();
  }

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProduct(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', requireAdmin, (req, res) => {
  try {
    const product = db.addProduct(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  const product = db.updateProduct(req.params.id, req.body);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const ok = db.deleteProduct(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true });
});

// Coupons
app.get('/api/coupons', requireAdmin, (req, res) => {
  res.json(db.getCoupons());
});

app.post('/api/coupons', requireAdmin, (req, res) => {
  const coupon = db.addCoupon(req.body);
  res.status(201).json(coupon);
});

app.put('/api/coupons/:id', requireAdmin, (req, res) => {
  const coupon = db.updateCoupon(req.params.id, req.body);
  if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
  res.json(coupon);
});

app.delete('/api/coupons/:id', requireAdmin, (req, res) => {
  const ok = db.deleteCoupon(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Coupon not found' });
  res.json({ success: true });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, cartTotal } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code is required' });

  const coupon = db.getCoupons().find(c => c.code.toUpperCase() === code.toUpperCase());
  if (!coupon) {
    return res.status(400).json({ error: 'Invalid coupon code' });
  }

  const now = new Date();
  if (new Date(coupon.expiryDate) < now) {
    return res.status(400).json({ error: 'Coupon has expired' });
  }

  if (coupon.usageCount >= coupon.usageLimit) {
    return res.status(400).json({ error: 'Coupon usage limit reached' });
  }

  if (cartTotal < coupon.minPurchase) {
    return res.status(400).json({ error: `Minimum purchase of ৳${coupon.minPurchase} required` });
  }

  res.json(coupon);
});

// Orders
app.get('/api/orders', authenticateUser, (req, res) => {
  const user = (req as any).user;
  const orders = db.getOrders();
  if (user.role === 'admin') {
    res.json(orders);
  } else {
    // Filter by customer email
    const customerOrders = orders.filter(o => o.customerEmail.toLowerCase() === user.email.toLowerCase());
    res.json(customerOrders);
  }
});

app.get('/api/orders/:id', authenticateUser, (req, res) => {
  const user = (req as any).user;
  const order = db.getOrders().find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (user.role !== 'admin' && order.customerEmail.toLowerCase() !== user.email.toLowerCase()) {
    return res.status(403).json({ error: 'Unauthorized to view this order' });
  }

  res.json(order);
});

app.post('/api/orders', optionalAuthenticateUser, (req, res) => {
  try {
    const order = db.addOrder(req.body);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = db.updateOrderStatus(req.params.id, orderStatus, paymentStatus);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Reviews
app.get('/api/reviews', (req, res) => {
  const { productId, approvedOnly } = req.query;
  let reviews = db.getReviews();
  if (productId) {
    reviews = reviews.filter(r => r.productId === productId);
  }
  if (approvedOnly === 'true') {
    reviews = reviews.filter(r => r.isApproved);
  }
  res.json(reviews);
});

app.post('/api/reviews', authenticateUser, (req, res) => {
  const review = db.addReview(req.body);
  res.status(201).json(review);
});

app.put('/api/reviews/:id/approve', requireAdmin, (req, res) => {
  const review = db.approveReview(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json(review);
});

app.put('/api/reviews/:id/reply', requireAdmin, (req, res) => {
  const review = db.replyReview(req.params.id, req.body.reply);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json(review);
});

app.delete('/api/reviews/:id', requireAdmin, (req, res) => {
  const ok = db.deleteReview(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Review not found' });
  res.json({ success: true });
});

// Customers (Admin-only)
app.get('/api/customers', requireAdmin, (req, res) => {
  const users = db.getUsers().filter(u => u.role === 'customer');
  const orders = db.getOrders();
  
  // Enriched customer data with order statistics
  const enrichedCustomers = users.map(user => {
    const customerOrders = orders.filter(o => o.customerEmail.toLowerCase() === user.email.toLowerCase());
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      ...user,
      orderCount: customerOrders.length,
      totalSpent
    };
  });

  res.json(enrichedCustomers);
});

app.put('/api/customers/:id/block', requireAdmin, (req, res) => {
  const { block } = req.body;
  const ok = db.blockUser(req.params.id, block);
  if (!ok) return res.status(404).json({ error: 'Customer not found' });
  res.json({ success: true });
});

app.delete('/api/customers/:id', requireAdmin, (req, res) => {
  const ok = db.deleteUser(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Customer not found' });
  res.json({ success: true });
});

// Authentication
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, address, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const profile = db.registerUser(name, email, phone || '', address || '', password);
  res.status(201).json({ user: profile, token: profile.id });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.findUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  if (user.isBlocked) {
    return res.status(403).json({ error: 'Your account has been suspended' });
  }

  const { passwordHash: _, ...profile } = user;
  res.json({ user: profile, token: profile.id });
});

app.get('/api/auth/profile', authenticateUser, (req, res) => {
  const user = (req as any).user;
  const { passwordHash: _, ...profile } = user;
  res.json(profile);
});

app.put('/api/auth/profile', authenticateUser, (req, res) => {
  const user = (req as any).user;
  const updated = db.updateUserProfile(user.id, req.body);
  if (!updated) return res.status(500).json({ error: 'Failed to update profile' });
  res.json(updated);
});

// Reports / Analytics
app.get('/api/reports/sales', requireAdmin, (req, res) => {
  const orders = db.getOrders();
  const products = db.getProducts();

  // Low stock products
  const lowStockThreshold = 5;
  const lowStock = products
    .filter(p => p.stock <= lowStockThreshold)
    .map(p => ({ id: p.id, name: p.name, stock: p.stock }));

  // Total Sales & Today Sales
  let totalSalesValue = 0;
  let todaySalesValue = 0;
  let confirmedOrdersCount = 0;
  const todayStr = new Date().toISOString().split('T')[0];

  orders.forEach(order => {
    if (order.orderStatus !== 'cancelled') {
      totalSalesValue += order.total;
      confirmedOrdersCount++;

      const orderDateStr = new Date(order.createdAt).toISOString().split('T')[0];
      if (orderDateStr === todayStr) {
        todaySalesValue += order.total;
      }
    }
  });

  // Calculate monthly analytics trends (last 6 months)
  const monthlyTrends: { [key: string]: number } = {};
  orders.forEach(order => {
    if (order.orderStatus !== 'cancelled') {
      const date = new Date(order.createdAt);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyTrends[monthYear] = (monthlyTrends[monthYear] || 0) + order.total;
    }
  });

  const trendsArray = Object.keys(monthlyTrends).map(key => ({
    month: key,
    sales: monthlyTrends[key]
  }));

  res.json({
    totalSales: totalSalesValue,
    todaySales: todaySalesValue,
    ordersCount: orders.length,
    confirmedOrdersCount,
    lowStock,
    monthlyTrends: trendsArray.slice(-6), // Return last 6 months
  });
});


// ==========================================
// VITE AND STATIC SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BazareX Server running on port ${PORT}`);
  });
}

startServer();
