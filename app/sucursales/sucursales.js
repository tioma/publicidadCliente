/**
 * Created by Artiom on 01/04/2016.
 */
myApp.controller('sucursalesCtrl', ['$scope', 'uiGmapIsReady', 'uiGmapGoogleMapApi', 'sucursalesFactory', 'imagesService', 'FileUploader', '$q', '$state', '$compile',
	function($scope, uiGmapIsReady, uiGmapGoogleMapApi, sucursalesFactory, imagesService, FileUploader, $q, $state, $compile){

		//TODO verificar que los datos de la sucursal esten completos
		//TODO cambiar metodo aca y en el servidor para la subida de imagenes
		//TODO verificar que el archivo seleccionado sea una imagen jpeg

		var mapsInstances = 1;
		if ($state.current.name == 'sucursales.nueva') mapsInstances = 2;

		$scope.calendarioDesde = false;
		$scope.calendarioHasta = false;

		$scope.uploader = new FileUploader({
			alias: 'sucursal',
			url: 'http://localhost:3002/sucursales/nueva/imagen/',
			removeAfterUpload: true
		});

		$scope.mapPrincipal = {
			center: { latitude: 45, longitude: -73 },
			pan: true,
			zoom: 12,
			control: {}
		};

		$scope.mapForm = {
			center: { latitude: 45, longitude: -73 },
			pan: true,
			zoom: 12,
			control: {}
		};

		$scope.dataSucursales = [];

		//Sucursal elegida para editar
		$scope.sucursalSelected = {};

		$scope.abrirFormulario = function(nueva){
			$scope.nueva = nueva;
			$state.transitionTo('sucursales.nueva');
		};

		$scope.editarSucursal = function(){
			console.log('holaaaa');
			$scope.sucursalSelected.horario.desde = new Date(2016, 1, 1, $scope.sucursalSelected.horario.desde % 60, $scope.sucursalSelected.horario.desde - ($scope.sucursalSelected.horario.desde % 60 * 60))
			$scope.sucursalSelected.horario.hasta = new Date(2016, 1, 1, $scope.sucursalSelected.horario.hasta % 60, $scope.sucursalSelected.horario.hasta - ($scope.sucursalSelected.horario.hasta % 60 * 60))
			$scope.sucursal = $scope.sucursalSelected;

			$scope.mapForm.center.latitude = $scope.sucursal.ubicacion.latitud;
			$scope.mapForm.center.longitude = $scope.sucursal.ubicacion.longitud;

			$scope.sucursalMarker = {
				position: {
					latitude: $scope.sucursal.ubicacion.latitud,
					longitude: $scope.sucursal.ubicacion.longitud
				},
				options: {
					visible: true,
					title: $scope.sucursal.nombre
				}
			};

			console.log($scope.sucursal);
			$scope.abrirFormulario(false);
		};

		//Espera hasta que las instancias de los mapas se carguen
		//Traigo las sucursales cargadas y las muestro en el mapa principal
		uiGmapIsReady.promise(mapsInstances).then(function(instances){

			$scope.mapInstance = $scope.mapPrincipal.control.getGMap();

			sucursalesFactory.obtenerSucursales({}, function(response){
				if (response.statusText == 'OK'){
					$scope.dataSucursales = response.data.map(function(curr, ind){
						curr.position = {
							latitude: curr.ubicacion.latitud,
							longitude: curr.ubicacion.longitud
						};
						curr.options = {
							visible: true,
							title: curr.nombre
						};
						curr.id = ind;
						return curr;
					});
				} else {
					console.log('todo mal')
				}
			});
		});

		//Se ejecuta una vez que carga la librería de google maps
		//Acá meto las funciones que utilizan la API de google
		uiGmapGoogleMapApi.then(function(maps) {

			$scope.infoWindow = null;

			//Click sobre un marcador
			$scope.markerClick = function(marker, ev, sucursal){
				var content;
				if ($scope.infoWindow != null) $scope.infoWindow.close();
				if (sucursal.imagen.ready){
					content = '<div id="iw-container">' +
						'<div class="iw-title">' + sucursal.nombre + '</div>' +
						'<div class="iw-content"><img src="http://localhost:3002/sucursales/imagen/' + sucursal._id + '" height="100">' + sucursal.direccion + '</div>' +
							'<button type="button" class="btn btn-default" ng-click="editarSucursal()">Editar</button>' +
						'</div>';
				} else {
					content = '<div id="iw-container">' +
						'<div class="iw-title">' + sucursal.nombre + '</div>' +
						'<div class="iw-content">' + sucursal.direccion + '</div>' +
						'<button type="button" class="btn btn-default" ng-click="editarSucursal()">Editar</button>' +
						'</div>';
				}
				var compiledContent = $compile(content)($scope);

				$scope.sucursalSelected = sucursal;
				$scope.infoWindow = new maps.InfoWindow({
					content: compiledContent[0]
				});
				$scope.infoWindow.open($scope.mapInstance, marker);
			};

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

			//Trae las direcciones a medida que voy escribiendo
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

			//Marca la ubicación elegida en el mapa y setea los datos en la sucursal
			$scope.getAddressSelected = function(address){
				var latitud = address.geometry.location.lat();
				var longitud = address.geometry.location.lng();
				$scope.sucursalMarker.position.latitude = latitud;
				$scope.sucursalMarker.position.longitude = longitud;
				$scope.sucursalMarker.options.visible = true;
				$scope.sucursalMarker.options.title = $scope.sucursal.nombre;

				$scope.mapForm.center.latitude = latitud;
				$scope.mapForm.center.longitude = longitud;

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

		//Modelo para bindear al formulario y editar
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
			telefonos: []
		};

		$scope.imageSelected = false;

		//TODO crear directiva que manejar el file upload
		/*var canvas = document.getElementById("canvasImagen");
		var context = canvas.getContext("2d");*/

		//context.fillText("Arrastre una imagen aquí", 15, 60);

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

		//Se ejecuta en el progreso de la subida, devuelve el porcentaje que se lleva completado
		//TODO analizar el poner una barra para indicar el estado de la carga de la imagen
		$scope.uploader.onProgressItem = function(fileItem, progress) {
			console.info('onProgressItem', fileItem, progress);
		};

		//Se ejecuta cuando se termina de subir un archivo
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
				telefonos: []
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

			sucursalesFactory.guardarSucursal($scope.sucursal, function(response){
				if (response.statusText == 'OK'){
					if ($scope.uploader.queue.length > 0){
						var fileItem = $scope.uploader.queue[0];
						fileItem.url = fileItem.url + response.data._id;
						$scope.uploader.uploadAll();
					} else {
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
							telefonos: []
						};
					}
				}
			})
		};

		$scope.abrirCalendar = function(event){
			event.preventDefault();
			event.stopPropagation();
		}

	}]);