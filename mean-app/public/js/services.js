'use strict';

/* Services */

angular.module('teamRoom.services', [])

	.factory('MetadataService', ['$http', function($http) {

		return {

			// call to get all items
			get : function() {
				return $http.get('/api/metadata');
			}

		};

	}]) 
	
	.factory('TeamItemsService', ['$http', function($http) {

		return {

			// call to get all items
			get : function() {
				return $http.get('/api/items');
			},

			// call to POST and create a new geek
			create : function(itemData) {
				return $http.post('/api/items', itemData);
			},

			// call to DELETE an item
			delete : function(id) {
				return $http.delete('/api/items/' + id);
			},

			update : function(id, itemData) {
				return $http.put('/api/items/' + id, itemData);
			}
		};
		
	}])

	.factory('ItemFilesService', ['$http', function($http) {

		return {

			get : function(itemId) {
				return $http.get('/api/items/' + itemId + '/files');
			}

		};

	}]);
