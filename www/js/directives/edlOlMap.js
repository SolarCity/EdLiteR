function edlOlMap(MapService, OlService) {
  return {
    restrict: "A",
    transclude: true,
    // controller: "SearchCtrl",
    // controllerAs: "search",
    scope: {
      layerTarget: "="
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

        var mapOptions = {
          layers: [mapCapture],
          interactions: ol.interaction.defaults({
            altShiftDragRotate: true,
            dragPan: false,
            rotate: true
          }).extend([new ol.interaction.DragPan({kinetic: null})]),
          target: olMapDiv,
          view: view
        };
        var map = MapService.setOmap(mapOptions);

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




        };
                  // NEW BELOW HERE: 

          var overlayStyle = (function() {
            /* jshint -W069 */
            var styles = {};
            styles['Polygon'] = [
              new ol.style.Style({
                fill: new ol.style.Fill({
                  color: [255, 255, 255, 0.5]
                })
              }),
              new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: [255, 255, 255, 1],
                  width: 5
                })
              }),
              new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: [0, 153, 255, 1],
                  width: 3
                })
              }),
              new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: [0, 0, 255, 1],
                  width: 1
                })
              })
            ];
            styles['MultiPolygon'] = styles['Polygon'];

            styles['LineString'] = [
              new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: [255, 255, 255, 1],
                  width: 5
                })
              }),
              new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: [0, 153, 255, 1],
                  width: 3
                })
              })
            ];
            styles['MultiLineString'] = styles['LineString'];

            styles['Point'] = [
              new ol.style.Style({
                image: new ol.style.Circle({
                  radius: 7,
                  fill: new ol.style.Fill({
                    color: [0, 153, 255, 1]
                  }),
                  stroke: new ol.style.Stroke({
                    color: [255, 255, 255, 0.75],
                    width: 1.5
                  })
                }),
                zIndex: 100000
              })
            ];
            styles['MultiPoint'] = styles['Point'];

            styles['GeometryCollection'] = styles['Polygon'].concat(styles['Point']);

            return function(feature, resolution) {
              return styles[feature.getGeometry().getType()];
            };
            /* jshint +W069 */
          })();          

          var select = new ol.interaction.Select({
            style: overlayStyle
          });

          map.addInteraction(select);
        draw.on('drawend', gutterLineFinder);
      }

    },
    // template: [     ].join('')
  };

}
directives.directive('edlOlMap', edlOlMap);
