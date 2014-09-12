function DetailCtrl_($scope, $stateParams, $state, OlService, FeatureOptionService, MapService, StyleService) {
	
	function detailsUpdate(event, args){
		event.preventDefault();
		vm.featureType   	= args.featureType;
	}
	$scope.$on('update details', detailsUpdate); 

	var vm = this;
	vm.featureProperties = {};

	vm.f = {
		id: $scope.selectedFeatureId,
		type: $scope.selectedFeatureType
	};

	vm.feature = function(){
		var f = vm.f;
		var layer = layers[f.type];
		feature = getFeatureFromLayerByIdAndType(layer, f.id, f.type);
		console.log(feature);
		return feature;
	};

	var getFeatureFromLayerByIdAndType = OlService.getFeatureFromLayerByIdAndType;

  // where we find mountplane features added by drawing
  var layers = {};
  layers.mount = OlService.mounts;
  layers.obstruction = OlService.obstructions;

	vm.updateFeatureRadius = function(feature, key ) {
		value = vm.featureRadius;
		feature.set(key, value);
		var result = feature.get('radius');
		return result;
	};

}

controllers.controller("DetailCtrl", DetailCtrl_);
