directives.directive('edlPanel', [ '$ionicGesture', 'd3', 'PanelService', function(ionicGesture, d3, ps) {
  return {
    restrict: "EAC",
    scope: {
      panel: "=",
      rowindex: "=",
      row: "=",
      plane: "=",
      scalex: "=",
      scaley: "=",
    },
    transclude: true,
    require: '^edlMount',
    link: function (scope, ele, attrs, edlMountCtrl) {
      var corner = {}
      // corner.lat = edlMountCtrl.cornerPosition.lat + scope.rowindex*scope.panel.size.h;
      // corner.lon = edlMountCtrl.cornerPosition.lon + scope.panel.panelId*scope.panel.size.w;

      corner.lat = scope.rowindex*scope.panel.size.h;
      corner.lon = scope.panel.panelId*scope.panel.size.w;

      scope.x = corner.lon;
      scope.y = corner.lat;

      scope.rotate = scope.panel.rotate;
      scope.height = scope.panel.size.h;
      scope.width = scope.panel.size.w;

      scope.azm = edlMountCtrl.azm;
      scope.slope = edlMountCtrl.slope;

      var removePanel = function(ele) {
        // console.log(arguments);
        scope.plane.removedPanels.push({rowId: scope.rowindex, panelId:scope.panel.panelId});
        this.remove();
      }

      ionicGesture.on('hold', removePanel, ele);

    },
    template: '<g ion-stop-event><rect ng-attr-x="{{x}}" ng-attr-y="{{y}}" ng-attr-width="{{width}}" ng-attr-height="{{height}}" ></rect></g>'

  };
}]);
