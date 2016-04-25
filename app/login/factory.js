/**
 * Created by Artiom on 25/04/2016.
 */
myApp.factory('loginFactory', ['$http', 'connectionService', 'storageService', function($http, connectionService, storageService){

	return {
		login: function(user, callback){
			var inserturl = connectionService.serverUrl + '/user/login';
			$http.post(inserturl, user).then(function(response){
				console.log('ok');
				if (response.status == 200){
					storageService.setKey('token', response.data);
				}
				callback(response);
			}, function(response){
				console.log('error');
				callback(response);
			})
		}
	}

}]);