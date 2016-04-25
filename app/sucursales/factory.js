/**
 * Created by Artiom on 06/04/2016.
 */
myApp.factory('sucursalesFactory', ['$http', 'connectionService', function($http, connectionService){

	return {
		guardarSucursal: function(sucursal, callback){
			var inserturl = connectionService.serverUrl + '/sucursales/nueva';
			$http.post(inserturl, sucursal).then(function(response){
				console.log(response);
				callback(response);
			}, function(response){
				console.log(response);
				callback(response);
			})
		},
		obtenerSucursales: function(callback){
			var inserturl = connectionService.serverUrl + '/sucursales/';
			$http.get(inserturl).then(function(response){
				callback(response);
			}, function(response){
				callback(response);
			})
		},
		imagenSucursal: function(idSucursal, callback){
			var inserturl = connectionService.serverUrl + '/sucursales/imagen/' + idSucursal;
			$http.get(inserturl).then(function(response){
				callback(response);
			}, function(response){
				callback(response);
			})
		}
	}
}]);