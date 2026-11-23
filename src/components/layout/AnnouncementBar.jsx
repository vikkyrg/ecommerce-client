import React from 'react';
import { Phone, ShieldCheck, MessageCircle } from 'lucide-react';
import businessConfig from '../../config/businessConfig';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#171717] text-[#eeeeec] text-[10px] sm:text-[11px] font-['Inter'] py-1.5 sm:py-2 border-b border-neutral-800">
      <div className="site-container flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1.5 font-medium text-neutral-200 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ffdf9c] flex-shrink-0" />
            <span className="truncate">Premium Stone Care Products | 100% Genuine</span>
          </span>
          <span className="hidden md:inline text-neutral-600">•</span>
          <span className="hidden md:inline text-[#ffdf9c] font-medium">
            Fast Delivery Across India
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-medium tracking-wide text-neutral-300">
          <a
            href={businessConfig.phoneTel}
            className="inline-flex items-center gap-1 hover:text-[#ffdf9c] transition-colors"
            title={`Call ${businessConfig.companyName}`}
          >
            <Phone className="w-3 h-3 text-[#ffdf9c] flex-shrink-0" />
            <span className="font-semibold">{businessConfig.phone}</span>
          </a>
          <span className="text-neutral-700">|</span>
          <a
            href={businessConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-[#25D366] inline-flex items-center gap-1 transition-colors"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3 h-3 text-[#25D366]" />
            <span className="font-medium">WhatsApp</span>
          </a>
          <span className="text-neutral-700 hidden lg:inline">|</span>
          <span className="text-neutral-400 hidden lg:inline">
            {businessConfig.supportHours}
          </span>
        </div>
      </div>
    </div>
  );
}
