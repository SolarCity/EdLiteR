function MountDetailCtrl_($scope, OlService, MountService, feature) {

	var vm = this; 

	vm.feature = feature;
	vm.featureDetails = MountService.mountOptions;
	vm.featureProperties = {};

	vm.submitFeature = function() {
		// do feature.setProperties() here instead of in edlOLMap
		console.log('hi',vm.featureProperties);
	};

}

controllers.controller("MountDetailCtrl", MountDetailCtrl_);

	//TODO: more stuff like this pattern
	// var vm = this; 

	// vm.deleteFeature = function (feature, index) {
	// 	OlService
	// 		.removeFeature(feature)
	// 		.then(function delete_callback (response) {
	// 			console.log('response');
	// 		});
	// };
