function edlOlMap($stateParams, $rootScope, $state, $window, $timeout, MapService, OlService, StyleService, FeatureOptionService) {
  return {
    restrict: "A",
    transclude: false,
    scope: {
      featureDetails:        "=",
      mountCollection:       "=",
      obstructionCollection: "=",
      planRadius:            "=",
      // planIncline:           "=",
      featureType:           "=",
    },
    link: function edlOlMapLink(scope, ele, attrs) {
      /* Leftside controls. See init() for instantiation */
      var controllerbox = angular.element('<div></div>');
      controllerbox.addClass('mapboxcontrols');
      controllerbox.attr('id', 'edl-control-box');
      var mountbutton = angular.element('<button ></button>');
      var obstructionbutton = angular.element('<button ></button>');
      var selectbutton = angular.element('<button >Select</button>');
      var leftsidecontrolbox = new ol.control.Control({element: controllerbox[0]});
      controllerbox.append(mountbutton);
      controllerbox.append(obstructionbutton);
      controllerbox.append(selectbutton);
      
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
      $timeout(timer_init, 1); //HACK: biggest hack evar.
      //  this allows the $window.innerHeight to get set appropriately 
      //  after Angular(ionic?) sets that top banner. so dumb. otherwise 
      // the mouse position is offSet too high on the first click.
      function timer_init() {
      MapService.getStatic()
            .then(init);
      }

      function init (imgUrl) {
        var olMapDiv = ele[0];
        OlService.mapDiv = olMapDiv;

        var gmap = MapService.getGmap();
        var bounds;
        if (gmap) {
          bounds = gmap.getBounds();
          MapService.g.bounds = bounds;
        }

        var pixelProjection = new ol.proj.Projection({
          // code: 'pixelsweknownalove',
          // code: 'EPSG:3857',
          units: 'pixels',
          // global: false,
          extent: OlService.extent
        });
        
        OlService.pixelProjection = pixelProjection;
        var view =  MapService.setOview( 
          new ol.View({
            projection: pixelProjection,
            center: ol.extent.getCenter(pixelProjection.getExtent()),
            zoom: OlService.defaultZoom,
          })
        );
        // the picture we'll display our drawn features on
        var mapCapture = new ol.layer.Image({ //HACK: possible solution for timeout hack 
                                             // is to set this mapCapture inside of the OLService
                                             // instead of in this map. 
          source: new ol.source.ImageStatic({
            url: imgUrl,
            imageSize: [OlService.extent[2], OlService.extent[3]],
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

        // layer for panels
        var panels = OlService.panels;
        var panelLayer = new ol.layer.Vector({
          source: panels, 
          projection: pixelProjection,
          // style:  StyleService.defaultStyleFunction,
        });
        panelLayer.set('name', 'panelLayer');
        OlService.panelLayer = panelLayer;
        
        /* Mount interactions */
        var drawMount = new ol.interaction.Draw({
          source: mounts,
          snapTolerance: 25,
          type: 'Polygon', 
          geometryName: 'mount',
          style: StyleService.defaultStyleFunction,
        });

        /* Obstruction interactions */
        var drawObstruction = new ol.interaction.Draw({
          source: obstructions,
          type: 'Point',
          geometryName: 'obstruction',
          style: StyleService.defaultStyleFunction,
        });
                
        var selectInteraction = new ol.interaction.Select({
          features: [mounts.getFeatures(), obstructions.getFeatures()],
          condition: ol.events.condition.targetNotEditable,
          style: StyleService.highlightStyleFunction,
        });
        OlService.selectInteraction = selectInteraction;

        var modifyInteraction = new ol.interaction.Modify({
          features: selectInteraction.getFeatures(),
          style: StyleService.highlightStyleFunction,
        });

        /* Map Options */
        var mapOptions = {
          layers: [mapCapture, mountLayer, obstructionLayer, panelLayer],
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
          e.preventDefault();

          // change button styling
          mountbutton.addClass('button-assertive');
          obstructionbutton.removeClass('button-assertive');
          selectbutton.removeClass('button-assertive');

          // remove Obstruction interactions
          map.removeInteraction(drawObstruction);
          map.removeInteraction(selectInteraction);
          map.removeInteraction(modifyInteraction);

          // add mount draw interaction
          map.addInteraction(drawMount);

          // notify controllbutton listener to update plan.featureType
          scope.$emit('controlbutton', {featureType: 'mount'});
        };

        var handleObstructionButton = function handleObstructionButton(e) {
          e.preventDefault();
          // change button styling
          obstructionbutton.addClass('button-assertive');
          mountbutton.removeClass('button-assertive');
          selectbutton.removeClass('button-assertive');

          // remove interactions
          map.removeInteraction(drawMount);
          map.removeInteraction(selectInteraction);
          map.removeInteraction(modifyInteraction);

          // add obstruction draw interaction
          map.addInteraction(drawObstruction);

          // notify controllbutton listener to update plan.featureType
          scope.$emit('controlbutton', {featureType: 'obstruction'}); 
        };

        var handleSelectButton = function handleSelectButton (e) {
          e.preventDefault();
          selectbutton.addClass('button-assertive');
          mountbutton.removeClass('button-assertive');
          obstructionbutton.removeClass('button-assertive');

          // remove Draw interactions
          map.removeInteraction(drawMount);
          map.removeInteraction(drawObstruction);

          // add select and modify interactions
          map.addInteraction(selectInteraction);
          map.addInteraction(modifyInteraction);
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
        var select_button_options = {
          buttonText:   'Select', 
          // topButton:    false,
          // bottomButton: true,
          callback:     handleSelectButton,
          target:       selectbutton,
          // map: map,
        };

        var mountDrawbutton       = new DrawControlButton(top_button_options);
        var obstructionDrawbutton = new DrawControlButton(bottom_button_options);
        var selectDrawbutton      = new DrawControlButton(select_button_options);

        var handlechange = function handlechange(c){
          console.log('handlechange', arguments);
        };
        
        // selectInteraction.getFeatures().on('change:length', handlechange);
      
        var gutterLineFinder = OlService.gutterLineFinder;
        drawMount.on('drawend', gutterLineFinder, scope.featureDetails);
        drawMount.on('drawend', function(){
          scope.$emit('controlbutton', {featureType: 'mount'});
        });

        var afterObstruction =  function (event) {
          var feature = event.feature;
          console.log(feature);
          // var redrawOnChangeRadius = function (){
          //   console.log('resetStyleAfterRadius');
          //   this.setStyle(StyleService.defaultStyleFunction);
          // };

          var featureId = obstructions.getFeatures().length;
          console.log('featureId (for removing feature if needed)',featureId);
          OlService.setIdsOfFeaturearray([feature], featureId);
          var radius = scope.planRadius ? scope.planRadius : 10;
          feature.set('radius', radius );
          OlService.setRecent([feature], 'obstruction');
          OlService.currentModify = selectInteraction.getFeatures().push(feature);
          console.log(OlService.currentModify);

          var selected = selectInteraction.getFeatures();
          selected.insertAt(selected.length, feature);

        };

        // initialize buttons
        mountbutton.addClass('button-assertive');

        // initialize interactions
        map.addInteraction(modifyInteraction);
  
        // var afterObstruction = OlService.afterObstruction;
        drawObstruction.on('drawend', afterObstruction);

      }
    },
    // template: [     ].join('')
  };

}
directives.directive('edlOlMap', edlOlMap);
