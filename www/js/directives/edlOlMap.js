function edlOlMap(MapService) {
  return {
    restrict: "A",
    transclude: true,
    controller: function edlOlMapController($scope, $element, $attrs) {

    },
    link: function edlOlMapLink(scope, ele, attrs) {

      function initialize() {

        // set the ol view
        var view = MapService.setOview(
          new ol.View({
            maxZoom: 21
          })
        );

        var gmap = MapService.getGmap();
        // bind ol view to google map

          // gmap.setCenter(center);
        
        view.on('change:center', function() {
          console.log('changed center');
          var center = view.getCenter();
          gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
        });
        view.on('change:resolution', function() {
          gmap.setZoom(view.getZoom());
        });

        // where we will display fixed mounting planes
        var vector = new ol.layer.Vector({
          source: new ol.source.Vector()
        });

        var mapOptions = {
          layers: [vector],
          interactions: ol.interaction.defaults({
            altShiftDragRotate: false,
            dragPan: false,
            rotate: false
          }).extend([new ol.interaction.DragPan({kinetic: null})]),
          target: ele[0],
          view:   MapService.getView()
        };
        var map = MapService.setOmap(mapOptions);

        var mountPlaneOverlay = new ol.FeatureOverlay({
          style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.8)'
            }),
            stroke: new ol.style.Stroke({
              color: '#ffcc33',
              width: 2
            }),
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: '#ffcc33'
              })
            })
          })
        });
        MapService.addOverlay(mountPlaneOverlay);

        var gutterOverlay = new ol.FeatureOverlay({
          style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(0, 0, 255, 0.8)'
            }),
            stroke: new ol.style.Stroke({
              color: 'red',
              width: 5
            }),
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: '#ffcc33'
              })
            })
          })
        });
        MapService.addOverlay(gutterOverlay);

        var modify = new ol.interaction.Modify({
          features: mountPlaneOverlay.getFeatures(),
          // the SHIFT key must be pressed to delete vertices, so
          // that new vertices can be drawn at the same position
          // of existing vertices
          deleteCondition: function(event) {
            return ol.events.condition.shiftKeyOnly(event) &&
                ol.events.condition.singleClick(event);
          }
        });
        map.addInteraction(modify);

        // TODO: directive
        var draw = new ol.interaction.Draw({
          features: mountPlaneOverlay.getFeatures(),
          snapTolerance: 25,
          type: 'Polygon'
        });

        map.addInteraction(draw);
        console.log('loading omap');

        map.on('click', function(evt) {
          console.log('click');
        });
        
        view.setCenter([37.5516671,-122.31563]);
        view.setZoom(20);
        
        olMapDiv = ele[0];
        var center =  new google.maps.LatLng(37.5516671,-122.31563);
        gmap.setCenter(center);
                
        // gmap.controls[google.maps.ControlPosition.LEFT_TOP].push(olMapDiv);
      }
      console.log(ele[0]);

      google.maps.event.addDomListener(window, 'loadOlMap', initialize);
    },
    // template: [     ].join('')
  };
}
directives.directive('edlOlMap', edlOlMap);
