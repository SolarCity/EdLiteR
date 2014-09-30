function edlOlMap($stateParams, $rootScope, $state, $window, $timeout, ApiService, PanelFillService, MapService, OlService, StyleService, FeatureOptionService) {
  return {
    restrict: "A",
    transclude: false,
    scope: {
      toggleRightMenu:       "=",
      handlePreviewButton:   "=",
      radius:                "=",
      pitch:                 "=",
      previewPanels:         "=",
      focusedFeature:        "=", //NOTE: this gives us the selected feature throughout the app :)
    },
    link: function edlOlMapLink(scope, ele, attrs) {
      var Ol = OlService;


      /* button controls. See init() for instantiation */
      var controllerbox = angular.element('<div></div>');
      var leftsidecontrolbox = new ol.control.Control({element: controllerbox[0]});
      controllerbox.addClass('buttoncontrols bar row');
      controllerbox.attr('id', 'edl-control-box');

      function controlButton(svgSourceFile, disableable){
        var disableclass = disableable ? 'ng-class="{disabled: !plan.focus}"' : ' ';
        return angular.element([
            '<object class="button button-icon icon col edl-button" ' + disableclass,
              ' type="image/svg+xml" data="img/' + svgSourceFile + '"> ',
            '</object>',
          ].join('')
        );
      }

      var selectbutton      = controlButton('select.svg',  false);
      var drawbutton        = controlButton('draw.svg',    false);
      var obstructionbutton = controlButton('obstcal.svg', false);
      var deletebutton      = controlButton('trash.svg',   true);
      var togglebutton      = controlButton('propoty.svg', true);
      var previewbutton        = $('#edl-preview-button');

      var buttons = [selectbutton, drawbutton, obstructionbutton, deletebutton, togglebutton];
      var conditional_buttons = [ togglebutton, deletebutton];

      angular.forEach(buttons, function(val){
        controllerbox.append(val);
      });
      angular.forEach(conditional_buttons, function(b){
        b.addClass('disabled');
      });

      var styleThisButton = function styleThisButton (selected) {
        if (selected !== previewbutton) {
          Ol.setPreviewMode(false);
        } else {
          Ol.setPreviewMode(!OlService._previewing);
        }
        angular.forEach(buttons, function(b){
          b.removeClass('button-assertive');
        });
        // if (selected) selected.addClass('button-assertive');
        if (selected) selected.addClass('edl-button-assertive');
      };

      var DrawControlButton = function DrawControlButton(opt_options){
        var options = opt_options || {};
        var map = options.map;
        var anchor = options.target;
        anchor.addClass('edl-control-button');
        // anchor.addClass('button button-stable edl-control-button');
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
        /* pay attention to when there are panels present so the preview button can be styled: 
            this gives us scope.previewPanels -> plan.previewPanels
            there's an ng-class on the previewbutton looking for plan.previewPanels
        */
        Ol.panels.on('change', function panels(event) {
          var features = event.target.getFeatures();
          scope.previewPanels = features;
        });

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
          var removeAll = [drawMount, drawObstruction, selectInteraction, modifyInteraction];
          if (Ol._previewing) {
            OlService.setPreviewMode(false);
            previewbutton.removeClass('button-assertive');
            handleSelectButton();
          } else {
            styleThisButton(previewbutton);
            OlService.setPreviewMode(true);
            addAndRemoveInteractions([], removeAll);
          }
        };
        scope.handlePreviewButton = handlePreviewButton;

        /* controller button options */
        var button_options = {
          mount_button: {
            callback:     handleMountButton,
            target:       drawbutton,
          },
          obstruction_button: {
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
        };

        ionic.on('tapstart', handlePreviewButton, previewbutton[0]);

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
          angular.forEach(conditional_buttons, function(b){
            if (scope.focusedFeature) {
              b.removeClass('disabled');
            } else {
              b.removeClass('disabled');
            }
          });
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
