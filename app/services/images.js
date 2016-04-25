/**
 * Created by Artiom on 06/04/2016.
 */
myApp.service('imagesService', [function(){

	function resizeImage (imagen, ancho){
		var resizeCanvas = document.createElement('CANVAS');
		var resizeContext = resizeCanvas.getContext('2d');
		var alto = imageService.getImageProportion(imagen, ancho);

		resizeCanvas.width = ancho;
		resizeCanvas.height = alto;

		resizeContext.drawImage(imagen, 0, 0, ancho, alto);

		var b64Image = resizeCanvas.toDataURL("image/jpeg").replace("data:image/jpeg;base64,", "");
		resizeCanvas = null;

		return b64toBlob(b64Image, 'image/jpeg');
	}

	function b64toBlob(b64Data, contentType, sliceSize){
		contentType = contentType || '';
		sliceSize = sliceSize || 512;

		var byteCharacters = atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize){
			var slice = byteCharacters.slice(offset, offset + sliceSize);

			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++){
				byteNumbers[i] = slice.charCodeAt(i);
			}

			var byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		var blob = new Blob(byteArrays, {type: contentType});
		return blob;
	}

	var imageService = {
		getImagesResize: function(imagen){
			var fileList = [];
			fileList.push(resizeImage(imagen, 320));
			console.log(fileList);
			fileList.push(resizeImage(imagen, 768));
			console.log(fileList);
			fileList.push(resizeImage(imagen, 1080));
			console.log(fileList);
			return fileList
		},
		getImageProportion: function(imagen, ancho){
			var proportion = ancho / imagen.width;
			return imagen.height * proportion;
		}
	};

	return imageService;

}]);