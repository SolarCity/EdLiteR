function DetailCtrl_($scope, $rootScope, $stateParams, $state, OlService, FeatureOptionService, MapService, StyleService) {
	var vm = this;
	
	vm.f = {
		id: $scope.selectedFeatureId,
		type: $scope.selectedFeatureType
	};
	
	vm.currR = $rootScope.planRadius;

	$scope.$watch('syncFeature', function(){
		vm.currR = vm.getOrUpdateRadius();
		vm.currP = vm.getOrUpdatePitch();
	});

	vm.featureProperties = {};

	function getFeature(){
	  // where we find mountplane features added by drawing
	  var layers = {};
	  layers.mount = OlService.mounts;
	  layers.obstruction = OlService.obstructions;
		
		// obj for currently selected feature
		var f = {
			id: $scope.selectedFeatureId,
			type: $scope.selectedFeatureType
		};

		var layer = layers[f.type];
		var  result = OlService.getFeatureFromLayerByIdAndType(layer, f.id, f.type);
		$scope.syncFeature = result;
		return result;
	}

	vm.getOrUpdatePitch = function(newVal) {

		var feature = getFeature();
		if (newVal) { // update existing pitch
			$rootScope.planPitch = newVal; //HACK: so ugly
			feature.set('pitch', newVal);
			return newVal;
		}
		
		// get pitch
		if (feature) {
			vm.currP = feature.get('pitch') || 0;
		}

		return vm.currP;
	};

	vm.getOrUpdateRadius = function(newVal) {		
		var feature = getFeature();
		if (newVal) { // update radius
			$rootScope.planRadius = newVal; //HACK: so ugly
			feature.set('radius', newVal);
			return newVal;
		}
		
		// get radius
		if (feature) {
			vm.currR = feature.get('radius');
			
		}

		return vm.currR;
	};

	vm.setFeatureProperty = function(feature, key ) {
		alert('detailctrlfeaturepropertywtf?');

	};

	function detailsUpdate(event, args){
		event.preventDefault();
		vm.featureType = args.featureType;
       
	}
	$scope.$on('update details', detailsUpdate); 
}

controllers.controller("DetailCtrl", DetailCtrl_);
