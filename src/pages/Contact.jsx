import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Headphones,
  AlertCircle
} from 'lucide-react';
import businessConfig from '../config/businessConfig';
import { submitEnquiryApi } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await submitEnquiryApi({
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'Website General Contact',
        message: formData.message
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError(err.message || 'Unable to submit your message. Please try WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-8 sm:py-14">
      <div className="site-container">
        
        {/* Header Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full inline-block mb-3">
            Customer Support &amp; Enquiries
          </span>
          <h1 className="font-['Manrope'] font-bold text-3xl sm:text-4xl text-black tracking-tight">
            Contact NS Stone Chemicals
          </h1>
          <p className="font-['Inter'] text-xs sm:text-sm text-neutral-600 mt-2.5 leading-relaxed">
            Have questions about product usage, bulk requirements, or order deliveries? Our stone care specialists are here to assist you.
          </p>
        </div>

        {/* 2-Column Layout: Contact Information & WhatsApp Quick Links vs Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Official Business Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct WhatsApp Callout Card */}
            <div className="bg-gradient-to-br from-[#128C7E] to-[#075E54] rounded-2xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Instant WhatsApp Support
                </div>
                <h3 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-white">
                  Fastest Way to Reach Us
                </h3>
                <p className="font-['Inter'] text-xs sm:text-sm text-white/90 mt-2 leading-relaxed">
                  Chat directly with our chemical specialists for guidance, technical product data sheets, or instant order assistance.
                </p>
                <div className="mt-5">
                  <a
                    href={businessConfig.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-neutral-100 font-['Inter'] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-emerald-700 text-emerald-700" />
                    <span>Open WhatsApp Chat ({businessConfig.phone})</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Official Business Information Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e2e3e1] shadow-2xs space-y-5">
              <h3 className="font-['Manrope'] font-bold text-lg text-black border-b border-neutral-100 pb-3">
                Official Business Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm font-['Inter']">
                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Phone Number
                    </span>
                    <a
                      href={businessConfig.phoneTel}
                      className="font-bold text-black hover:text-amber-700 transition-colors"
                    >
                      {businessConfig.phone}
                    </a>
                    <span className="block text-[11px] text-neutral-500 mt-0.5">
                      Direct voice calls during business hours
                    </span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-[#25D366]">
                    <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      WhatsApp Support
                    </span>
                    <a
                      href={businessConfig.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      {businessConfig.whatsapp}
                    </a>
                    <span className="block text-[11px] text-neutral-500 mt-0.5">
                      Available for quick inquiries &amp; order updates
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-800">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Official Email
                    </span>
                    <a
                      href={businessConfig.emailMailto}
                      className="font-bold text-black hover:text-amber-700 transition-colors break-all"
                    >
                      {businessConfig.email}
                    </a>
                    <span className="block text-[11px] text-neutral-500 mt-0.5">
                      Customer support &amp; inquiries
                    </span>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-800">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Official Website
                    </span>
                    <a
                      href={businessConfig.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-black hover:text-amber-700 transition-colors"
                    >
                      {businessConfig.websiteDisplay}
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-800">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Working Hours
                    </span>
                    <span className="font-semibold text-black">
                      {businessConfig.supportHours}
                    </span>
                    <span className="block text-[11px] text-neutral-500 mt-0.5">
                      Sunday closed for shipping operations
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-800">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Distribution Depot
                    </span>
                    <span className="font-semibold text-black">
                      {businessConfig.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Assurance Badges */}
            <div className="bg-white rounded-xl p-4 border border-[#e2e3e1] flex items-center justify-around text-center text-xs text-neutral-600">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-bold text-black text-[11px]">100% Genuine</span>
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-neutral-700 mb-1" />
                <span className="font-bold text-black text-[11px]">Pan-India Delivery</span>
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div className="flex flex-col items-center">
                <Headphones className="w-5 h-5 text-amber-700 mb-1" />
                <span className="font-bold text-black text-[11px]">Expert Guidance</span>
              </div>
            </div>

          </div>

          {/* Right Column: Responsive Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-9 border border-[#e2e3e1] shadow-2xs">
              <div className="mb-6">
                <h3 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-black tracking-tight">
                  Send Us a Message
                </h3>
                <p className="font-['Inter'] text-xs sm:text-sm text-neutral-500 mt-1">
                  Fill in your details below and our team will get back to you within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-['Manrope'] font-bold text-lg text-emerald-900">
                    Thank You! Message Received.
                  </h4>
                  <p className="font-['Inter'] text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                    We have received your message. One of our stone care representatives will contact you shortly via phone or email.
                  </p>
                  <div className="pt-3">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-black text-[#ffdf9c] px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block font-['Inter'] text-xs font-semibold text-neutral-700 mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full bg-[#f9f9f7] text-neutral-900 text-xs sm:text-sm rounded-lg px-3.5 py-3 border border-neutral-300 focus:outline-none focus:border-black focus:bg-white transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-['Inter'] text-xs font-semibold text-neutral-700 mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rajesh@example.com"
                        className="w-full bg-[#f9f9f7] text-neutral-900 text-xs sm:text-sm rounded-lg px-3.5 py-3 border border-neutral-300 focus:outline-none focus:border-black focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block font-['Inter'] text-xs font-semibold text-neutral-700 mb-1.5">
                        Phone / WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#f9f9f7] text-neutral-900 text-xs sm:text-sm rounded-lg px-3.5 py-3 border border-neutral-300 focus:outline-none focus:border-black focus:bg-white transition-all"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block font-['Inter'] text-xs font-semibold text-neutral-700 mb-1.5">
                        Subject <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. Marble polishing powder query"
                        className="w-full bg-[#f9f9f7] text-neutral-900 text-xs sm:text-sm rounded-lg px-3.5 py-3 border border-neutral-300 focus:outline-none focus:border-black focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-['Inter'] text-xs font-semibold text-neutral-700 mb-1.5">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please specify which product you are inquiring about, area size, or delivery location..."
                      className="w-full bg-[#f9f9f7] text-neutral-900 text-xs sm:text-sm rounded-lg p-3.5 border border-neutral-300 focus:outline-none focus:border-black focus:bg-white transition-all resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-[#ffdf9c] font-['Inter'] font-semibold text-xs sm:text-sm px-8 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>

                  <p className="font-['Inter'] text-[11px] text-neutral-400 pt-2">
                    Prefer direct email? You can also email us directly at{' '}
                    <a href={businessConfig.emailMailto} className="text-black font-semibold underline">
                      {businessConfig.email}
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
