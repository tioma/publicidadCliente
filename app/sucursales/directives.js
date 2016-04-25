/**
 * Created by Artiom on 04/04/2016.
 */

myApp.directive('fileChange', function(){
	return {
		retrict: 'A',
		scope: {
			handler: '&'
		},
		link: function(scope, element){
			element.on('change', function(event){
				scope.$apply(function(){
					scope.handler({files: event.target.files})
				})
			})
		}
	}
});

myApp.directive('droppable', function(){
	return {
		restrict: 'A',
		scope: {
			drop: '&'
		},
		link: function(scope, element){
			var el = element[0];

			el.addEventListener('dragover', function(e){
				e.dataTransfer.dropEffect = 'copy';
				e.stopPropagation();
				e.preventDefault();
				this.classList.add('over');
			}, false);

			el.addEventListener('dragenter', function(e){
				e.stopPropagation();
				e.preventDefault();
				this.classList.add('over');
			}, false);

			el.addEventListener('dragleave', function(e){
				e.stopPropagation();
				e.preventDefault();
				this.classList.remove('over');
			}, false);

			el.addEventListener('drop', function(e){
				e.stopPropagation();
				e.preventDefault();
				this.classList.remove('over');
				scope.$apply(function(){
					scope.drop({files: event.dataTransfer.files});
				});
			}, false);
		}
	}
});