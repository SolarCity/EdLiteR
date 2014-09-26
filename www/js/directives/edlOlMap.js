function edlOlMap($stateParams, $rootScope, $state, $window, $timeout, ApiService, PanelFillService, MapService, OlService, StyleService, FeatureOptionService) {
  return {
    restrict: "A",
    transclude: false,
    scope: {
      toggleRightMenu:       "=",
      radius:                "=",
      pitch:                 "=",
      focusedFeature:        "=", //NOTE: this gives us the selected feature throughout the app :) 
    },
    link: function edlOlMapLink(scope, ele, attrs) {
      /* button controls. See init() for instantiation */
      var Ol = OlService;


      var controllerbox = angular.element('<div></div>');
      var leftsidecontrolbox = new ol.control.Control({element: controllerbox[0]});
      controllerbox.addClass('buttoncontrols');
      controllerbox.attr('id', 'edl-control-box');

      var selectbutton = angular.element('<i><object type="image/svg+xml" data="img/select.svg"></object></i>');
      var drawbutton = angular.element('<i><object type="image/svg+xml" data="img/draw.svg"></object></i>');
      var obstructionbutton = angular.element('<i><object type="image/svg+xml" data="img/obstcal.svg"></object></i>');
      var deletebutton = angular.element('<i><object type="image/svg+xml" data="img/trash.svg"></object></i>');
      var togglebutton = angular.element('<i><object type="image/svg+xml" data="img/propoty.svg"></object></i>');
      var previewbutton = angular.element('<i><object type="image/svg+xml" data="img/preview.svg"></object></i>');

      var buttons = [drawbutton, selectbutton, obstructionbutton, deletebutton, togglebutton, previewbutton];

      buttons.forEach(function(val){
        controllerbox.append(val);
      });

      var styleThisButton = function styleThisButton (selected) {
        Ol.setPreviewMode(false);

        angular.forEach(buttons, function(b){
          b.removeClass('button-assertive');
        });
        if (selected) selected.addClass('button-assertive');
      };
      
      /*
       *  ControllButton constructor
       *  options look like this: 
       *  {
       *    buttonText: {string}, 
       *    callback: {function}, 
       *    target:   {should be your map?}, 
       *  } 
       */  

      var DrawControlButton = function DrawControlButton(opt_options){
        var options = opt_options || {};

        var map = options.map;
        var anchor = options.target;
        anchor.addClass('button button-stable edl-control-button');
        // anchor.addClass('button button-stable');
        if (options.buttonText) anchor.text(options.buttonText);

        ionic.on('tap', options.callback, anchor[0]);
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

        // layer for gutters
        var gutters = Ol.gutters;
        var gutterLayer = new ol.layer.Vector({
          source: gutters,
          projection: pixelProjection,
          style:  StyleService.defaultStyleFunction,
        });
        gutterLayer.set('name', 'gutterLayer');

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
          layers: new ol.Collection([mountLayer, obstructionLayer, gutterLayer])
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
          layers: [obstructionLayer, mountLayer],
          style: StyleService.highlightStyleFunction,
        });
        Ol.selectInteraction = selectInteraction;

        var modifyInteraction = new ol.interaction.Modify({
          features: selectInteraction.getFeatures(),
          style: StyleService.highlightStyleFunction,
        });
        Ol.modifyInteraction = modifyInteraction;

          /* Map Options */
        var mapOptions = {
            layers: [mapCapture, mountLayer, obstructionLayer, panelLayer, gutterLayer],
            controls: ol.control.defaults({
                zoom:false,
              attributionOptions: ({
                  collapsible: false,
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
        function addAndRemoveInteractions(arrayToAdd, arrayToRemove){
          selectInteraction.getFeatures().clear();
          angular.forEach(arrayToRemove, function (interaction) {
            map.removeInteraction(interaction);
          });
          angular.forEach(arrayToAdd, function (interaction){
            map.addInteraction(interaction);
          });
        }

        var handleMountButton = function handleMountButton(e){
          if (e) {
            e.preventDefault();
          }
          styleThisButton(drawbutton);

          var removeUs = [drawObstruction, modifyInteraction];
          var addUs    = [drawMount, selectInteraction];
          addAndRemoveInteractions(addUs, removeUs, map);
        };

        var handleObstructionButton = function handleObstructionButton(e) {
          if (e) {
            e.preventDefault();
          }
          styleThisButton(obstructionbutton);

          var removeUs = [drawMount, selectInteraction, modifyInteraction];
          var addUs    = [drawObstruction, selectInteraction];
          addAndRemoveInteractions(addUs, removeUs, map);
        };

        var handleSelectButton = function handleSelectButton (e) {
          if (e) {
            e.preventDefault();
          }
          styleThisButton(selectbutton);
          var removeUs = [drawMount, drawObstruction, selectInteraction, modifyInteraction];
          var addUs    = [selectInteraction, modifyInteraction];
          addAndRemoveInteractions(addUs, removeUs, map);
        };

        var handleDeleteButton = function handleDeleteButton(e) {
            if (e) {
                e.preventDefault();
            }

            var layer;
            var feature = Ol.getSelectedFeature()[0];

            if (!!feature && feature.getGeometryName() === 'mount') {
                layer = Ol.layers.mount;
                Ol.removeFeatureById(feature.getId(), layer);
                layer = Ol.layers.panel;
                Ol.removeFeatureById(feature.getId(), layer);
                layer = Ol.layers.gutter;
                Ol.removeFeatureById(feature.getId(), layer);
            } else if (!!feature && feature.getGeometryName() === 'panel') {
                layer = Ol.layers[feature.getGeometryName()];
                layer.removeFeature(feature);
            }
            else if (!!feature && feature.getGeometryName() === 'obstruction') {
                layer = Ol.layers[feature.getGeometryName()];
                layer.removeFeature(feature);
            }

            if (Ol.selectInteraction.getFeatures().getArray().length !== 0) {
              Ol.selectInteraction.getFeatures().clear(); //HACK: eliminate residual touch/mouse points
            }
            handleSelectButton();
        };
        
        var handleToggleButton = function handleToggleButton (e) {
          if (e) {
            e.preventDefault();
          }
          // get selected feature
          var feature = Ol.getSelectedFeature()[0];
          // toggle the menu out with that feature
          scope.toggleRightMenu(feature);
        };
        
        var handlePreviewButton = function handlePreviewButton (e) {
          e.preventDefault();
          var removeAll = [drawMount, drawObstruction, selectInteraction, modifyInteraction];
          if (Ol._previewing) {
            OlService.setPreviewMode(false);
            handleSelectButton();
          } else {
            styleThisButton(previewbutton);
            OlService.setPreviewMode(true);
            addAndRemoveInteractions([], removeAll, map);
          }
        };

        /* controller button options */
        var button_options = {
          top_button: {
            callback:     handleMountButton,
            target:       drawbutton,
          },
          bottom_button: {
            callback:     handleObstructionButton,
            target:       obstructionbutton,
          },
          select_button: {
            callback:     handleSelectButton,
            target:       selectbutton,
          },
          delete_button: {
            callback:     handleDeleteButton,
            target:       deletebutton,
          },
          toggle_button: {
            callback:     handleToggleButton,
            target:       togglebutton,
          },
          preview_button: {
            callback:     handlePreviewButton,
            target:       previewbutton,
          },
        };

        angular.forEach(button_options, function(val, key) {
          new DrawControlButton(val);
        });

        function mountDrawStart(){
          var removeUs = [modifyInteraction, selectInteraction];
          addAndRemoveInteractions([], removeUs, map);
        }
        function mountDrawEnd(event){
          var feature = event.feature;
          var removeUs = [];
          var addUs    = [selectInteraction, modifyInteraction];
          addAndRemoveInteractions(addUs, removeUs, map);
          selectInteraction.getFeatures().push(feature);
          Ol.gutterLineFinder(event);
        }
        drawMount.on('drawend', mountDrawEnd, scope.featureDetails);
        drawMount.on('drawstart', mountDrawStart, scope.featureDetails);

        selectInteraction.getFeatures().on('change:length', function (event) {
          scope.focusedFeature = event.target.getArray()[0];
          scope.$apply(); // apply changed scope features.
        });

        var afterObstruction =  function (event) {
          var feature = event.feature;
          var featureId = obstructions.getFeatures().length;

          feature.setId(featureId);
          
          // set default radius if we don't have one already          
          scope.radius = scope.radius || PanelFillService.obstructionDefaultRadius();

          feature.set('radius', scope.radius);
          feature.set('type', 'obstruction' );

          // clear any selected features, select the feature we just made
          Ol.selectInteraction.getFeatures().clear();
          Ol.selectInteraction.getFeatures().push(feature);
        };
        drawObstruction.on('drawend', afterObstruction);

        handleSelectButton();
      }
    },
  };
}
directives.directive('edlOlMap', edlOlMap);
