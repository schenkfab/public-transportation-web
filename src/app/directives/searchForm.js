angular.module('myApp').directive('searchform', function() {
	return {
		templateUrl: 'app/templates/searchform.html', // Where is the html code for the directive?
		//controller: 'mainCtrl', // What controller should be applied to the directive?
		replace: true // Do you wan't to display the directive tag?
	};
});