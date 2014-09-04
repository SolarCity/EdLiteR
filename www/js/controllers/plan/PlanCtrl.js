function PlanCtrl_($scope, $ionicSideMenuDelegate, FeatureOptionService, OlService, MapService, PanelFillService) {
	var vm = this;

 	vm.toggleDetailView = function() {
		$ionicSideMenuDelegate.toggleRight();
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
	}
	$scope.$on('new radius', planUpdateRadius);

	vm.featureCorners = function() {
		var mountPoints = {}; // we'll send this to the api
		var wkt = OlService.wkt; // used for turning features to strings
		//set zoom to initial zoomlevel // HACK: avoid using projection pixel <> latlng 		
		MapService.getView().setZoom(OlService.defaultZoom);
		// get features
		var features  = OlService.mounts.getFeatures();
		// for features by type "mount" 
		features.forEach(function(feat, idx, col){
			if (feat.getGeometryName() === "mount") {
				// add their points to mountpoints
				mountPoints[idx] = wkt.writeFeature(feat).split(',');
				mountPoints[idx][0] = mountPoints[idx][0].split('((')[1];
				mountPoints[idx].splice(-1); // remove the last point, it's a dupe of the 1st
			}
		});
		PanelFillService.processFeatures(mountPoints);
	};

}
controllers.controller('PlanCtrl',PlanCtrl_);
