import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';

export default function CategoryCard({ category }) {
  const { name, slug, description, image, itemCount } = category;
  const targetCategory = slug || name;

  return (
    <Link
      to={`/products?category=${encodeURIComponent(targetCategory)}`}
      className="group flex flex-col bg-white rounded-xl p-3 sm:p-5 border border-[#e2e3e1] shadow-2xs hover:shadow-lg hover:border-neutral-400 transition-all duration-350 ease-out transform hover:-translate-y-1 h-full min-w-0"
    >
      {/* Category Image with Smooth Zoom */}
      <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-neutral-100 mb-2.5 sm:mb-4">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class=\"w-full h-full flex items-center justify-center\"><svg class=\"w-10 h-10 text-neutral-300\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polygon points=\"12 2 2 7 12 12 22 7 12 2\"/><polyline points=\"2 17 12 22 22 17\"/><polyline points=\"2 12 12 17 22 12\"/></svg></div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Layers className="w-10 h-10 text-neutral-300" aria-label="No category image" />
          </div>
        )}
        {itemCount && (
          <span className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-medium font-['Inter'] px-1.5 py-0.5 rounded-full transition-transform group-hover:scale-105">
            {itemCount}
          </span>
        )}
      </div>

      {/* Category Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-['Manrope'] font-bold text-xs sm:text-base text-neutral-900 group-hover:text-black transition-colors leading-snug line-clamp-2">
            {name}
          </h3>
          <p className="font-['Inter'] text-[10px] sm:text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed hidden xs:block">
            {description}
          </p>
        </div>

        {/* Explore Button with animated arrow */}
        <div className="pt-2 sm:pt-4 mt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-black group-hover:text-amber-700 transition-colors">
          <span className="font-['Inter'] truncate">Explore</span>
          <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-neutral-100 group-hover:bg-amber-100 flex items-center justify-center transition-all duration-200 group-hover:scale-105 flex-shrink-0">
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
