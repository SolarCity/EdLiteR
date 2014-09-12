function edlOlMap($stateParams, $rootScope, $state, $window, $ionicSideMenuDelegate, $timeout, ApiService, PanelFillService, MapService, OlService, StyleService, FeatureOptionService) {
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
      var Ol = OlService;
      var controllerbox = angular.element('<div></div>');
      var leftsidecontrolbox = new ol.control.Control({element: controllerbox[0]});
      controllerbox.addClass('buttoncontrols');
      controllerbox.attr('id', 'edl-control-box');

      var selectbutton      = angular.element('<button id="selectbutton"></button>');
      var drawbutton        = angular.element('<button id="drawbutton" ></button>');
      var obstructionbutton = angular.element('<button id="obstructionbutton" ></button>');
      var deletebutton      = angular.element('<button id="deletebutton" ></button>');
      var fillbutton        = angular.element('<button id="fillbutton" ></button>');
      var previewbutton     = angular.element('<button id="previewbutton" ></button>');
      controllerbox.append(selectbutton);
      controllerbox.append(drawbutton);
      controllerbox.append(obstructionbutton);
      controllerbox.append(deletebutton);
      controllerbox.append(fillbutton);
      controllerbox.append(previewbutton);
      var buttons = [drawbutton, selectbutton, obstructionbutton, deletebutton, fillbutton, previewbutton];
      
      var selectThisButton = function selectThisButton (selected) {
        Ol.setPreviewMode(false);

        buttons.forEach(function(b){
          b.removeClass('button-assertive');
        });
        selected.addClass('button-assertive');
      };
      
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
        Ol.mapDiv = olMapDiv;

        var gmap = MapService.getGmap();
        var bounds;
        if (gmap) {
          bounds = gmap.getBounds();
          MapService.g.bounds = bounds;
        }

        var pixelProjection = new ol.proj.Projection({
          units: 'pixels',
          extent: Ol.extent
        });
        
        Ol.pixelProjection = pixelProjection;
        var view =  MapService.setOview( 
          new ol.View({
            projection: pixelProjection,
            center: ol.extent.getCenter(pixelProjection.getExtent()),
            zoom: Ol.defaultZoom,
          })
        );
        // the picture we'll display our drawn features on
        var mapCapture = new ol.layer.Image({ //HACK: possible solution for timeout hack 
                                             // is to set this mapCapture inside of the OLService
                                             // instead of in this map. 
          source: new ol.source.ImageStatic({
            url: imgUrl,
            imageSize: [Ol.extent[2], Ol.extent[3]],
            projection: pixelProjection,
            imageExtent: pixelProjection.getExtent()
          }),
        });
        mapCapture.set('name', 'mapCapture');

        // layer for mounts
        var mounts = Ol.mounts;
        var mountLayer = new ol.layer.Vector({
          source: mounts, 
          projection: pixelProjection,
          style:  StyleService.defaultStyleFunction,
        });
        mountLayer.set('name', 'mountLayer');

        // layer for obstructions
        var obstructions = Ol.obstructions;
        var obstructionLayer = new ol.layer.Vector({
          source: obstructions, 
          projection: pixelProjection,
          style:  StyleService.defaultStyleFunction,
        });
        obstructionLayer.set('name', 'obstructionLayer');

        // layer for panels
        var panels = Ol.panels;
        var panelLayer = new ol.layer.Vector({
          source: panels, 
          projection: pixelProjection,
          style:  StyleService.defaultStyleFunction,
          opacity: 0.6,
        });
        panelLayer.set('name', 'panelLayer');
        Ol.panelLayer = panelLayer;
        
        Ol.hideLayers = new ol.layer.Group({
          layers: new ol.Collection([mountLayer, obstructionLayer])
        });

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
          style: StyleService.highlightStyleFunction,
        });
        Ol.selectInteraction = selectInteraction;

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
        var handleDrawButton = function handleDrawButton(e){
          if (e) {
            e.preventDefault();
            
          }
          // change button styling
          selectThisButton(drawbutton);

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
          if (e) {
            e.preventDefault();
          }
          // change button styling
          selectThisButton(obstructionbutton);

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
          if (e) {
            e.preventDefault();
          }
          selectThisButton(selectbutton);

          // remove Draw interactions
          map.removeInteraction(drawMount);
          map.removeInteraction(drawObstruction);

          // add select and modify interactions
          map.addInteraction(selectInteraction);
          map.addInteraction(modifyInteraction);

        };        
        var handleDeleteButton = function handleDeleteButton (e) {
          if (e) {
            e.preventDefault();

          }
          var layer;
          var feature = Ol.getSelectedFeature().pop();
          if (!!feature && feature.getGeometryName() === 'mount') {
            layer = Ol.layers.mount;
            Ol.removeFeatureById(feature.getId(), layer);
            layer = Ol.layers.panel;
            Ol.removeFeatureById(feature.getId(), layer);
          } else if (!!feature) {
            layer = Ol.layers[feature.getGeometryName()];
            Ol.removeFeatureById(feature.getId(), layer);
          }
          
          // this may help solve the problem of latent objects 
          Ol.modifyInteraction.getFeatures().clear();
          Ol.selectInteraction.getFeatures().clear();

        };

        var handleFillButton = function handleFillButton (e) {
          if (e) {
            e.preventDefault();
            
          }
          // get selected feature
          var feature = Ol.getSelectedFeature()[0];
            // if selected feature has panels, delete them
          var id = feature.getId();
          var panellayer = Ol.layers.panel;
          var existing = panellayer.getFeatureById(id);
          if (existing) {
            Ol.removeFeatureById(id, panellayer);
          }
          var msg = Ol.fillMessageForSingleMount(feature);
          // create api message with Process Features
          var api = PanelFillService.processFeatures(msg.m, msg.o);

          ApiService.uploadMounts(api) //TODO: change from sample
            .then(function(data){
              PanelFillService.addPanelsFromApi(data, id);              
          });
        };
        
        var handlePreviewButton = function handlePreviewButton (e) {
          e.preventDefault();
          // change button styling
          selectThisButton(previewbutton);
          OlService.setPreviewMode(true);

        };
          
        /* Map controller button options */ 
        var top_button_options = {
          buttonText:   'Draw', 
          callback:     handleDrawButton,
          target:       drawbutton,
        };
        
        var bottom_button_options = {
          buttonText:   'Obstruction', 
          callback:     handleObstructionButton,
          target:       obstructionbutton,
        };
        var select_button_options = {
          buttonText:   'Select', 
          callback:     handleSelectButton,
          target:       selectbutton,
        };        

        var delete_button_options = {
          buttonText:   'Delete', 
          callback:     handleDeleteButton,
          target:       deletebutton,
        };
        
        var fill_button_options = {
          buttonText:   'Fill Selected',
          callback:     handleFillButton,
          target:       fillbutton,
        };
        var preview_button_options = {
          buttonText:   'Preview',
          callback:     handlePreviewButton,
          target:       previewbutton,
        };

        var OLmountDrawbutton       = new DrawControlButton(top_button_options);
        var OLobstructionDrawbutton = new DrawControlButton(bottom_button_options);
        var OLselectButton          = new DrawControlButton(select_button_options);
        var OLdeleteButton          = new DrawControlButton(delete_button_options);
        var OLfillButton            = new DrawControlButton(fill_button_options);
        var OLpreviewButton         = new DrawControlButton(preview_button_options);

        var gutterLineFinder = Ol.gutterLineFinder;
        drawMount.on('drawend', gutterLineFinder, scope.featureDetails);
        drawMount.on('drawend', function(){
          scope.$emit('controlbutton', {featureType: 'mount'});
        });

        var afterObstruction =  function (event) {
          var feature = event.feature;
          var featureId = obstructions.getFeatures().length;
          
          Ol.setIdsOfFeaturearray([feature], featureId);


          var radius = scope.planRadius ? scope.planRadius : 50;
          feature.set('radius', radius );
          feature.set('type', 'obstruction' );

          Ol.selectInteraction.getFeatures().push(feature); 
          handleSelectButton();
          // $ionicSideMenuDelegate.toggleRight();
        };
        drawObstruction.on('drawend', afterObstruction);

        // initialize buttons
        selectbutton.addClass('button-assertive');

        // initialize interactions
        map.addInteraction(modifyInteraction);
      }
    },
    // template: [     ].join('')
  };

}
directives.directive('edlOlMap', edlOlMap);
