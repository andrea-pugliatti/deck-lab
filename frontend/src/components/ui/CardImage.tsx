import { ImageOff } from "lucide-react";
import React, { useState } from "react";

import { API_BASE_URL } from "../../config/env";

export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  fallback?: React.ReactNode;
}

function normalizeCardImageUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;

  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  if (trimmed.startsWith("/api/")) return `${baseUrl}${trimmed}`;
  if (trimmed.startsWith("/")) return `${baseUrl}/api${trimmed}`;
  return `${baseUrl}/api/${trimmed}`;
}

/**
 * Reusable CardImage component that normalizes card image URLs,
 * handles image load errors gracefully, and provides a standardized fallback representation.
 */
export const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  (
    {
      src,
      alt,
      fallback,
      className = "size-full object-cover",
      loading,
      decoding = "async",
      onError,
      ...props
    },
    ref,
  ) => {
    const [hasError, setHasError] = useState(false);
    const [prevSrc, setPrevSrc] = useState(src);

    if (prevSrc !== src) {
      setPrevSrc(src);
      setHasError(false);
    }

    const resolvedUrl = normalizeCardImageUrl(src);

    if (!resolvedUrl || hasError) {
      if (fallback !== undefined) {
        return <>{fallback}</>;
      }

      return (
        <div
          data-testid="card-fallback"
          className="bg-dark-surface-elevated/40 border-border-dim/40 @container relative flex size-full flex-col items-center justify-center gap-1 overflow-hidden p-1 text-center select-none"
        >
          <ImageOff className="size-4 shrink-0 text-slate-500 @[100px]:size-6" aria-hidden="true" />
          <span className="text-3xs @[120px]:text-2xs sr-only font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase @[72px]:not-sr-only @[72px]:inline">
            [ No Artwork ]
          </span>
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={resolvedUrl}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        onError={(e) => {
          setHasError(true);
          onError?.(e);
        }}
        {...props}
      />
    );
  },
);

CardImage.displayName = "CardImage";

export default CardImage;
