directives.directive('edlMount', [ '$ionicGesture', 'd3', 'MountPlaneService', 'PanelService', function(ionicGesture, d3, mp, ps) {
  return {
    restrict: "EAC",
    scope: {
      plane: '=',
    },
    transclude: true,
    controller: function ($scope, $element, $attrs) {
      var plane    = $scope.plane;
      // this.planeId = plane.mountId;

      // this.orientation     = plane.orientation;
      // this.azm             = plane.azm;
      // this.slope           = plane.slope;
      // this.cornerPosition  = plane.corner;
      // this.panelRows       = plane.panelRows;

      this.planeId = plane.planeId;
      this.skewX = plane.skewX;
      this.skewY = plane.skewY;
      this.cornerPosition = plane.corner;
      this.azm = plane.azm
      this.position = plane.position; // currently not used, should get updated as image is rotated
      this.slope = plane.slope;
      this.panelRows = plane.rows;
      this.orientation = plane.orientation;
      this.length = plane.null;
      this.height = plane.null;
    },

    link: function (scope, ele, attrs, controller) {
      scope.skewX = 0;
      scope.skewY = 0;

      ionicGesture.on('dragright', onDragRight, ele)
      ionicGesture.on('dragleft', onDragLeft, ele)
      ionicGesture.on('dragup', onDragUp, ele)
      ionicGesture.on('dragdown', onDragDown, ele)

      function onDragRight(e) {
        scope.plane.skewX +=1.5
        scope.skewX += 1.5;
        scope.$apply();
        e.stopPropagation();
      };
      function onDragLeft(e) {
        scope.plane.skewX -=1.5
        scope.skewX -= 1.5;
        scope.$apply();
        e.stopPropagation();
      };
      function onDragUp(e) {
        scope.plane.skewY +=1.5
        scope.skewY -= 1.5;
        scope.$apply();
        e.stopPropagation();
      };
      function onDragDown(e) {
        scope.plane.skewY +=1.5
        scope.skewY += 1.5;
        scope.$apply();
        e.stopPropagation();
      };
    },
    template: '<g class="mplane" > \
                <g z-index="1" class="panelrow" ng-repeat="row in plane.panelRows" > \
                  <g edl-panel z-index="10" ng-repeat="panel in row.panels" panel="panel" plane="plane" row="row" rowindex="row.rowId" skewy="skewY" skewx="skewX" > \
                  </g> \
                </g> \
              </g>'
  };
}]);
