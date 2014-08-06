function edlOlMap(MapService) {
  return {
    restrict: "A",
    transclude: true,
    // controller: "SearchCtrl",
    // controllerAs: "search",
    link: function edlOlMapLink(scope, ele, attrs) {

      // set the ol view
      var view = MapService.setOview(
        new ol.View({
          maxZoom: 19,
        })
      );

      var gmap = MapService.getGmap();
      // bind ol view to google map
      var gCenter = MapService.getCenter();

      view.setZoom(gmap.getZoom());
      view.setCenter([gCenter.lat(),gCenter.lng()]);

      view.on('change:center', function() {
        var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
        gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
      });
      view.on('change:resolution', function() {
        gmap.setZoom(view.getZoom());
      });

      // where we will display fixed mounting planes
      var vector = new ol.layer.Vector({
        source: new ol.source.Vector({
          projection: 'EPSG:3857'
        }),
      });
      var olMapDiv = document.getElementById('omap');
      var mapOptions = {
        layers: [vector],
        interactions: ol.interaction.defaults({
          altShiftDragRotate: false,
          dragPan: false,
          rotate: false
        }).extend([new ol.interaction.DragPan({kinetic: null})]),
        target: olMapDiv,
        view: view
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

      // TODO: extract to another state
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
        features: mountPlaneOverlay.getFeatures()          
      });
      map.addInteraction(modify);

      // TODO: directive
      var draw = new ol.interaction.Draw({
        features: mountPlaneOverlay.getFeatures(),
        snapTolerance: 25,
        type: 'Polygon'
      });

      map.addInteraction(draw);

      map.on('click', function(evt) {
        console.log('click');
      });

      olMapDiv.parentNode.removeChild(olMapDiv);
      gmap.controls[google.maps.ControlPosition.TOP_LEFT].pop();
      gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);
    },
    // template: [     ].join('')
  };
}
directives.directive('edlOlMap', edlOlMap);
