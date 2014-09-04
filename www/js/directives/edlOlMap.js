function edlOlMap($stateParams, $rootScope, $state, $window, $timeout, MapService, OlService, StyleService, FeatureOptionService) {
  return {
    restrict: "A",
    transclude: false,
    scope: {
      featureDetails:        "=",
      mountCollection:       "=",
      obstructionCollection: "=",
      planRadius:            "=",
    },
    // controller: function edlOlMapCtrl($scope, $element, $attrs) {
    // },
    link: function edlOlMapLink(scope, ele, attrs) {

      /* Leftside controls. See init() for instantiation */
      var controllerbox = angular.element('<div></div>');
      controllerbox.addClass('mapboxcontrols');
      controllerbox.attr('id', 'edl-control-box');
      var mountbutton = angular.element('<button ui-sref="plan.type({id:null, type:\'mount\'})"></button>');
      var obstructionbutton = angular.element('<button ui-sref="plan.type({id:null, type:\'obstruction\'})"></button>');
      var selectbutton = angular.element('<button class="button button-stable">Select</button>');
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
      $timeout(timer_init, 1); //HACK: biggest hack evar. this allows the $window.innerHeight to get set appropriately after Angular(ionic?) sets that top banner. so dumb. otherwise the mouse position is offSet too high on the first click.
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
        var mapCapture = new ol.layer.Image({ //HACK: possible solution for timeout hack is to set this mapCapture inside of the OLService instead of in this map. 
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


        

        // var testFeature = OlService.wkt.readGeometry("POLYGON((159 569,541 576,554 286,193 271,159 569))");
        // console.log(testFeature.getKeys());
        // console.log(obstructionLayer.getSource().addFeature([OlService.wkt.readGeometry("POLYGON((159 569,541 576,554 286,193 271,159 569))")]));
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
          condition: ol.events.condition.click,
          style: StyleService.highlightStyleFunction,
        });

        var modifyObstruction = new ol.interaction.Modify({
          features: selectObstruction.getFeatures(),
          // style: StyleService.highlightStyleFunction,
          style: StyleService.defaultStyleFunction,
        });
        

        // var selectedOverlay = OlService.selectedOverlay;

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
          // overlays: [selectedOverlay],
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

          // remove Obstruction interactions
          map.removeInteraction(drawObstruction);
          map.removeInteraction(selectObstruction);
          map.removeInteraction(modifyObstruction);

          // add Mount interactions
          map.addInteraction(selectMount); //TODO: use filterfunction
          map.addInteraction(modifyMount);
          map.addInteraction(drawMount);
          scope.$emit('controlbutton', {featureType: 'mount'});
        };

        var handleObstructionButton = function handleObstructionButton(e) {
          e.preventDefault();
          // change button styling
          obstructionbutton.addClass('button-assertive');
          mountbutton.removeClass('button-assertive');

          // remove Mount interactions
          map.removeInteraction(drawMount);
          map.removeInteraction(selectMount);
          map.removeInteraction(modifyMount);

          // add Obstruction interactions
          map.addInteraction(selectObstruction); //TODO: use filterfunction
          // map.addInteraction(modifyObstruction);
          map.addInteraction(drawObstruction);
          scope.$emit('controlbutton', {featureType: 'obstruction'}); 
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
          console.log('handlechange', arguments);
        };
        
        selectMount.on('addfeature', handlechange);
        selectObstruction.on('addfeature', handlechange);
      
        // handleMountButton();
        var gutterLineFinder = OlService.gutterLineFinder;
        drawMount.on('drawend', gutterLineFinder, scope.featureDetails);

        var afterObstruction =  function (event) {
          var feature = event.feature;
          console.log(feature);
          // var redrawOnChangeRadius = function (){
          //   console.log('resetStyleAfterRadius');
          //   this.setStyle(StyleService.defaultStyleFunction);
          // };

          var featureId = obstructions.getFeatures().length;
          console.log(featureId);
          OlService.setIdsOfFeaturearray([feature], featureId);
          console.log(scope.planRadius);
          var radius = scope.planRadius ? scope.planRadius : 10;
          feature.set('radius', radius );
          console.log(feature.get('radius'));
          OlService.setRecent([feature], 'obstruction');
          OlService.currentModify = selectObstruction.getFeatures().getArray()
          console.log(OlService.currentModify);

        };

        // initialize buttons
        mountbutton.addClass('button-assertive');

        // initialize interactions
        map.addInteraction(selectMount); //TODO: use filterfunction
        map.addInteraction(modifyMount);
        map.addInteraction(drawMount);


        // var afterObstruction = OlService.afterObstruction;
        drawObstruction.on('drawend', afterObstruction);

      }
    },
    // template: [     ].join('')
  };

}
directives.directive('edlOlMap', edlOlMap);
