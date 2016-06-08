/**
 * Created by Artiom on 06/04/2016.
 */
myApp.factory('sucursalesFactory', ['$http', 'connectionService', function($http, connectionService){

	return {
		guardarSucursal: function(nueva, sucursal, callback){
			var inserturl;
			if (nueva){
				inserturl = connectionService.serverUrl + '/sucursales/nueva';
				$http.post(inserturl, sucursal).then(function(response){
					console.log(response);
					callback(response);
				}, function(response){
					console.log(response);
					callback(response);
				})
			} else {
				inserturl = connectionService.serverUrl + '/sucursales/guardar/' + sucursal._id;
				$http.put(inserturl, sucursal).then(function(response){
					console.log(response);
					callback(response);
				}, function(response){
					console.log(response);
					callback(response);
				})
			}
		},
		obtenerSucursales: function(param, callback){
			var inserturl = connectionService.serverUrl + '/sucursales/';
			$http.get(inserturl, {params: param }).then(function(response){
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