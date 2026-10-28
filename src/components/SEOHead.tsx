import { useEffect } from 'react';
import { NBI_LOGO_URL } from '../assets/editorialVisuals';
import { NewsArticle } from '../types/news';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  article?: NewsArticle;
  breadcrumbs?: { name: string; path: string }[];
}

export function SEOHead({
  title,
  description,
  canonicalPath = '/',
  ogImage = NBI_LOGO_URL,
  ogType = 'website',
  article,
  breadcrumbs,
}: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = title.includes('NaviBihar India')
      ? title
      : `${title} | NaviBihar India (NBI News)`;
    document.title = fullTitle;

    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://navibiharindia.com';
    const canonicalUrl = `${origin}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', ogImage.startsWith('http') ? ogImage : `${origin}${NBI_LOGO_URL}`);
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // JSON-LD Structured Data
    const schemas: Record<string, unknown>[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'NewsMediaOrganization',
        name: 'NaviBihar India (NBI News)',
        alternateName: 'NBI News',
        url: origin,
        logo: `${origin}${NBI_LOGO_URL}`,
      },
    ];

    if (article) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.description,
        image: [
          article.featuredImage.startsWith('data:')
            ? `${origin}${NBI_LOGO_URL}`
            : article.featuredImage,
        ],
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        author: [
          {
            '@type': 'Person',
            name: article.author,
          },
        ],
        publisher: {
          '@type': 'Organization',
          name: 'NaviBihar India (NBI News)',
          logo: {
            '@type': 'ImageObject',
            url: `${origin}${NBI_LOGO_URL}`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      });
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `${origin}${crumb.path}`,
        })),
      });
    }

    let scriptEl = document.getElementById('nbi-jsonld-schema') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'nbi-jsonld-schema';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemas);
  }, [title, description, canonicalPath, ogImage, ogType, article, breadcrumbs]);

  return null;
}
