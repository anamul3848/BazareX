import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';

export default function ClientContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-200">
      
      {/* Intro */}
      <section className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Contact Customer Support</h1>
        <p className="text-xs text-gray-400">Have hardware questions, pre-purchase inquiries, or warranty service requests? Reach out now!</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact info panel */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">Get In Touch</h3>
          
          <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4 text-xs font-medium text-gray-600">
            <div className="flex gap-3">
              <Phone className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-800">Direct Support Line</h4>
                <p className="mt-0.5 text-gray-500">+880 1712-345678</p>
                <p className="text-[10px] text-gray-400">Sat-Thu, 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-800">Email Correspondence</h4>
                <p className="mt-0.5 text-gray-500">support@bazarex.com</p>
                <p className="text-[10px] text-gray-400">Response within 2 hours</p>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-800">Headquarters</h4>
                <p className="mt-0.5 text-gray-500">Suite 401, Mirpur Road, Dhanmondi, Dhaka 1205</p>
                <p className="text-[10px] text-gray-400">Bangladesh</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50/50 p-5 space-y-2 text-xs">
            <h4 className="font-bold text-blue-900 flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              Need Quick Answers?
            </h4>
            <p className="text-blue-700 leading-relaxed text-[11px]">
              Use our live specifications comparison matrix on product pages, or enter your orders ID in profile views to get instant tracking data.
            </p>
          </div>
        </div>

        {/* Contact Form dispatch */}
        <div className="md:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
          <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-6">Dispatch Message Inquiry</h3>
          
          {success ? (
            <div className="rounded-xl bg-green-50 p-4 text-xs font-semibold text-green-600 border border-green-100 leading-relaxed">
              🎉 Thank you for reaching out! Your support inquiry has been logged successfully. An agent from BazareX Support will contact you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Inquiry Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Details Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your tech requirement, order details, or warranty validation claim..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-blue-600 py-3 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Dispatch Support Inquiry
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
