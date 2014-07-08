services.service('MountPlaneService', function() {
  // panels on the plane
  var testPanels = [[10,10],[50,50],[90,90],[130,130],[170,170],[210,210],[250,250]]
  //  var panels = [];

  // coordinate centers for possible panels on the plane
  // takes the form of [[false, true, false], [false, true, true]]. so, centers[col][row] gives you answers
  var centers = [];

  // set centers & return nearest to point
  var panelCenters = function(point) {
    if (centers.length === 0) {
      canvasSize = canvasSize || {w: 1000, h: 1000}
      var centers = [];
      var centerY = point.pageY % pSize.h;
      var centerX = point.pageX % pSize.w;
      // add centerX + n(pSize.h) to centers as rows
      for (var i = 0; i < canvasSize.w/pSize.w ; i++) {
      console.log(centerX, centerY, point, pSize)

      // return a matrix[rowY][colX]
        centers[i] = [];
        for ( var j = 0 ; j < canvasSize.h/pSize.h ; j++) {
          centers[i][j] = [centerY * i, centerX * j, false];
        }
      }

      panelCenterCoords = centers;
    }
    return point;
  };

  return {
    panels:    testPanels,
    centers:   centers,

    drawPlane: function(parent) {

    },
    skew:      function() {
      // body...
    },
    scale:     function(){

    },
  };
});
