directives.directive('edlButtons', [ '$ionicGesture', 'd3', 'PanelService', 'MountPlaneService', 'panelOpts', function( ionicGesture, d3, ps, mp, panel) {
  return {
    restrict: "EA",
    transclude: true,
    link: function (scope, ele, attrs, edlMount) {
      // get the <svg> from PanelService
      var azm = 0, slope = 0, orientation = "portrait";
       console.log('yo1');

      // console.log('panelOptions',panel);
      scope.addMP = function() {
        console.log('yo');
        var location = location;
        var rowCount, rowLength;

        var dimensions = scope.tellCorners();
        var orientation = "portrait";
        rowLength = Math.floor( dimensions.l / panel.panelLength );
        rowCount  = Math.floor( dimensions.h / panel.panelHeight );
        var corner    = {
          lat: scope.topCorner.pageY,
          lon: scope.bottomCorner.pageX
        };
        // console.log('yo before push');

        scope.pushToMountPlane(rowCount, rowLength, azm, slope, orientation, corner);

        // console.log('yo after push');

        // console.log('dimensions, ',dimensions, 'mountplanes,', scope.mountPlanes);
      };

      // scope.addRow = function(mp) {
      //   mp.addRow();
      // };

      // scope.addCol = function(mp) {
      //   mp.addRow();
      // };

      scope.export = function() {
        console.log(scope.mountPlanes);
      };

      scope.adjustIncline = function(num) {
        scope.currentSelected.adjustIncline(num);
        ionic.trigger('incline', {target: scope.currentSelected});
      };

      scope.tellCorners = function() {
        var height = scope.bottomCorner.pageY - scope.topCorner.pageY;
        var length = scope.topCorner.pageX - scope.bottomCorner.pageX;

        var result = {
          h: height,
          l: length
        };
        // console.log(result);

        return result;
      };

    },

    template: ['<div>',
                '<div class="edl buttons" style=" float: right; width: 10%; padding-top: 44px" >',
                '<button class="button button-full button-positive" ng-click="addMP()"                       >add MP</button>',
                // '<button class="button button-full button-positive" ng-click="addRow(selectedId)"            >add row</button>',
                // '<button class="button button-full button-positive" ng-click="addCol(selectedId)"            >add col</button>',
                // '<button class="button button-full button-positive" ng-click="rotate()" on-drag="rotate()"   >rotate</button>',
                '<button class="button button-full button-positive" ng-click="adjustIncline(10)"             >inc+</button>',
                '<button class="button button-full button-positive" ng-click="adjustIncline(-10)"            >inc-</button>',
                '<button class="button button-full button-positive" ng-click="export()" on-drag="onDrag()"   >export</button>',
                '<button class="button button-full button-positive" ng-click="tellCorners()"                 >corners</button>',
                '</div>',
              '</div>'].join('')
  };
}]);
