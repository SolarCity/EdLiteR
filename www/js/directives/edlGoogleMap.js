function edlGoogleMap(MapService) {
  return {
    restrict: "A",
    transclude: true,
    scope: {
    	onCreate: "&"
    },
    controller: function edlGoogleMapController($scope, $element, $attrs) {

    },
    link: function edlGoogleMapLink(scope, ele, attrs) {
      
		  function initialize() {

        var mapOptions = {
          disableDefaultUI: true,
          keyboardShortcuts: false,
          draggable: false,
          disableDoubleClickZoom: true,
          scrollwheel: false,
          streetViewControl: false,
          // center: new google.maps.LatLng(37.5516671,-122.31563),
          // zoom: 20,
          mapTypeId: google.maps.MapTypeId.SATELLITE, 
          tilt: 0, 
          // streetViewControl: false,
          // rotateControl: true,
          // mapTypeControl: false,
          // zoomControl: true,
          // zoomControlOptions: {
          //   style: google.maps.ZoomControlStyle.LARGE
          // }
        };

        var map =  MapService.setGmap(ele[0], mapOptions);
        scope.onCreate({map:MapService.getGmap()});

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
        ionic.trigger('loadOlMap',{target: window});
      }  
      console.log(ele[0]);
	    google.maps.event.addDomListener(window, 'load google', initialize);
    }
  };
}
directives.directive('edlGoogleMap', edlGoogleMap);
