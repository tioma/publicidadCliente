/**
 * Created by Artiom on 09/05/2016.
 */
myApp.factory('catalogoFactory', ['$http', 'connectionService', function($http, connectionService){

	return {
		obtenerProductos: function(param, callback){
			var inserturl = connectionService.serverUrl + '/productos/';
			$http.get(inserturl, {params: param }).then(function(response){
				callback(response);
			}, function(response){
				callback(response);
			})
		},
		guardarProducto: function(dataProducto, callback){
			var inserturl = connectionService.serverUrl + '/productos/nuevo';
			$http.post(inserturl, dataProducto).then(function(response){
				console.log(response);
				callback(response);
			}, function(response){
				console.log(response);
				callback(response);
			})

		}
	}

}])