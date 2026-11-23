import React from 'react';
import businessConfig from '../config/businessConfig';

export function ShippingPolicy() {
  return (
    <div className="bg-[#f9f9f7] min-h-screen py-10 sm:py-14">
      <div className="site-container max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-[#e2e3e1] shadow-2xs space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Policies &amp; Terms</span>
          <h1 className="font-['Manrope'] font-bold text-2xl sm:text-3xl text-black mt-1">Shipping &amp; Delivery Policy</h1>
        </div>
        <div className="space-y-4 text-xs sm:text-sm text-neutral-700 font-['Inter'] leading-relaxed">
          <p>
            Welcome to <strong>{businessConfig.companyName}</strong>. We strive to provide reliable and insured doorstep delivery for all stone care products, tile adhesives, and diamond abrasives across India.
          </p>
          <h2 className="font-bold text-black text-base pt-2">1. Processing &amp; Dispatch</h2>
          <p>All orders are verified and dispatched within 24 to 48 business hours from our authorized warehouses. Orders placed on Sundays or national holidays are dispatched on the subsequent business day.</p>
          
          <h2 className="font-bold text-black text-base pt-2">2. Delivery Timeframes</h2>
          <p>• Metro Cities (Bangalore, Mumbai, Delhi-NCR, Hyderabad, Chennai): 2 to 4 business days.<br/>• Tier 2 &amp; Tier 3 regions: 4 to 6 business days.<br/>• Remote or specialized courier regions: 6 to 8 business days.</p>

          <h2 className="font-bold text-black text-base pt-2">3. Shipping Rates</h2>
          <p>• Orders above ₹1,999: <strong>FREE Standard Shipping</strong>.<br/>• Orders below ₹1,999: Flat rate of ₹150.</p>

          <h2 className="font-bold text-black text-base pt-2">4. Hazardous / Chemical Transport Safety</h2>
          <p>Stone sealers and polishing powders are packed with specialized secondary inner sealing and foam cushioning in compliance with Indian surface transport guidelines.</p>
        </div>
      </div>
    </div>
  );
}

export function ReturnPolicy() {
  return (
    <div className="bg-[#f9f9f7] min-h-screen py-10 sm:py-14">
      <div className="site-container max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-[#e2e3e1] shadow-2xs space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Policies &amp; Terms</span>
          <h1 className="font-['Manrope'] font-bold text-2xl sm:text-3xl text-black mt-1">Returns &amp; Refund Policy</h1>
        </div>
        <div className="space-y-4 text-xs sm:text-sm text-neutral-700 font-['Inter'] leading-relaxed">
          <p>
            At <strong>{businessConfig.companyName}</strong>, customer satisfaction and genuine product quality are our highest priorities.
          </p>
          <h2 className="font-bold text-black text-base pt-2">1. 7-Day Return Window</h2>
          <p>You can request a return within 7 calendar days of delivery for unopened, unused items with the manufacturer seal intact.</p>
          
          <h2 className="font-bold text-black text-base pt-2">2. Damaged or Incorrect Shipments</h2>
          <p>If an item arrives damaged or leaking, please contact our support team on WhatsApp at {businessConfig.phone} or email {businessConfig.email} within 48 hours of delivery with photos of the damaged packaging. We will send an immediate free replacement.</p>

          <h2 className="font-bold text-black text-base pt-2">3. Refund Processing</h2>
          <p>Approved refunds are processed to your original payment method (or UPI) within 3 to 5 business days after inspection at our hub.</p>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="bg-[#f9f9f7] min-h-screen py-10 sm:py-14">
      <div className="site-container max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-[#e2e3e1] shadow-2xs space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Policies &amp; Terms</span>
          <h1 className="font-['Manrope'] font-bold text-2xl sm:text-3xl text-black mt-1">Privacy Policy</h1>
        </div>
        <div className="space-y-4 text-xs sm:text-sm text-neutral-700 font-['Inter'] leading-relaxed">
          <p>
            <strong>{businessConfig.companyName}</strong> respects customer privacy and strictly protects your personal information.
          </p>
          <h2 className="font-bold text-black text-base pt-2">1. Information We Collect</h2>
          <p>When you register, order, or submit inquiries, we collect your name, mobile number, shipping address, and email to fulfill your order and provide delivery notifications.</p>
          
          <h2 className="font-bold text-black text-base pt-2">2. Payment Security</h2>
          <p>We do not store your credit card or debit card numbers on our servers. All transactions are processed through encrypted 256-bit payment gateways.</p>

          <h2 className="font-bold text-black text-base pt-2">3. No Data Selling</h2>
          <p>We do not sell, rent, or lease customer contact information to third parties.</p>
        </div>
      </div>
    </div>
  );
}

export function TermsConditions() {
  return (
    <div className="bg-[#f9f9f7] min-h-screen py-10 sm:py-14">
      <div className="site-container max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-[#e2e3e1] shadow-2xs space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Policies &amp; Terms</span>
          <h1 className="font-['Manrope'] font-bold text-2xl sm:text-3xl text-black mt-1">Terms &amp; Conditions</h1>
        </div>
        <div className="space-y-4 text-xs sm:text-sm text-neutral-700 font-['Inter'] leading-relaxed">
          <p>
            By accessing and placing an order on <strong>{businessConfig.websiteDisplay}</strong>, you agree to comply with the terms set forth by <strong>{businessConfig.companyName}</strong>.
          </p>
          <h2 className="font-bold text-black text-base pt-2">1. Product Usage &amp; Testing</h2>
          <p>Stone chemicals (sealers, crystallization powders, epoxy grouts) should always be spot-tested on an inconspicuous piece or tile sample before full surface application to verify desired finish.</p>
          
          <h2 className="font-bold text-black text-base pt-2">2. Pricing &amp; Inventory</h2>
          <p>All prices are listed in Indian Rupees (INR) inclusive of applicable taxes. In the event of a stock discrepancy, our support team will inform you prior to dispatch.</p>
        </div>
      </div>
    </div>
  );
}
