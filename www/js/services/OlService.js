function OlService_ ($q, $state, $window, $ionicSideMenuDelegate, StyleService, MapService) {
  // this factory is a singleton & provides layers, styles, etc for the edl-ol-map ... 
  // 

  //TODO: get all the OlMap stuff from MapService into this Service instead.
  var OlService = {};

  // TODO: give styles for the type of thing selected... (maybe)
  // var selectedStyleFunction = function function_name (argument) {
    
  // };

  OlService.recentFeature = {}; 

  // dev 
  var mapDiv = {};
  mapDiv.clientHeight = 725;
  OlService.mapDiv = mapDiv;
  OlService.extent = [0, 0, $window.innerWidth, OlService.mapDiv.clientHeight ];
  OlService.defaultZoom = 2;

  OlService.setRecent = function(featureArray, opt) {
    if (opt === undefined) console.log('setRecent needs a type to set, dummy'); //TODO: check error in prettier way
    featureArray = Array.isArray(featureArray) ? featureArray : [ featureArray ];
    OlService.recentFeature[opt] = new ol.Collection(featureArray);
    console.log('setting recent', opt, 'as: ', OlService.recentFeature);
    $ionicSideMenuDelegate.toggleRight();
    return OlService.recentFeature;
  };

  OlService.getRecent = function(opt) {
    console.log('getting recent', opt, OlService.recentFeature[opt]);
    if (opt === undefined) console.log('getRecent needs a type to get, dummy'); //TODO: check error in prettier way
    return OlService.recentFeature[opt];
  };

  OlService.setIdsOfFeaturearray = function(featurearray, id) { // utility for setting id. allow to later remove by id(??)
    for (var key in featurearray) {
      console.log('featureId', featurearray[key]);
      var f = featurearray[key];
      f.setId(id);
    }
  };

  OlService.removeFeatureById = function(id, layer){
    var removeus = [];
    function findforremove(f) {
      if (f.getId() === id) {
        removeus.push(f);
      }
    }
    layer.forEachFeature(findforremove);
    for (var a in removeus) {
      layer.removeFeature(removeus[a]);
    }
  };

  OlService.mounts = new ol.source.Vector({
    features: new ol.Collection([])
  });

  OlService.panels = new ol.source.Vector({
    features: new ol.Collection([]),
  });
  
  OlService.obstructions = new ol.source.Vector({
    features: new ol.Collection([])
  });
  
  // OlService.afterObstruction = function afterObstruction(event, formDetails) {
  //   var feature = event.feature;
  //   console.log(formDetails);

  //   var radius = Math.floor(Math.random()*25 + 1);
  //   feature.set('radius', radius );
  //   OlService.setRecent([feature], 'obstruction');
  // };

  OlService.wkt = new ol.format.WKT();

  OlService.gutterLineFinder = function gutterLineFinder(event) {
    var feature = event.feature;
    var mountfeature = feature.getGeometry();

    var featureWkt;
    var gutterLineWkt;
    var wkt = OlService.wkt;

    var mounts = OlService.mounts; //HACK: make this a parameter? 

    // get & split the WKT (well-known text) for our feature
    featureWkt = wkt.writeFeature(feature).split(' ');
    // create a LineString to mark our gutter
    gutterLineWkt = [
      'LINESTRING(',
        featureWkt[0].split('((')[1],
        featureWkt[1],
        featureWkt[2].split(',')[0],
        ')'
    ].join(' ');

    // make a gutter feature to draw & push to gutterOverlay's feature collection
    var gutterLineGeom = wkt.readGeometry(gutterLineWkt);
    var gutterFeature = wkt.readFeature(gutterLineWkt);

    // set gutter geometry and key for stylefunction
    gutterFeature.setProperties({
      gutter: gutterLineGeom,
    });
    gutterFeature.setGeometryName('gutter');
    // set drawn geometry and key for stylefunction
    feature.setProperties({
      mount: mountfeature,
    });
    feature.setGeometryName('mount');

    // OlService.setRecent([feature, gutterFeature], 'mount'); //HACK: this should happen elsewhere

    // put the features in the source
    var featureArray = [feature, gutterFeature];
    console.log('setting mount id as', OlService.mounts.getFeatures().length);
    OlService.setIdsOfFeaturearray(featureArray, OlService.mounts.getFeatures().length);

    mounts.addFeature(gutterFeature);
    feature.on('change', function(event){
      console.log(event.target);
      // this.removeFeature([gutterFeature]);
    }, mounts);

  };

  return OlService;
}

angular.module('edliter').factory('OlService', OlService_);  
