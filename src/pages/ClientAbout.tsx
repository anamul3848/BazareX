import { ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';

export default function ClientAbout() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-in fade-in duration-200">
      
      {/* Brand Intro Hero */}
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">About Bazare<span className="text-blue-600">X</span></h1>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Next Generation Premium Hardware Store</p>
        <p className="text-sm text-gray-500 leading-relaxed font-medium">
          BazareX is Bangladesh's premiere destination for high-end electronic devices, enthusiast computer peripherals, smart IoT accessories, and pristine audio gear. We bridge the gap between global hardware makers and Bangladeshi tech-lovers with unbeatable speed, official warranty support, and absolute genuineness.
        </p>
      </section>

      {/* Corporate values grid */}
      <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 pt-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-800">100% Genuine</h3>
          <p className="text-[11px] text-gray-400 leading-normal">Every single hardware component passes visual inspection and seal check before dispatching.</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Truck className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-800">Nationwide Delivery</h3>
          <p className="text-[11px] text-gray-400 leading-normal">Prompt, secure, fully-insured delivery routes touching Dhaka, Chittagong, Sylhet, and beyond.</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-800">Prompt Support</h3>
          <p className="text-[11px] text-gray-400 leading-normal">Our dedicated tech support team resolves pre-sales, checkout, or warranty claims within 24 hours.</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-800">VIP Tech Experience</h3>
          <p className="text-[11px] text-gray-400 leading-normal">Exclusive vouchers, launch alerts, and spec comparison matrices for our VIP members.</p>
        </div>
      </section>

      {/* Our Mission Detail Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50/50 p-6 sm:p-10 rounded-3xl">
        <div className="space-y-4">
          <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Our Mission</h2>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            To empower Bangladeshi students, computer professionals, audio enthusiasts, and general consumers by providing direct, affordable access to high-quality hardware. We eliminate custom processing delay and excessive importer middleman margins so that premium hardware is readily accessible on every budget tier.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            We are deeply committed to fostering trust, building robust localized delivery loops, and supporting developers and designers alike with excellent workstation hardware setups.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border bg-white">
          <img 
            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80" 
            alt="BazareX workspace" 
            className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300" 
          />
        </div>
      </section>

    </div>
  );
}
