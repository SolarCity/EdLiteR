function edlOlMap($state, MapService, OlService) {
  return {
    restrict: "A",
    transclude: true,
    scope: {
      targetLayer: "=",
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
        mapCapture.set('name', 'mapCapture');

        var olMapDiv = ele[0];
        // var olMapDiv = document.getElementById('omap');



        // let's tinker with the layers
        // get the layer... 
        var mountPlaneImage = OlService.mountPlaneImage;
        var mountAndGutterSource = OlService.mountAndGutterSource;
        var mountLayer = new ol.layer.Image({
          source: mountPlaneImage
        });
        mountLayer.set('name', 'mountLayer');

        // add the layer to the map
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


        var selectedMountOverlay = OlService.selectedMountOverlay;
        MapService.addOverlay(selectedMountOverlay);

        //TODO: combine with selectedMountOverlay and give it a style function (i guess)
        var gutterOverlay = OlService.gutterOverlay;
        MapService.addOverlay(gutterOverlay);

        // TODO: obstructions should work
        // var obstructionOverlay = OlService.obstructionOverlay;
        // MapService.addOverlay(obstructionOverlay);

        var modify = new ol.interaction.Modify({
          features: selectedMountOverlay.getFeatures()          
        });
        map.addInteraction(modify);

        // // TODO: directive
        var draw = new ol.interaction.Draw({
          features: selectedMountOverlay.getFeatures(),
          snapTolerance: 25,
          type: 'Polygon', 
          geometryName: 'mount',
        });

        map.addInteraction(draw);

        var gutterLineFinder = function gutterLineFinder (event) {
          var feature = event.feature;
          console.log('feat')
          var wkt = new ol.format.WKT();

         /* 
          *
          * get & split the WKT (well-known text) for our feature
          * looks like this -> POLYGON((0.7031250000000142
          *                     7.306665009118518,27.949218750000007
          *                     25.59079413562536,28.828124999999996
          *                     -15.846384918461212,0.7031250000000142
          *                   7.306665009118518))
          *
          */
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
          gutterLine.setGeometryName('gutter');
          gutterOverlay.addFeature(gutterLine);
          // mountAndGutterSource.addFeature(feature.clone());

          // var drawnfeature = selectedMountOverlay.getFeatures().pop(); //TODO: after feature becomes "fixed"
          var drawnfeature = feature;
          // var drawnfeature = selectedMountOverlay.getFeatures().getArray()[0].pop();

          OlService.setRecent(feature);
          // selectedMountOverlay.addFeature(drawnfeature.clone())
          drawnfeature.setProperties(OlService.mountplane);

          var featurearray = [gutterLine, drawnfeature];
          var featuresindex = mountAndGutterSource.getFeatures().length;
          mountAndGutterSource.addFeature(drawnfeature);

          OlService.setIdsOfFeaturearray(featurearray, featuresindex ); 
          $state.go('plan.mount', {id: featuresindex});

        };
                  // NEW BELOW HERE: 


        draw.on('drawend', gutterLineFinder);

      }

    },
    // template: [     ].join('')
  };

}
directives.directive('edlOlMap', edlOlMap);
