function PlanCtrl_($scope, $rootScope, $timeout, $ionicSideMenuDelegate, FeatureOptionService, OlService, MapService, PanelFillService, ApiService) {
  var vm = this;
  $('#attributeButton').addClass('button-stable');
  $scope.$on('selected', function(args, count){
    
    if (count > 0) {
      $('#attributeButton').addClass('button-energized');
      $('#attributeButton').removeClass('button-stable');

    } else {
      $('#attributeButton').addClass('button-stable');
      $('#attributeButton').removeClass('button-energized');
    }
  });

  vm.featureAttrs = {};

  vm.toggleDetailView = function(e, args) {
    // request update of values in detail control
    $scope.selectedFeatureId = OlService.selectInteraction.getFeatures().getArray()[0].getId();
    $scope.selectedFeatureType=OlService.selectInteraction.getFeatures().getArray()[0].getGeometryName();
    var f = {
      id   : $scope.selectedFeatureId,
      type : $scope.selectedFeatureType,
      
    };
    
    var layer = layers[f.type];
    
    vm.feature = vm.feature || OlService.getFeatureFromLayerByIdAndType(layer, f.id, f.type);
    vm.featureAttrs = vm.getOrMakeFeatureAttrs();

    $scope.detailpanelwidth = $scope.selectedFeatureType !== 'obstruction' ? 
      275 : 50;
    vm.featureAttrs.radius = vm.feature.get('radius') || $rootScope.planRadius;

    $timeout($ionicSideMenuDelegate.toggleRight,1 ); //HACK: duh. 
  };

  vm.toggleHelpView = function (e, args) {
    // request update of values in detail control
    $ionicSideMenuDelegate.toggleLeft();
  };

  var layers = {};
  layers.mount = OlService.mounts;
  layers.obstruction = OlService.obstructions;
  
  vm.getOrMakeFeatureAttrs = function () {
    // var result;

    var f = {
      id   : $scope.selectedFeatureId,
      type : $scope.selectedFeatureType,
      
    };
    var layer = layers[f.type];
    
    var feature = OlService.getFeatureFromLayerByIdAndType(layer, f.id, f.type);

    var edl = feature.get('edl');

    if (edl === undefined) {
      edl = new FeatureOptionService.detailConstructor(feature.getGeometryName());
      feature.set('edl', edl);
      return edl;
    }
    return feature.get('edl');

  };

  // detail and feature listen for this event fired on controlbutton
  function controlbutton(e, args){
    e.preventDefault();
    $scope.$broadcast('update details', args); 
  }
  $scope.$on( 'controlbutton', controlbutton);

  // listen for radius change in detailCtrl
  // function planUpdateRadius(e, args){
  //   vm.radius = args;
  //   console.log(MapService.o.omap);
  //   MapService.o.omap.render();
  // }
  // $scope.$on('new radius', planUpdateRadius);

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
