function PlanCtrl_($scope, $rootScope, $timeout, $ionicSideMenuDelegate, FeatureOptionService, OlService, MapService, PanelFillService, ApiService) {
  var vm = this;
  vm.featureAttrs = {};

  $scope.$watch(function(){return vm.focus;}, function(feature){
    $scope.focus = feature;
    if (feature && feature.getGeometryName() === "obstruction") {
      vm.radius = feature.get('radius');
    }else if (feature && feature.getGeometryName() === "mount") {
      vm.pitch = feature.get('pitch');
    }
  });

  vm.toggleDetailView = function(feature) {
    if (!feature) alert('no feature selected');

    vm.feature = feature ;
    vm.featureAttrs = vm.getOrMakeFeatureAttrs(feature);

    $scope.detailpanelwidth = feature.getGeometryName() !== 'obstruction' ? 
      275 : 50;
      
    $scope.$apply();
    $ionicSideMenuDelegate.toggleRight();
  };

  vm.toggleHelpView = function (e, args) {
    $ionicSideMenuDelegate.toggleLeft();
  };

  var layers = {};
  layers.mount = OlService.mounts;
  layers.obstruction = OlService.obstructions;
  
  vm.getOrMakeFeatureAttrs = function (feature) {
    var edl = feature.get('edl');

    if (edl === undefined) {
      edl = new FeatureOptionService.detailConstructor(feature.getGeometryName());
      feature.set('edl', edl);
      return edl;
    }
    return feature.get('edl');

  };

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
