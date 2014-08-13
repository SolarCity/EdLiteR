function edlOlMap($state, MapService, OlService) {
  return {
    restrict: "A",
    transclude: true,
    scope: {
      targetLayer: "=",
      // map: "=?", // add the ? because parent scope property doesn't exist yet :)
    },
    // controller: function edlOlMapCtrl($scope, $element, $attrs) {
    // },
    link: function edlOlMapLink(scope, ele, attrs) {

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

        var olMapDiv = ele[0];
        // var olMapDiv = document.getElementById('omap');



        // let's tinker with the layers
        // get the layer... 
        var mountPlaneImage = OlService.mountPlaneImage;
        var mountPlaneSource = OlService.mountPlaneSource;
        var mountLayer = new ol.layer.Image({
          source: mountPlaneImage
        });



        // add the layer to the map
        // map.addLayer(mountLayer);

        var mapOptions = {
          layers: [mapCapture, mountLayer],
          interactions: ol.interaction.defaults({
            altShiftDragRotate: true,
            dragPan: false,
            rotate: true
          }).extend([new ol.interaction.DragPan({kinetic: null})]),
          target: olMapDiv,
          view: view
        };
        var map = MapService.setOmap(mapOptions);
        // scope.map = map;













        var mountPlaneOverlay = OlService.mountPlaneOverlay;
        MapService.addOverlay(mountPlaneOverlay);

        //TODO: combine with mountplaneOverlay and give it a style function (i guess)
        var gutterOverlay = OlService.gutterOverlay;
        MapService.addOverlay(gutterOverlay);

        var obstructionOverlay = OlService.obstructionOverlay;
        MapService.addOverlay(obstructionOverlay);

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
          // mountPlaneSource.addFeature(feature.clone());

          var drawnfeature = mountPlaneOverlay.getFeatures().pop(); //TODO: after feature becomes "fixed"
          OlService.setRecent(feature);

          drawnfeature.setProperties(OlService.mountplane);

          
          mountPlaneSource.addFeature(drawnfeature);

          $state.go('plan.mount', {id: mountPlaneSource.getFeatures().length});

        };
                  // NEW BELOW HERE: 


        draw.on('drawend', gutterLineFinder);

      }

    },
    // template: [     ].join('')
  };

}
directives.directive('edlOlMap', edlOlMap);
