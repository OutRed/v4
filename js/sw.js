var cacheName = "orchache";
var cacheAssets = ["/"];

// Call install Event
self.addEventListener("install", (e) => {
  // Wait until promise is finished
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log(`Service Worker: Caching Files: ${cache}`);
      cache
        .addAll(cacheAssets)
        // When everything is set
        .then(() => self.skipWaiting());
    })
  );
});

// Call Fetch Event
self.addEventListener("fetch", (e) => {
  console.log("Service Worker: Fetching");
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // The response is a stream and in order the browser
        // to consume the response and in the same time the
        // cache consuming the response it needs to be
        // cloned in order to have two streams.
        const resClone = res.clone();
        // Open cache
        caches.open(cacheName).then((cache) => {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch((err) => caches.match(e.request).then((res) => res))
  );
});
