directives.directive('edlPanel', [ '$ionicGesture', 'd3', 'PanelService', function(ionicGesture, d3, ps) {

  return {
    restrict: "EAC",
    scope: {corners: "=", panels: '=', panel: '='},
    link: function (scope, ele, attrs) {
        scope.points = ps.pCorners(scope.corners[0], scope.corners[1], {h:30, w:40}, 1)
          ele.on('$destroy', function() {
            // remove yourself from the panelsObject
          });
      ionicGesture.on('touch', function(e, scope){
        console.log(ele)
        // ele.scope.panels.push([55,55])

      }, ele);


    },

    // controller: function ($scope) {

    //   console.log(arguments)
    //   // console.log(ps)
    //     // scope.points = ps.pCorners(scope.corners[0], scope.corners[1], {h:30, w:40}, 1)
    //   ionicGesture.on('touch', function(e){
    //     console.log(arguments)
    //     // ele.remove()
    //     ps.testPanels.push([55,55])

    //   }, ele);


    // },
    template: '<polygon ng-attr-points="{{points}}"></polygon>'
  };
}]);
