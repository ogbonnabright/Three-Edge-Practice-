import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeoForLocation, SITE_NAME } from '../src/seo/seoConfig';

function upsertMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertStructuredData(data: Record<string, unknown> | null) {
  const existing = document.getElementById('tep-structured-data');
  if (!data) {
    if (existing) existing.remove();
    return;
  }

  let script = existing as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'tep-structured-data';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

const SeoManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const seo = getSeoForLocation(location.pathname, location.search);

    document.title = seo.title;
    upsertMetaTag('name', 'description', seo.description);
    upsertMetaTag('name', 'robots', seo.robots);
    upsertCanonicalLink(seo.canonical);

    upsertMetaTag('property', 'og:type', seo.ogType);
    upsertMetaTag('property', 'og:site_name', SITE_NAME);
    upsertMetaTag('property', 'og:locale', 'en_NG');
    upsertMetaTag('property', 'og:title', seo.title);
    upsertMetaTag('property', 'og:description', seo.description);
    upsertMetaTag('property', 'og:url', seo.canonical);
    upsertMetaTag('property', 'og:image', seo.ogImage);
    upsertMetaTag('property', 'og:image:alt', seo.ogImageAlt);

    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', seo.title);
    upsertMetaTag('name', 'twitter:description', seo.description);
    upsertMetaTag('name', 'twitter:image', seo.ogImage);
    upsertMetaTag('name', 'twitter:image:alt', seo.ogImageAlt);

    upsertStructuredData(seo.structuredData);
  }, [location.pathname, location.search]);

  return null;
};

export default SeoManager;
