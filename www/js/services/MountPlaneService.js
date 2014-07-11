services.service('MountPlaneService', function() {
  // this service contains the functions needed to construct planes for the directive

  return {
    FakeMount: function(touchpoint) {
      return {
        corner: touchpoint ? {lat: touchpoint.y, lon: touchpoint.x} : {lat: 10, lon: 10}, // TODO: this should be a latitude longitude point on the map
        planeId: 1,
        azm: 0,
        skew: 0,
        slope: 0,
        panelRows: RowsConstructor(3, 4, null),
        orientation: null,
        length: null,
        height: null
      }
    },
    MountingPlane: function (rowCount, rowLength, azm, slope, orientation, corner) {
      if (orientation !== "landscape" || "horizontal" ) {
        console.log('orientation not set, default to landscape');
        orientation = "landscape"
      };

      var newPlane = {
        planeId: null, // TODO: set this value by Add MP Button
        skewX: 0,
        skewY: 0,
        corner: corner,
        azm: azm || null,
        position: null, // TODO: set this value by Directive
        slope: slope || null,
        panelRows: RowsConstructor(rowCount, rowLength, orientation),
        orientation: orientation,
        length: null,
        height: null,
      }
      console.log(newPlane)
      return newPlane
    },
  };
});

var RowsConstructor = function(rowCount, panelsPerRow, orientation){
  console.log('rowsconstructor')
  var halfstep = false; // TODO: needs implementation to support halfsteps
  var rows = [];
  var panelOpts = {xSize: 50, ySize: 100, orientation: 'portrait'};

  var RowOfPanels = function (panelCount, halfstep, panelOpts) {
    if (typeof panelOpts !== "object"){
      panel = {};
      panel.xSize = 30;
      panel.ySize = 40;
      panel.orientation = 'landscape';
    };

    halfstep = halfstep ? halfstep : false; //TODO: wtf how do we halfstep

    var panels = [];
    for (var i = 0; i < panelCount; i++) {
      panels.push( PanelConstructor(panelOpts,  i));
    }

    return {
      rowId: null,
      halfstep: halfstep,
      panels: panels
    }
  };

  for (var i = 0; i < rowCount; i++) {
    rows[i] = RowOfPanels(panelsPerRow, halfstep, panelOpts);
    rows[i].rowId = i;

  };

  return rows
};


var PanelConstructor = function(panelOpts, id) {
  var x = panelOpts.xSize, y = panelOpts.ySize, orient = panelOpts.orientation;
  return {
    panelId: id,
    orientation: orient,
    size: {
      h: x,
      w: y
    },
  }
};
