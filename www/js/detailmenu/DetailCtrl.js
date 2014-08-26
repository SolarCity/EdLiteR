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
  

	
	// the form values become these properties
	// vm.featureId = $stateParams.id;

	// where we find mountplane features added by drawing
	vm.mountFeatures 			 = OlService.mounts.getFeatures();
	vm.obstructionFeatures = OlService.obstructions.getFeatures();

	vm.setRadius = function (){
		var newval = vm.featureProperties.radius;
		var recent = OlService.getRecent('obstruction');
		if (recent) {
			console.log('newval', newval);
			console.log('recent', recent);
			recent.set('radius', newval);
			console.log(OlService.currentModify);
			// OlService.currentModify[0].set('radius', radius);
			// OlService.currentModify[0].setStyle(StyleService.defaultStyleFunction);
			var radius = recent.get('radius');
			console.log('radius', radius);
		}
		$scope.$emit('new radius', {radius: newval});
	};
	
	vm.getFeatureDetails = function (f) {
		f = f === undefined ? vm.featureArray() : f;
		console.log('featuredetails', f.get('edl'));
		return f.get('edl');
	};

	vm.submitFeature = function(f) {
		console.log('trying to set properties', vm.featureProperties);
		vm.featureType = FeatureOptionService.currentFeatureType;

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
		// remove the feature from that layer.
		vm.getFeatureDetails();
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
