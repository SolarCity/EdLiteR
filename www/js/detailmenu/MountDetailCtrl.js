function MountDetailCtrl_($scope, $stateParams, OlService, MountService, MapService) {

	var vm = this;
	vm.omap = MapService.getOmap();
	vm.featureArray = OlService.getRecent;
	vm.featureDetails = MountService.mountOptions;
	vm.featureProperties = {};
	vm.featureId = $stateParams.id;

	// where we find mountplane features added by drawing
	vm.mountFeatures 			 = OlService.mounts.getFeatures();
	vm.obstructionFeatures = OlService.obstructions.getFeatures();
	
	vm.getFeatureDetails = function (f) {
		f = f === undefined ? vm.featureArray() : f;
		console.log('featuredetails', f.get('edl'));
		return f.get('edl');

	};

	vm.submitFeature = function(f) {
		f = f === undefined ? vm.featureArray() : f;

		var properties = {};
		properties.edl = vm.featureProperties;

		f.setProperties(properties);
		var result = f.get('edl');
		console.log('feature & properties', f, result);

		return result;
	};

	vm.removeFeature = function(f) {
		// identify the feature's layer
		// remove the feature from that layer.
		vm.getFeatureDetails();
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
