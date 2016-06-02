'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('pruebaApp', [
	'ui.router',
	'myApp.version',
	'ui.bootstrap',
	'ui.bootstrap.datetimepicker',
	'uiGmapgoogle-maps',
	'ngSanitize',
	'angularFileUpload',
	'dialogs.main',
	'ngTagsInput'
]).
config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	$urlRouterProvider.otherwise('/login');

	$stateProvider.state('login', {
		url: '/login',
		templateUrl: 'login/login.html',
		controller: 'loginCtrl'
	}).state('sucursales', {
		url: '/sucursales',
		templateUrl: "sucursales/sucursales.html",
		controller: "sucursalesCtrl"
	}).state('sucursales.nueva', {
		url: '/nueva',
		templateUrl: 'sucursales/sucursales.new.html'
	}).state('catalogo', {
		url: '/catalogo',
		templateUrl: 'catalogo/catalogo.html',
		controller: 'catalogoCtrl'
	}).state('ofertas', {
		url: '/ofertas',
		templateUrl: 'ofertas/ofertas.html',
		controller: 'ofertasCtrl'
	})

}]);

myApp.constant('uiDatetimePickerConfig', {
	dateFormat: 'dd/MM/yyyy HH:mm',
	defaultTime: '00:00:00',
	html5Types: {
		date: 'dd/MM/yyyy',
		'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
		'month': 'yyyy-MM'
	},
	initialPicker: 'date',
	reOpenDefault: false,
	enableDate: true,
	enableTime: true,
	buttonBar: {
		show: true,
		now: {
			show: true,
			text: 'Ahora'
		},
		today: {
			show: true,
			text: 'Hoy'
		},
		clear: {
			show: true,
			text: 'Borrar'
		},
		date: {
			show: true,
			text: 'Fecha'
		},
		time: {
			show: true,
			text: 'Hora'
		},
		close: {
			show: true,
			text: 'Cerrar'
		}
	},
	closeOnDateSelection: true,
	appendToBody: false,
	altInputFormats: [],
	ngModelOptions: {}
});

myApp.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
	uiGmapGoogleMapApiProvider.configure({
		key: 'AIzaSyCCKsEZwijdGJpCMwnB5twipBvGYvD7W5Q',
		//v: '3.20', //defaults to latest 3.X anyhow
		libraries: 'weather,geometry,visualization'
	});
}]);

myApp.run(['$rootScope', function($rootScope){

	$rootScope.loginScreen = true;

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		$rootScope.loginScreen = (toState.name == 'login');
	})
}]);