function edlOlMap(MapService) {
  return {
    restrict: "A",
    // transclude: true,
    // controller: "SearchCtrl",
    // controllerAs: "search",

    // controller: function edlOlMapCtrl($scope, $element, $attrs) {
    // },
    link: function edlOlMapLink(scope, ele, attrs) {
      console.log(arguments);
      MapService.getStatic()
      .then(init);
      function init (imgUrl) {
        console.log(imgUrl  )
        // set the ol view
        var pixelProjection = new ol.proj.Projection({
          code: 'pixel',
          units: 'pixels',
          global: false,
          extent: [0, 0, 960, 557]
        });

        var view = /* MapService.setOview( */
          new ol.View({
            projection: pixelProjection,
            center: ol.extent.getCenter(pixelProjection.getExtent()),
            zoom: 2 }
          // })
        );

        // view.on('change:center', function() {
        //   var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
        //   gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
        // });

        // view.on('change:resolution', function() {
        //   gmap.setZoom(view.getZoom());
        // });

        // where we will display fixed mounting planes
        var vector = new ol.layer.Image({
          source: new ol.source.ImageStatic({
            url: imgUrl,
            imageSize: [960, 557],
            projection: pixelProjection,
            imageExtent: pixelProjection.getExtent()
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
          // target: ele[0],
          target: olMapDiv,
          view: view
        };
        var map = MapService.setOmap(mapOptions);

        // var mountPlaneOverlay = new ol.FeatureOverlay({
        //   style: new ol.style.Style({
        //     fill: new ol.style.Fill({
        //       color: 'rgba(255, 255, 255, 0.8)'
        //     }),
        //     stroke: new ol.style.Stroke({
        //       color: '#ffcc33',
        //       width: 2
        //     }),
        //     image: new ol.style.Circle({
        //       radius: 7,
        //       fill: new ol.style.Fill({
        //         color: '#ffcc33'
        //       })
        //     })
        //   })
        // });
        // MapService.addOverlay(mountPlaneOverlay);

        // TODO: extract to another state
        // var gutterOverlay = new ol.FeatureOverlay({
        //   style: new ol.style.Style({
        //     fill: new ol.style.Fill({
        //       color: 'rgba(0, 0, 255, 0.8)'
        //     }),
        //     stroke: new ol.style.Stroke({
        //       color: 'red',
        //       width: 5
        //     }),
        //     image: new ol.style.Circle({
        //       radius: 7,
        //       fill: new ol.style.Fill({
        //         color: '#ffcc33'
        //       })
        //     })
        //   })
        // });
        // MapService.addOverlay(gutterOverlay);

        // var modify = new ol.interaction.Modify({
        //   features: mountPlaneOverlay.getFeatures()          
        // });
        // map.addInteraction(modify);

        // // TODO: directive
        // var draw = new ol.interaction.Draw({
        //   features: mountPlaneOverlay.getFeatures(),
        //   snapTolerance: 25,
        //   type: 'Polygon'
        // });

        // map.addInteraction(draw);

        // map.on('click', function(evt) {
        //   console.log('click');
        // });
    }

    },
    // template: [     ].join('')
  };

}
directives.directive('edlOlMap', edlOlMap);
