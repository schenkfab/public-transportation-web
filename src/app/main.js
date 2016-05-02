// Initialize Angular Module myApp
angular.module('myApp', ['ui.bootstrap']);

// Register service worker:
if (navigator.serviceWorker) {
	navigator.serviceWorker.register('../sw.js').then(function(reg) {
		if (!navigator.serviceWorker.controller) {
			return;
		}
		if (reg.waiting) {
			console.log('new sw ready');
			return;
		}
	}).catch(function() {
		console.log('Registration failed');
	});
}