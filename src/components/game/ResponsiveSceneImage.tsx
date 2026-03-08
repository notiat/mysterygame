'use client';

import Image from 'next/image';
import { useOrientation } from '@/hooks/useOrientation';

interface ResponsiveSceneImageProps {
  src: string;
  portraitSrc?: string;
  landscapeSrc?: string;
  alt: string;
  priority?: boolean;
}

export default function ResponsiveSceneImage({
  src,
  portraitSrc,
  landscapeSrc,
  alt,
  priority = false
}: ResponsiveSceneImageProps) {
  const orientation = useOrientation();
  const resolvedSrc =
    orientation === 'portrait' ? portraitSrc ?? src : landscapeSrc ?? src;
  const sizes =
    orientation === 'portrait'
      ? '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw'
      : '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw';

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      sizes={sizes}
      quality={78}
      loading={priority ? 'eager' : 'lazy'}
      priority={priority}
      className="object-cover grayscale contrast-125"
    />
  );
}
