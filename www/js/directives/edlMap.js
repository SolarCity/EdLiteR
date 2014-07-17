directives.directive('edlMap', [ '$ionicGesture', '$ionicPlatform', function( ionicGesture, ionicPlatform) {
  return {
    restrict: "EA",
    scope: {
      onCreate: "&"
    },
    controller: function ($scope, $element, $attrs) {
      
    },
    link: function (scope, ele, attrs) {
      function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(37.5516671,-122.31563),
          zoom: 20,
          mapTypeId: google.maps.MapTypeId.SATELLITE, 
          tilt: 0, 
          streetViewControl: false,
          rotateControl: true,
          mapTypeControl: false,
          zoomControl: true,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE
          }
        };

        var map = new google.maps.Map(ele[0], mapOptions);

        scope.onCreate({map:map});

        // google.maps.event.addDomListener(ele[0], 'touchdown', function(e) {
        //   e.preventDefault();
        //   return false;
        // });

        var input = document.getElementById("place-input");
      
        var types = document.getElementById('type-selector');

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);
      
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var marker     = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0,0)
        });

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

      }

      google.maps.event.addDomListener(window, 'load', initialize);
      ionic.trigger('load',{target: window});

    },

    };
}]);
