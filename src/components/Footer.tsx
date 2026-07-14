import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, ShieldCheck, MessageCircle, Youtube, Video } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface FooterProps {
  settings: WebsiteSettings;
  setView: (view: string) => void;
}

export default function Footer({ settings, setView }: FooterProps) {
  return (
    <footer className="bg-neutral-900 text-gray-400 text-sm">
      {/* Upper Features Bar */}
      <div className="border-b border-neutral-800 bg-neutral-950 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-neutral-800 p-3 text-blue-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white">100% Genuine Products</h4>
                <p className="mt-1 text-xs text-neutral-500">Directly sourced tech accessories and premium gadgets.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-neutral-800 p-3 text-blue-500">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Fast Nationwide Delivery</h4>
                <p className="mt-1 text-xs text-neutral-500">Express shipping to Dhanmondi, Gulshan, Chittagong, and beyond.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-neutral-800 p-3 text-blue-500">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Dedicated Support</h4>
                <p className="mt-1 text-xs text-neutral-500">Phone & email support for all pre-sale and post-sale needs.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-neutral-800 p-3 text-blue-500">
                <Facebook className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Secure Payments</h4>
                <p className="mt-1 text-xs text-neutral-500">Supports SSLCommerz, bKash, Nagad, Rocket, and Cash on Delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          
          {/* Brand Intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-600 px-3 py-1 text-xl font-black tracking-tighter text-white">
                B
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                {settings.logo}<span className="text-blue-500">X</span>
              </span>
            </div>
            <p className="text-neutral-500 leading-relaxed text-xs">
              {settings.seoDescription}
            </p>
            <div className="flex gap-2.5 pt-2 flex-wrap">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="rounded-full bg-neutral-800 p-2 text-gray-400 hover:bg-blue-600 hover:text-white transition-all" title="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="rounded-full bg-neutral-800 p-2 text-gray-400 hover:bg-blue-400 hover:text-white transition-all" title="Twitter/X">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="rounded-full bg-neutral-800 p-2 text-gray-400 hover:bg-pink-600 hover:text-white transition-all" title="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings.whatsappNumber && (
                <a href={settings.whatsappNumber.startsWith('http') ? settings.whatsappNumber : `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="rounded-full bg-neutral-800 p-2 text-gray-400 hover:bg-emerald-600 hover:text-white transition-all" title="WhatsApp">
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
              {settings.tiktokUrl && (
                <a href={settings.tiktokUrl} target="_blank" rel="noreferrer" className="rounded-full bg-neutral-800 p-2 text-gray-400 hover:bg-neutral-950 hover:text-white transition-all border border-neutral-700/30 hover:border-transparent" title="TikTok">
                  <Video className="h-4 w-4" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="rounded-full bg-neutral-800 p-2 text-gray-400 hover:bg-red-600 hover:text-white transition-all" title="YouTube">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Shop Pages</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setView('shop')} className="hover:text-blue-500 transition-colors">All Products</button></li>
              <li><button onClick={() => setView('shop')} className="hover:text-blue-500 transition-colors">New Tech Releases</button></li>
              <li><button onClick={() => setView('shop')} className="hover:text-blue-500 transition-colors">Hot Deals & Promos</button></li>
              <li><button onClick={() => setView('compare')} className="hover:text-blue-500 transition-colors">Compare Tool</button></li>
            </ul>
          </div>

          {/* About / Support Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Support & Company</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setView('about')} className="hover:text-blue-500 transition-colors">About BazareX</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-blue-500 transition-colors">Contact Support</button></li>
              <li><button onClick={() => setView('profile')} className="hover:text-blue-500 transition-colors">My Profile</button></li>
              <li><button onClick={() => setView('orders')} className="hover:text-blue-500 transition-colors">Track Orders</button></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Contact Us</h4>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-blue-500" />
                <span>{settings.contactAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-blue-500" />
                <span>{settings.contactPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-blue-500" />
                <span>{settings.contactEmail}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower copyright bar */}
        <div className="mt-16 border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} BazareX. All rights reserved. Developed with Premium standards.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-300">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-300">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-gray-300">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
