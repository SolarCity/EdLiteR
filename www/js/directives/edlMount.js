directives.directive('edlMount', [ '$ionicGesture', 'd3', 'MountPlaneService', 'PanelService', function(ionicGesture, d3, mp, ps) {
  return {
    restrict: "EAC",
    scope: {
      plane: '=',
    },
    transclude: true,
    controller: function ($scope, $element, $attrs) {
      var plane    = $scope.plane;

      plane.removedPanels = []; //TODO: currently stores removed {rowindex, panelId} for export only.
      this.rotation = 0; //TODO: setup rotation
      this.planeId = plane.planeId;
      this.cornerPosition = plane.corner;
      this.azm = plane.azm
      this.position = plane.position; // TODO: currently not used, should get updated as image is rotated
      this.slope = plane.slope;
      this.panelRows = plane.rows;
      this.orientation = plane.orientation;
      this.length = plane.null;
      this.height = plane.null;
    },

    link: function (scope, ele, attrs, controller) {
      scope.scalex = 0;
      scope.scaley = 0;

      ionicGesture.on('doubletap', setSelected, ele);

      function setSelected(e) {
        scope.plane.isSelected = !scope.plane.isSelected;
        scope.$apply();
        e.stopPropagation();
      }

      ionicGesture.on('drag', movePanel, ele)
        console.log(arguments, controller, controller.cornerPosition )


      function movePanel(e) {
        e.stopPropagation();
        scope.plane.corner.lon = e.gesture.center.pageX;
        scope.plane.corner.lat = e.gesture.center.pageY;
        scope.$apply();

      };
    },
    template: '<g class="mplane" ng-class="{true:\'isSelected\'}[plane.isSelected]" ion-stop-event \
                  ng-attr-transform="translate({{plane.corner.lon}},{{plane.corner.lat}})" > \
                <g z-index="1" class="panelrow" ng-repeat="row in plane.panelRows" > \
                  <g edl-panel z-index="10" ng-repeat="panel in row.panels" panel="panel" plane="plane" row="row" \
                  ng-class="{0:\'firstrow\'}[row.rowId]" \
                  rowindex="row.rowId" scaley="scaley" scale="scalex" > \
                  </g> \
                </g> \
              </g>'
  };
}]);
