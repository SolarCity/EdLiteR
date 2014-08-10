function MapService_ ($q) {
  // this factory is a singleton for the Application. 
  // it provides maps, layers, collections, etc... 
  var MapService = {};
  
  // the google map
  MapService.g = {};
  // the openlayer map
  MapService.o = {};

  MapService.g.mapOptions = { 
    disableDefaultUI: true,
    keyboardShortcuts: false,
    draggable: true,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    streetViewControl: false,
    // center: new google.maps.LatLng(37.5516671,-122.31563), //TODO: device location
    // zoom: 20,
    mapTypeId: google.maps.MapTypeId.SATELLITE, 
    tilt: 0, 
    rotateControl: true,
    mapTypeControl: false,
    // zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE
    }
  };

  MapService.o.staticMap = null;  
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

  MapService.getOview = function() {
    return MapService.o.view;
  };

  MapService.setCenter = function(center) {
    MapService.g.center = center;
    return MapService.g.center;
  };

  MapService.getCenter = function(center) {
    if (MapService.g.center) {
      return MapService.g.center;
    } else {
      return new google.maps.LatLng(37.5516671,-122.31563); //HACK: should only return current map center
      // return null;
    }
  };

  MapService.setStatic = function (ele) {
    var element = document.getElementById('gmap'); //HACK: this should be a parameter
    var defer = $q.defer();
    MapService.o.staticMap = defer.promise;
    html2canvas(element, {
      useCORS: true,
      onrendered: function(canvas) {
        var dataUrl= canvas.toDataURL("image/png");
        console.log('dataUrl saved as ', dataUrl);
        defer.resolve(dataUrl);
      }
    });
    return MapService.o.staticMap;
  };

  MapService.getStatic = function() {
    return MapService.o.staticMap;
  };

  return MapService;
}
angular.module('edliter').factory('MapService', MapService_);  
