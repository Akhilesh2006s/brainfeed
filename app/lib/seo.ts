// Get base URL - use environment variable or fallback
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use NEXT_PUBLIC_BASE_URL or current origin
    return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  }
  // Server-side: use BASE_URL, NEXT_PUBLIC_BASE_URL, or default to Railway URL
  return process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://brainfeed-production.up.railway.app';
}

// Helper to build full URL from path
export function buildUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Remove leading slash if path starts with one to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function setSEO(title: string, description: string, image?: string, url?: string) {
  // Set page title
  document.title = `${title} | Brainfeed Magazine`;
  
  // Remove existing meta tags to avoid duplicates
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', description);

  // Use provided URL or construct from baseUrl and current path
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : getBaseUrl());

  // Open Graph tags
  const tags = [
    { property: 'og:title', content: `${title} | Brainfeed Magazine` },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: fullUrl },
    { property: 'og:image', content: image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200' },
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:title', content: `${title} | Brainfeed Magazine` },
    { property: 'twitter:description', content: description },
    { property: 'twitter:image', content: image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200' },
  ];

  tags.forEach(({ property, content }) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });
}

export function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function setStructuredData(data: any) {
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}
