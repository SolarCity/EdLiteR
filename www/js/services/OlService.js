function OlService_ ($q, StyleService) {
  // this factory is a singleton & provides layers, styles, etc for the edl-ol-map ... 
  // 

  //TODO: get all the OlMap stuff from MapService into this Service instead.

  var OlService = {};

  // TODO: give styles for the type of thing selected... (maybe)
  // var selectedStyleFunction = function function_name (argument) {
    
  // };

  OlService.getLayers = function() {

  };

  OlService.setRecent = function(feature) {
    OlService.recentFeature = feature;
    return OlService.recentFeature;
  };

  OlService.getRecent = function() {
    return OlService.recentFeature;
  };

  OlService.setIdsOfFeaturearray = function(featurearray, id) { // TODO: make use of this... 
    for (var key in featurearray) {
      var f = featurearray[key];
      f.setId(id);
    }
  };

  OlService.mountAndGutterSource = new ol.source.Vector({
    features: []
  });

  // create image source from canvas elements from vector source
  // these are the uneditable elements
  OlService.mountPlaneImage = new ol.source.ImageVector({
    style: StyleService.defaultStyleFunction, 
    source: OlService.mountAndGutterSource
  });

  // mounting plane FeatureOverlay
  OlService.selectedMountOverlay = new ol.FeatureOverlay({
    style: StyleService.highlightStyleFunction 
  });
  

  
  // obstruction layer
  OlService.obstructionOverlay = new ol.FeatureOverlay({
    style: new ol.style.Circle({
      radius: 10,
      fill: null,
      stroke: new ol.style.Stroke({color: 'orange', width: 2})
    }
  )});

  // gutterlayer (to be changed later)
  OlService.gutterOverlay = new ol.FeatureOverlay({
    style: StyleService.defaultStyleFunction 
  });

  return OlService;
}

angular.module('edliter').factory('OlService', OlService_);  
