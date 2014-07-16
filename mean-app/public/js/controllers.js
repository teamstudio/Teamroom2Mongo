'use strict';

angular.module( 'teamRoom.controllers', [])

	.controller('MainCtrl', [ '$scope', 'MetadataService', function($scope, MetadataService) {

		console.log('main');
		$scope.metadata = {};

		MetadataService.get()
			.success( function(metadata) {
				$scope.metadata = metadata; 
			});

	}])

	.controller('NavbarCtrl', function() {

		//reserved for later use

	})

	.controller('DocCtrl', [ '$scope', 'TeamItemsService', function($scope, TeamItemsService) {

		$scope.save = function() {
			
			$scope.setEditMode(false);
			
			var data = {
					title : $scope.selectedDoc.title,
					contents : $scope.selectedDoc.contents
				};

			if ($scope.selectedDoc.isNew) {

				TeamItemsService.create(data)
					.success( $scope.loadRemote );	

				$scope.selectedDoc.isNew = false;

			} else {

				TeamItemsService.update($scope.selectedDoc._id, data);	
			}

		};

		$scope.delete = function() {
				TeamItemsService.delete($scope.selectedDoc._id)
					.success( $scope.loadRemote );
			};


	}])

	.controller('FilesCtrl', [ '$scope', 'ItemFilesService', function($scope, ItemFilesService)  {

		$scope.getFiles = function(doc) {

			return [];
			if (null !== doc) {

				console.log(' calling get files with ' + doc._id);

				ItemFilesService.get(doc._id)
					.success( function(data) {
						console.log('get ot');
						console.log(data);

					} );

				return 'bla';
			}

		};

	} ])

	.controller('TeamDocsCtrl', [ '$scope', '$routeParams', 'TeamItemsService', 
		
		function($scope, $routeParams, TeamItemsService) {

			$scope.editMode = false;
			$scope.selectedDoc = null;

			//select a single document
			$scope.selectDocument = function(doc) {
				$scope.selectedDoc = doc;
			};

			$scope.isDocSelected = function() {
				return $scope.selectedDoc !== null;
			};
			$scope.isSelected = function(doc) {
				return $scope.selectedDoc === doc;
			};

			$scope.setEditMode = function(to) {
				$scope.editMode = to;
			};

			$scope.tagline = 'Team documents';

			$scope.loadRemote = function() {
				TeamItemsService.get()
					.success( function(data) {
						applyRemote(data);
						$scope.selectedDoc = null;
					} );

			};

			$scope.cancel = function() {
				$scope.setEditMode(false);

				if ( $scope.selectedDoc.isNew ) {
					$scope.selectedDoc = null;
				}

			};
			
			var store = $scope;
			store.documents = [];

			$scope.loadRemote();

			function applyRemote(data) {
				store.documents = data;

			}

			$scope.createDocument = function() {
				$scope.setEditMode(true);

				$scope.selectedDoc = {
					isNew : true
				};

				

			};

			$scope.isMeeting = function(doc) {
				return (doc.type=='meeting');
			};
			$scope.isReference = function(doc) {
				return (doc.type=='reference');
			};
			$scope.isDiscussion = function(doc) {
				return (doc.type=='discussion');
			};
			$scope.isAnnouncement = function(doc) {
				return (doc.type=='announcement');
			};

		}

	] )

	.controller('PersonalDocsCtrl', function($scope) {
		$scope.tagline = 'Personal documents';	
		
	})

	.controller('HeadCtrl', function($scope) {

		//determine device specific CSS file
		var ua = navigator.userAgent;
		var isAndroid = (ua.match(/Android/i) !== null);
		var isIos = (ua.match(/iPhone|iPad|iPod/i) !== null);
		
		this.bootcardsDeviceCSS = 'libs/bootcards/dist/css/' +
			( isAndroid ? 'bootcards-android.min.css' : 
				(isIos ? 'bootcards-ios.min.css' : 'bootcards-desktop.min.css') );

	});
