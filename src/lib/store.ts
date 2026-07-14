import { useState, useEffect } from 'react';
import { Product, OrderItem } from '../types';

export interface CartItem extends OrderItem {}

// Custom event system to sync cart/wishlist/compare across components
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

let cart: CartItem[] = JSON.parse(localStorage.getItem('bx_cart') || '[]');
let wishlist: Product[] = JSON.parse(localStorage.getItem('bx_wishlist') || '[]');
let compareList: Product[] = JSON.parse(localStorage.getItem('bx_compare') || '[]');

export const store = {
  // Listen to changes
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Cart operations
  getCart(): CartItem[] {
    return cart;
  },

  addToCart(product: Product, quantity = 1, variant?: string) {
    const existing = cart.find(
      item => item.productId === product.id && item.selectedVariant === variant
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
        quantity,
        image: product.images[0] || '',
        selectedVariant: variant
      });
    }

    this.saveCart();
  },

  updateCartQty(productId: string, quantity: number, variant?: string) {
    cart = cart.map(item => {
      if (item.productId === productId && item.selectedVariant === variant) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    });
    this.saveCart();
  },

  removeFromCart(productId: string, variant?: string) {
    cart = cart.filter(
      item => !(item.productId === productId && item.selectedVariant === variant)
    );
    this.saveCart();
  },

  clearCart() {
    cart = [];
    this.saveCart();
  },

  getCartTotal(): number {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getCartCount(): number {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  saveCart() {
    localStorage.setItem('bx_cart', JSON.stringify(cart));
    notify();
  },

  // Wishlist operations
  getWishlist(): Product[] {
    return wishlist;
  },

  toggleWishlist(product: Product) {
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      wishlist = wishlist.filter(item => item.id !== product.id);
    } else {
      wishlist.push(product);
    }
    localStorage.setItem('bx_wishlist', JSON.stringify(wishlist));
    notify();
  },

  isInWishlist(productId: string): boolean {
    return wishlist.some(item => item.id === productId);
  },

  clearWishlist() {
    wishlist = [];
    localStorage.setItem('bx_wishlist', JSON.stringify([]));
    notify();
  },

  // Compare operations
  getCompare(): Product[] {
    return compareList;
  },

  toggleCompare(product: Product) {
    const exists = compareList.some(item => item.id === product.id);
    if (exists) {
      compareList = compareList.filter(item => item.id !== product.id);
    } else {
      if (compareList.length >= 3) {
        // Limit to 3 items
        compareList.shift();
      }
      compareList.push(product);
    }
    localStorage.setItem('bx_compare', JSON.stringify(compareList));
    notify();
  },

  removeFromCompare(productId: string) {
    compareList = compareList.filter(item => item.id !== productId);
    localStorage.setItem('bx_compare', JSON.stringify(compareList));
    notify();
  },

  isInCompare(productId: string): boolean {
    return compareList.some(item => item.id === productId);
  },

  clearCompare() {
    compareList = [];
    localStorage.setItem('bx_compare', JSON.stringify([]));
    notify();
  }
};

// React hook to use store state
export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  return {
    cart: store.getCart(),
    cartCount: store.getCartCount(),
    cartTotal: store.getCartTotal(),
    wishlist: store.getWishlist(),
    clearWishlist: () => store.clearWishlist(),
    compare: store.getCompare(),
    compareList: store.getCompare(),
    addToCart: (p: Product, q?: number, v?: string) => store.addToCart(p, q, v),
    removeFromCart: (pId: string, v?: string) => store.removeFromCart(pId, v),
    updateCartQty: (pId: string, q: number, v?: string) => store.updateCartQty(pId, q, v),
    clearCart: () => store.clearCart(),
    toggleWishlist: (p: Product) => store.toggleWishlist(p),
    isInWishlist: (pId: string) => store.isInWishlist(pId),
    toggleCompare: (p: Product) => store.toggleCompare(p),
    removeFromCompare: (pId: string) => store.removeFromCompare(pId),
    isInCompare: (pId: string) => store.isInCompare(pId),
    clearCompare: () => store.clearCompare()
  };
}
