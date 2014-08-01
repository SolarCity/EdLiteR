function MapService_ () {
  // this factory is a singleton for the Application. 
  // it provides maps, layers, collections, etc... 
  var MapService = {};
  
  // the google map
  MapService.g = {};
  // the openlayer map
  MapService.o = {};

  // MapService.o.inteactions;
  // MapService.o.projection;


  // google map
  MapService.g.gmap = null;
  MapService.g.autocomplete = null;

  // openlayer map
  MapService.o.omap = null;
  MapService.o.view = new ol.View({
    maxZoom: 21
  });

  MapService.o.layers = null;
  

  // group methods
  MapService.getLayer = function(layername) {
    if (layername === undefined) {
      return MapService.o.layers;
    } else {
      return MapService.o.layers[layername];
    }
  };

  MapService.getView = function() {
    return MapService.o.view;
  };

  MapService.addOverlay = function(layer) {
    // console.log(MapService.o.omap.getLayer())
    return MapService.o.omap.addOverlay(layer);
  };

  MapService.setAutocomplete = function(element) {
    MapService.g.autocomplete = new google.maps.places.Autocomplete(element);
    return MapService.g.autocomplete;
  };

  MapService.setGmap = function(element, options) {
    MapService.g.gmap = new google.maps.Map(element, options);
    return MapService.g.gmap;
  };

  MapService.getGmap = function() {
    return MapService.g.gmap;
  };

  MapService.setOmap = function(options) {

    MapService.o.omap = new ol.Map(options);
    return MapService.o.omap;
  };

  MapService.setOview = function(view) {
    MapService.o.view = view;
    return MapService.o.view;
  };

  return MapService;
}
angular.module('edliter').factory('MapService', MapService_);  
