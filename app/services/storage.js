/**
 * Created by Artiom on 25/04/2016.
 */
myApp.service('storageService', [function(){
	return {
		setKey: function(key, value){
			sessionStorage.setItem(key, value);
		},
		getKey: function(key){
			return sessionStorage.getItem(key);
		},
		setObject: function(key, value){
			sessionStorage.setItem(key, JSON.stringify(value));
		},
		getObject: function(key){
			return JSON.parse(sessionStorage.getItem(key));
		}

	}
}]);