function StyleService_ ($q) {
  // this factory provides styles, etc for edlOlMap features
  // 

  var StyleService = {};

  StyleService.defaultStyleFunction = (function() {
    /* jshint -W069 */

    var styles = {};

    styles['mount'] = [new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 0.4)'
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
            })];

    styles['gutter'] =  [new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'green'
              }),
              stroke: new ol.style.Stroke({
                color: 'black',
                width: 20
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: '#ffcc33'
                })
              })
            })];
    
    styles['geometry'] =  [new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'pink'
              }),
              stroke: new ol.style.Stroke({
                color: 'white',
                width: 20
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: 'blue'
                })
              })
            })];
    // obstruction style
    styles['obstruction'] = [new ol.style.Style({
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: '#ffcc33'
                })
              })
            })];


    return function(feature, resolution) {

      return styles[feature.getGeometryName()];
    };
    /* jshint +W069 */
  })();

  StyleService.highlightStyleFunction = (function() {
    /* jshint -W069 */
    
    var styles = {};
    styles['mount'] = [new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 0.4)'
              }),
              stroke: new ol.style.Stroke({
                color: 'pink',
                width: 5
              }),
            
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: '#ffcc33'
                })
              })
            })];

    styles['gutter'] =  [new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'white'
              }),
              stroke: new ol.style.Stroke({
                color: 'black',
                width: 20
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: '#ffcc33'
                })
              })
            })];
    
    styles['geometry'] =  [new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'pink'
              }),
              stroke: new ol.style.Stroke({
                color: 'white',
                width: 20
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: 'blue'
                })
              })
            })];
    // obstruction style
    styles['obstruction'] = [new ol.style.Style({
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: 'orange'
                })
              })
            })];

    /*jshint +W069 */

    return function(feature, resolution) {
      // var featureType = feature.getGeometryName(); 
      return styles[feature.getGeometryName()] ;
    };
  })();

  return StyleService;
}

angular.module('edliter').factory('StyleService', StyleService_);  
