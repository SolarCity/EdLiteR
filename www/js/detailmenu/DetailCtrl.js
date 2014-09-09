function FeatureCtrl_($scope, $ionicSideMenuDelegate, $state, $stateParams, FeatureOptionService, MapService, OlService) {
	var vm = this;
	
}
controllers.controller('FeatureCtrl',FeatureCtrl_);


function DetailCtrl_($scope, $stateParams, $state, OlService, FeatureOptionService, MapService, featureArray, StyleService) {
	
	function detailsUpdate(event, args){
		event.preventDefault();
		vm.featureType   	= args.featureType;
		vm.featureDetails = FeatureOptionService.options[vm.featureType];
	}
	$scope.$on('update details', detailsUpdate); 
	
	var vm = this;
	vm.featureProperties = {};
	vm.featureProperties.radius = 10;
	vm.featureArray = OlService.getRecent;

  vm.featureType = 'obstruction';
  vm.omap = MapService.getOmap();
  vm.featureArray = OlService.getRecent;

  
	// where we find mountplane features added by drawing
	var layers = {};
	layers.mount = OlService.mounts;
	layers.obstruction = OlService.obstructions;
	
	vm.setRadius = function (){
		var newval = vm.featureProperties.radius;
		var recent = OlService.getRecent('obstruction');
		if (recent) {
			recent.set('radius', radius);
			// OlService.currentModify[0].setStyle(StyleService.defaultStyleFunction);
			// var radius = recent.getKeys();
			var radius = recent.get('radius');
			console.log('radius', radius);
		}
		$scope.$emit('new radius', {radius: newval});
	};
	
	vm.getFeatureDetails = function (f) {
		f = f === undefined ? vm.featureArray(vm.featureType) : f;
		console.log('featuredetails', f.get('edl'));
		return f.get('edl');
	};

	vm.submitFeature = function(f) {
		console.log('trying to set properties', vm.featureProperties);

		f = f === undefined ? vm.featureArray(vm.featureType) : f;
		console.log(vm.featureType, vm.featureArray(vm.featureType));
		var properties = {};
		properties.edl = vm.featureProperties;

		f.setProperties(properties);
		var result = f.get('edl');
		console.log('feature & properties', f, result);

		return result;
	};

	vm.removeFeature = function(f) {
		// identify the feature's layer
		console.log('trying to remove feature & type', vm.featureType,  layers[vm.featureType].getFeatures());
		f = f === undefined ? vm.featureArray(vm.featureType) : f;
		// remove the feature from that layer.
		console.log();
		// debugger;
		// console.log('f', f.getArray());
		// f.getArray()[0].setId(2);
		// f.getArray()[1].setId(1);
		var features = OlService.selectInteraction.getFeatures().getArray();
		OlService.removeFeatureById(features[0].getId(), layers[vm.featureType]);
		// OlService.selectInteraction.removeFeature(features[0]);
	
	};
}

controllers.controller("DetailCtrl", DetailCtrl_);



	//TODO: more stuff like this pattern
	// var vm = this; 

	// vm.deleteFeature = function (feature, index) {
	// 	OlService
	// 		.removeFeature(feature)
	// 		.then(function delete_callback (response) {
	// 			console.log('response');
	// 		});
	// };
