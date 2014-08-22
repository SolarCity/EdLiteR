function edlOlMap($state, $window, $timeout, $document, MapService, OlService, StyleService) {
  return {
    restrict: "A",
    transclude: true,
    scope: {
      targetLayer: "=",
    },
    // controller: function edlOlMapCtrl($scope, $element, $attrs) {
    //   console.log('ele ehight', $element[0].clientHeight);

    //   var watcher = function(){return $element[0].clientHeight};
    //   var listern = function(){console.log(arguments)};
    //   $scope.$watch(watcher, listern, true);
    //         alert('Ctrlfunc')
    // },
    link: function edlOlMapLink(scope, ele, attrs) {
      var olMapDiv = ele[0];

      var pixelProjection = new ol.proj.Projection({
        code: 'pixel',
        units: 'pixels',
        global: false,
        extent: [0, 0, $window.innerWidth, olMapDiv.clientHeight ] //HACK: Should be dynamic
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
      var mountbutton = angular.element('<button></button>');
      var obstructionbutton = angular.element('<button></button>');
      var leftsidecontrolbox = new ol.control.Control({element: controllerbox[0]});
      controllerbox.append(mountbutton);
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

        anchor.on('click', options.callback);
        anchor.on('touchstart', options.callback);

        return new ol.control.Control({
          element: anchor[0],
        });
      };
      ol.inherits(DrawControlButton , ol.control.Control);
      
      /* map init! */
      $timeout(timer_init, 1); //HACK: biggest hack evar. this allows the $window.innerHeight to get set appropriately after Angular(ionic?) sets that top banner. so dumb. otherwise the mouse position is offSet too high on the first click.
      function timer_init() {
      MapService.getStatic()
            .then(init);
        
      }
      function init (imgUrl) {
        // the picture we'll display our drawn features on
        var mapCapture = new ol.layer.Image({ //HACK: possible solution for timeout hack is to set this mapCapture inside of the OLService instead of in this map. 
          source: new ol.source.ImageStatic({
            url: imgUrl,
            imageSize: [$window.innerHeight, $window.innerWidth],
            projection: pixelProjection,
            imageExtent: pixelProjection.getExtent()
          }),
        });
        mapCapture.set('name', 'mapCapture');

        // layer for mounts
        var mounts = OlService.mounts;
        var mountLayer = new ol.layer.Vector({
          source: mounts, 
          projection: pixelProjection,
          style:  StyleService.defaultStyleFunction,
        });
        mountLayer.set('name', 'mountLayer');

        // layer for obstructions
        var obstructions = OlService.obstructions;
        var obstructionLayer = new ol.layer.Vector({
          source: obstructions, 
          projection: pixelProjection,
          style:  StyleService.defaultStyleFunction,
        });

        obstructionLayer.set('name', 'obstructionLayer');
        
        /* Mount interactions */
        var drawMount = new ol.interaction.Draw({
          source: mounts,
          snapTolerance: 25,
          type: 'Polygon', 
          geometryName: 'mount',
          style: StyleService.defaultStyleFunction,
        });

        var selectMount = new ol.interaction.Select({
          features: mounts.getFeatures(),
          condition: ol.events.condition.targetNotEditable,
          style: StyleService.highlightStyleFunction,
        });
        
        var modifyMount = new ol.interaction.Modify({
          features: selectMount.getFeatures(),
          style: StyleService.highlightStyleFunction,
        });


        /* Obstruction interactions */
        var drawObstruction = new ol.interaction.Draw({
          source: obstructions,
          type: 'Point',
          geometryName: 'obstruction',
          style: StyleService.defaultStyleFunction,
        });
        
        var selectObstruction = new ol.interaction.Select({
          features: obstructions.getFeatures(),
          condition: ol.events.condition.targetNotEditable,
          style: StyleService.highlightStyleFunction,
        });

        var modifyObstruction = new ol.interaction.Modify({
          features: selectObstruction.getFeatures(),
          style: StyleService.highlightStyleFunction,
        });
        

        // var selectedOverlay = OlService.selectedOverlay;

        /* Map Options */
        var mapOptions = {
          layers: [mapCapture, mountLayer, obstructionLayer],
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
          // overlays: [selectedOverlay],
          target: olMapDiv,
          view: view
        };
      
        var map = MapService.setOmap(mapOptions);
        
        /* left controls callbacks */
        var handleMountButton = function handleMountButton(e){
          // change button styling
          mountbutton.addClass('button-assertive');
          obstructionbutton.removeClass('button-assertive');

          // remove Obstruction interactions
          map.removeInteraction(drawObstruction);
          map.removeInteraction(selectObstruction);
          map.removeInteraction(modifyObstruction);

          // add Mount interactions
          map.addInteraction(selectMount); //TODO: use filterfunction
          map.addInteraction(modifyMount);
          map.addInteraction(drawMount);
        };

        var handleObstructionButton = function handleObstructionButton(e) {
          // change button styling
          obstructionbutton.addClass('button-assertive');
          mountbutton.removeClass('button-assertive');

          // remove Mount interactions
          map.removeInteraction(drawMount);
          map.removeInteraction(selectMount);
          map.removeInteraction(modifyMount);

          // add Obstruction interactions
          map.addInteraction(selectObstruction); //TODO: use filterfunction
          map.addInteraction(modifyObstruction);
          map.addInteraction(drawObstruction);
        };

        /* Left controller buttons */ 
        var top_button_options = {
          buttonText:   'Mount', 
          topButton:    true,
          bottomButton: false, 
          callback:     handleMountButton, 
          target:       mountbutton,
          // map: map,
        };
        
        var bottom_button_options = {
          buttonText:   'Obstruction', 
          topButton:    false,
          bottomButton: true, 
          callback:     handleObstructionButton,
          target:       obstructionbutton,
          // map: map,
        };

        var mountDrawbutton = new DrawControlButton(top_button_options);
        var obstructionDrawbutton = new DrawControlButton(bottom_button_options);
        
        var handlechange = function handlechange(c){

        };
        
        selectMount.on('addfeature', handlechange);
      

        handleMountButton();



        var gutterLineFinder = OlService.gutterLineFinder;
        drawMount.on('drawend', gutterLineFinder);
          pixelProjection.setExtent([0, 0, 1024, 725] );
      

      }
    },
    // template: [     ].join('')
  };

}
directives.directive('edlOlMap', edlOlMap);
