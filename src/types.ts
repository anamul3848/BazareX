export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  discountPrice: number; // 0 or less if no discount
  stock: number;
  rating: number;
  ratingsCount: number;
  images: string[];
  variants?: {
    name: string; // e.g. "Color" or "Storage"
    options: string[]; // e.g. ["Midnight Black", "Titanium Gray"]
  }[];
  specifications: { [key: string]: string };
  isFeatured: boolean;
  isFlashSale: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: 'cod' | 'sslcommerz' | 'bkash' | 'nagad' | 'rocket';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingCost: number;
  tax: number;
  total: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  reply?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  type: 'hero' | 'promo' | 'offer';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface WebsiteSettings {
  logo: string;
  favicon: string;
  seoTitle: string;
  seoDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  whatsappNumber?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  shippingFlatRate: number;
  taxPercentage: number;
}
