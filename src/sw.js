var cacheName = 'publictransportationcache';

self.addEventListener('install', function(event) {
	var urlsToCacheDev = [
		'/',
		'/bower_components/jquery/dist/jquery.js',
		'/bower_components/angular/angular.js',
		'/bower_components/ng-focus-if/focusIf.js',
		'/bower_components/angular-ui/build/angular-ui.js',
		'/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
		'/app/main.js',
		'/app/controllers/main.js',
		'/app/directives/ngEnter.js',
		'/app/directives/_template.js',
		'/app/directives/searchForm.js',
		'/app/directives/transportationtable.js',
		'/app/services/page.js',
		'/app/idb.js',
		'/app/vendors.css',
		'/css/font-awesome.css',
		'/css/font-awesome.min.css',
		'/app/style.css',
		'/app/templates/searchform.html',
		'/app/templates/transportationtable.html',
		'/sw.js'
	];
	var urlsToCacheProd = [
		'/',
		'/css/vendors.css',
		'/css/font-awesome.css',
		'/css/font-awesome.min.css',
		'/css/style.css',
		'/app/templates/searchform.html',
		'/app/templates/transportationtable.html',
		'/js/all.js',
		'/js/angular-ui.js',
		'/js/angular.js',
		'/js/focusIf.js',
		'/js/jquery.js',
		'/js/ui-bootstrap-tpls.js',
		'/sw.js'
	];

	event.waitUntil(
		caches.open(cacheName).then(function(cache) {
			cache.addAll(urlsToCacheDev);
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
