function FeatureCtrl_($scope, $ionicSideMenuDelegate, $state, $stateParams, FeatureOptionService, MapService, OlService) {
	var vm = this;
	
}
controllers.controller('FeatureCtrl',FeatureCtrl_);


function DetailCtrl_($scope, $stateParams, $state, OlService, FeatureOptionService, MapService, featureArray, StyleService) {
	
	function detailsUpdate(event, args){
		event.preventDefault();
		vm.featureType   	= args.featureType;
		// vm.featureDetails = FeatureOptionService.options[vm.featureType];
		// vm.featureDetails = vm.getFeatureDetails();
	}
	$scope.$on('update details', detailsUpdate); 
	
	var vm = this;
	vm.featureProperties = {};
	vm.featureProperties.radius = 10;
	// vm.featureArray = $scope.selectedFeatureId;
	vm.selectedFeatureId = $scope.selectedFeatureId;
	vm.selectedFeatureType = $scope.selectedFeatureType;
	vm.selectedFeature = {
		id: $scope.selectedFeatureId,
		type: $scope.selectedFeatureType
	};

	vm.feature = function(){
		var f = {
			id: $scope.selectedFeatureId,
			type: $scope.selectedFeatureType
		};

		var layer = layers[f.type];
		feature = getFeatureFromLayerByIdAndType(layer, f.id, f.type);
		return feature;
	};


	var getFeatureFromLayerByIdAndType = OlService.getFeatureFromLayerByIdAndType;

  // where we find mountplane features added by drawing
  var layers = {};
  layers.mount = OlService.mounts;
  layers.obstruction = OlService.obstructions;

	// vm.setRadius = function (){
	// 	var newval = vm.featureProperties.radius;
	// 	var recent = OlService.getRecent('obstruction');
	// 	if (recent) {
	// 		recent.set('radius', newval);
	// 	}
	// 	$scope.$emit('new radius', {radius: newval});
	// };
	// var layers = {};
 //  layers.mount = OlService.mounts;
 //  layers.obstruction = OlService.obstructions;
	// vm.getFeatureDetails = function () {
	// 	var f = {};
	// 	if ($scope.selectedFeatureId) {
	// 		f.id 	 = $scope.selectedFeatureId;
	// 		f.type = $scope.selectedFeatureType;
	// 	} else {
	// 		f.type = vm.featureType;
	// 	}
		
	// 	var layer = layers[f.type];
	// 	if (f.id) {
	// 		feature = getFeatureFromLayerByIdAndType(layer, f.id, f.type);
	// 		if (feature.edl) {
	// 			console.log('yes feature.edl', feature.edl);
	// 			return feature.edl;
				
	// 		} else {
	// 			console.log('no feature.edl', FeatureOptionService.options[f.type]);
	// 			return FeatureOptionService.options[f.type];
	// 		}
	// 	} else {
	// 		console.log('no f.id', FeatureOptionService.options[f.type]);
	// 		// vm.featureProperties = FeatureOptionService.options[vm.featureType];
	// 		return FeatureOptionService.options[f.type];
	// 	}

	// };

	vm.submitFeature = function() {
		var feature = vm.feature();
		var properties = {};
		properties.edl = vm.featureProperties;
		console.log('hi', properties)
		feature.edl = properties.edl;
		var result = feature.edl;
		console.log('feature & properties', feature, result);

		return result;
	};

	vm.removeFeature = function() {
		var f = {
			id: $scope.selectedFeatureId,
			type: $scope.selectedFeatureType
		};

		var layer = layers[f.type];
		feature = getFeatureFromLayerByIdAndType(layer, f.id, f.type);

		OlService.removeFeatureById(f.id, layer);
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
