angular.module('myApp').service('pageService', function() {
	this.page = '';

	this.setCurrentPage = function(page) {
		this.page = page;
	};

	this.getCurrentPage = function() {
		return this.page;
	};
});