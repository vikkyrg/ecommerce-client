import React from 'react';

export default function CategorySkeletonCard({ keyIndex = 0 }) {
  // Vary text widths slightly for an organic, natural appearance
  const titleWidths = ['w-3/4', 'w-4/5', 'w-2/3', 'w-5/6', 'w-3/4', 'w-4/5'];
  const titleWidth = titleWidths[keyIndex % titleWidths.length];

  return (
    <div className="flex flex-col items-center text-center w-full animate-pulse">
      {/* Square Image Placeholder matching CategoryCard dimensions */}
      <div className="w-full max-w-[100px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-[170px] aspect-square bg-gradient-to-br from-neutral-200 via-neutral-150 to-neutral-250 rounded-xl sm:rounded-2xl border border-[#dce3ec]/80 p-2 xs:p-2.5 sm:p-3.5 flex items-center justify-center overflow-hidden relative">
        <div className="w-full h-full bg-neutral-200/90 rounded-lg sm:rounded-xl relative overflow-hidden">
          {/* Subtle shimmer sheen */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>

      {/* Category Name Placeholder lines directly underneath */}
      <div className="mt-2 sm:mt-3 flex flex-col items-center w-full max-w-[120px] sm:max-w-[170px] px-1 space-y-1.5">
        <div className={`h-2.5 sm:h-3 ${titleWidth} bg-neutral-200 rounded-md relative overflow-hidden`}>
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
        <div className="h-2 sm:h-2.5 w-1/2 bg-neutral-200/70 rounded-md relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}
