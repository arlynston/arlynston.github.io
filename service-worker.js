var CACHE_NAME = 'my-site-cache-v1';

self.addEventListener('fetch', function(evt) {
	if (evt.request.mode != 'navigate') {  
	} 
	evt.respondWith( 
		fetch(evt.request) 
		.catch(() => { 
			return caches.open(CACHE_NAME) 
			.then((cache) => { 
				return cache.match('offline.html'); 
			}); 
		})); 
});

self.addEventListener('activate', (evt) => {
	evt.waitUntil( 
		caches.keys().then((keyList) => { 
			return Promise.all(keyList.map((key) => { 
				if (key != CACHE_NAME) { 
					console.log('[ServiceWorker] Removing old cache', key); 
					return caches.delete(key); 
				} 
			}));
		})); 
});

self.addEventListener('install', (evt) => {
	evt.waitUntil( 
		caches.open(CACHE_NAME).then((cache) => { 
			console.log('[ServiceWorker] Pre-caching offline page'); 
			return cache.addAll(FILES_TO_CACHE);
		}) 
		);
	self.skipWaiting();
}); 

const FILES_TO_CACHE = [ 'offline.html', ]; 




