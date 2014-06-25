directives.directive('edlSvg', [ 'd3', function(d3) {
  return {
    restrict: "EA",
    // templateUrl: "../../templates/directives/edlSvg.html",
    template: '<p>hi</p>',
    link: function (scope, ele, attrs) {
        var svg = d3.select(ele[0])
            .append('svg')
            .style('width', '100%');
        console.log('hi')
          // Browser onresize event
          window.onresize = function() {
            scope.$apply();
          };

          // hard-code data
          scope.data = [
            {name: "Greg", score: 98},
            {name: "Ari", score: 96},
            {name: 'Q', score: 75},
            {name: "Loser", score: 48}
          ];
    }
  };
}]);
