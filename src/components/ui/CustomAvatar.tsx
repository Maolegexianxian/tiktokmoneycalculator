'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { generateAvatarDataURL, getInitials, getColorFromName } from '@/lib/avatar-generator';

export interface CustomAvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
  alt?: string;
  showFallback?: boolean;
}

/**
 * Custom Avatar Component
 * 
 * Displays user avatars with automatic fallback to generated SVG avatars
 * when the image source is not available.
 */
export function CustomAvatar({
  name,
  src,
  size = 40,
  className,
  alt,
  showFallback = true
}: CustomAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const initials = getInitials(name);
  const shouldShowFallback = !src || imageError || !showFallback;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100',
        className
      )}
      style={{ width: size, height: size }}
    >
      {shouldShowFallback ? (
        // Fallback: Generated Avatar
        <div
          className="flex h-full w-full items-center justify-center rounded-full text-white font-semibold"
          style={{
            backgroundColor: getColorFromName(name),
            fontSize: size * 0.4
          }}
        >
          {initials}
        </div>
      ) : (
        // Primary: User uploaded image
        <>
          {imageLoading && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-200 animate-pulse"
            >
              <div
                className="text-gray-400 font-semibold"
                style={{ fontSize: size * 0.3 }}
              >
                {initials}
              </div>
            </div>
          )}
          <Image
            src={src}
            alt={alt || `${name}'s avatar`}
            width={size}
            height={size}
            className={cn(
              'rounded-full object-cover transition-opacity duration-200',
              imageLoading ? 'opacity-0' : 'opacity-100'
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
            priority={size > 100}
          />
        </>
      )}
    </div>
  );
}

/**
 * Avatar Group Component
 */
export interface AvatarGroupProps {
  avatars: Array<{
    name: string;
    src?: string;
    alt?: string;
  }>;
  size?: number;
  max?: number;
  className?: string;
}

export function AvatarGroup({
  avatars,
  size = 32,
  max = 4,
  className
}: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayAvatars.map((avatar, index) => (
        <CustomAvatar
          key={`${avatar.name}-${index}`}
          name={avatar.name}
          src={avatar.src}
          alt={avatar.alt}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className="flex items-center justify-center rounded-full bg-gray-100 ring-2 ring-white text-xs font-medium text-gray-600"
          style={{ width: size, height: size }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

export default CustomAvatar;
