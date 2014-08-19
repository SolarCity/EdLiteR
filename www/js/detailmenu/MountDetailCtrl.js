function MountDetailCtrl_($scope, $stateParams, OlService, MountService, MapService, feature) {

	var vm = this;
	vm.omap = MapService.getOmap();
	vm.feature = feature;
	vm.featureDetails = MountService.mountOptions;
	vm.featureProperties = {};
	vm.featureId = $stateParams.id;

	// where we find mountplane features added by drawing
	vm.mpSource = OlService.mounts;

	// where we find gutterline features added automagically
	vm.glSource = OlService.gutterOverlay;
	// vm.olLayers = vm.omap.getLayers(); // returns {} w/ layers as keys (??)
	
	vm.getFeatureDetails = function (f) {
		console.log(MapService.getOmap());
	};

	vm.submitFeature = function(f) {
		f = f === undefined ? vm.feature : f;

		var properties = {};
		properties.edl = vm.featureProperties;

		f.setProperties(properties);
		var result = f.get('edl');
		console.log('feature & properties', f, result);

		return result;
	};

	vm.finalizeFeature = function(f) {
		f = vm.feature; //HACK: should be able to pass this in as a parameter
		console.log(f.getId());
		// verify there's a legit feature
		// if (f.getGeometryName() !== "geometry") { // TODO: make the geometry name something specific
		// 	console.log('err... that ain\'t real geometry, brah');
		// 	return;
		// }
		// get the map
		var omap = MapService.getOmap();
		// verify featureDetails are complete //TODO: try with form validation? 

		// add featureDetails to the feature
		f.setProperties(vm.featureProperties);
		f.setId(vm.featureId);
		// add/move/clone the feature to mounts
		OlService.mounts.addFeature(f);
		// delete the original feature from selectedMountOverlay
		var allfeaturearray = OlService.mountPlaneImage.getSource().getFeatures();
		OlService.selectedMountOverlay.removeFeature(f);
	};

	vm.removeFeature = function(f) {
		var omap = MapService.getOmap();
		console.log('layers array',omap.getLayers().getArray());
		console.log('L 0 source',omap.getLayers().getArray()[0].get('name'));
		console.log('L 1 source',omap.getLayers().getArray()[1].get('name'));
		console.log('overlays',omap.getOverlays().getArray());
		console.log('o 0',omap.getOverlays().getArray()[0].getFeatures().getArray());
		console.log('o 1',omap.getOverlays().getArray()[1].getFeatures().getArray());
		// console.log('o 2',omap.getOverlays().getArray()[2].getFeatures().getArray()); //was previously the Obstructionoverlay


		// identify the feature's layer
		// remove the feature from that layer.
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
