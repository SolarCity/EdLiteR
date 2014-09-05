function PlanCtrl_($scope, $ionicSideMenuDelegate, FeatureOptionService, OlService, MapService, PanelFillService, ApiService) {
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
		var mounts  = OlService.mounts.getFeatures();
    mountPoints.m = {};
    var obstructions = OlService.obstructions.getFeatures();
    console.log(obstructions)
    mountPoints.o = {};
		// for features by type "mount" 
		mounts.forEach(function(feat, idx, col){
			if (feat.getGeometryName() === "mount") {

				// add their points to mountpoints
				mountPoints.m[idx] = wkt.writeFeature(feat).split(',');
				mountPoints.m[idx][0] = mountPoints.m[idx][0].split('((')[1];
				mountPoints.m[idx].splice(-1); // remove the last point, it's a dupe of the 1st
			}
		});
		obstructions.forEach(function(feat, idx, col){
			if (feat.getGeometryName() === "obstruction") {

				// add their points to mountpoints
				mountPoints.o[idx] = wkt.writeFeature(feat).split(',');
        console.log(mountPoints.o[idx]);
        mountPoints.o[idx][0] = mountPoints.o[idx][0].split('(')[1];
        console.log(mountPoints.o[idx]);
        mountPoints.o[idx][0] = mountPoints.o[idx][0].split(')');
        console.log(mountPoints.o[idx][0], mountPoints.o[idx][1]);
			}
		});
		// vm.buildMessage(mountPoints, {});
		vm.apiMessage = PanelFillService.processFeatures(mountPoints.m, mountPoints.o);
	};

	vm.buildMessage = function(mounts, obstructions) {
		mounts = mounts || {};
		obstructions = obstructions || {};
		var msg = {};
		msg.o = [];
		msg.m = [];

		for (var m in mounts) {

			console.log(mounts);
			console.log(m);
			msg.m.push({
				id: m.idx, 
				pitch: 'pitch',
				points: mounts,
			});
		}
		
		for (var o in obstructions) {
			msg.o.push({
				id: o.idx, 
				radius: 'radius',
				center: {
					lat: 'lat',
					lng: 'lng',
				}
			});
		}
		


		vm.apiMessage = msg;
	};

}
controllers.controller('PlanCtrl',PlanCtrl_);



// {
// 	"o": [
// 		{
// 			"radius": 0,
// 			"height": 0,
// 			"center": {
// 				"lat": 0,
// 				"lon": 0
// 			}

// 		}
// 	],


// 	"m": [
// 		{
// 			"id": 0,
// 			"pitch": 0,
// 			"points": [
// 				[0,1,2], 
// 				[0,1,2], 
// 				[0,1,2], 
// 				[0,1,2], 
// 				[0,1,2], 
// 			]
// 		}
// 	]

// }
