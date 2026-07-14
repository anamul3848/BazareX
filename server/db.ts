import fs from 'fs';
import path from 'path';
import { 
  Product, Category, Brand, Coupon, Order, Review, Banner, UserProfile, WebsiteSettings 
} from '../src/types';

interface DatabaseSchema {
  settings: WebsiteSettings;
  banners: Banner[];
  categories: Category[];
  brands: Brand[];
  products: Product[];
  coupons: Coupon[];
  orders: Order[];
  reviews: Review[];
  users: (UserProfile & { passwordHash: string; isBlocked?: boolean })[];
}

const DB_FILE = path.join(process.cwd(), 'server', 'db.json');

// Ensure database directory exists
const dbDir = path.dirname(DB_FILE);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initial Seeding Data
const initialSettings: WebsiteSettings = {
  logo: 'BazareX',
  favicon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80',
  seoTitle: 'BazareX - Premium Electronics & Tech Accessories Store',
  seoDescription: 'Discover high-end smartphones, premium laptops, mechanical keyboards, audiophile headphones, and elite smartwatches at BazareX.',
  contactEmail: 'support@bazarex.com',
  contactPhone: '+880 1712-345678',
  contactAddress: 'Level 12, Sona Tower, Gulshan-2, Dhaka, Bangladesh',
  facebookUrl: 'https://facebook.com/bazarex',
  twitterUrl: 'https://twitter.com/bazarex',
  instagramUrl: 'https://instagram.com/bazarex',
  whatsappNumber: '+8801712345678',
  tiktokUrl: 'https://tiktok.com/@bazarex',
  youtubeUrl: 'https://youtube.com/@bazarex',
  shippingFlatRate: 100, // in BDT or Currency
  taxPercentage: 5, // 5% VAT
};

const initialBanners: Banner[] = [
  {
    id: 'b1',
    title: 'The Sound of Purity',
    subtitle: 'Sony WH-1000XM5 Active Noise Cancelling Headphones. Experience industry-leading silence and premium acoustics.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
    link: '/shop?category=audio',
    type: 'hero'
  },
  {
    id: 'b2',
    title: 'Pro Workflow Unleashed',
    subtitle: 'MacBook Pro 16" with M3 Max. Liquid Retina XDR display, up to 128GB unified memory, and 22-hour battery life.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',
    link: '/shop?category=laptops',
    type: 'hero'
  },
  {
    id: 'b3',
    title: 'Limitless Performance',
    subtitle: 'Grab up to 20% Off on our best selling smartphone models this week only!',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    link: '/shop?isFlashSale=true',
    type: 'promo'
  }
];

const initialCategories: Category[] = [
  { id: 'cat1', name: 'Smartphones', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&q=80' },
  { id: 'cat2', name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1496181130204-755241524eab?w=300&q=80' },
  { id: 'cat3', name: 'Audio', slug: 'audio', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&q=80' },
  { id: 'cat4', name: 'Wearables', slug: 'wearables', image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=300&q=80' },
  { id: 'cat5', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300&q=80' }
];

const initialBrands: Brand[] = [
  { id: 'br1', name: 'Apple', slug: 'apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&q=80' },
  { id: 'br2', name: 'Samsung', slug: 'samsung', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&q=80' },
  { id: 'br3', name: 'Sony', slug: 'sony', logo: 'https://images.unsplash.com/photo-1591130219388-ae3a1ff2a736?w=100&q=80' },
  { id: 'br4', name: 'Keychron', slug: 'keychron', logo: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&q=80' },
  { id: 'br5', name: 'Anker', slug: 'anker', logo: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=100&q=80' }
];

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max - Titanium Gray',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    sku: 'AP-IP15PM-256-TG',
    brand: 'Apple',
    category: 'Smartphones',
    price: 139000,
    discountPrice: 132000,
    stock: 12,
    rating: 4.8,
    ratingsCount: 45,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
      'https://images.unsplash.com/photo-1695048132959-1e3ff2ca1605?w=600&q=80'
    ],
    variants: [
      { name: 'Storage', options: ['256GB', '512GB', '1TB'] },
      { name: 'Color', options: ['Natural Titanium', 'Blue Titanium', 'Black Titanium'] }
    ],
    specifications: {
      'Processor': 'A17 Pro chip',
      'Display': '6.7-inch Super Retina XDR OLED',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto',
      'Battery': 'Up to 29 hours video playback',
      'OS': 'iOS 17'
    },
    isFeatured: true,
    isFlashSale: true,
    isBestSeller: true,
    isNewArrival: true,
    status: 'active'
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.',
    sku: 'SS-S24U-512-Y',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 145000,
    discountPrice: 138000,
    stock: 8,
    rating: 4.9,
    ratingsCount: 38,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80'
    ],
    variants: [
      { name: 'Storage', options: ['256GB', '512GB'] },
      { name: 'Color', options: ['Titanium Yellow', 'Titanium Violet', 'Titanium Black'] }
    ],
    specifications: {
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'Camera': '200MP Main + 50MP + 12MP + 10MP Quad Camera',
      'Battery': '5000mAh with 45W Fast Charging',
      'Pen': 'Embedded S-Pen'
    },
    isFeatured: true,
    isFlashSale: false,
    isBestSeller: true,
    isNewArrival: true,
    status: 'active'
  },
  {
    id: 'p3',
    name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    description: 'Our industry-leading noise cancellation just took its biggest step forward. With four microphones on each earcup, ambient sound is captured even more accurately.',
    sku: 'SO-WH1000XM5-B',
    brand: 'Sony',
    category: 'Audio',
    price: 38500,
    discountPrice: 34900,
    stock: 25,
    rating: 4.7,
    ratingsCount: 112,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Midnight Black', 'Platinum Silver'] }
    ],
    specifications: {
      'Battery Life': 'Up to 30 hours (ANC ON)',
      'Charging Time': 'Quick charge (3 min for 3 hours)',
      'Noise Cancelling': 'Auto NC Optimizer & dual processor',
      'Connection': 'Bluetooth 5.2, Multipoint Connection',
      'Weight': '250g'
    },
    isFeatured: true,
    isFlashSale: true,
    isBestSeller: true,
    isNewArrival: false,
    status: 'active'
  },
  {
    id: 'p4',
    name: 'Keychron Q1 QMK Custom Mechanical Keyboard',
    description: 'A fully customizable 75% layout mechanical keyboard with a solid CNC machined aluminum body, gasket mount, and hot-swappable switches.',
    sku: 'KC-Q1-HOTSWAP',
    brand: 'Keychron',
    category: 'Accessories',
    price: 18500,
    discountPrice: 17500,
    stock: 5,
    rating: 4.6,
    ratingsCount: 29,
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80'
    ],
    variants: [
      { name: 'Switch Type', options: ['Gateron G Pro Red', 'Gateron G Pro Brown', 'Gateron G Pro Blue'] },
      { name: 'Color', options: ['Carbon Black', 'Silver Grey', 'Navy Blue'] }
    ],
    specifications: {
      'Layout': '75% Compact',
      'Body Material': 'CNC Anodized Aluminum',
      'Connectivity': 'Wired Type-C',
      'Switches': 'Hot-swappable 3pin/5pin',
      'Software': 'QMK / VIA compatible'
    },
    isFeatured: false,
    isFlashSale: false,
    isBestSeller: false,
    isNewArrival: true,
    status: 'active'
  },
  {
    id: 'p5',
    name: 'Apple Watch Series 9 GPS',
    description: 'A smarter, brighter, mightier Apple Watch. Features the S9 SiP, a magical new way to use your watch without touching the screen, and double the brightness.',
    sku: 'AP-W9-GPS-45',
    brand: 'Apple',
    category: 'Wearables',
    price: 49500,
    discountPrice: 46000,
    stock: 15,
    rating: 4.7,
    ratingsCount: 34,
    images: [
      'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=600&q=80',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=80'
    ],
    variants: [
      { name: 'Size', options: ['41mm', '45mm'] },
      { name: 'Band Style', options: ['Midnight Sport Band', 'Starlight Sport Loop', 'Blue Ocean Band'] }
    ],
    specifications: {
      'Processor': 'S9 SiP',
      'Display': 'Always-On Retina display, up to 2000 nits',
      'Sensors': 'Blood Oxygen, ECG, Temperature sensing',
      'Battery': 'Up to 18 hours (36 hours in Low Power Mode)',
      'Water Resistance': 'Swimproof (50m WR)'
    },
    isFeatured: true,
    isFlashSale: true,
    isBestSeller: false,
    isNewArrival: true,
    status: 'active'
  },
  {
    id: 'p6',
    name: 'Anker Prime 20,000mAh Power Bank (200W)',
    description: 'Ultra-high capacity power bank with lightning-fast 200W multi-port output, real-time smart digital display, and heavy-duty battery protection.',
    sku: 'AK-PRIME-20K-200W',
    brand: 'Anker',
    category: 'Accessories',
    price: 12500,
    discountPrice: 11000,
    stock: 3, // Low stock alert trigger
    rating: 4.5,
    ratingsCount: 78,
    images: [
      'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&q=80',
      'https://images.unsplash.com/photo-1620283085439-39620a1e21c4?w=600&q=80'
    ],
    specifications: {
      'Capacity': '20,000 mAh',
      'Max Output': '200W Total (100W per USB-C)',
      'Ports': '2 x USB-C, 1 x USB-A',
      'Display': 'TFT Smart Digital Display',
      'Recharging Time': 'Full charge in 1 hour 15 mins (with 100W input)'
    },
    isFeatured: false,
    isFlashSale: false,
    isBestSeller: true,
    isNewArrival: false,
    status: 'active'
  }
];

const initialCoupons: Coupon[] = [
  {
    id: 'c1',
    code: 'WELCOME10',
    discountType: 'percentage',
    value: 10,
    minPurchase: 1000,
    expiryDate: '2026-12-31',
    usageLimit: 100,
    usageCount: 15
  },
  {
    id: 'c2',
    code: 'BAZAREX500',
    discountType: 'fixed',
    value: 500,
    minPurchase: 5000,
    expiryDate: '2026-09-30',
    usageLimit: 50,
    usageCount: 8
  }
];

const initialReviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    productName: 'iPhone 15 Pro Max - Titanium Gray',
    userName: 'Imran Khan',
    userEmail: 'imran@gmail.com',
    rating: 5,
    comment: 'Absolute beast of a phone! The titanium finish feels premium and the camera zoom is incredibly crisp.',
    reply: 'Thank you Imran! Glad you are loving the Premium Titanium build.',
    isApproved: true,
    createdAt: '2026-07-01T10:00:00Z'
  },
  {
    id: 'r2',
    productId: 'p3',
    productName: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    userName: 'Sadia Rahman',
    userEmail: 'sadia@outlook.com',
    rating: 4,
    comment: 'Noise cancellation is world class. Comfort is good but the headband feels a bit thinner than XM4. Sound signature is brilliant.',
    isApproved: true,
    createdAt: '2026-07-05T14:30:00Z'
  },
  {
    id: 'r3',
    productId: 'p2',
    productName: 'Samsung Galaxy S24 Ultra',
    userName: 'Kazi Mahbub',
    userEmail: 'kazi@yahoo.com',
    rating: 5,
    comment: 'The anti-reflective screen coating is a game-changer. Galaxy AI features like Circle to Search are actually highly useful daily.',
    isApproved: false, // Needs admin approval
    createdAt: '2026-07-12T08:15:00Z'
  }
];

const initialUsers: DatabaseSchema['users'] = [
  {
    id: 'u1',
    name: 'BazareX Admin',
    email: 'admin@bazarex.com',
    phone: '+8801911111111',
    address: 'BazareX Headquarters, Dhaka',
    role: 'admin',
    createdAt: '2026-06-01T00:00:00Z',
    passwordHash: 'admin123' // Simple secure string comparison for our admin portal
  },
  {
    id: 'u2',
    name: 'Anamul Matubber',
    email: 'matubberanamul001@gmail.com',
    phone: '+8801700000000',
    address: 'Dhanmondi, Dhaka, Bangladesh',
    role: 'customer',
    createdAt: '2026-07-10T12:00:00Z',
    passwordHash: 'user123'
  }
];

const initialOrders: Order[] = [
  {
    id: 'o1',
    invoiceNo: 'BX-2026-10001',
    customerName: 'Anamul Matubber',
    customerEmail: 'matubberanamul001@gmail.com',
    customerPhone: '+8801700000000',
    shippingAddress: 'Dhanmondi, Dhaka, Bangladesh',
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    items: [
      {
        productId: 'p3',
        name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
        price: 34900,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        selectedVariant: 'Midnight Black'
      }
    ],
    subtotal: 34900,
    discount: 500,
    couponCode: 'BAZAREX500',
    shippingCost: 100,
    tax: 1720, // 5% of (34900 - 500)
    total: 36220,
    createdAt: '2026-07-12T11:20:00Z'
  },
  {
    id: 'o2',
    invoiceNo: 'BX-2026-10002',
    customerName: 'Kazi Mahbub',
    customerEmail: 'kazi@yahoo.com',
    customerPhone: '+8801811223344',
    shippingAddress: 'Mirpur, Dhaka',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'pending',
    items: [
      {
        productId: 'p6',
        name: 'Anker Prime 20,000mAh Power Bank (200W)',
        price: 11000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&q=80'
      }
    ],
    subtotal: 22000,
    discount: 0,
    shippingCost: 100,
    tax: 1100, // 5% of 22000
    total: 23200,
    createdAt: '2026-07-14T10:05:00Z'
  }
];

class FileDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = {
      settings: initialSettings,
      banners: initialBanners,
      categories: initialCategories,
      brands: initialBrands,
      products: initialProducts,
      coupons: initialCoupons,
      orders: initialOrders,
      reviews: initialReviews,
      users: initialUsers,
    };
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (e) {
      console.error('Error loading file database, using fallback seeding:', e);
      this.save();
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to save file database:', e);
    }
  }

  // Settings
  getSettings(): WebsiteSettings {
    return this.data.settings;
  }
  updateSettings(settings: WebsiteSettings) {
    this.data.settings = settings;
    this.save();
  }

  // Banners
  getBanners(): Banner[] {
    return this.data.banners;
  }
  addBanner(banner: Omit<Banner, 'id'>): Banner {
    const newBanner = { ...banner, id: 'b_' + Math.random().toString(36).substr(2, 9) };
    this.data.banners.push(newBanner);
    this.save();
    return newBanner;
  }
  updateBanner(id: string, banner: Partial<Banner>): Banner | null {
    const idx = this.data.banners.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.banners[idx] = { ...this.data.banners[idx], ...banner };
    this.save();
    return this.data.banners[idx];
  }
  deleteBanner(id: string): boolean {
    const initialLen = this.data.banners.length;
    this.data.banners = this.data.banners.filter(b => b.id !== id);
    this.save();
    return this.data.banners.length < initialLen;
  }

  // Categories
  getCategories(): Category[] {
    return this.data.categories;
  }
  addCategory(category: Omit<Category, 'id'>): Category {
    const newCategory = { ...category, id: 'cat_' + Math.random().toString(36).substr(2, 9) };
    this.data.categories.push(newCategory);
    this.save();
    return newCategory;
  }
  updateCategory(id: string, category: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...category };
    this.save();
    return this.data.categories[idx];
  }
  deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    this.save();
    return this.data.categories.length < initialLen;
  }

  // Brands
  getBrands(): Brand[] {
    return this.data.brands;
  }
  addBrand(brand: Omit<Brand, 'id'>): Brand {
    const newBrand = { ...brand, id: 'br_' + Math.random().toString(36).substr(2, 9) };
    this.data.brands.push(newBrand);
    this.save();
    return newBrand;
  }
  updateBrand(id: string, brand: Partial<Brand>): Brand | null {
    const idx = this.data.brands.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.brands[idx] = { ...this.data.brands[idx], ...brand };
    this.save();
    return this.data.brands[idx];
  }
  deleteBrand(id: string): boolean {
    const initialLen = this.data.brands.length;
    this.data.brands = this.data.brands.filter(b => b.id !== id);
    this.save();
    return this.data.brands.length < initialLen;
  }

  // Products
  getProducts(): Product[] {
    return this.data.products;
  }
  getProduct(id: string): Product | null {
    return this.data.products.find(p => p.id === id) || null;
  }
  addProduct(product: Omit<Product, 'id' | 'rating' | 'ratingsCount'>): Product {
    const newProduct: Product = {
      ...product,
      id: 'p_' + Math.random().toString(36).substr(2, 9),
      rating: 5.0,
      ratingsCount: 0
    };
    this.data.products.push(newProduct);
    this.save();
    return newProduct;
  }
  updateProduct(id: string, product: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...product };
    this.save();
    return this.data.products[idx];
  }
  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.save();
    return this.data.products.length < initialLen;
  }

  // Coupons
  getCoupons(): Coupon[] {
    return this.data.coupons;
  }
  addCoupon(coupon: Omit<Coupon, 'id' | 'usageCount'>): Coupon {
    const newCoupon: Coupon = {
      ...coupon,
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      usageCount: 0
    };
    this.data.coupons.push(newCoupon);
    this.save();
    return newCoupon;
  }
  updateCoupon(id: string, coupon: Partial<Coupon>): Coupon | null {
    const idx = this.data.coupons.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.coupons[idx] = { ...this.data.coupons[idx], ...coupon };
    this.save();
    return this.data.coupons[idx];
  }
  deleteCoupon(id: string): boolean {
    const initialLen = this.data.coupons.length;
    this.data.coupons = this.data.coupons.filter(c => c.id !== id);
    this.save();
    return this.data.coupons.length < initialLen;
  }

  // Reviews
  getReviews(): Review[] {
    return this.data.reviews;
  }
  addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const newReview: Review = {
      ...review,
      id: 'r_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.data.reviews.push(newReview);

    // Re-calculate rating for that product
    const productReviews = this.data.reviews.filter(r => r.productId === review.productId && r.isApproved);
    if (productReviews.length > 0) {
      const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      const productIdx = this.data.products.findIndex(p => p.id === review.productId);
      if (productIdx !== -1) {
        this.data.products[productIdx].rating = parseFloat(avg.toFixed(1));
        this.data.products[productIdx].ratingsCount = productReviews.length;
      }
    }

    this.save();
    return newReview;
  }
  approveReview(id: string): Review | null {
    const idx = this.data.reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.data.reviews[idx].isApproved = true;

    // Recalculate average rating
    const productId = this.data.reviews[idx].productId;
    const productReviews = this.data.reviews.filter(r => r.productId === productId && r.isApproved);
    if (productReviews.length > 0) {
      const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      const productIdx = this.data.products.findIndex(p => p.id === productId);
      if (productIdx !== -1) {
        this.data.products[productIdx].rating = parseFloat(avg.toFixed(1));
        this.data.products[productIdx].ratingsCount = productReviews.length;
      }
    }

    this.save();
    return this.data.reviews[idx];
  }
  replyReview(id: string, reply: string): Review | null {
    const idx = this.data.reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.data.reviews[idx].reply = reply;
    this.save();
    return this.data.reviews[idx];
  }
  deleteReview(id: string): boolean {
    const idx = this.data.reviews.findIndex(r => r.id === id);
    if (idx === -1) return false;
    const productId = this.data.reviews[idx].productId;
    this.data.reviews.splice(idx, 1);
    
    // Recalculate product rating
    const productReviews = this.data.reviews.filter(r => r.productId === productId && r.isApproved);
    const productIdx = this.data.products.findIndex(p => p.id === productId);
    if (productIdx !== -1) {
      if (productReviews.length > 0) {
        const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        this.data.products[productIdx].rating = parseFloat(avg.toFixed(1));
        this.data.products[productIdx].ratingsCount = productReviews.length;
      } else {
        this.data.products[productIdx].rating = 5.0;
        this.data.products[productIdx].ratingsCount = 0;
      }
    }
    
    this.save();
    return true;
  }

  // Users
  getUsers() {
    return this.data.users.map(({ passwordHash, ...rest }) => rest);
  }
  findUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }
  registerUser(name: string, email: string, phone: string, address: string, passwordHash: string): UserProfile {
    const newUser = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      address,
      role: 'customer' as const,
      createdAt: new Date().toISOString(),
      passwordHash,
      isBlocked: false
    };
    this.data.users.push(newUser);
    this.save();
    const { passwordHash: _, ...profile } = newUser;
    return profile;
  }
  updateUserProfile(id: string, profile: Partial<UserProfile>): UserProfile | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...profile };
    this.save();
    const { passwordHash: _, ...rest } = this.data.users[idx];
    return rest;
  }
  blockUser(id: string, block: boolean): boolean {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    this.data.users[idx].isBlocked = block;
    this.save();
    return true;
  }
  deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    this.save();
    return this.data.users.length < initialLen;
  }

  // Orders
  getOrders(): Order[] {
    return this.data.orders;
  }
  addOrder(order: Omit<Order, 'id' | 'invoiceNo' | 'createdAt'>): Order {
    const lastNum = this.data.orders.length > 0
      ? parseInt(this.data.orders[this.data.orders.length - 1].invoiceNo.split('-')[2])
      : 10000;
    const nextNum = lastNum + 1;
    const invoiceNo = `BX-${new Date().getFullYear()}-${nextNum}`;
    const id = 'o_' + Math.random().toString(36).substr(2, 9);
    
    const newOrder: Order = {
      ...order,
      id,
      invoiceNo,
      createdAt: new Date().toISOString()
    };
    this.data.orders.push(newOrder);

    // Manage Inventory & Coupon Limit
    order.items.forEach(item => {
      const product = this.data.products.find(p => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    });

    if (order.couponCode) {
      const coupon = this.data.coupons.find(c => c.code.toUpperCase() === order.couponCode?.toUpperCase());
      if (coupon) {
        coupon.usageCount += 1;
      }
    }

    this.save();
    return newOrder;
  }
  updateOrderStatus(id: string, status: Order['orderStatus'], paymentStatus?: Order['paymentStatus']): Order | null {
    const idx = this.data.orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    this.data.orders[idx].orderStatus = status;
    if (paymentStatus) {
      this.data.orders[idx].paymentStatus = paymentStatus;
    }
    // Auto-update paymentStatus to paid if delivered
    if (status === 'delivered') {
      this.data.orders[idx].paymentStatus = 'paid';
    }
    this.save();
    return this.data.orders[idx];
  }
}

export const db = new FileDatabase();
