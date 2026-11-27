import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed z-40 flex items-center justify-center rounded-full bg-[#171717] text-[#D4AF37] border border-[#2a2a2a] shadow-lg hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] hover:scale-110 active:scale-95 transition-all duration-300 ease-out cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      } right-4 bottom-5 sm:right-6 sm:bottom-[30px] w-11 h-11 sm:w-12 sm:h-12`}
    >
      <ArrowUp className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2] transition-colors duration-200 group-hover:text-black text-[#D4AF37]" />
    </button>
  );
}
