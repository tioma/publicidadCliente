/**
 * Created by Artiom on 01/04/2016.
 */
myApp.controller('sucursalesCtrl', ['$scope', 'uiGmapGoogleMapApi', 'sucursalesFactory', 'imagesService', 'FileUploader', '$q',
	function($scope, uiGmapGoogleMapApi, sucursalesFactory, imagesService, FileUploader, $q){

		//TODO verificar que los datos de la sucursal esten completos
		//TODO cambiar metodo aca y en el servidor para la subida de imagenes
		//TODO verificar que el archivo seleccionado sea una imagen jpeg

		$scope.calendarioDesde = false;
		$scope.calendarioHasta = false;

		$scope.uploader = new FileUploader({
			alias: 'sucursal',
			url: 'http://localhost:3002/sucursales/nueva/imagen/',
			removeAfterUpload: true
		});

		/*sucursalesFactory.obtenerSucursales(function(data){
			console.log(data);
			console.log("http://localhost:3002/sucursales/imagen/" + data[0]._id + '?size=');
			/*var imageObj = new Image();
			 imageObj.onload = function() {
			 console.log('ya cargo la imagen');

			 context.drawImage(imageObj, 0, 0);
			 $scope.sucursal.imagen.data = canvas.toDataURL("image/jpeg").replace("data:image/jpeg;base64,", "");
			 $scope.sucursal.imagen.contentType = "image/jpeg";
			 //context.drawImage(imagen, 0, 0, 150, 120);
			 console.log($scope.sucursal);
			 };

			 imageObj.crossOrigin="anonymous";
			 imageObj.src = "http://localhost:3002/sucursales/imagen/" + data[0]._id;
			 /*sucursalesFactory.imagenSucursal(data[0]._id, function(dataImagen){
			 console.log(dataImagen);
			 var blobImagen = new Blob(dataImagen, {type: 'image/jpeg'});
			 var arrayImagen = [];
			 arrayImagen.push(blobImagen);
			 $scope.fileSelect(arrayImagen);
			 /*var imagen = new Image();
			 imagen.src = dataImagen;

			 imagen.onload = function() {
			 console.log('ya cargo la imagen');

			 context.drawImage(imagen, 0, 0);
			 $scope.sucursal.imagen.data = canvas.toDataURL("image/jpeg").replace("data:image/jpeg;base64,", "");
			 $scope.sucursal.imagen.contentType = "image/jpeg";
			 //context.drawImage(imagen, 0, 0, 150, 120);
			 console.log($scope.sucursal);
			 };
			 })
		});*/

		$scope.map = {
			center: { latitude: 45, longitude: -73 },
			pan: true,
			zoom: 12
		};

		uiGmapGoogleMapApi.then(function(maps) {

			$scope.sucursalMarker = {
				position: {
					latitude: 45,
					longitude: -73
				},
				options: {
					visible: false,
					title: $scope.sucursal.nombre
				}
			};

			$scope.getAdress = function(val){
				var deferred = $q.defer();
				var geocoder = new maps.Geocoder();
				geocoder.geocode( { 'address': val}, function(results, status) {
					if (status == maps.GeocoderStatus.OK) {
						deferred.resolve(results);
					} else {
						console.log("Geocode was not successful for the following reason: " + status);
						deferred.reject();
					}
				});
				return deferred.promise;
			};

			$scope.getAddressSelected = function(address){
				var latitud = address.geometry.location.lat();
				var longitud = address.geometry.location.lng();
				$scope.sucursalMarker.position.latitude = latitud;
				$scope.sucursalMarker.position.longitude = longitud;
				$scope.sucursalMarker.options.visible = true;
				$scope.sucursalMarker.options.title = $scope.sucursal.nombre;

				$scope.map.center.latitude = latitud;
				$scope.map.center.longitude = longitud;

				$scope.sucursal.direccion = address.formatted_address;
				$scope.sucursal.ubicacion.latitud = latitud;
				$scope.sucursal.ubicacion.longitud = longitud;
				address.address_components.forEach(function(component){
					switch (component.types[0]){
						case 'country':
							$scope.sucursal.pais = component.long_name;
							break;
						case 'administrative_area_level_1':
							$scope.sucursal.provincia = component.long_name;
							break;
						case 'administrative_area_level_2':
							$scope.sucursal.localidad = component.long_name;
							break;
					}
				});
			};

		});

		$scope.sucursal = {
			nombre: '',
			descripcion: '',
			direccion: '',
			ubicacion: {
				latitud: '',
				longitud: ''
			},
			localidad: '',
			provincia: '',
			pais: '',
			horario: {
				desde: new Date(2016, 1, 1, 9),
				hasta: new Date(2016, 1, 1, 19)
			},
			telefonos: [4561321, 4896549, 651321989, 96846513]
		};

		$scope.imageSelected = false;

		var canvas = document.getElementById("canvasImagen");
		var context = canvas.getContext("2d");

		context.fillText("Arrastre una imagen aquí", 15, 60);

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
						//var fileList = imagesService.getImagesResize(imagen);
						//console.log(fileList);
						//var otroReader = new FileReader();
						context.drawImage(imagen, 0, 0, 150, imagesService.getImageProportion(imagen, 150));
						$scope.imageSelected = true;
						/*fileList.forEach(function(imageBlob){
						 otroReader.onload = function(ev){
						 $scope.uploader.addToQueue(ev.target.result);
						 };
						 otroReader.readAsDataURL(imageBlob);
						 })*/


					};
				};

				reader.readAsDataURL(file);
			}
		};

		$scope.uploader.onProgressItem = function(fileItem, progress) {
			console.info('onProgressItem', fileItem, progress);
		};

		$scope.uploader.onSuccessItem = function(item, response, status, headers){
			$scope.sucursal = {
				nombre: '',
				descripcion: '',
				direccion: '',
				ubicacion: {
					latitud: '',
					longitud: ''
				},
				localidad: '',
				provincia: '',
				pais: '',
				horario: {
					desde: new Date(2016, 1, 1, 9),
					hasta: new Date(2016, 1, 1, 19)
				},
				telefonos: [4561321, 4896549, 651321989, 96846513]
			};
			$scope.imageSelected = false;
			$scope.$broadcast('uploadFinish');
		};

		$scope.borrarCampo = function(campo){
			$scope.sucursal[campo] = '';
			if (campo == 'direccion'){
				$scope.sucursal.ubicacion.latitud = '';
				$scope.sucursal.ubicacion.longitud = '';
				$scope.sucursal.pais = '';
				$scope.sucursal.provincia = '';
				$scope.sucursal.localidad = '';
			}
		};

		$scope.agregarTelefonos = function(nuevoTelefono){
			nuevoTelefono.numero = parseInt(nuevoTelefono.numero);
		};

		$scope.guardarSucursal = function(){
			/*console.log($scope.uploader.getReadyItems());
			console.log($scope.uploader.getNotUploadedItems());
			console.log($scope.uploader.queue);*/
			sucursalesFactory.guardarSucursal($scope.sucursal, function(response){
				console.log(response);
				if (response.statusText == 'OK'){
					if ($scope.uploader.queue.length > 0){
						var fileItem = $scope.uploader.queue[0];
						fileItem.url = fileItem.url + response.data._id;
						$scope.uploader.uploadAll();
					}
				}
			})
		};

		$scope.abrirCalendar = function(event){
			event.preventDefault();
			event.stopPropagation();
		}

	}]);