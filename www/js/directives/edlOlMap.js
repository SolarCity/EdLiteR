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

      /* Leftside controls. See init() for instantiation */
      var controllerbox = angular.element('<div></div>');
      controllerbox.addClass('mapboxcontrols');
      controllerbox.attr('id', 'edl-control-box');
      var mountdrawbutton = angular.element('<button></button>');
      var obstructionbutton = angular.element('<button></button>');
      var leftsidecontrolbox = new ol.control.Control({element: controllerbox[0]});
      controllerbox.append(mountdrawbutton);
      controllerbox.append(obstructionbutton);

      /*
       *  ControllButton constructor
       *  options look like this: 
       *  {
       *    buttonText: {string}, 
       *    topButton: {boolean},
       *    bottomButton: {boolean}, 
       *    callback: {function}, 
       *    target:   {should be your map?}, 
       *    container: {DOM element into which button gets appended}, 
       *  } 
       */  
      var DrawControlButton = function DrawControlButton(opt_options){
        var options = opt_options || {};

        var map = options.map;
        var anchor = options.target;
        anchor.addClass('button button-stable');
        if (options.buttonText) anchor.text(options.buttonText);
        if (!!options.topButton) anchor.addClass('topbutton');
        if (!!options.bottomButton) anchor.addClass('bottombutton');

        anchor.on('touchstart', options.callback);

        return new ol.control.Control({
          element: anchor[0],
        });
      };
      ol.inherits(DrawControlButton , ol.control.Control);

      /* map init! */
      MapService.getStatic()
      .then(init);
      function init (imgUrl) {
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
        var mountLayer = new ol.layer.Vector({
          // source: OlService.mountPlaneImage,
          source: mounts, 
          // style:  StyleService.defaultStyleFunction,
        });
        mountLayer.set('name', 'mountLayer');
        var obstructions = OlService.obstructions;
        var obstacleLayer = new ol.layer.Vector({
          // source: OlService.mountPlaneImage,
          source: obstructions, 
          // style:  StyleService.defaultStyleFunction,
        });
        mountLayer.set('name', 'mountLayer');

        /* Map Options */
        var mapOptions = {
          layers: [mapCapture, mountLayer, obstacleLayer],
          controls: ol.control.defaults({
              attributionOptions: ({
                collapsible: false
              })
            }).extend([leftsidecontrolbox]),
          interactions: ol.interaction.defaults({
            altShiftDragRotate: true,
            dragPan: true,
            rotate: true
          }).extend([new ol.interaction.DragPan({kinetic: null})]),
          target: olMapDiv,
          view: view
        };
        var map = MapService.setOmap(mapOptions);

        /* left controls callbacks */
        var handleMountButton = function handleMountButton(e){
          mountLayer.setStyle(StyleService.highlightStyleFunction);
          obstacleLayer.setStyle(StyleService.defaultStyleFunction);
          var interactions = map.getInteractions();
          interactions.pop();
          // map.removeInteraction(drawObstacle);
          map.addInteraction(drawMount);

        };

        var handleObstacleButton = function handleObstacleButton(e) {
          mountLayer.setStyle(StyleService.defaultStyleFunction);
          obstacleLayer.setStyle(StyleService.highlightStyleFunction);
          // change button styling
          var elem = angular.element(this);
          elem.toggleClass('button-assertive');
          
          var interactions = map.getInteractions();
          interactions.pop();
          map.addInteraction(drawObstacle);
        };

        /* Left controller buttons */ 
        var top_button_options = {
          buttonText:   'Mount', 
          topButton:    true,
          bottomButton: false, 
          callback:     handleMountButton, 
          target:       mountdrawbutton,
          // map: map,
        };
        
        var bottom_button_options = {
          buttonText:   'Obstruction', 
          topButton:    false,
          bottomButton: true, 
          callback:     handleObstacleButton,
          target:       obstructionbutton,
          // map: map,
        };

        var mountbutton = new DrawControlButton(top_button_options);
        var obstaclebutton = new DrawControlButton(bottom_button_options);

        var selectedOverlay = OlService.selectedOverlay;
        MapService.addOverlay(selectedOverlay);

        /* Interactions */
        var select = new ol.interaction.Select({
          features: mounts.getFeatures(),
          condition: ol.events.condition.targetNotEditable,
          styleFunction: StyleService.highlightStyleFunction,
        });
        map.addInteraction(select);


        var modify = new ol.interaction.Modify({
          features: select.getFeatures(),
          style: StyleService.highlightStyleFunction,
        });

        map.addInteraction(modify);
        // // TODO: directive
        var drawMount = new ol.interaction.Draw({
          // features: mounts.getFeatures(),
          source: mounts,
          snapTolerance: 25,
          type: 'Polygon', 
          geometryName: 'mount',
          style: StyleService.defaultStyleFunction,
        });

        var drawObstacle = new ol.interaction.Draw({
          // features: mounts.getFeatures(),
          source: mounts,
          // snapTolerance: 25,
          type: 'Point',
          geometryName: 'obstruction',
          style: StyleService.defaultStyleFunction,
        });

        map.addInteraction(drawMount);

        var gutterLineFinder = OlService.gutterLineFinder;
        drawMount.on('drawend', gutterLineFinder);

      }

    },
    // template: [     ].join('')
  };

}
directives.directive('edlOlMap', edlOlMap);
