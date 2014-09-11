function StyleService_ ($q) {
  // this factory provides styles, etc for edlOlMap features
  // 

  var colors = {};
  var c = colors;

  c.greenALandingGradieance = "rgba(30, 173, 83, 1)";
  c.greenBLandingGradieance = "rgba(33, 168, 109, 1)";
  c.yellowR                 = "rgba(253, 192, 97, 1)";
  c.orangeBorder            = "rgba(255, 150, 0, 1)";
  c.orangeFill              = "rgba(255, 150, 0, 0.3)";
  c.orangeGutter            = "rgba(255, 78, 24, 1)";
  c.greenBorder             = "rgba(30, 173, 83, 1)";
  c.greenGutter             = "rgba(21, 122, 59, 1)";
  c.greenFill               = "rgba(30, 173, 83, 0.3)";
  c.highlightBGlightGreen   = "rgba(235, 246, 238, 1)";
  c.grey_btns               = "rgba(131, 131, 131, 1)";
  c.panelBorderHighlight    = "rgba(223, 215, 191, 0.8)";
  c.panelFillHighlight      = "rgba(41, 49, 69, 0.4)";
  c.panelBorder             = "rgba(0,  66, 99, 1)";
  c.panelFill               = "rgba(33, 22, 45, 1)";

  var StyleService = {};
  StyleService.colors = c;
  StyleService.defaultStyleFunction = (function() {
    /* jshint -W069 */
    var styles = {};

    styles['mount'] = [new ol.style.Style({
              fill: new ol.style.Fill({
                color: c.greenFill,
              }),
              stroke: new ol.style.Stroke({
                color: c.greenBorder,
                width: 5
              }),
            
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: c.greenBorder
                })
              })
            })];

    styles['gutter'] =  [new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: c.greenGutter,
                width: 5
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: c.greenGutter
                })
              })
            })];
    
    styles['geometry'] =  [new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'pink'
              }),
              stroke: new ol.style.Stroke({
                color: 'red',
                width: 12
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: 'blue'
                })
              })
            })];

    styles['panel'] =  [new ol.style.Style({
        fill: new ol.style.Fill({
          color: c.panelFill,
        }),
        stroke: new ol.style.Stroke({
          color: c.panelBorder,
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: c.orangeBorder,
          })
        })
      })];

    // create a separate style function for obstructions because they need to update on the fly: 
    styles['obstruction'] = function(rad, res) {
      return [new ol.style.Style({
              image: new ol.style.Circle({
                radius: rad / (res*4.5) ,
                fill: new ol.style.Fill({
                  color: c.greenGutter
                })
              })
            })];
      };

    return function(feature, resolution) {
      var radius = feature.get('radius');
      if (radius) {
        return styles[feature.getGeometryName()](radius.radius, resolution);
      }
      return styles[feature.getGeometryName()];
    };
    /* jshint +W069 */
  })();

  StyleService.highlightStyleFunction = (function() {
    /* jshint -W069 */
    var styles = {};
    styles['mount'] = [new ol.style.Style({
              fill: new ol.style.Fill({
                color: c.orangeFill,
              }),
              stroke: new ol.style.Stroke({
                color: c.orangeBorder,
                width: 5
              }),
            
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: c.orangeBorder,
                })
              })
            })];

    styles['gutter'] =  [new ol.style.Style({
              // fill: new ol.style.Fill({
              //   color: c.orangeFill
              // }),
              stroke: new ol.style.Stroke({
                color: c.orangeGutter,
                width: 5
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: c.orangeGutter
                })
              })
            })];
    
    styles['geometry'] =  [new ol.style.Style({
              fill: new ol.style.Fill({
                color: c.orangeFill,
              }),
              stroke: new ol.style.Stroke({
                color: c.orangeBorder,
                width: 5
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: c.orangeBorder,
                })
              })
            })];

    styles['panel'] =  [new ol.style.Style({
            fill: new ol.style.Fill({
              color: c.panelFillHighlight,
            }),
            stroke: new ol.style.Stroke({
              color: c.panelBorderHighlight,
              width: 2
            }),
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: c.orangeBorder,
              })
            })
          })];
  // obstruction style
    styles['obstruction'] = function(rad, res) {
      return [new ol.style.Style({
              image: new ol.style.Circle({
                radius: rad / (res*4.5) ,
                fill: new ol.style.Fill({
                  color: c.orangeGutter
                })
              })
            })];
      };

    /*jshint +W069 */

    return function(feature, resolution) {
      var radius = feature.get('radius');
      if (radius) {
        return styles[feature.getGeometryName()](radius.radius, resolution);
      }
      return styles[feature.getGeometryName()];
    };
  })();

  return StyleService;
}

angular.module('edliter').factory('StyleService', StyleService_);  
