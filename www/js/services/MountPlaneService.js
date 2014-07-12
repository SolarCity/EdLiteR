services.service('MountPlaneService', [ 'panelOpts', function(panel) {
  // this service contains the functions needed to construct planes for the directive
  return {
    // FakeMount: function(touchpoint) {
    //   return {
    //     corner: touchpoint ? {lat: touchpoint.y, lon: touchpoint.x} : {lat: 10, lon: 10}, // TODO: this should be a latitude longitude point on the map
    //     planeId: 1,
    //     azm: 0,
    //     skew: 0,
    //     slope: 0,
    //     panelRows: RowsConstructor(3, 4, null),
    //     orientation: null,
    //     length: null,
    //     height: null
    //   }
    // },
    MountingPlane: function (rowCount, rowLength, azm, slope, orientation, corner) {
      if (orientation !== "landscape" && orientation !== "horizontal" ) {
        console.log(orientation)
        console.log('orientation not set, default to landscape');
        orientation = "landscape"
      };

      console.log(arguments);

      var newPlane = {
        planeId: null, // TODO: set this value by Add MP Button
        skewX: 0,
        skewY: 0,
        corner: corner,
        azm: azm || null,
        position: null, // TODO: set this value by Directive
        slope: slope || null,
        panelRows: RowsConstructor(rowCount, rowLength, orientation, panel),
        orientation: orientation,
        length: rowLength,
        height: rowCount,
        addRow: function() {
          // TODO: recreate Plane w/ +1 rows added to the bottom probably...
          this.panelRows.push(RowsConstructor(1, this.length, this.orientation, panel))
        },
        addColumn: function() {
          // TODO: recreate Plane w/ +1 columns
        }

      }
      console.log('this is the generated plane: ', newPlane, 'this is the plane\'s location', newPlane.corner);
      return newPlane
    },
  };
}]);

var RowsConstructor = function(rowCount, panelsPerRow, orientation, panelOpts){
  var halfstep = false; // TODO: needs implementation to support halfsteps
  var rows = [];
  panelOpts = panelOpts || {panelHeight: 50, panelLength: 100, orientation: 'landscape'};

  var RowOfPanels = function (panelCount, halfstep, panelOpts) {
    if (typeof panelOpts !== "object"){
      console.log('panelOpts not defined... this is a problem...');
      panel = {};
      panel.panelLength = 70;
      panel.panelHeight = 40;
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
  var x = panelOpts.panelLength, y = panelOpts.panelHeight, orient = panelOpts.orientation;
  return {
    panelId: id,
    orientation: orient,
    size: {
      h: y,
      w: x
    },
  }
};
