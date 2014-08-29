function edlGoogleMap($timeout, $document, $window, MapService) {
  return {
    restrict: "A",
    transclude: true,
    scope: {
    	onCreate: "&"
    },
    controller: function edlGoogleMapController($scope, $element, $attrs) {

    },
    link: function edlGoogleMapLink(scope, ele, attrs) {
      
      var mapOptions = MapService.g.mapOptions;
      $timeout(timer_init, 1); //HACK: biggest hack evar. 
      function timer_init() {

        var map =  MapService.setGmap(ele[0], mapOptions);
        // scope.onCreate({map:MapService.getGmap()});

        var input = document.getElementById('place-input'); 
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var autocomplete = MapService.setAutocomplete(input);
        autocomplete.bindTo('bounds', map);
        google.maps.event.addListener(autocomplete, 'place_changed', function(){
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            return;
          }
          // If the place has a geometry then present it on the map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
          }

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }
          
        });
        var center =  MapService.getCenter();
        map.setCenter(center);
        // map.setZoom(20);

        var saveCenter = function saveCenter () {
          var center = map.getCenter();
          if (center) {
            console.log(MapService.setCenter(center));
          }

        };
        google.maps.event.addListener(map, 'center_changed', saveCenter);
      }
      // var mapDiv = document.getElementById('gmap');

      // console.log(ele[0]);
    }
  };
}
directives.directive('edlGoogleMap', edlGoogleMap);
