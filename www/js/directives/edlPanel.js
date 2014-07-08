directives.directive('edlPanel', [ '$ionicGesture', 'd3', 'PanelService', function(ionicGesture, d3, ps) {
  return {
    restrict: "EAC",
    scope: {
      panel: "=",
    },
    link: function (scope, ele, attrs) {
      console.log('panel in edl-panel', scope.panel);

      scope.points = ps.pCorners(scope.panel[0], scope.panel[1], {h:30, w:40}, 1)
      console.log(scope.points)
      // remove yourself from the panelsObject
      ele.on('$destroy', function() {
      });

      ionicGesture.on('touchstart', function(e, scope){
        console.log(ele, arguments);
        e.remove();
      }, ele);

    },

    template: '<g ng-attr-transform="translate(100, 100)"><polygon ng-attr-points="{{points}}" ></polygon></g>'
  };
}]);
