/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Import Workbox from the correct CDN URL instead of a local file
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Ensure Workbox is loaded
if (workbox) {
  console.log('Workbox is loaded.');

  // Skip waiting and claim clients immediately
  self.skipWaiting();
  workbox.core.clientsClaim();

  // Precache files
  workbox.precaching.precacheAndRoute([
    { url: 'index.html', revision: null }, // Cache index.html
    { url: 'registerSW.js', revision: null }, // Cache the service worker registration script
    // Add other assets you want to precache
  ]);

  // Cache navigation requests (SPA routing)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'navigation-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
        }),
      ],
    })
  );

  // Cache static assets (e.g., JS, CSS, images)
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'image',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-assets-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // Cleanup outdated caches
  workbox.precaching.cleanupOutdatedCaches();
} else {
  console.error('Workbox failed to load.');
}
