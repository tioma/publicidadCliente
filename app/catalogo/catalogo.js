/**
 * Created by Artiom on 02/05/2016.
 */
myApp.controller('catalogoCtrl', ['$scope', 'catalogoFactory', 'sucursalesFactory', '$q', 'FileUploader', 'imagesService',
	function($scope, catalogoFactory, sucursalesFactory, $q, FileUploader, imagesService){

		$scope.imageSelected = false;

		$scope.producto = {
			nombre: '',
			descripcion: '',
			codigo: '',
			precio: '',
			sucursales: [],
			etiquetas: []
			//destacar:
		};

		$scope.uploader = new FileUploader({
			alias: 'producto',
			url: 'http://localhost:3002/productos/nueva/imagen/',
			removeAfterUpload: true
		});

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

		var canvas = document.getElementById("canvasImagen");
		var context = canvas.getContext("2d");

		context.fillText("Arrastre una imagen aquí", 15, 60);

		$scope.guardarProducto = function(){
			console.log($scope.producto);
			var arrayEtiqueta = [];
			$scope.producto.etiquetas.forEach(function(etiqueta){
				arrayEtiqueta.push(etiqueta.text)
			});
			var nuevoProducto = angular.copy($scope.producto);
			nuevoProducto.etiquetas = arrayEtiqueta;
			catalogoFactory.guardarProducto(nuevoProducto, function(response){
				if (response.statusText == 'OK'){
					if ($scope.uploader.queue.length > 0){
						var fileItem = $scope.uploader.queue[0];
						fileItem.url = fileItem.url + response.data._id;
						$scope.uploader.uploadAll();
					} else {
						$scope.producto = {
							nombre: '',
							descripcion: '',
							codigo: '',
							precio: '',
							sucursales: [],
							etiquetas: []
							//destacar:
						};
						console.log('todo OK');
					}
				}
			});
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

		$scope.uploader.onSuccessItem = function(item, response, status, headers){
			$scope.producto = {
				nombre: '',
				descripcion: '',
				codigo: '',
				precio: '',
				sucursales: [],
				etiquetas: []
				//destacar:
			};
			$scope.imageSelected = false;
			$scope.$broadcast('uploadFinish');
			console.log('termino la subida');
		};

	}]);