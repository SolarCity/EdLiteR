directives.directive('edlSvg', [ '$ionicGesture', 'd3', 'PanelService', function(ionicGesture, d3, ps) {
  return {
    restrict: "EA",

    scope: {
      mounts: '='
    },

    link: function (scope, ele, attrs) {
      ps.svg(d3.select('svg'));
      console.log('mounts in edl-svg', scope.mounts);

      scope.position = ps.pCorners(10, 25, {h:30, w:40}, 1);

      ionicGesture.on('touch', function(e){
        var point = e.gesture.center; // {pageX: X, pageY: Y}

        scope.mounts[0].push([e.gesture.center.pageX, e.gesture.center.pageY ])
        console.log('test')
        scope.$apply()
        console.log(scope.mounts)
        // var panel = ps.svg()
        //   .append('polygon')
        //   .attr('points', ps.pCorners(point.pageX, point.pageY, {h:30, w:40}, 1))
        //   .attr('edl-panel')

      }, ele);


    },

    template:
      '<svg style="width: 100%;"> \
        <g edl-mount \
          ng-repeat="mount in mounts"  \
          mount="mount" \
          position="position" \
          ng-attr-transform="translate(100, 100)" > \
        </g>\
      </svg>'

  };
}]);
