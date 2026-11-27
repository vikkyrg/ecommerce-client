import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function CategoryCard({ category }) {
  const { name, slug, image } = category;
  const targetCategory = slug || name;

  return (
    <Link
      to={`/products?category=${encodeURIComponent(targetCategory)}`}
      className="group flex flex-col items-center text-center transition-transform duration-200 ease-out hover:-translate-y-0.5 w-full"
    >
      {/* Compact Square Image Container */}
      <div className="w-full max-w-[100px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-[170px] aspect-square bg-[#fbfbfa] rounded-xl sm:rounded-2xl border border-[#dce3ec] p-2 xs:p-2.5 sm:p-3.5 flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:border-[#3b82f6] group-hover:shadow-[0_4px_16px_rgba(59,130,246,0.1)]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-6 h-6 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-300" aria-label="No category image" />
          </div>
        )}
      </div>

      {/* Category Name directly underneath */}
      <span className="mt-1.5 sm:mt-2.5 font-['Manrope'] font-medium text-[10px] xs:text-[11px] sm:text-xs md:text-[13px] text-neutral-800 group-hover:text-black group-hover:font-semibold leading-tight line-clamp-2 max-w-[120px] sm:max-w-[170px] px-0.5">
        {name}
      </span>
    </Link>
  );
}
