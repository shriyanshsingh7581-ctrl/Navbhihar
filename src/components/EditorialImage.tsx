import React, { useState } from 'react';
import { EDITORIAL_IMAGES, NBI_LOGO_URL } from '../assets/editorialVisuals';

interface EditorialImageProps {
  src: string;
  alt: string;
  category?: string;
  className?: string;
  priority?: boolean;
}

export function EditorialImage({
  src,
  alt,
  category = 'bihar',
  className = 'w-full h-full object-cover',
  priority = false,
}: EditorialImageProps) {
  const [failed, setFailed] = useState(false);

  const getFallbackByCategory = (cat: string): string => {
    switch (cat.toLowerCase()) {
      case 'politics':
        return EDITORIAL_IMAGES.biharPolitics;
      case 'education':
        return EDITORIAL_IMAGES.bpscEducation;
      case 'employment':
        return EDITORIAL_IMAGES.rozgarJobs;
      case 'crime':
        return EDITORIAL_IMAGES.crimeAlert;
      case 'india':
        return EDITORIAL_IMAGES.nationalIndia;
      case 'sports':
        return EDITORIAL_IMAGES.sportsCricket;
      case 'technology':
        return EDITORIAL_IMAGES.techDigital;
      case 'business':
        return EDITORIAL_IMAGES.businessEconomy;
      case 'entertainment':
        return EDITORIAL_IMAGES.entertainmentCinema;
      case 'viral':
        return EDITORIAL_IMAGES.viralSocial;
      default:
        return EDITORIAL_IMAGES.patnaMetro;
    }
  };

  const resolvedSrc = !src || failed ? getFallbackByCategory(category) : src;

  return (
    <img
      src={resolvedSrc}
      alt={alt || 'NaviBihar India (NBI News)'}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      onError={() => {
        if (!failed) setFailed(true);
      }}
      className={className}
    />
  );
}

export function BrandLogo({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const dimensions =
    size === 'sm'
      ? 'w-9 h-9'
      : size === 'lg'
        ? 'w-14 h-14'
        : 'w-11 h-11';

  return (
    <img
      src={NBI_LOGO_URL}
      alt="NaviBihar India (NBI News) Official Logo"
      referrerPolicy="no-referrer"
      className={`${dimensions} rounded-full object-contain shrink-0 bg-white shadow-xs ${className}`}
    />
  );
}
