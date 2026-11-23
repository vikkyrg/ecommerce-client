import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import businessConfig from '../config/businessConfig';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      category: 'Products & Stone Care',
      q: 'Are all products on NS Stone Chemicals 100% genuine?',
      a: 'Yes, absolutely. We source exclusively from official manufacturer channels and direct authorized distributors of Tenax, Akemi, Kerakoll, Mapei, and Surie Polex. Every item arrives in authentic, factory-sealed packaging.'
    },
    {
      category: 'Products & Stone Care',
      q: 'Which sealer is best for granite kitchen countertops?',
      a: 'For dark and exotic granite, Tenax Ager provides deep color enhancement with strong water and oil repelling properties. For neutral tone natural stone without altering color, penetrating impregnating sealers provide invisible stain resistance.'
    },
    {
      category: 'Ordering & Payment',
      q: 'What payment methods do you accept?',
      a: 'We accept all major UPI applications (Google Pay, PhonePe, Paytm, BHIM), Visa, MasterCard, and RuPay debit/credit cards, Net Banking across all Indian banks, and Cash on Delivery (COD) for eligible pincodes.'
    },
    {
      category: 'Ordering & Payment',
      q: 'Can I order directly via WhatsApp?',
      a: `Yes! You can tap the "Ask or Order via WhatsApp" button on any product page or text us directly at ${businessConfig.phone}. Our team will immediately process your requirements.`
    },
    {
      category: 'Shipping & Delivery',
      q: 'How long does shipping take across India?',
      a: 'Orders are dispatched from our depots within 24 hours. Metros typically receive delivery within 2–4 business days, while other regions take 4–6 business days. Insured door-to-door tracking is provided.'
    },
    {
      category: 'Shipping & Delivery',
      q: 'What are the delivery charges?',
      a: 'Orders with a subtotal above ₹1,999 qualify for Free Standard Delivery. Orders below ₹1,999 carry a flat delivery fee of ₹150 nationwide.'
    },
    {
      category: 'Returns & Refunds',
      q: 'What is your return policy?',
      a: 'We offer an easy 7-day return policy for unopened, undamaged items in their original factory seal. Contact our customer care team via WhatsApp or email to initiate a return pickup.'
    }
  ];

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-10 sm:py-16">
      <div className="site-container max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full inline-block">
            Frequently Asked Questions
          </span>
          <h1 className="font-['Manrope'] font-bold text-3xl sm:text-4xl text-black">
            Customer FAQ &amp; Guidance
          </h1>
          <p className="font-['Inter'] text-xs sm:text-sm text-neutral-500">
            Answers to common questions regarding stone chemicals, deliveries, and orders.
          </p>
        </div>

        {/* Accordion */}
        <div className="bg-white rounded-2xl border border-[#e2e3e1] shadow-2xs divide-y divide-neutral-100 overflow-hidden">
          {faqs.map((f, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                      {f.category}
                    </span>
                    <span className="font-['Manrope'] font-bold text-sm sm:text-base text-neutral-900">
                      {f.q}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180 text-black' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 font-['Inter'] leading-relaxed bg-neutral-50/50">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e3e1] text-center space-y-3">
          <p className="font-['Manrope'] font-bold text-base text-black">Still have questions?</p>
          <p className="text-xs text-neutral-500">Our customer care team is available on WhatsApp and Phone.</p>
          <a
            href={businessConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp ({businessConfig.phone})</span>
          </a>
        </div>

      </div>
    </div>
  );
}
