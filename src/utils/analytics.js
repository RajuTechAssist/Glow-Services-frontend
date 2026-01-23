// Simple GA4 loader and page view tracker for Vite/React
let initialized = false;

const loadScript = (id) => {
  if (document.getElementById('ga4-gtag')) return;
  const script = document.createElement('script');
  script.id = 'ga4-gtag';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
};

export const initAnalytics = (id) => {
  if (!id || initialized || typeof window === 'undefined') return;
  loadScript(id);
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { send_page_view: false });
  initialized = true;
};

export const trackPageView = (id, path) => {
  if (!id || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
  });
};

export const trackEvent = (id, name, params = {}) => {
  if (!id || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
};
