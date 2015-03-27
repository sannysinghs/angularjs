//app.js
var app = angular.module('flickgular', ['ngRoute','ngSanitize']);

var api = {
	url : "https://api.flickr.com/services/rest",
	methods : {
		search :  "flickr.photos.search",
		info : "flickr.photos.getInfo",
		comments : "flickr.photos.comments.getList"
	},
	key : "77a30ff3e5b6d3ac7075a11ad8c35cdc",
	secret : "2ad7071bcfd6b406",
	format : "json&nojsoncallback=1",
	sort : "interestingness-desc"
};



app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/photos', {
		templateUrl: 'views/photos.html',
		controller: 'PhotosCtrl'
	})
	.when('/photo/:pos', {
		templateUrl: 'views/detail.html',
		controller: 'PhotoDetailCtrl'
	})
	.otherwise({ redirectTo: '/photos' })

}]);

app.controller('FlickgularCtrl', ['$scope', function ($scope) {
	$scope.photos = [];
}]);

app.controller('PhotosCtrl', ['$scope','$log','$http','pagiService', function ($scope,$log,$http,pagiService) {
		
		$scope.pagiSrc = pagiService;

		$scope.search = function(text){
			// var photos = [];
			$http.get(api.url+'/?method='+api.methods.search+'&api_key='+api.key+'&text='+text+'&sort='+api.sort+'&format='+api.format)
			.success(function(data){

				$scope.error = false;
				if (data.stat === "fail") {
					$scope.error = true;
					$scope.error_msg = data.message;
				}else{
					$scope.error = false;
					$scope.photos.length = 0;
					var i = 0;
					angular.forEach(data.photos.photo, function(value,key){
						if (key % 12 === 0 ) {
							$scope.pagiSrc.addPage(i++)
					  		$scope.pagiSrc.setCount(i);
					  	}
						var photo = {
							"key" : key,
							"id" : value.id,
							"title" : value.title,
							"description" : null,
							"date" : null,
							"owner" : null,
							"info" : {
								"farm" : value.farm,
								"secret" : value.secret,
								"server" : value.server
							},
							"isfavorite" : null,
							"views" : null,
							"comment" : {
								"count" : null,
								"comments" : []
							}
						};
						$scope.photos.push(photo);
					});
				}
			})
			.error(function(data){
				$log.error(data);
			});

			pagiSrc.reset();
			
		};

		$scope.resetError = function(){
			$scope.error = false;
		};
		
}]);

app.controller('PhotoDetailCtrl', ['$scope','$log','$routeParams','$http', function ($scope,$log,$routeParams,$http) {

	 
	  var pos = parseInt($routeParams.pos);
	  $scope.photo = $scope.photos[pos];
	  
	  $http.get(api.url+'/?method='+api.methods.info+'&api_key='+api.key+'&photo_id='+$scope.photo.id+'&format='+api.format)
	  .success(function(data){
	  	
	  	var detail = data.photo;
	  	$scope.photo.date = detail.dateuploaded;
	  	$scope.photo.owner = detail.owner.username;
	  	$scope.photo.isfavorite = detail.isfavorite;
	  	$scope.photo.comment.count = detail.comments._content;
	  	$scope.photo.description = detail.description._content;
	  	$scope.photo.views = detail.views;

	  	if ($scope.photo.comment.count > 0) {
	  		$http.get(api.url+"/?method="+api.methods.comments+'&api_key='+api.key+'&photo_id='+$scope.photo.id+'&format='+api.format).success(function (data) {
	  			$scope.photo.comment.comments.length = 0;
	  			angular.forEach(data.comments.comment, function(value,key){
	  				$scope.photo.comment.comments.push(value);
	  			});

	  		});
	  	};
	  	$scope.photos[pos] = $scope.photo;
		  	
	  })
	  .error(function(data){
			$log.error(data);
	  });

	  $scope.comment = {};


	  $scope.addComment = function(comment){
	  	$scope.photo.comments.push(comment);
	  	$scope.comment = {};
	  	$log.debug($scope.photo.comments);
	  };

	  $scope.toggleFav = function(){
	  	$scope.photo.isfavourite = !$scope.photo.isfavourite;
	  };

}]);

app.filter('pagination',function($log){

	return function(input,start,size){
		if (input) {
			var start = start * size;
			return input.slice(start,start + size);
		}
	};

});

app.factory('pagiService', [function () {
	var pages = []
	var size = 12;
	var start = 0 ;
	var count = 0;
	return {
		getPages : function(){
			return pages;
		},
		getSize : function () {
			return size;
		},
		setSize : function(data) {
			size = data;
		},
		getStart : function () {
			return start;
		},
		setStart : function(data) {
			start = data;
		},
		getCount : function () {
			return count;
		},
		setCount : function(data) {
			count = data;
		},
		nextPage : function(){
			if (start < count ) {
				start = start + 1;	
			};
		},
		prevPage : function(){
			if (start > 0 ) {
				start = start - 1;	
			};
		},
		setPage : function(data){
	    	this.setStart(data);
	    },
	    isActivePage : function(data){
			return start === data;
		},
		addPage : function(data){
			pages.push(data);
		},
		reset : function(){
			this.setStart(0);
		}
	};
}])