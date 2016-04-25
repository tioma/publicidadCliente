'use strict';

myApp.controller('loginCtrl', ['$scope', 'loginFactory', '$state', 'dialogs', function($scope, loginFactory, $state, dialogs) {

	$scope.user = {
		name: '',
		password: ''
	};

	$scope.login = function(){
		console.log($scope.user);
		loginFactory.login($scope.user, function(response){
			console.log(response);
			if (response.statusText == 'OK'){
				$state.transitionTo('sucursales');
			} else {
				dialogs.error('Error', 'Usuario o contraseña incorrectos', {animation: true, backdrop: false, size: 'sm'});
			}
		})
	}

}]);