import { DateTime } from 'luxon';

const CACHE_NAME = 'vedic-calendar-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/js/main.js',
  '/static/css/main.css'
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Cache calculated panchang data
const panchangCache = new Map();

self.addEventListener('message', (event: any) => {
  if (event.data.type === 'CACHE_PANCHANG') {
    const { date, location, data } = event.data;
    const key = `${date}_${location.name}`;
    panchangCache.set(key, {
      data,
      timestamp: DateTime.now().toMillis()
    });
  }
});

// Clear old cache entries (older than 24 hours)
setInterval(() => {
  const now = DateTime.now().toMillis();
  for (const [key, value] of panchangCache.entries()) {
    if (now - value.timestamp > 24 * 60 * 60 * 1000) {
      panchangCache.delete(key);
    }
  }
}, 60 * 60 * 1000); // Check every hour
