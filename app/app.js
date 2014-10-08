//app.js
var app = angular.module('flickgular', ['ngRoute']);
var photos = [];
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
app.controller('PhotosCtrl', ['$scope','$http', function ($scope,$http) {
		
		$scope.photos = photos || [];
		
		$scope.search = function(text){
			$http.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3b79da6149f6cd056aae1f2a193df93f&text='+text+'&format=json&nojsoncallback=1')
			.success(function(data){
				photos = data.photos.photo;
				$scope.photos = photos;
			});
		}
}]);

app.controller('PhotoDetailCtrl', ['$scope','$routeParams','$http', function ($scope,$routeParams,$http) {
	  $scope.photo = {};
	  $scope.id = $routeParams.photoId;
	  $http.get('https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=e547239fc7b331f67b0ee0d5894792f3&photo_id='+$scope.id+'&format=json&nojsoncallback=1')
	  .success(function(data){
	  	var photo_info = data.photo;
	  	$scope.photo.title = photo_info.title._content;
	  	$scope.photo.date = photo_info.dates.posted;
	  	$scope.photo.owner = photo_info.owner.username;
	  	console.log(data);
	  });

}])