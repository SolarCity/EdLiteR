directives.directive('edlSvg', [ '$ionicGesture', 'd3', 'PanelService', 'MountPlaneService', function(ionicGesture, d3, ps, mp) {
  return {
    restrict: "EA",
    transclude: true,
    controller: function($scope, $element, $attrs) {
      // these are injected into child directives
      this.mapCenter   = {};
      this.rotation    = null;
      this.mountPlanes = $scope.mountPlanes;
      this.scale       = $scope.scale;
      $scope.rotate = 15
      // make the <svg> available outisde by saving it on the PanelService
      ps.svg(d3.select('svg'));

    },
    template:
      '<div><svg style="width: 90%;"> \
        <g z-index="40" edl-mount  \
          ng-repeat="plane in mountPlanes"  \
          plane="plane" \
          position="position" \
           > \
        </g> \
      </svg></div>'
  };
}]);
