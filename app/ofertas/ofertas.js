/**
 * Created by Artiom on 11/05/2016.
 */
myApp.controller('ofertasCtrl', ['$scope', 'catalogoFactory', 'sucursalesFactory', '$q', 'FileUploader',
	function($scope, catalogoFactory, sucursalesFactory, $q, FileUploader){

		$scope.imageSelected = false;

		$scope.oferta = {
			titulo: '',
			descripcion: '',
			fecha: {
				desde: new Date(),
				hasta: new Date()
			},
			producto: '',
			edades: {
				desde: 0,
				hasta: 99
			},
			sexo: '',
			sucursales: [],
			etiquetas: []
		};

		$scope.uploader = new FileUploader({
			alias: 'oferta',
			url: 'http://localhost:3002/ofertas/nueva/imagen/',
			removeAfterUpload: true
		});

		$scope.datePopUp = [
			{opened: false, format: 'dd/MM/yyyy', options: {formatYear: 'yyyy', startingDay: 1}},
			{opened: false, format: 'dd/MM/yyyy', options: {formatYear: 'yyyy', startingDay: 1}}
		];

		$scope.abrirCalendar = function(index){
			$scope.datePopUp[index].opened = !$scope.datePopUp[index].opened
		};

		$scope.getProductos = function(val){
			var deferred = $q.defer();
			var param = {
				nombre: val
			};
			catalogoFactory.obtenerProductos(param, function(response){
				if (response.statusText == 'OK'){
					deferred.resolve(response.data);
				} else {
					deferred.reject();
				}
			});
			return deferred.promise;
		};

		$scope.buscarSucursales = function(val){
			var deferred = $q.defer();
			var param = {
				nombre: val
			};
			sucursalesFactory.obtenerSucursales(param, function(response){
				if (response.statusText == 'OK'){
					deferred.resolve(response.data);
				} else {
					deferred.reject();
				}
			});
			return deferred.promise;
		};

		$scope.fileSelect = function(files){
			if (files.length > 0){
				var file = files[0];
				var reader = new FileReader();
				$scope.uploader.clearQueue();
				$scope.uploader.addToQueue(file);

				reader.onload = function(event){
					var imagen = new Image();
					imagen.src = event.target.result;

					imagen.onload = function() {
						context.drawImage(imagen, 0, 0, 150, imagesService.getImageProportion(imagen, 150));
						$scope.imageSelected = true;
					};
				};

				reader.readAsDataURL(file);
			}
		};

		$scope.guardarOferta = function(){

		}

	}]);