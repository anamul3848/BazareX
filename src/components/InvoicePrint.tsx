import { Order, WebsiteSettings } from '../types';
import { Printer, ShieldCheck, Download, Calendar } from 'lucide-react';
import { api } from '../lib/api';

interface InvoicePrintProps {
  order: Order;
  settings: WebsiteSettings;
  onBack?: () => void;
}

export default function InvoicePrint({ order, settings, onBack }: InvoicePrintProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-3xl bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-md space-y-8 print:border-none print:shadow-none print:p-0">
      
      {/* Action buttons (hidden in print) */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 print:hidden">
        <button 
          onClick={onBack}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          {api.getCurrentUser() ? '← Back to Account' : '← Back to Shop'}
        </button>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 px-3 py-1 text-xl font-black tracking-tighter text-white">
              B
            </div>
            <span className="text-xl font-extrabold tracking-tight text-neutral-900">
              {settings.logo}<span className="text-blue-600">X</span>
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Premium Electronics Store</p>
        </div>

        <div className="text-right sm:text-right">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">INVOICE RECEIPT</h2>
          <p className="text-xs font-bold text-blue-600 mt-0.5">{order.invoiceNo}</p>
        </div>
      </div>

      {/* Addresses details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-b border-gray-100 py-6 text-xs leading-relaxed">
        <div>
          <p className="font-bold text-gray-400 uppercase tracking-wider mb-2">Sold By</p>
          <p className="font-bold text-gray-800">{settings.logo} Tech Corp</p>
          <p className="text-gray-500">{settings.contactAddress}</p>
          <p className="text-gray-500">Phone: {settings.contactPhone}</p>
          <p className="text-gray-500">Email: {settings.contactEmail}</p>
        </div>

        <div>
          <p className="font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
          <p className="font-bold text-gray-800">{order.customerName}</p>
          <p className="text-gray-500">{order.shippingAddress}</p>
          <p className="text-gray-500">Phone: {order.customerPhone}</p>
          {order.customerEmail ? <p className="text-gray-500">Email: {order.customerEmail}</p> : <p className="text-gray-400 italic">No Email Provided</p>}
        </div>
      </div>

      {/* Meta dates / payments */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <p className="text-gray-400 font-semibold uppercase tracking-wider mb-1">Issue Date</p>
          <p className="font-bold text-gray-800 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold uppercase tracking-wider mb-1">Payment Channel</p>
          <p className="font-bold text-gray-800 capitalize">{order.paymentMethod}</p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold uppercase tracking-wider mb-1">Payment Status</p>
          <span className={`inline-block rounded-md text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Items list table */}
      <div className="space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Device Manifest</p>
        <div className="rounded-xl border border-gray-150 overflow-hidden bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-150">
                <th className="p-3">Device Item Description</th>
                <th className="p-3 text-center">Price</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="p-3">
                    <p className="font-bold text-gray-800">{item.name}</p>
                    {item.selectedVariant && (
                      <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">
                        {item.selectedVariant}
                      </p>
                    )}
                  </td>
                  <td className="p-3 text-center text-gray-600">৳{item.price.toLocaleString()}</td>
                  <td className="p-3 text-center text-gray-600 font-bold">{item.quantity}</td>
                  <td className="p-3 text-right font-bold text-gray-800">৳{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial calculations */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 text-xs pt-4 border-t border-gray-100">
        <div className="max-w-xs space-y-1.5 leading-relaxed text-gray-400">
          <p className="font-bold text-gray-700 flex items-center gap-1 text-[11px] uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-green-600 fill-current" />
            Verified Invoice Receipt
          </p>
          <p className="text-[10px]">Thank you for purchasing premium hardware from BazareX. Retain this invoice for official warranty validations and support claims.</p>
        </div>

        <div className="w-full sm:w-64 space-y-2">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal Value</span>
            <span className="font-bold text-gray-800">৳{order.subtotal.toLocaleString()}</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
              <span>-৳{order.discount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-gray-500">
            <span>Nationwide Shipping</span>
            <span className="font-bold text-gray-800">৳{order.shippingCost.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-gray-500">
            <span>Calculated VAT</span>
            <span className="font-bold text-gray-800">৳{order.tax.toLocaleString()}</span>
          </div>

          <div className="border-t border-gray-150 pt-3 flex justify-between text-sm font-black text-gray-950">
            <span>Invoice Total Paid</span>
            <span className="text-base text-blue-600">৳{order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
