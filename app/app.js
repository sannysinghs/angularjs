//app.js
var app = angular.module('flickgular', ['ngRoute']);
var photos = [];
var api = {
	url : "https://api.flickr.com/services/rest",
	methods : {
		search :  "flickr.photos.search",
		info : "flickr.photos.getInfo"
	},
	key : "77a30ff3e5b6d3ac7075a11ad8c35cdc",
	secret : "2ad7071bcfd6b406",
	format : "json&nojsoncallback=1"
};

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/photos', {
		templateUrl: 'views/photos.html',
		controller: 'PhotosCtrl'
	})
	.when('/photo/:photoId', {
		templateUrl: 'views/detail.html',
		controller: 'PhotoDetailCtrl'
	})
	.otherwise({ redirectTo: '/photos' })

}]);
app.controller('PhotosCtrl', ['$scope','$log','$http', function ($scope,$log,$http) {
		
		$scope.photos = photos || [];
		
		$scope.search = function(text){
			$http.get(api.url+'/?method='+api.methods.search+'&api_key='+api.key+'&text='+text+'&format='+api.format)
			.success(function(data){
				$scope.error = false;
				if (data.stat === "fail") {
					$log.info(data);
					$scope.error = true;
					$scope.error_msg = data.message;
				}else{
					$scope.error = false;
					photos = data.photos.photo;
					$scope.photos = photos;

				}
				
			})
			.error(function(data){
				$log.error(data);
			});
		}

		$scope.resetError = function(){
			$scope.error = false;
		};
}]);

app.controller('PhotoDetailCtrl', ['$scope','$log','$routeParams','$http', function ($scope,$log,$routeParams,$http) {
	  
	  $scope.id = $routeParams.photoId;
	  $http.get(api.url+'/?method='+api.methods.info+'&api_key='+api.key+'&photo_id='+$scope.id+'&format='+api.format)
	  .success(function(data){
	  	$log.info(data);
	  	var info = data.photo;
	  	$scope.photo = {
	  		"title" : info.title._content,
	  		"date" : info.dateuploaded,
	  		"owner" : info.owner.username,
	  		"farm" : info.farm,
	  		"secret" : info.secret,
	  		"server" : info.server,
	  		"comments" : [ ]
	  	};
	  })
	  .error(function(data){
			$log.error(data);
	  });

	  $scope.comment = {};

	  $scope.addComment = function(comment){
	  	$scope.photo.comments.push(comment);
	  	$scope.comment = {};
	  	$log.debug($scope.photo.comments);
	  }

}]);