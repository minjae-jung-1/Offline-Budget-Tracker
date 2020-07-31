const cacheName = 'static-cache-v2';
const dataCacheName = 'data-cache-v2';

self.addEventListener("install", (event) =>{
    console.log("service work installed")
    event.waitUntil(
        caches.open(cacheName).then((cache) =>{
            cache.addAll([
            "/db.js",
            "/index.js",
            "/styles.css",
            "/icons/icon-192x192.png",
            "/icons/icon-512x512.png"])
        })
    )
})

self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((keyList) => {
        console.log(keyList)
        return Promise.all(
            keyList.map((key) => {
            if (key !== cacheName && key !== dataCacheName) {
              console.log("delete cahhe", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
  
    self.clients.claim();
  });

self.addEventListener('fetch', (event) =>{
        event.respondWith(
            caches.open(dataCacheName).then((cache) =>{
                return fetch(event.request)
                    .then((res) => {
                        if(res.status === 200) {
                            cache.put(event.request.url, res.clone());
                        }
                        return res;
                    })
                    .catch((error) => {
                        console.log(error)
                        return cache.match(event.request);
                    });
            })
        );
});