import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

const SITE_URL = process.env.SITE_URL || 'https://glow-service.studio';

// Public-facing routes; extend as you add pages
const routes = [
  '/',
  '/about',
  '/services',
  '/products',
  '/blog',
  '/customer/login',
  '/customer/register',
  '/customer/dashboard',
  '/customer/orders',
  '/customer/profile',
  '/customer/history',
  '/customer/rewards'
];

async function generate() {
  const stream = new SitemapStream({ hostname: SITE_URL });
  const writeStream = createWriteStream(resolve('public', 'sitemap.xml'));
  stream.pipe(writeStream);

  routes.forEach((url) => {
    stream.write({ url, changefreq: 'weekly', priority: url === '/' ? 1.0 : 0.7 });
  });

  stream.end();
  await streamToPromise(stream);
  console.log('sitemap.xml generated at public/sitemap.xml');
}

generate().catch((err) => {
  console.error('Sitemap generation failed', err);
  process.exit(1);
});
