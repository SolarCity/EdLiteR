function edlOlMap(MapService) {
  return {
    restrict: "A",
    transclude: true,
    // controller: "SearchCtrl",
    // controllerAs: "search",
    scope: {

    },
    // controller: function edlOlMapCtrl($scope, $element, $attrs) {
    // },
    link: function edlOlMapLink(scope, ele, attrs) {
      console.log(arguments);
      MapService.getStatic()
      .then(init);
      function init (imgUrl) {
        // set the ol view
        var pixelProjection = new ol.proj.Projection({
          code: 'pixel',
          units: 'pixels',
          global: false,
          extent: [0, 0, 960, 557] //HACK: Should be dynamic
        });

        var view =  MapService.setOview( 
          new ol.View({
            projection: pixelProjection,
            center: ol.extent.getCenter(pixelProjection.getExtent()),
            zoom: 2 
          })
        );

        // where we will display fixed mounting planes
        var mapCapture = new ol.layer.Image({
          source: new ol.source.ImageStatic({
            url: imgUrl,
            imageSize: [960, 557], //HACK: Should be dynamic
            projection: pixelProjection,
            imageExtent: pixelProjection.getExtent()
          }),
        });
        var olMapDiv = document.getElementById('omap');
        var mapOptions = {
          layers: [mapCapture],
          interactions: ol.interaction.defaults({
            altShiftDragRotate: true,
            dragPan: false,
            rotate: true
          }).extend([new ol.interaction.DragPan({kinetic: null})]),
          // target: ele[0],
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

        // // TODO: directive
        var draw = new ol.interaction.Draw({
          features: mountPlaneOverlay.getFeatures(),
          snapTolerance: 25,
          type: 'Polygon'
        });

        map.addInteraction(draw);

        var gutterLineFinder = function gutterLineFinder (event) {
        var feature = event.feature;
        var wkt = new ol.format.WKT();

        // get & split the WKT (well-known text) for our feature
        //  looks like this -> POLYGON((0.7031250000000142
        //                       7.306665009118518,27.949218750000007
        //                       25.59079413562536,28.828124999999996
        //                       -15.846384918461212,0.7031250000000142
        //                     7.306665009118518))
        var featureWkt = wkt.writeFeature(feature).split(' ');

        // create a LineString to mark our gutter
        // looks like this --> "LINESTRING(549.609375", "360.140625,372.294921875", "254.798828125)"
        var gutterLineWkt = [
          'LINESTRING(',
            featureWkt[0].split('((')[1],
            featureWkt[1],
            featureWkt[2].split(',')[0],
            ')'
        ].join(' ');

        // make a gutter feature to draw & push to gutterOverlay's feature collection
        var gutterLineGeom = wkt.readGeometry(gutterLineWkt);
        var gutterLine = new ol.Feature(gutterLineGeom);
        gutterOverlay.addFeature(gutterLine);
        console.log(gutterLineWkt);
      };

      draw.on('drawend', gutterLineFinder);
    }

    },
    // template: [     ].join('')
  };

}
directives.directive('edlOlMap', edlOlMap);
