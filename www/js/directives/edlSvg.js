directives.directive('edlSvg', [ '$ionicGesture', 'd3', 'PanelService', function(ionicGesture, d3, ps) {
  return {
    restrict: "EA",

    scope: {
      panels: '=',
    },
    link: function (scope, ele, attrs) {
      ps.svg(d3.select('svg'))

      scope.longarray = ps.testPanels
      // scope.panels = ps.testPanels;
      // for (var i = 0; i < ps.testPanels.length; i++){
      //   ps.svg()
      //     .append('polygon')
      //     .attr('ng-attr', 'edl-panel')
      //     .attr('points', ps.pCorners(ps.testPanels[i][0], ps.testPanels[i][1], {h:30, w:40}, 1))

      //   ps.svg()
      //     .append('edl-panel')
      //     .attr('ng-attr', 'edlPanel')
      //     .attr('center', ps.testPanels[i])
      //     .attr('transform', 'translate('+ps.testPanels[i][0]+', '+ps.testPanels[i][1]+')' )
      // }

      for (var i = 0; i < ps.testPanels.length; i++){
      }

      ionicGesture.on('touch', function(e){
        var point = e.gesture.center; // {pageX: X, pageY: Y}
      // if no centers, sets centers
        // ps.addOrRemovePanel(point);
      // if no polygon, draws polygon at closest center
        var panel = ps.svg()
          .append('polygon')
          .attr('points', ps.pCorners(point.pageX, point.pageY, {h:30, w:40}, 1))

      }, ele);

    },
    // template: '<svg style="width: 100%;"><polygon ng-repeat="panel in longarray" ng-attr-points="{{panel.points}}"></polygon></svg>'
    template: '<svg style="width: 100%;"><g edl-panel corners="panel" panels="panels"  ng-repeat="panel in longarray" ng-attr-transform="translate(100, 100)" ></g></svg>'

  };
}]);
