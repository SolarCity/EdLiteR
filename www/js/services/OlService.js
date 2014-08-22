function OlService_ ($q, $state, StyleService) {
  // this factory is a singleton & provides layers, styles, etc for the edl-ol-map ... 
  // 

  //TODO: get all the OlMap stuff from MapService into this Service instead.

  var OlService = {};

  // TODO: give styles for the type of thing selected... (maybe)
  // var selectedStyleFunction = function function_name (argument) {
    
  // };

  OlService.recentFeature = {}; 

  OlService.setRecent = function(featureArray, opt) {
    if (opt === undefined) console.log('setRecent needs a type to set');return; //TODO: check error in prettier way
    
    featureArray = Array.isArray(featureArray) ? featureArray : [ featureArray ];

    OlService.recentFeature[opt] = new ol.Collection(featureArray);
    return OlService.recentFeature;
  };

  OlService.getRecent = function(opt) {
    return OlService.recentFeature[opt];
  };

  OlService.setIdsOfFeaturearray = function(featurearray, id) { 
    for (var key in featurearray) {
      var f = featurearray[key];
      f.setId(id);
    }
  };

  OlService.removeRecent = function(recentArray){
    recentArray.forEach(function(){

    });
  };

  OlService.mounts = new ol.source.Vector({
    features: []
  });

  OlService.obstructions = new ol.source.Vector({
    features: []
  });

  // create image source from canvas elements from vector source
  // these are the uneditable elements
  // OlService.mountPlaneImage = new ol.source.Vector({
  //   style: StyleService.defaultStyleFunction,
  //   source: OlService.mounts
  // });

  // mounting plane FeatureOverlay // NOTE: not used
  // OlService.selectedOverlay = new ol.FeatureOverlay({
  //   style: StyleService.highlightStyleFunction,
  // });
  
  OlService.gutterLineFinder = function gutterLineFinder (event) {
    var feature = event.feature;
    var mountfeature = feature.getGeometry();

    var featureWkt;
    var gutterLineWkt;
    var wkt = new ol.format.WKT();

    var mounts = OlService.mounts; //HACK: make this a parameter? 

   /* 
    *
    * get & split the WKT (well-known text) for our feature
    * looks like this -> POLYGON((0.7031250000000142  7.306665009118518,27.949218750000007  25.59079413562536,28.828124999999996  -15.846384918461212,0.703125000000014 27.306665009118518))
    *
    */
    featureWkt = wkt.writeFeature(feature).split(' ');

    // create a LineString to mark our gutter
    // looks like this --> "LINESTRING(549.609375", "360.140625,372.294921875", "254.798828125)"
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

    OlService.setRecent([mountfeature, gutterFeature], 'mount'); //HACK: this should happen elsewhere
    feature.setProperties(OlService.mountplane); //HACK: this should happen elsewhere

    // put the features in the overlay
    var featurearray = [gutterFeature, feature];
    mounts.addFeatures(featurearray);

    // set feature id#s to be the same
    var featuresindex = mounts.getFeatures().length;
    OlService.setIdsOfFeaturearray(featurearray, featuresindex ); 

    // $state.go('plan.mount', {id: featuresindex}); // TODO: still need access to the feature id, but can't do it with statego because too much refreshing

  };

  return OlService;
}

angular.module('edliter').factory('OlService', OlService_);  
