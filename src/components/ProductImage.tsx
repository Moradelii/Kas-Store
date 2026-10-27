import React, { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'portrait' | 'square' | 'video';
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'portrait',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const aspectClass =
    aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : 'aspect-[16/9]';

  return (
    <div className={`relative overflow-hidden bg-[#E8DEC9]/30 ${aspectClass} ${className}`}>
      {!hasError ? (
        <>
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-[#E8DEC9]/40 animate-pulse flex items-center justify-center">
              <span className="text-xs text-[#2E2721]/60 tracking-wider uppercase font-medium">KAS Store</span>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#E8DEC9]/40 p-4 text-center">
          <svg
            className="w-12 h-12 text-[#B88B4A]/70 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2E2721]">{alt}</span>
          <span className="text-[11px] text-[#2E2721]/60 mt-0.5">KAS Store · Mezclilla</span>
        </div>
      )}
    </div>
  );
};
