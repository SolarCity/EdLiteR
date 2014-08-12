function MountDetailCtrl_($scope, MapService, OlService, MountService, feature) {
	// $scope.layerTarget = "mount";
	// console.log('scope static stuff: ', $scope.mapStatic);

	// $scope.feature.detail = [1,2,3,4];
	$scope.omap = MapService.o.omap;

	var vm = this; 

	vm.feature = feature;

	console.log(feature);

	vm.submitFeature = function() {
		// do feature.setProperties() here instead of in edlOLMap
	};

	//TODO: more stuff like this pattern
	// var vm = this; 

	// vm.deleteFeature = function (feature, index) {
	// 	OlService
	// 		.removeFeature(feature)
	// 		.then(function delete_callback (response) {
	// 			console.log('response');
	// 		});
	// };

}

controllers.controller("MountDetailCtrl", MountDetailCtrl_);
