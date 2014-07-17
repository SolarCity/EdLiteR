services.service('PanelService', function($http, $q) {

  var svg          = null;
  var centers      = null;
  var screenSize   = null;
  var panelSize    = null;
  var scale        = 1;

  var testPanels = [[10,10],[50,50],[90,90],[130,130],[170,170],[210,210],[250,250]]

  return {
    testPanels: testPanels,
    svg: function(ele) {
      if (ele !== undefined) {
        svg = ele;
      }
      return svg;
    },

    addOrRemovePanel: function(point) {
      // find nearest center
      // var center = panelCenter(point);
      // // if no panel at center
      // if (!panelHere(center)){
      //   // place a panel at nearest center
      //   panels.push(panelMaker(point))
      // }
    },

    panelTouch: function(e) {
      var point = e.gesture.center; // {pageX: X, pageY: Y}

    },

    pCorners: function(startX, startY, pSize, scale) {
      // corners
      var x0y0, x1y0, x0y0, y1x1;
      // panel size
      var h = pSize.h || 4;
      var w = pSize.w || 3;
      // scale the panel
      h = h*scale;
      w = w*scale;

      // returns a string of x,y corners for the <polygon points=""/>
      // TODO: rotation skewing http://www.w3.org/TR/SVG/coords.html#TransformAttribute
      var corner = function(x,y){
        return ''+x+','+y+' ';
      }

      x0y0 = corner(startX, startY);
      x1y0 = corner(startX+w, startY);
      x0y1 = corner(startX, startY+h);
      x1y1 = corner(startX+w, startY+h);

      return x0y0 + x0y1 + x1y1 + x1y0;
    },

  };
});
