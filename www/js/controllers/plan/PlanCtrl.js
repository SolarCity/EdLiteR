function PlanCtrl_($scope, $ionicSideMenuDelegate, FeatureOptionService, OlService, MapService, PanelFillService, ApiService) {
	var vm = this;

 	vm.toggleDetailView = function(e, args) {
    // request update of values in detail control
    $scope.selectedFeatureId = OlService.selectInteraction.getFeatures().getArray()[0].getId();
    $scope.selectedFeatureType=OlService.selectInteraction.getFeatures().getArray()[0].getGeometryName();
    
    vm.feature = vm.getFeatureDetails();

    $ionicSideMenuDelegate.toggleRight();
	};

  var getFeatureFromLayerByIdAndType = OlService.getFeatureFromLayerByIdAndType;

  vm.selectedFeatureId = $scope.selectedFeatureId;
  vm.selectedFeatureType = $scope.selectedFeatureType;
  vm.selectedFeature = {
    id: $scope.selectedFeatureId,
    type: $scope.selectedFeatureType
  };

  var layers = {};
  layers.mount = OlService.mounts;
  layers.obstruction = OlService.obstructions;
  
  vm.getFeatureDetails = function () {
    var f = {};
    if ($scope.selectedFeatureId) {
      f.id   = $scope.selectedFeatureId;
      f.type = $scope.selectedFeatureType;
    } else {
      f.type = vm.featureType;
    }
    
    var layer = layers[f.type];
    var result;
    if (f.id) {
      feature = getFeatureFromLayerByIdAndType(layer, f.id, f.type);
      if (feature.edl) {
        return feature;
        
      } else {
        result = new FeatureOptionService.options(f.type);
        feature.edl = result;
      }
    } else {
      result = new FeatureOptionService.options(f.type);
      feature.edl = result;
    }
    return feature;

  };

	// detail and feature listen for this event fired on controlbutton
	function controlbutton(e, args){
		e.preventDefault();
		$scope.$broadcast('update details', args); 
	}
	$scope.$on(	'controlbutton', controlbutton);

	// listen for radius change in detailCtrl
	function planUpdateRadius(e, args){
		vm.radius = args;
    console.log(MapService.o.omap);
    MapService.o.omap.render();
	}
	$scope.$on('new radius', planUpdateRadius);

	vm.featureCorners = function() {
		var mountPoints = {}; // we'll send this to the api
		var wkt = OlService.wkt; // used for turning features to strings
		//set zoom to initial zoomlevel // HACK: avoid using projection pixel <> latlng 		
		MapService.getView().setZoom(OlService.defaultZoom);
		// get features
		var mounts  = OlService.mounts.getFeatures();
    mountPoints.m = {};
    var obstructions = OlService.obstructions.getFeatures();
    console.log(obstructions);
    mountPoints.o = {};
		// for features by type "mount" 
		mounts.forEach(function(feat, idx, col){
			if (feat.getGeometryName() === "mount") {
        idx = parseInt(idx);
        // add their points to mountpoints
        mountPoints.m[idx] = wkt.writeFeature(feat).split(',');
        mountPoints.m[idx][0] = mountPoints.m[idx][0].split('((')[1];
        mountPoints.m[idx].splice(-1); // remove the last point, it's a dupe of the 1st
        // mountPoints.m[idx].feat = feat;
      }
    });
    obstructions.forEach(function(feat, idx, col){
      if (feat.getGeometryName() === "obstruction") {
        idx = parseInt(idx);
				// add their points to mountpoints
				mountPoints.o[idx] = wkt.writeFeature(feat).split(',');
        mountPoints.o[idx][0] = mountPoints.o[idx][0].split('(')[1];
        mountPoints.o[idx][0] = mountPoints.o[idx][0].split(')');
        mountPoints.o[idx].splice(1);
        mountPoints.o[idx] = mountPoints.o[idx][0];
        // mountPoints.o[idx].feat = feat;
			}
		});
		// vm.buildMessage(mountPoints, {});
		vm.apiMessage = PanelFillService.processFeatures(mountPoints.m, mountPoints.o);
    $scope.apiMessage = vm.apiMessage;
	};
}
controllers.controller('PlanCtrl',PlanCtrl_);
