import React from 'react';
import { Star, CheckCircle, ShieldCheck } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';

export default function CustomerReviews() {
  const reviews = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      initials: 'RK',
      rating: 5,
      date: 'May 14, 2026',
      title: 'Excellent Product Quality',
      review: 'Good quality stone polishing materials. The products are useful for professional marble and granite maintenance work.'
    },
    {
      id: 2,
      name: 'Suresh R',
      initials: 'SR',
      rating: 5,
      date: 'May 08, 2026',
      title: 'Reliable Products',
      review: 'Good collection of tile adhesives and stone care products. The ordering experience is simple and convenient.'
    },
    {
      id: 3,
      name: 'Praveen Kumar',
      initials: 'PK',
      rating: 4,
      date: 'Apr 29, 2026',
      title: 'Good Service',
      review: 'Useful construction materials and polishing accessories. Overall, a good shopping experience.'
    },
    {
      id: 4,
      name: 'Arun Kumar',
      initials: 'AK',
      rating: 5,
      date: 'Apr 21, 2026',
      title: 'Quality Materials',
      review: 'Good range of marble and granite cutting accessories. Product selection is convenient.'
    },
    {
      id: 5,
      name: 'Karthik M',
      initials: 'KM',
      rating: 5,
      date: 'Apr 15, 2026',
      title: 'Easy Shopping Experience',
      review: 'The website is easy to navigate and product information is clearly displayed.'
    },
    {
      id: 6,
      name: 'Leo A',
      initials: 'VS',
      rating: 4,
      date: 'Apr 03, 2026',
      title: 'Good Product Collection',
      review: 'A useful collection of stone polishing and construction materials in one place.'
    }
  ];

  const ratingBreakdown = [
    { stars: 5, percent: 84 },
    { stars: 4, percent: 12 },
    { stars: 3, percent: 3 },
    { stars: 2, percent: 1 },
    { stars: 1, percent: 0 }
  ];

  return (
    <section className="py-10 sm:py-16 bg-[#ffffff] border-t border-[#e2e3e1]">
      <div className="site-container">
        
        {/* Section Header */}
        <ScrollReveal direction="up" duration={600} distance={20}>
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="font-['Inter'] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-amber-700 block mb-1">
              Customer Feedback
            </span>
            <h2 className="font-['Manrope'] font-bold text-2xl sm:text-3xl lg:text-4xl text-black tracking-tight">
              What Our Customers Say
            </h2>
            <p className="font-['Inter'] text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
              Trusted by professionals for quality stone care products, reliable materials and dependable service.
            </p>
          </div>
        </ScrollReveal>

        {/* Rating Summary Card */}
        <ScrollReveal direction="up" delay={100} duration={600} distance={20}>
          <div className="bg-[#fbfbfa] rounded-2xl border border-[#e2e3e1] p-5 sm:p-7 max-w-3xl mx-auto mb-8 sm:mb-12 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left: Overall Score */}
              <div className="md:col-span-5 text-center md:text-left md:border-r md:border-[#e2e3e1] md:pr-6">
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="font-['Manrope'] text-4xl sm:text-5xl font-extrabold text-black">
                    4.8
                  </span>
                  <span className="text-xs sm:text-sm text-neutral-500 font-medium">/ 5.0</span>
                </div>

                {/* 5 Gold Stars */}
                <div className="flex items-center justify-center md:justify-start gap-1 mt-2 text-[#D4AF37]">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>

                <p className="text-xs text-neutral-600 font-medium mt-2">
                  Based on <strong>120+ Customer Ratings</strong>
                </p>
              </div>

              {/* Right: Star Distribution Bars */}
              <div className="md:col-span-7 space-y-1.5 text-xs">
                {ratingBreakdown.map(item => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="w-12 text-neutral-600 font-medium flex items-center gap-1 justify-end">
                      <span>{item.stars}</span>
                      <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-neutral-500 font-mono text-[11px]">
                      {item.percent}%
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </ScrollReveal>

        {/* Reviews Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map(item => (
            <div
              key={item.id}
              className="bg-[#ffffff] rounded-2xl border border-[#e2e3e1] p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-[#D4AF37]/60 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Header: Avatar, Name, Verified Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#171717] text-[#ffdf9c] font-['Manrope'] font-bold text-xs flex items-center justify-center flex-shrink-0 border border-neutral-800 shadow-xs">
                      {item.initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-['Manrope'] font-bold text-sm text-black truncate leading-tight">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Sample Review</span>
                  </span>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-2 text-[#D4AF37]">
                  {[1, 2, 3, 4, 5].map(starIndex => (
                    <Star
                      key={starIndex}
                      className={`w-3.5 h-3.5 ${
                        starIndex <= item.rating
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'fill-neutral-200 text-neutral-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-[11px] font-bold text-neutral-800 font-['Inter']">
                    {item.rating}.0
                  </span>
                </div>

                {/* Review Title */}
                <h5 className="font-['Manrope'] font-bold text-sm text-black mb-1.5 leading-snug">
                  {item.title}
                </h5>

                {/* Review Body */}
                <p className="font-['Inter'] text-xs sm:text-[13px] text-neutral-600 leading-relaxed">
                  "{item.review}"
                </p>
              </div>

              {/* Bottom Subtle Trust Note */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Stone Care Customer</span>
                </span>
                <span className="font-medium text-neutral-500">Bangalore, IN</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
