function StyleService_ ($q) {
  // this factory is a singleton & provides layers, styles, etc for the edl-ol-map ... 
  // 

  var StyleService = {};

  StyleService.defaultStyleFunction = function(feature, resolution) {
    console.log('defaultStyleFunction');
    var featureType = feature.getGeometryName(); //TODO: set geometry name, use that instead of geometry type
    styles = {};
    /*jshint -W069 */
    // mount plane
    styles['mount'] = [ mountPolyStyle ];

    styles['gutter'] = [ gutterLineStyle ];

    styles['obstruction'] = [ obstructionStyle ]; 
    /*jshint +W069 */
    console.log(featureType)
    return styles[featureType];
  };

  StyleService.highlightStyleFunction = function(feature, resolution) {
    console.log('highlightStyleFunction')
    var featureType = feature.getGeometryName(); //TODO: set geometry name, use that instead of geometry type
    styles = {};
    /*jshint -W069 */
    // mount plane
    styles['mount'] = [ selectedMountPolyStyle ];

    styles['gutter'] = [ selectedGutterLineStyle ];

    styles['obstruction'] = [ selectedObstructionStyle ]; 
    /*jshint +W069 */

    return styles[featureType];
  };

  var mountPolyStyle =  new ol.style.Style({
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
      });

  var gutterLineStyle = new ol.style.Style({
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
    });

  // obstruction style
  var obstructionStyle = new ol.style.Circle({
      radius: 10,
      fill: null,
      stroke: new ol.style.Stroke({color: 'orange', width: 10})
    });

  // highlighted 
  var selectedMountPolyStyle = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'orange'
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
    });

  var selectedGutterLineStyle = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.8)'
      }),
      stroke: new ol.style.Stroke({
        color: 'green',
        width: 5
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    });

  var selectedObstructionStyle = new ol.style.Circle({
      radius: 10,
      fill: null,
      stroke: new ol.style.Stroke({color: 'red', width: 10})
    });

  return StyleService;
}

angular.module('edliter').factory('StyleService', StyleService_);  
