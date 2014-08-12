function OlService_ ($q) {
  // this factory is a singleton & provides layers, styles, etc for the edl-ol-map ... 
  // 

  var OlService = {};

  // TODO: give styles for the type of thing selected... (maybe)
  // var selectedStyleFunction = function function_name (argument) {
    
  // };
  
  OlService.mountPlaneSource = new ol.source.Vector({
    features: []
  });

  // create image source from canvas elements from vector source
  OlService.mountPlaneImage = new ol.source.ImageVector({
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'green'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffff33',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    }), 
    source: OlService.mountPlaneSource
  });

  // add a feature to the testing layer. 

  // mounting plane layer
  OlService.mountPlaneOverlay = new ol.FeatureOverlay({
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.8)'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    })
  });
  

  
  // obstruction layer
  OlService.obstructionOverlay = new ol.FeatureOverlay({
    style: new ol.style.Circle({
      radius: 10,
      fill: null,
      stroke: new ol.style.Stroke({color: 'orange', width: 2})
    }
  )});

  // gutterlayer (to be changed later)
  OlService.gutterOverlay = new ol.FeatureOverlay({
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.8)'
      }),
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 5
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    })
  });

  return OlService;
}

angular.module('edliter').factory('OlService', OlService_);  
