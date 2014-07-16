// public/js/app.js

angular.module('teamRoom', [
	'ngRoute',
	'ngSanitize',
	'teamRoom.controllers', 
	'teamRoom.services'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	
	$routeProvider

		.when('/', {
			templateUrl: 'views/home.html'
		})

		//show all team docs
		.when('/teamdocs', {
			templateUrl: (bootcards.isXS() ? 'views/teamdocs_single.html' : 'views/teamdocs.html'),
			controller: 'TeamDocsCtrl'
		})

		//specific team doc
		.when('/teamdocs/:docId', {
			templateUrl: 'views/teamdocs.html', 
			controller : 'TeamDocsCtrl'
		})

		//team doc in edit mode
		.when('/teamdocs/:docId/edit', {
			templateUrl: 'views/teamdocs.html', 
			controller : 'TeamDocsCtrl'
		})

		//new team doc
		.when('/teamdocs/new', {
			templateUrl: 'views/teamdocs.html', 
			controller : 'TeamDocsCtrl'
		})

		//show all personal docs
		.when('/personaldocs', {
			templateUrl: 'views/personaldocs.html',
			controller: 'PersonalDocsCtrl'	
		});

	//$locationProvider.html5Mode(true);

}]);
