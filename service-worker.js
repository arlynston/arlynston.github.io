var CACHE_NAME = 'my-site-cache-v1';
var CACHE_DYNAMIC_NAME = 'my-site-cache-v2';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_DYNAMIC_NAME)
      .then(function(cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/',
          '/offline.html',
          '/index.html',
          '/favorite.html',
          '/bootstrap.min.css',
          '/font-awesome.min.css',
          '/css/style.css',
          'https://code.jquery.com/jquery-3.4.1.min.js',
          'https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css',
          'https://code.jquery.com/jquery-1.11.3.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',
          'https://fonts.googleapis.com/css?family=Permanent+Marker&display=swap',
          '/manifest.json',
          '/js/index.js',
        ]);
      })
  )
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil( 
    caches.keys()
      .then((keyList) => { 
       return Promise.all(keyList.map((key) => { 
        if (key !== CACHE_NAME && key !== CACHE_DYNAMIC_NAME) { 
          console.log('[ServiceWorker] Removing old cache', key); 
          return caches.delete(key); 
        } 
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function(err) {
              return caches.open(CACHE_NAME)
                .then(function(cache) {
                  return cache.match('/offline.html');
                });
            });
        }
      })
  );
});

// self.addEventListener('fetch', function(evt) {
// 	if (evt.request.mode !== 'navigate') { 
// 		return; 
// 	}
// 	evt.respondWith( 
// 		fetch(evt.request) 
// 		.catch(() => { 
// 			return caches.open(CACHE_NAME) 
// 			.then((cache) => { 
// 				return cache.match('/~m26416122/mobweb/offline.html'); 
// 			}); 
// 		}) 
// 		); 

// });


// self.addEventListener('install', (evt) => {
// 	evt.waitUntil( 
// 		caches.open(CACHE_NAME).then((cache) => { 
// 			console.log('[ServiceWorker] Pre-caching offline page'); 
// 			return cache.addAll(FILES_TO_CACHE);
// 		}) 
// 		);
// 	self.skipWaiting();
// });

// self.addEventListener('install', function(event) {
//   console.log('[Service Worker] Installing Service Worker ...', event);
//   event.waitUntil(
//     caches.open(CACHE_DYNAMIC_NAME)
//       .then(function(cache) {
//         console.log('[Service Worker] Precaching App Shell');
//         cache.addAll([
//           '/',
//           '/resep.html',
//           '/home.html',
//           '/sign-up.php',
//           '/sign-in.php',
//           '/app.js',
//           '/login.html',
//           'https://code.jquery.com/jquery-3.4.1.min.js',
//           'https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css',
//           'https://code.jquery.com/jquery-1.11.3.min.js',
//           'css/app.css'
//         ]);
//       })
//   )
// });
