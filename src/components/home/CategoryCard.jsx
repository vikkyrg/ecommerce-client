import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  const { name, description, image, itemCount } = category;

  return (
    <Link
      to={`/products?category=${encodeURIComponent(name)}`}
      className="group flex flex-col bg-white rounded-xl p-4 sm:p-5 border border-[#e2e3e1] shadow-2xs hover:shadow-lg hover:border-neutral-400 transition-all duration-350 ease-out transform hover:-translate-y-1 h-full"
    >
      {/* Category Image with Smooth Zoom */}
      <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-neutral-100 mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
        {itemCount && (
          <span className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-medium font-['Inter'] px-2 py-0.5 rounded-full transition-transform group-hover:scale-105">
            {itemCount} Products
          </span>
        )}
      </div>

      {/* Category Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-['Manrope'] font-bold text-base sm:text-lg text-neutral-900 group-hover:text-black transition-colors leading-snug line-clamp-1">
            {name}
          </h3>
          <p className="font-['Inter'] text-xs text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Explore Button with animated arrow */}
        <div className="pt-4 mt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-black group-hover:text-amber-700 transition-colors">
          <span className="font-['Inter']">Explore Category</span>
          <div className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-amber-100 flex items-center justify-center transition-all duration-200 group-hover:scale-105">
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
