const cacheName = 'v1'; //whatever you want

const cacheAssets = [
    './index.html',
    './about.html',
    './css/style.css',
    './js/main.js'
]
// Call Install Event
self.addEventListener('install', e => {
    console.log('Service Worker: Install')

    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('cache files')
                cache.addAll(cacheAssets)
            })
            .then(() => self.skipWaiting())
    )
})

// Call Activate Event
self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated')
    // remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('service worker: clearing old cache')
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
})

// call fetch event
self.addEventListener('fetch', (e) => {
    console.log('service worker: fetching')
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
})