function DetailCtrl_($scope, $rootScope, $stateParams, $state, OlService, FeatureOptionService, MapService, StyleService, ApiService, PanelFillService) {
	var vm = this;
	var Ol = OlService;
	
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

  vm.fillPanel = function fillPanel(feature) {
	  if (feature !== null) {
	      // if selected feature has panels, delete them
	      var id = feature.getId();
	      var panellayer = Ol.layers.panel;
	      var existing = panellayer.getFeatureById(id);
	      if (existing) {
	          Ol.removeFeatureById(id, panellayer);
	      }
	      var msg = Ol.fillMessageForSingleMount(feature);
	      // create api message with Process Features
	      var api = PanelFillService.processFeatures(msg.m, msg.o);

	      ApiService.uploadMounts(api) //TODO: change from sample
	        .then(function (data) {
	          PanelFillService.addPanelsFromApi(data, id);
	      });
	  }
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
