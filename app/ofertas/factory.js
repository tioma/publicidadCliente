/**
 * Created by Artiom on 11/05/2016.
 */
myApp.factory('ofertasFactory', ['$http', 'connectionService', function($http, connectionService){

	return {
		guardarOferta: function(oferta, callback){
			var insertUrl = connectionService.serverUrl + '/ofertas/nueva';
			$http.post(insertUrl, oferta).then(function(response){
				callback(response);
			}, function(response){
				callback(response)
			})
		},
		buscarOferta: function(param, callback){

		}
	}

}]);