'use strict';
// Initialize Angular Module myApp
angular.module('myApp', ['ui.bootstrap']);

// Register service worker:
/*if (navigator.serviceWorker) {
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
}*/

// Work with idb.js
var dbPromise = idb.open('myDb', 3, upgradeDb => {
	switch(upgradeDb.oldVersion) {
	case 0:
		var keyValStore = upgradeDb.createObjectStore('keyval');
		keyValStore.put('world', 'hello');
	case 1:
		upgradeDb.createObjectStore('people', {keyPath: 'name'});
	case 2:
		var peopleStore = upgradeDb.transaction.objectStore('people');
		peopleStore.createIndex('age', 'age');
	}
});

dbPromise.then(db => {
	var tx = db.transaction('keyval');
	var keyValStore = tx.objectStore('keyval');
	return keyValStore.get('hello');
}).then(val =>
	{
		console.log(val);
});

dbPromise.then(db => {
	var tx = db.transaction('keyval', 'readwrite');
	var keyValStore = tx.objectStore('keyval');
	return keyValStore.put('another', 'bleh');
});

dbPromise.then(db =>{
	var tx = db.transaction('people', 'readwrite');
	var peopleStore = tx.objectStore('people');
	peopleStore.put({
		name: 'John2',
		age: 15
	});
	peopleStore.put({
		name: 'John3',
		age: 25
	});
	peopleStore.put({
		name: 'John4',
		age: 12
	});
	peopleStore.put({
		name: 'John5',
		age: 25
	});
	return tx.complete;
}).then(val =>{
	console.log(val);
});

dbPromise.then(db =>{
	var tx = db.transaction('people', 'readwrite');
	var peopleStore = tx.objectStore('people');
	var ageIndex = peopleStore.index('age');
	// Only show the onces that are 25
	//return ageIndex.getAll(25);
	// Show index
	//return ageIndex.getAll();
	// Show all by key
	return peopleStore.getAll();
}).then(vals => { console.log(vals); })