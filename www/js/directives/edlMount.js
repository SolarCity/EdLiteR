directives.directive('edlMount', [ '$ionicGesture', 'd3', 'PanelService', function(ionicGesture, d3, ps) {
  return {
    restrict: "EAC",
    scope: {
      mount: '=',
    },
    link: function (scope, ele, attrs) {
      console.log('mount in edl-mount',scope.mount)
      // scope.points = ps.pCorners(scope.corners[0], scope.corners[1], {h:30, w:40}, 1)

      // remove yourself from the colleciton of mounts
      ele.on('$destroy', function() {
      });

      ionicGesture.on('touchstart', function(e, scope){
        console.log(arguments)
        console.log(ele)
        ele.remove();
      }, ele);

    },
    template: '<g ng-attr-transform="translate(100, 100)" > \
                <g ng-attr-transform="translate(100, 100)" edl-panel ng-repeat="panel in mount" panel="panel" > \
                </g> \
              </g>'
  };
}]);
