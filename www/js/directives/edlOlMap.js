function edlOlMap($state, MapService, OlService, StyleService) {
  return {
    restrict: "A",
    transclude: true,
    scope: {
      targetLayer: "=",
    },
    // controller: function edlOlMapCtrl($scope, $element, $attrs) {
    // },
    link: function edlOlMapLink(scope, ele, attrs) {
      var olMapDiv = ele[0];

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

      // TODO: why can't angular elements be used here?
      // make a controls box
      var controllerbox = angular.element('<div></div>');
      controllerbox.addClass('mapboxcontrols');
      controllerbox.attr('id', 'edl-control-box');

      // mountdraw button
      var mountdrawbutton = angular.element('<button></button>');
      mountdrawbutton.addClass('button button-stable topbutton');
      mountdrawbutton.text('Mount');
      var mountcontrol = new ol.control.Control({
        element: mountdrawbutton[0]
      });
      // obstruction button
      var obstructionbutton = angular.element('<button></button>');
      obstructionbutton.addClass('button button-stable bottombutton');
      obstructionbutton.text('Obstacle');
      var obstructioncontrol = new ol.control.Control({
        element: obstructionbutton[0],
      });
      // add buttons to box

      controllerbox.append(mountdrawbutton);
      controllerbox.append(obstructionbutton);

      var leftsidecontrolbox = new ol.control.Control({element: controllerbox[0]});

      // draw mount
        // control function
      var mountDraw = function mountDraw(){
        console.log('hello mount');

      };
      var obstructionDraw = function obstructionDraw(){
        console.log('hello obstruction');

      };
      // add control to button
      // mountdrawbutton.on('touchstart', mountDraw, false);
      // draw obstruction
        // control function
        // add control to button

      mountdrawbutton.on('click', mountDraw);
      obstructionbutton.on('click', obstructionDraw);

      MapService.getStatic()
      .then(init);
      function init (imgUrl) {
        // set the ol view

        // the picture we'll display our drawn features on
        var mapCapture = new ol.layer.Image({
          source: new ol.source.ImageStatic({
            url: imgUrl,
            imageSize: [960, 557], //HACK: Should be dynamic
            projection: pixelProjection,
            imageExtent: pixelProjection.getExtent()
          }),
        });
        mapCapture.set('name', 'mapCapture');

        var mounts = OlService.mounts;
        var mountLayer = new ol.layer.Image({
          source: OlService.mountPlaneImage, 
          style:  StyleService.defaultStyleFunction,
        });
        mountLayer.set('name', 'mountLayer');

        // add the layer to the map

        var mapOptions = {
          layers: [mapCapture, mountLayer],
          controls: ol.control.defaults({
              attributionOptions: ({
                collapsible: false
              })
            // }).extend([mountcontrol, obstructioncontrol]),
            }).extend([leftsidecontrolbox]),
          interactions: ol.interaction.defaults({
            altShiftDragRotate: true,
            dragPan: false,
            rotate: true
          }).extend([new ol.interaction.DragPan({kinetic: null})]),
          target: olMapDiv,
          view: view
        };
        var map = MapService.setOmap(mapOptions);

        var select = new ol.interaction.Select({
          features: mounts.getFeatures(),
          condition: ol.events.condition.targetNotEditable,
          styleFunction: StyleService.highlightStyleFunction,
        });
        map.addInteraction(select);

        var selectedMountOverlay = OlService.selectedMountOverlay;
        MapService.addOverlay(selectedMountOverlay);

        var modify = new ol.interaction.Modify({
          features: select.getFeatures(),
          style: StyleService.highlightStyleFunction,
        });
        map.addInteraction(modify);
        // // TODO: directive
        var draw = new ol.interaction.Draw({
          features: mounts.getFeatures(),
          snapTolerance: 25,
          type: 'Polygon', 
          geometryName: 'mount',
          style: StyleService.defaultStyleFunction,
        });

        map.addInteraction(draw);

        var gutterLineFinder = OlService.gutterLineFinder;
        draw.on('drawend', gutterLineFinder);

      }

    },
    // template: [     ].join('')
  };

}
directives.directive('edlOlMap', edlOlMap);
