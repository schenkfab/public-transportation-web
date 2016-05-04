var cacheName = 'publictransportationcache';

self.addEventListener('install', function(event) {
	var urlsToCache = [
		'/',
		'/bower_components/jquery/dist/jquery.js',
		'/bower_components/angular/angular.js',
		'/bower_components/angular-ui/build/angular-ui.js',
		'/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
		'/app/main.js',
		'/app/controllers/main.js',
		'/app/directives/ngEnter.js',
		'/app/directives/_template.js',
		'/app/directives/searchForm.js',
		'/app/directives/transportationtable.js',
		'/app/services/page.js'
	];

	event.waitUntil(
		caches.open(cacheName).then(function(cache) {
			cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(names) {
			return Promise.all(
				names.filter(function(name) {
					return name.startsWith('myAppCache') && name != cacheName;
				}).map(function(name) {
					return cache.delete(name);
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
		.then(function(response) {
			if (response) {
				return response;
			} else {
				return fetch(event.request.url).then(function(response) {
					return response;
				});
			}
		})
	);
});
