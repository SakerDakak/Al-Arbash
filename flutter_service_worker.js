'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "60f79c9063f5618e0c647cabdd7ae79d",
"splash/img/light-2x.png": "7a41618b81e9593e7aabe6b0b7f1cbe9",
"splash/img/dark-4x.png": "40a133f0750838bf2abcb177d92d3e3c",
"splash/img/light-3x.png": "ca13e8b2190fa8a017372b075f51b63a",
"splash/img/dark-3x.png": "ca13e8b2190fa8a017372b075f51b63a",
"splash/img/light-4x.png": "40a133f0750838bf2abcb177d92d3e3c",
"splash/img/dark-2x.png": "7a41618b81e9593e7aabe6b0b7f1cbe9",
"splash/img/dark-1x.png": "2920d5a172d453f870a5c543d60dfa61",
"splash/img/light-1x.png": "2920d5a172d453f870a5c543d60dfa61",
"splash/splash.js": "123c400b58bea74c1305ca3ac966748d",
"splash/style.css": "8bd6ba0beca27debce08508a6c732e26",
"index.html": "3ebcefe696c51fa649d6ed1a6ac85635",
"/": "3ebcefe696c51fa649d6ed1a6ac85635",
"main.dart.js": "a49591f169874f36fef5c627883f61c5",
"jsQR.js": "06c4d5a0dd8975a781f089e8b308e5b8",
"flutter.js": "a85fcf6324d3c4d3ae3be1ae4931e9c5",
"favicon.png": "6d3389ced56f9368a7c7cc5e39e81780",
"icons/Icon-192.png": "bc2c647eea3f66a0f46b3dc0f54a6860",
"icons/Icon-maskable-192.png": "bc2c647eea3f66a0f46b3dc0f54a6860",
"icons/Icon-maskable-512.png": "84727a238d15bf4461ba930bd0deee78",
"icons/Icon-512.png": "84727a238d15bf4461ba930bd0deee78",
"manifest.json": "fd0dc4ac4e6e8fdb3a46156297faab80",
"assets/AssetManifest.json": "60007e50851a24bf3a7c2e11c29dc8b6",
"assets/NOTICES": "3845fdf4a2397f9cdce8165b659fd795",
"assets/FontManifest.json": "5824e0a303ac17d41ce1a02c8d8536e4",
"assets/packages/multi_image_picker_view/assets/close-48.png": "477613265893447bc3d72ec5797ed926",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/iconsax/lib/assets/fonts/iconsax.ttf": "071d77779414a409552e0584dcbfd03d",
"assets/packages/flutter_tesseract_ocr/images/test_16.jpg": "35314971c77f915dd1bf0b9579a84960",
"assets/packages/flutter_tesseract_ocr/images/test_11.jpg": "0d635defc90b9fa1df0ba9def0eeb9cb",
"assets/packages/flutter_tesseract_ocr/images/test_1.jpg": "0a2be1304ca3660cbd959ab65d45f98f",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/splash/splash.png": "3cee6a078b7c0eb2d4234daccce453e2",
"assets/assets/images/product.png": "5afa713913e901db250f001041a650f5",
"assets/assets/images/empty.png": "e0bc5cc092e97f131cb73a9be4f6e6f8",
"assets/assets/images/logo.png": "3cee6a078b7c0eb2d4234daccce453e2",
"assets/assets/images/qr.png": "f49a1dc8bb030682500c481f56aea038",
"assets/assets/images/text.png": "1314f872be5d3b9ee70b5ad38df3a1a3",
"assets/assets/fonts/Alexandria-Thin.ttf": "235a76bc4da6f28b11f7150b99b7128b",
"assets/assets/fonts/Alexandria-ExtraLight.ttf": "3a85367961735121615187607f55a0e6",
"assets/assets/fonts/Alexandria-SemiBold.ttf": "8d52b83d1601500fd84b074b201cf0b2",
"assets/assets/fonts/Alexandria-Medium.ttf": "dd32bed638cb46dc628fd2f6c5c61160",
"assets/assets/fonts/Alexandria-Bold.ttf": "1bf93b97df59b33d2371ca545e897887",
"assets/assets/fonts/Alexandria-Light.ttf": "c9400c6b4e722fb70e4c7d32524eaf9c",
"assets/assets/fonts/Alexandria-Regular.ttf": "ed3925cb571103cafb8101b83dab1b5b",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
