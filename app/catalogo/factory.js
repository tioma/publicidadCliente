/**
 * Created by Artiom on 09/05/2016.
 */
myApp.factory('catalogoFactory', ['$http', 'connectionService', function($http, connectionService){

	return {
		obtenerProductos: function(callback){

		},
		guardarProducto: function(dataProducto, callback){
			var inserturl = connectionService.serverUrl + '/productos/nuevo';
			$http.post(inserturl, sucursal).then(function(response){
				console.log(response);
				callback(response);
			}, function(response){
				console.log(response);
				callback(response);
			})

		}
	}

}])