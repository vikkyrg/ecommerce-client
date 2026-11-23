import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, CheckCircle2, Award, Sparkles } from 'lucide-react';
import businessConfig from '../config/businessConfig';

export default function About() {
  return (
    <div className="bg-[#f9f9f7] min-h-screen py-10 sm:py-16">
      <div className="site-container max-w-4xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
            Direct Stone Care Chemicals
          </span>
          <h1 className="font-['Manrope'] font-bold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight">
            About {businessConfig.companyName}
          </h1>
          <p className="font-['Inter'] text-xs sm:text-sm text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Supplying direct customers, homeowners, fabricators, and stone artisans with authentic Italian sealers, crystallization powders, adhesives, and diamond polishing tools.
          </p>
        </div>

        {/* Core Values / Story Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#e2e3e1] shadow-2xs space-y-6">
          <h2 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-black">
            Our Mission &amp; Product Authenticity
          </h2>
          <p className="font-['Inter'] text-xs sm:text-sm text-neutral-700 leading-relaxed">
            At <strong>{businessConfig.companyName}</strong>, we bridge the gap between world-class stone chemical manufacturers and customers across India. Natural stone surfaces like Italian marble, Indian granite, and engineered quartz require specialized treatment—from chemical impregnators and color enhancers to diamond abrasive honing pads.
          </p>
          <p className="font-['Inter'] text-xs sm:text-sm text-neutral-700 leading-relaxed">
            We source 100% genuine inventory directly from verified manufacturer distributors including <strong>Tenax, Akemi, Kerakoll, Mapei, Surie Polex, MYK Laticrete, and Dongcheng</strong>. Every order is inspected and safely packed to guarantee original quality upon arrival at your doorstep.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e2e3e1] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-['Manrope'] font-bold text-base text-black">100% Genuine Certified</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We never compromise on chemical purity. Every Tenax sealer, Akemi glue, and Surie powder is 100% original.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2e3e1] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-['Manrope'] font-bold text-base text-black">Pan-India Direct Shipping</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Fast, insured surface transit across residential, commercial, and construction sites nationwide.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2e3e1] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="font-['Manrope'] font-bold text-base text-black">Direct Technical Advice</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Speak directly with chemical specialists for advice on grit progression, epoxy grouting, or surface sealing.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-[#171717] rounded-2xl p-8 sm:p-10 text-white text-center space-y-4 shadow-md">
          <h2 className="font-['Manrope'] font-bold text-2xl text-white">
            Have Questions About Stone Care?
          </h2>
          <p className="font-['Inter'] text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
            Contact us for expert chemical recommendations or direct ordering via WhatsApp and phone.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={businessConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#ffdf9c] text-black font-semibold text-xs sm:text-sm px-6 py-3 rounded-lg hover:bg-amber-400 transition-colors"
            >
              Chat on WhatsApp ({businessConfig.phone})
            </a>
            <Link
              to="/contact"
              className="bg-white/10 text-white font-medium text-xs sm:text-sm px-6 py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
            >
              Contact Page
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
